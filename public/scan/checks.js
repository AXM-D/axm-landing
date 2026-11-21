/* AXM Scan: pruebas. Cada una devuelve hallazgos con texto en español e inglés. */
(function () {
  'use strict'

  const m = (es, en) => ({ es, en })
  const F = (sec, lvl, cost, title, detail, fix, record) => ({ sec, lvl, cost, title, detail, fix, record })

  /* ---------- DNS sobre HTTPS ---------- */
  const cache = new Map()
  function dns(name, type) {
    const key = `${name}|${type}`
    if (!cache.has(key)) {
      cache.set(key, fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}&do=1`, { headers: { accept: 'application/dns-json' } })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`DNS ${r.status}`)))))
    }
    return cache.get(key)
  }
  const TYPE = { A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16, AAAA: 28, CAA: 257 }
  const ans = (j, t) => (j.Answer || []).filter((a) => a.type === TYPE[t]).map((a) => a.data)
  const txt = (s) => s.replace(/"\s+"/g, '').replace(/^"|"$/g, '')
  async function txts(name) { return ans(await dns(name, 'TXT'), 'TXT').map(txt) }

  async function withTimeout(promise, ms) {
    let t
    const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error('timeout')), ms) })
    try { return await Promise.race([promise, timeout]) } finally { clearTimeout(t) }
  }

  /* ---------- Correo ---------- */
  async function spfLookups(domain, depth = 0, seen = new Set()) {
    if (depth > 10 || seen.has(domain)) return 0
    seen.add(domain)
    const rec = (await txts(domain)).find((t) => /^v=spf1\b/i.test(t))
    if (!rec) return 0
    let n = 0
    for (const term of rec.split(/\s+/).slice(1)) {
      const t = term.replace(/^[+\-~?]/, '').toLowerCase()
      if (t.startsWith('include:')) n += 1 + (await spfLookups(t.slice(8), depth + 1, seen))
      else if (t.startsWith('redirect=')) n += 1 + (await spfLookups(t.slice(9), depth + 1, seen))
      else if (/^(a|mx|ptr|exists)([:/]|$)/.test(t)) n += 1
    }
    return n
  }

  function provider(mx) {
    const s = mx.join(' ').toLowerCase()
    if (/google\.com|googlemail/.test(s)) return { name: 'Google Workspace', spf: 'include:_spf.google.com', dkim: 'google' }
    if (/outlook\.com|protection\.outlook/.test(s)) return { name: 'Microsoft 365', spf: 'include:spf.protection.outlook.com', dkim: 'selector1' }
    if (/zoho/.test(s)) return { name: 'Zoho Mail', spf: 'include:zoho.com', dkim: 'zmail' }
    if (/protonmail|proton\.ch/.test(s)) return { name: 'Proton Mail', spf: 'include:_spf.protonmail.ch', dkim: 'protonmail' }
    return null
  }

  async function mail(d) {
    const out = []
    const mx = ans(await dns(d, 'MX'), 'MX').map((x) => x.split(' ').pop().replace(/\.$/, '')).filter((x) => x && x !== '.')
    const prov = provider(mx)
    const sendsMail = mx.length > 0
    out.push(sendsMail
      ? F('mail', 'info', 0, m('Recibe correo', 'Receives email'), m(`Servidores de correo: ${mx.slice(0, 3).join(', ')}${prov ? ` (${prov.name})` : ''}.`, `Mail servers: ${mx.slice(0, 3).join(', ')}${prov ? ` (${prov.name})` : ''}.`))
      : F('mail', 'info', 0, m('No recibe correo', 'Does not receive email'), m('No tiene registros MX. Aun así, sin SPF y DMARC estrictos cualquiera puede mandar correos que digan venir de este dominio.', 'It has no MX records. Even so, without strict SPF and DMARC anyone can send mail claiming to come from this domain.')))

    /* SPF */
    const all = await txts(d)
    const spfs = all.filter((t) => /^v=spf1\b/i.test(t))
    const spfSuggest = sendsMail ? `v=spf1 ${prov ? prov.spf + ' ' : ''}-all` : 'v=spf1 -all'
    if (spfs.length === 0) {
      out.push(F('mail', 'fail', 15, m('Sin SPF', 'No SPF'), m('No hay registro SPF: nada dice qué servidores pueden enviar correo en nombre del dominio.', 'There is no SPF record: nothing says which servers may send mail for the domain.'), m('Publica un TXT en la raíz del dominio con los servicios que envían tu correo y termina en -all.', 'Publish a TXT record at the domain root listing the services that send your mail, ending with -all.'), `${d}. TXT "${spfSuggest}"`))
    } else if (spfs.length > 1) {
      out.push(F('mail', 'fail', 10, m('Varios registros SPF', 'Multiple SPF records'), m(`Hay ${spfs.length} registros SPF. La especificación exige uno: con varios, los servidores lo tratan como error y el SPF no protege.`, `There are ${spfs.length} SPF records. The spec requires one: with several, receivers treat it as an error and SPF gives no protection.`), m('Únelos en un solo registro.', 'Merge them into a single record.')))
    } else {
      const spf = spfs[0]
      const q = (spf.match(/\s([+\-~?]?)all\b/i) || [])[1]
      if (q === undefined && !/redirect=/i.test(spf)) out.push(F('mail', 'warn', 8, m('SPF sin cierre "all"', 'SPF without an "all" mechanism'), m(`El registro no termina con -all o ~all: ${spf}`, `The record does not end with -all or ~all: ${spf}`), m('Añade -all al final.', 'Add -all at the end.')))
      else if (q === '+' || q === '') out.push(F('mail', 'fail', 20, m('SPF permite a cualquiera', 'SPF allows anyone'), m(`Termina en "+all" o "all": cualquier servidor del mundo pasa la prueba. ${spf}`, `It ends with "+all" or "all": any server in the world passes. ${spf}`), m('Cambia el final a -all.', 'Change the ending to -all.')))
      else if (q === '?') out.push(F('mail', 'warn', 10, m('SPF neutral (?all)', 'Neutral SPF (?all)'), m('"?all" no le dice nada al receptor: equivale a no tener SPF.', '"?all" tells receivers nothing: it is as good as no SPF.'), m('Cambia el final a -all.', 'Change the ending to -all.')))
      else if (q === '~') out.push(F('mail', 'pass', 2, m('SPF con ~all', 'SPF with ~all'), m(`Correcto, aunque "~all" solo marca como sospechoso; con DMARC estricto es suficiente. ${spf}`, `Fine, though "~all" only marks mail as suspicious; with strict DMARC it is enough. ${spf}`)))
      else out.push(F('mail', 'pass', 0, m('SPF estricto', 'Strict SPF'), m(spf, spf)))
      const n = await spfLookups(d)
      if (n > 10) out.push(F('mail', 'fail', 10, m(`SPF con ${n} consultas DNS`, `SPF needs ${n} DNS lookups`), m('El límite es 10. Por encima, el SPF falla y tu correo legítimo puede acabar en spam.', 'The limit is 10. Above it SPF fails and your legitimate mail can land in spam.'), m('Quita includes que ya no uses o aplana el registro.', 'Remove unused includes or flatten the record.')))
      else out.push(F('mail', 'pass', 0, m(`SPF con ${n} de 10 consultas`, `SPF uses ${n} of 10 lookups`), m('Dentro del límite.', 'Within the limit.')))
    }

    /* DMARC */
    const dmarc = (await txts(`_dmarc.${d}`)).find((t) => /^v=DMARC1/i.test(t))
    const dmarcSuggest = `_dmarc.${d}. TXT "v=DMARC1; p=${sendsMail ? 'quarantine' : 'reject'}; rua=mailto:dmarc@${d}; adkim=s; aspf=s"`
    if (!dmarc) {
      out.push(F('mail', 'fail', 20, m('Sin DMARC', 'No DMARC'), m('Sin DMARC, los proveedores de correo no tienen instrucciones para rechazar correos falsos con tu dominio. Es la causa más común de suplantación.', 'Without DMARC, mailbox providers have no instructions to reject forged mail using your domain. It is the most common cause of spoofing.'), m('Publica DMARC. Si envías correo, empieza con p=none unas semanas leyendo los informes (rua) y sube a quarantine o reject.', 'Publish DMARC. If you send mail, start with p=none for a few weeks reading the reports (rua), then move to quarantine or reject.'), dmarcSuggest))
    } else {
      const p = ((dmarc.match(/\bp=(\w+)/i) || [])[1] || '').toLowerCase()
      const pct = +((dmarc.match(/\bpct=(\d+)/i) || [])[1] || 100)
      if (p === 'none') out.push(F('mail', 'fail', 12, m('DMARC solo observa (p=none)', 'DMARC is monitor-only (p=none)'), m(`Los correos falsos se entregan igual. ${dmarc}`, `Forged mail is still delivered. ${dmarc}`), m('Cuando los informes muestren que tu correo legítimo pasa, sube a p=quarantine y luego a p=reject.', 'Once reports show your legitimate mail passing, move to p=quarantine and then p=reject.'), dmarcSuggest))
      else if (pct < 100) out.push(F('mail', 'warn', 5, m(`DMARC aplicado al ${pct}%`, `DMARC applied to ${pct}%`), m(dmarc, dmarc), m('Sube pct a 100 o quítalo.', 'Raise pct to 100 or remove it.')))
      else out.push(F('mail', 'pass', 0, m(`DMARC p=${p}`, `DMARC p=${p}`), m(dmarc, dmarc)))
      if (!/\brua=/i.test(dmarc)) out.push(F('mail', 'warn', 2, m('DMARC sin informes', 'DMARC without reports'), m('Sin rua no recibes informes de quién envía correo con tu dominio.', 'Without rua you get no reports on who sends mail using your domain.'), m('Añade rua=mailto:una-direccion-tuya.', 'Add rua=mailto:an-address-you-own.')))
    }

    /* DKIM: selectores comunes */
    if (sendsMail) {
      const sels = ['google', 'selector1', 'selector2', 'default', 'k1', 'k2', 's1', 's2', 'dkim', 'mail', 'smtp', 'zmail', 'protonmail', 'fm1', 'mandrill', 'mxvault', 'everlytickey1', 'sig1', 'key1']
      const found = []
      await Promise.all(sels.map(async (s) => {
        const j = await dns(`${s}._domainkey.${d}`, 'TXT').catch(() => ({}))
        if ((j.Answer || []).some((a) => /p=|k=rsa/i.test(a.data) || a.type === 5)) found.push(s)
      }))
      out.push(found.length
        ? F('mail', 'pass', 0, m('DKIM encontrado', 'DKIM found'), m(`Selectores: ${found.join(', ')}.`, `Selectors: ${found.join(', ')}.`))
        : F('mail', 'warn', 5, m('DKIM no encontrado', 'DKIM not found'), m('No encontramos firma DKIM en los selectores habituales. Puede usar otro nombre, pero si no firmas, DMARC depende solo de SPF.', 'We found no DKIM key on common selectors. It may use another name, but if you do not sign, DMARC relies on SPF alone.'), m(`Activa la firma DKIM en tu proveedor${prov ? ` (${prov.name})` : ''} y publica la clave que te dé.`, `Enable DKIM signing at your provider${prov ? ` (${prov.name})` : ''} and publish the key it gives you.`)))

      const sts = (await txts(`_mta-sts.${d}`)).find((t) => /^v=STSv1/i.test(t))
      out.push(sts
        ? F('mail', 'pass', 0, m('MTA-STS activo', 'MTA-STS enabled'), m('El correo entrante exige cifrado TLS.', 'Inbound mail requires TLS encryption.'))
        : F('mail', 'warn', 2, m('Sin MTA-STS', 'No MTA-STS'), m('El correo que te envían podría viajar sin cifrar si alguien interfiere la conexión.', 'Mail sent to you could travel unencrypted if someone tampers with the connection.'), m('Publica una política MTA-STS (un TXT y un archivo en mta-sts.tudominio).', 'Publish an MTA-STS policy (a TXT record and a file on mta-sts.yourdomain).')))
      const tls = (await txts(`_smtp._tls.${d}`)).find((t) => /^v=TLSRPTv1/i.test(t))
      out.push(tls
        ? F('mail', 'pass', 0, m('TLS-RPT activo', 'TLS-RPT enabled'), m('Recibes informes de fallos de cifrado.', 'You receive encryption failure reports.'))
        : F('mail', 'info', 0, m('Sin TLS-RPT', 'No TLS-RPT'), m('Opcional: informes de problemas de cifrado en el correo entrante.', 'Optional: reports on encryption problems with inbound mail.'), null, `_smtp._tls.${d}. TXT "v=TLSRPTv1; rua=mailto:tls@${d}"`))
      const bimi = (await txts(`default._bimi.${d}`)).find((t) => /^v=BIMI1/i.test(t))
      if (bimi) out.push(F('mail', 'pass', 0, m('BIMI configurado', 'BIMI configured'), m('Tu logo puede aparecer junto a tus correos.', 'Your logo can appear next to your emails.')))
    }
    return out
  }

  /* ---------- DNS ---------- */
  async function dnsChecks(d) {
    const out = []
    const soa = await dns(d, 'SOA')
    out.push(soa.AD
      ? F('dns', 'pass', 0, m('DNSSEC activo', 'DNSSEC enabled'), m('Las respuestas DNS están firmadas: es más difícil falsificarlas.', 'DNS answers are signed, which makes them harder to forge.'))
      : F('dns', 'warn', 5, m('Sin DNSSEC', 'No DNSSEC'), m('Las respuestas DNS no están firmadas.', 'DNS answers are not signed.'), m('Actívalo en tu proveedor de DNS y publica el registro DS en tu registrador.', 'Enable it at your DNS provider and publish the DS record at your registrar.')))
    const caa = ans(await dns(d, 'CAA'), 'CAA')
    out.push(caa.length
      ? F('dns', 'pass', 0, m('CAA configurado', 'CAA configured'), m(`Solo estas autoridades pueden emitir certificados: ${caa.join(' | ')}`, `Only these authorities may issue certificates: ${caa.join(' | ')}`))
      : F('dns', 'warn', 3, m('Sin CAA', 'No CAA'), m('Cualquier autoridad de certificación puede emitir certificados para tu dominio.', 'Any certificate authority may issue certificates for your domain.'), m('Publica CAA con la autoridad que usas (lo vemos en la sección de certificados).', 'Publish CAA with the authority you use (see the certificates section).'), `${d}. CAA 0 issue "letsencrypt.org"`))
    const ns = ans(await dns(d, 'NS'), 'NS').map((x) => x.replace(/\.$/, ''))
    if (ns.length) {
      const providers = new Set(ns.map((n) => n.split('.').slice(-2).join('.')))
      out.push(ns.length >= 2
        ? F('dns', 'pass', 0, m(`${ns.length} servidores de nombres`, `${ns.length} name servers`), m(ns.join(', ') + (providers.size > 1 ? '' : '.'), ns.join(', ')))
        : F('dns', 'warn', 4, m('Un solo servidor de nombres', 'Single name server'), m(`Si ${ns[0]} cae, tu dominio desaparece.`, `If ${ns[0]} goes down, your domain disappears.`), m('Usa al menos dos.', 'Use at least two.')))
    }
    return out
  }

  /* ---------- Certificados y subdominios ---------- */
  const TAKEOVER = /(github\.io|herokuapp\.com|herokudns\.com|azurewebsites\.net|cloudapp\.net|trafficmanager\.net|blob\.core\.windows\.net|s3[.-][\w-]*\.?amazonaws\.com|s3\.amazonaws\.com|cloudfront\.net|elasticbeanstalk\.com|netlify\.app|netlify\.com|vercel\.app|surge\.sh|bitbucket\.io|ghost\.io|myshopify\.com|wordpress\.com|pantheonsite\.io|zendesk\.com|readme\.io|fly\.dev|webflow\.io|squarespace\.com|helpscoutdocs\.com|statuspage\.io|unbouncepages\.com|fastly\.net)$/i
  const SENSITIVE = /^(dev|devel|develop|test|testing|staging|stage|stg|qa|uat|preprod|pre|admin|administrator|panel|vpn|remote|rdp|citrix|jenkins|gitlab|git|grafana|kibana|prometheus|elastic|db|database|mysql|phpmyadmin|old|backup|bak|internal|intranet|beta|demo|sandbox|jira|confluence|owa|webmail|cpanel|whm|ftp|sftp)(\d*|[-.].*)?$/i

  async function web(d, progress) {
    const out = []
    let names = []
    let certs
    try {
      const r = await withTimeout(fetch(`https://crt.sh/?q=${encodeURIComponent('%.' + d)}&output=json&exclude=expired`), 25000)
      if (!r.ok) throw new Error(r.status)
      certs = await r.json()
      const set = new Set()
      for (const c of certs) for (const n of String(c.name_value).toLowerCase().split('\n')) {
        const s = n.trim().replace(/^\*\./, '')
        if (s.endsWith(d) && s !== d) set.add(s)
      }
      names = [...set].sort()
    } catch {
      out.push(F('web', 'info', 0, m('Transparencia de certificados no disponible', 'Certificate Transparency unavailable'), m('crt.sh no respondió a tiempo. Vuelve a intentarlo en unos minutos para ver los subdominios.', 'crt.sh did not respond in time. Try again in a few minutes to see subdomains.')))
      return { out, names }
    }
    progress()
    const issuers = [...new Set(certs.map((c) => ((c.issuer_name || '').match(/O=([^,]+)/) || [])[1]).filter(Boolean))]
    out.push(F('web', 'info', 0, m(`${certs.length} certificados vigentes, ${names.length} subdominios a la vista`, `${certs.length} valid certificates, ${names.length} subdomains in plain sight`), m(`Emisores: ${issuers.slice(0, 5).join(', ') || '—'}. Cualquiera puede ver esta lista en los registros públicos de certificados.`, `Issuers: ${issuers.slice(0, 5).join(', ') || '—'}. Anyone can see this list in public certificate logs.`)))

    const sens = names.filter((n) => SENSITIVE.test(n.slice(0, -(d.length + 1)).split('.').pop()) || SENSITIVE.test(n.slice(0, -(d.length + 1))))
    if (sens.length) out.push(F('web', 'warn', Math.min(8, 2 + sens.length), sens.length === 1 ? m('1 subdominio sensible expuesto', '1 sensitive subdomain exposed') : m(`${sens.length} subdominios sensibles expuestos`, `${sens.length} sensitive subdomains exposed`), m(sens.slice(0, 12).join(', ') + (sens.length > 12 ? '…' : ''), sens.slice(0, 12).join(', ') + (sens.length > 12 ? '…' : '')), m('Paneles, entornos de prueba y accesos remotos son lo primero que se ataca. Ponlos detrás de VPN o autenticación, o elimínalos si ya no se usan.', 'Admin panels, test environments and remote access are attacked first. Put them behind a VPN or authentication, or remove them if unused.')))

    /* Secuestro de subdominio: CNAME a un servicio cuyo destino ya no existe */
    const sample = names.slice(0, 60)
    const takeover = []
    const broken = []
    let i = 0
    const worker = async () => {
      while (i < sample.length) {
        const n = sample[i++]
        try {
          const c = ans(await dns(n, 'CNAME'), 'CNAME')[0]
          if (!c) continue
          const target = c.replace(/\.$/, '')
          const t = await dns(target, 'A')
          if (t.Status === 3) (TAKEOVER.test(target) ? takeover : broken).push(`${n} → ${target}`)
        } catch { /* ignora */ }
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker))
    if (takeover.length) out.push(F('web', 'fail', Math.min(30, 20 + takeover.length * 5), m(`Posible secuestro de ${takeover.length} subdominio(s)`, `Possible takeover of ${takeover.length} subdomain(s)`), m(takeover.join('\n'), takeover.join('\n')), m('Estos subdominios apuntan a un servicio que ya no existe. Un atacante puede reclamarlo y publicar contenido con tu dominio. Borra el CNAME hoy o vuelve a crear el recurso.', 'These subdomains point at a service that no longer exists. An attacker can claim it and publish content under your domain. Delete the CNAME today or recreate the resource.')))
    else out.push(F('web', 'pass', 0, m('Sin subdominios secuestrables', 'No takeover-prone subdomains'), m(`Revisamos ${sample.length} subdominios y ninguno apunta a un servicio abandonado.`, `We checked ${sample.length} subdomains and none point at an abandoned service.`)))
    if (broken.length) out.push(F('web', 'warn', 3, m(`${broken.length} CNAME rotos`, `${broken.length} broken CNAMEs`), m(broken.slice(0, 8).join('\n'), broken.slice(0, 8).join('\n')), m('Apuntan a nombres que no existen. Límpialos.', 'They point at names that do not exist. Clean them up.')))
    return { out, names }
  }

  /* ---------- Registro (RDAP) ---------- */
  async function reg(d) {
    const out = []
    let j
    try {
      const r = await withTimeout(fetch(`https://rdap.org/domain/${d}`), 12000)
      if (!r.ok) throw new Error(r.status)
      j = await r.json()
    } catch {
      return [F('reg', 'info', 0, m('Registro no disponible', 'Registration not available'), m('Esta terminación no publica datos por RDAP o el servicio no respondió.', 'This TLD does not publish RDAP data or the service did not respond.'))]
    }
    const ev = (a) => (j.events || []).find((e) => e.eventAction === a)?.eventDate
    const created = ev('registration'), expires = ev('expiration')
    const registrar = (j.entities || []).find((e) => (e.roles || []).includes('registrar'))
    const rname = registrar?.vcardArray?.[1]?.find((v) => v[0] === 'fn')?.[3] || registrar?.handle || '—'
    const fmt = (s) => new Date(s).toISOString().slice(0, 10)
    out.push(F('reg', 'info', 0, m(`Registrador: ${rname}`, `Registrar: ${rname}`), m(`Creado ${created ? fmt(created) : '—'}, caduca ${expires ? fmt(expires) : '—'}.`, `Created ${created ? fmt(created) : '—'}, expires ${expires ? fmt(expires) : '—'}.`)))
    if (expires) {
      const days = Math.round((new Date(expires) - Date.now()) / 864e5)
      if (days < 30) out.push(F('reg', 'fail', 15, m(`Caduca en ${days} días`, `Expires in ${days} days`), m('Si caduca, cualquiera puede registrarlo y recibir tu correo.', 'If it lapses, anyone can register it and receive your email.'), m('Renuévalo y activa la renovación automática.', 'Renew it and turn on auto-renew.')))
      else if (days < 90) out.push(F('reg', 'warn', 4, m(`Caduca en ${days} días`, `Expires in ${days} days`), m('Revisa que la renovación automática esté activa.', 'Make sure auto-renew is on.')))
      else out.push(F('reg', 'pass', 0, m(`Vigente ${days} días más`, `Valid for ${days} more days`), m('Sin riesgo de caducidad próxima.', 'No near-term expiry risk.')))
    }
    const st = (j.status || []).map((s) => s.toLowerCase())
    out.push(st.some((s) => s.includes('transfer prohibited'))
      ? F('reg', 'pass', 0, m('Bloqueo de transferencia activo', 'Transfer lock enabled'), m('Nadie puede llevarse el dominio a otro registrador sin tu permiso.', 'No one can move the domain to another registrar without your permission.'))
      : F('reg', 'warn', 5, m('Sin bloqueo de transferencia', 'No transfer lock'), m('El dominio puede transferirse con menos fricción.', 'The domain can be transferred with less friction.'), m('Activa el bloqueo (transfer lock) en tu registrador.', 'Enable transfer lock at your registrar.')))
    return out
  }

  /* ---------- Dominios parecidos ---------- */
  async function look(d) {
    const base = window.Gemelo.parse(d)
    if (!base) return []
    const variants = window.Gemelo.generate(base).slice(0, 70)
    const withMail = []
    let taken = 0
    let i = 0
    const worker = async () => {
      while (i < variants.length) {
        const v = variants[i++]
        try {
          const ns = await dns(v.domain, 'NS')
          if (ns.Status === 3) continue
          const mx = ans(await dns(v.domain, 'MX'), 'MX').filter((x) => !/^0 \.$/.test(x))
          if (ns.Status === 0 && (ans(ns, 'NS').length || mx.length || (ns.Authority || []).length)) {
            taken++
            if (mx.length) withMail.push(v.domain)
          }
        } catch { /* ignora */ }
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker))
    const out = [F('look', 'info', 0, m(`${taken} de ${variants.length} variantes ya registradas`, `${taken} of ${variants.length} variants already registered`), m('Letras cambiadas, otras terminaciones y palabras añadidas que usaría un estafador.', 'Swapped letters, other TLDs and added words a scammer would use.'))]
    if (withMail.length) out.push(F('look', 'warn', Math.min(8, withMail.length * 2), m(`${withMail.length} parecidos pueden enviar correo`, `${withMail.length} lookalikes can send email`), m(withMail.slice(0, 12).join(', '), withMail.slice(0, 12).join(', ')), m('No siempre son maliciosos, pero conviene vigilarlos y avisar a tu equipo. Considera registrar los más peligrosos.', 'They are not always malicious, but watch them and warn your team. Consider registering the most dangerous ones.')))
    return out
  }

  window.Scan = { mail, dnsChecks, web, reg, look }
})()
