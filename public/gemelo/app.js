/* Gemelo: consulta DNS sobre HTTPS para cada variante y ordena por riesgo. */
(function () {
  'use strict'
  const { parse, generate, diff } = window.Gemelo
  const $ = (id) => document.getElementById(id)
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const RISK = { high: { n: 3, label: 'Alto', cls: 't-high' }, mid: { n: 2, label: 'Medio', cls: 't-mid' }, low: { n: 1, label: 'Bajo', cls: 't-low' } }

  async function dns(name, type) {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: 'application/dns-json' } })
    if (!r.ok) throw new Error(`DNS ${r.status}`)
    return r.json()
  }
  const answers = (j, type) => (j.Answer || []).filter((a) => a.type === type).map((a) => a.data)

  async function check(v) {
    const ns = await dns(v.domain, 'NS')
    if (ns.Status === 3) return { ...v, state: 'free' }
    const [a, mx] = await Promise.all([dns(v.domain, 'A'), dns(v.domain, 'MX')])
    const ips = answers(a, 1)
    const mxs = answers(mx, 15).filter((m) => !/^0 \.$/.test(m))
    const registered = ns.Status === 0 && (answers(ns, 2).length || ips.length || mxs.length || (ns.Authority || []).length)
    if (!registered) return { ...v, state: 'free' }
    const risk = mxs.length ? 'high' : ips.length ? 'mid' : 'low'
    return { ...v, state: 'taken', risk, ips, mx: mxs.map((m) => m.split(' ').pop().replace(/\.$/, '')) }
  }

  async function pool(items, size, fn, onEach) {
    let i = 0
    const run = async () => {
      while (i < items.length) {
        const item = items[i++]
        try { onEach(await fn(item)) } catch { onEach({ ...item, state: 'error' }) }
      }
    }
    await Promise.all(Array.from({ length: size }, run))
  }

  let running = false
  $('form').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (running) return
    const base = parse($('domain').value)
    if (!base) {
      $('hint').textContent = 'Escribe un dominio completo, por ejemplo tuempresa.com o tuempresa.com.mx.'
      $('hint').classList.add('is-error')
      $('domain').focus()
      return
    }
    $('hint').classList.remove('is-error')
    $('domain').value = base.domain
    running = true
    $('go').disabled = true
    $('go').textContent = 'Buscando…'

    const variants = generate(base)
    const taken = []
    const free = []
    let done = 0
    let errors = 0
    $('results').hidden = false
    $('list').innerHTML = ''
    $('free').innerHTML = ''

    const paint = () => {
      const n = taken.length
      $('sum-main').textContent = running
        ? `Revisando ${done} de ${variants.length} variantes de ${base.domain}…`
        : n === 0
          ? `Ninguna de las ${variants.length} variantes de ${base.domain} está registrada.`
          : `${n} ${n === 1 ? 'dominio parecido ya existe' : 'dominios parecidos ya existen'}.`
      $('sum-sub').textContent = running ? '' : `Revisé ${variants.length} variantes. ${taken.filter((t) => t.risk === 'high').length} con correo, ${taken.filter((t) => t.risk === 'mid').length} con web.${errors ? ` ${errors} no respondieron.` : ''}`
      $('bar').style.width = `${(done / variants.length) * 100}%`
      taken.sort((a, b) => RISK[b.risk].n - RISK[a.risk].n || a.domain.localeCompare(b.domain))
      $('list').innerHTML = taken.map(row).join('') || (running ? '' : '<li class="empty">Buena noticia. Aun así, registra las variantes de riesgo alto antes de que lo haga otro.</li>')
      $('free-sum').textContent = `Variantes libres (${free.length})`
      $('free').innerHTML = free.map((f) => `<li>${esc(f.domain)}</li>`).join('')
    }

    const row = (t) => {
      const [p, mid, s] = diff(base.domain, t.domain)
      const detail = t.risk === 'high'
        ? `Correo en ${esc(t.mx.slice(0, 2).join(', '))}`
        : t.risk === 'mid' ? `Web en ${esc(t.ips.slice(0, 2).join(', '))}` : 'Sin web ni correo'
      return `<li class="item"><span class="tag ${RISK[t.risk].cls}">${RISK[t.risk].label}</span><span class="dom">${esc(p)}<mark>${esc(mid)}</mark>${esc(s)}</span><span class="kind">${t.kind}</span><span class="det">${detail}</span></li>`
    }

    let last = 0
    await pool(variants, 8, check, (r) => {
      done++
      if (r.state === 'taken') taken.push(r)
      else if (r.state === 'free') free.push(r)
      else errors++
      const now = performance.now()
      if (now - last > 120) { last = now; paint() }
    })
    running = false
    paint()
    $('go').disabled = false
    $('go').textContent = 'Buscar parecidos'
  })
})()
