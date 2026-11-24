/* AXM Lockcheck: interfaz, hallazgos y exportación. */
(function () {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  /* ---------- idioma ---------- */
  let lang = 'es'
  try { lang = localStorage.getItem('axm-lang') || (navigator.language || 'es').slice(0, 2) } catch { /* sin almacenamiento */ }
  if (!window.I18N[lang]) lang = 'en'
  const T = () => window.I18N[lang]
  const tr = (s, v = {}) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '')

  function applyLang() {
    document.documentElement.lang = lang
    document.querySelectorAll('[data-i]').forEach((el) => { el.textContent = T()[el.dataset.i] })
    document.querySelectorAll('[data-i-html]').forEach((el) => { el.innerHTML = T()[el.dataset.iHtml] })
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
    if (state) paint()
  }
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang
    try { localStorage.setItem('axm-lang', lang) } catch { /* sin almacenamiento */ }
    applyLang()
  }))

  /* ---------- estado y hallazgos ---------- */
  let state = null
  const SECS = ['mal', 'vuln', 'fresh', 'script', 'typo', 'origin']
  const ORDER = { fail: 0, warn: 1, info: 2, pass: 3 }
  const SEV_RANK = { malware: 5, critical: 4, high: 3, moderate: 2, low: 1, unknown: 0 }
  const id = (p) => `${p.name}@${p.version}`

  function hoursText(h) {
    if (h < 1) return lang === 'es' ? 'menos de una hora' : 'less than an hour'
    if (h < 48) return `${Math.round(h)} h`
    return lang === 'es' ? `${Math.round(h / 24)} días` : `${Math.round(h / 24)} days`
  }

  /* Los hallazgos se guardan como funciones del idioma para poder cambiarlo después */
  function build() {
    const s = state
    const F = []
    const add = (sec, lvl, title, detail, fix, extra = {}) => F.push({ sec, lvl, title, detail, fix, ...extra })

    if (s.osv) {
      const { hits, details } = s.osv
      const mal = []
      const vul = []
      const isMal = (v) => window.Checks.severity(v) === 'malware'
      for (const [p, ids] of hits) {
        const vs = ids.map((i) => details.get(i) || { id: i })
        const m = vs.filter(isMal)
        if (m.length) { mal.push({ p, vs: m }); continue }
        vul.push({ p, vs })
      }
      for (const { p, vs } of mal) add('mal', 'fail', () => tr(T().malT, { pkg: id(p) }), () => vs.map((v) => tr(T().malD, { id: v.id, s: v.summary || v.details?.slice(0, 160) || '' })).join('\n'), () => T().malFix, { pkg: id(p), sev: 'malware', links: vs.map((v) => v.id) })
      if (!mal.length) add('mal', 'pass', () => T().noMal, () => '', null)
      vul.sort((a, b) => Math.max(...b.vs.map((v) => SEV_RANK[window.Checks.severity(v)])) - Math.max(...a.vs.map((v) => SEV_RANK[window.Checks.severity(v)])))
      for (const { p, vs } of vul) {
        const worst = vs.reduce((m, v) => (SEV_RANK[window.Checks.severity(v)] > SEV_RANK[m] ? window.Checks.severity(v) : m), 'unknown')
        const fixes = [...new Set(vs.flatMap((v) => window.Checks.fixedIn(v, p.name)))]
        const lvl = worst === 'critical' || worst === 'high' ? 'fail' : 'warn'
        add('vuln', lvl,
          () => tr(T().vulnT, { pkg: id(p), n: vs.length, sev: T().sev[worst] }),
          () => vs.slice(0, 6).map((v) => `${v.id} (${T().sev[window.Checks.severity(v)]}): ${v.summary || ''}`).join('\n') + (vs.length > 6 ? '\n…' : ''),
          () => (fixes.length ? tr(T().vulnFix, { fix: fixes.sort(cmpVer).at(-1) }) : T().vulnFixNone),
          { pkg: id(p), sev: worst, links: vs.map((v) => v.id) })
      }
      if (!vul.length) add('vuln', 'pass', () => tr(T().noVuln, { n: s.pkgs.length }), () => '', null)
    }

    if (s.fresh) {
      const recent = s.fresh.results.filter((r) => r.hours != null && r.hours < 24 * 7).sort((a, b) => a.hours - b.hours)
      for (const r of recent) add('fresh', r.hours < 72 ? 'fail' : 'warn', () => tr(T().freshT, { pkg: id(r.pkg), h: hoursText(r.hours) }), () => T().freshD, () => T().freshFix, { pkg: id(r.pkg) })
      for (const r of s.fresh.results.filter((x) => x.missing)) add('fresh', 'warn', () => tr(T().missingT, { pkg: id(r.pkg) }), () => T().missingD, null, { pkg: id(r.pkg) })
      for (const r of s.fresh.results.filter((x) => x.deprecated)) add('fresh', 'info', () => tr(T().deprT, { pkg: id(r.pkg) }), () => String(r.deprecated), null, { pkg: id(r.pkg) })
      if (!recent.length) add('fresh', 'pass', () => tr(T().noFresh, { n: s.fresh.results.length }), () => tr(T().freshNote, { n: s.fresh.checked }), null)
    }

    const scripts = s.pkgs.filter((p) => p.script)
    if (s.kind === 'package-lock.json') {
      if (scripts.length) add('script', 'info', () => tr(T().scriptT, { n: scripts.length }), () => scripts.slice(0, 30).map(id).join(', ') + (scripts.length > 30 ? '…' : ''), () => T().scriptFix)
      else add('script', 'pass', () => T().noScript, () => '', null)
    }

    const ty = window.Checks.typos(s.pkgs)
    for (const t of ty) add('typo', 'warn', () => tr(T().typoT, { pkg: t.pkg.name, near: t.near }), () => T().typoD, () => tr(T().typoFix, { near: t.near }), { pkg: id(t.pkg) })
    if (!ty.length) add('typo', 'pass', () => T().noTypo, () => '', null)

    if (s.pkgs[0]?.eco === 'npm' && s.kind !== 'pnpm-lock.yaml') {
      const odd = s.pkgs.filter((p) => p.resolved && !/^https:\/\/registry\.(npmjs\.org|yarnpkg\.com)\//.test(p.resolved) && !/@npm:/.test(p.resolved))
      const noInt = s.pkgs.filter((p) => !p.integrity && !(p.resolved && /^(file|link|workspace|patch|portal):/.test(p.resolved)))
      if (odd.length) add('origin', 'warn', () => tr(T().originT, { n: odd.length }), () => odd.slice(0, 12).map((p) => `${id(p)} ← ${p.resolved}`).join('\n'), () => T().originFix)
      if (noInt.length && noInt.length < s.pkgs.length) add('origin', 'warn', () => tr(T().integT, { n: noInt.length }), () => T().integD + '\n' + noInt.slice(0, 12).map(id).join(', '), () => T().integFix)
      if (!odd.length && !(noInt.length && noInt.length < s.pkgs.length)) add('origin', 'pass', () => T().noOrigin, () => '', null)
    }
    return F
  }

  function cmpVer(a, b) {
    const pa = a.split(/[.-]/).map((x) => (isNaN(x) ? x : +x)), pb = b.split(/[.-]/).map((x) => (isNaN(x) ? x : +x))
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if (pa[i] === pb[i]) continue
      if (pa[i] === undefined) return -1
      if (pb[i] === undefined) return 1
      return pa[i] > pb[i] ? 1 : -1
    }
    return 0
  }

  function grade(F) {
    const mal = F.filter((f) => f.sev === 'malware').length
    const crit = F.filter((f) => f.sec === 'vuln' && (f.sev === 'critical' || f.sev === 'high')).length
    const other = F.filter((f) => f.sec === 'vuln' && !(f.sev === 'critical' || f.sev === 'high')).length
    const warn = F.filter((f) => f.sec !== 'vuln' && f.sec !== 'mal' && (f.lvl === 'warn' || f.lvl === 'fail')).length
    const freshFail = F.some((f) => f.sec === 'fresh' && f.lvl === 'fail')
    const g = mal ? 'F' : crit >= 3 || freshFail ? 'D' : crit ? 'C' : other || warn ? 'B' : 'A'
    return { g, mal, crit, other, warn }
  }

  function paint() {
    const s = state
    const done = s.stage === 'done'
    const F = done ? build() : []
    s.findings = F
    const { g, mal, crit, other, warn } = grade(F)
    $('grade').dataset.g = done ? g : ''
    $('grade-l').textContent = done ? g : '…'
    $('sum-file').textContent = s.error ? '' : tr(T().file, { file: s.kind, n: s.pkgs.length, eco: s.pkgs[0]?.eco || '' })
    $('sum-h').textContent = s.error ? s.error : done ? T().sumH[g] : tr(T().running, { n: s.pkgs.length })
    $('sum-p').textContent = done ? tr(T().sumP, { mal, crit, other, warn }) : ''
    $('bar').style.width = `${s.progress * 100}%`
    $('sections').innerHTML = done ? SECS.map((sec) => {
      const list = F.filter((f) => f.sec === sec).sort((a, b) => ORDER[a.lvl] - ORDER[b.lvl])
      return list.length ? `<section class="sec"><h3>${T().sec[sec]}</h3><ul class="finds">${list.map(item).join('')}</ul></section>` : ''
    }).join('') : ''
    document.querySelectorAll('#report .actions .btn').forEach((b) => { if (b.id !== 'again') b.disabled = !done })
  }

  function item(f) {
    const detail = f.detail()
    const fix = f.fix?.()
    const links = (f.links || []).slice(0, 6).map((l) => `<a href="https://osv.dev/vulnerability/${encodeURIComponent(l)}" target="_blank" rel="noreferrer">${esc(l)}</a>`).join(' ')
    const body = `${detail ? `<p class="f-detail">${esc(detail)}</p>` : ''}${fix ? `<p class="f-fix"><strong>${lang === 'es' ? 'Qué hacer' : 'What to do'}.</strong> ${esc(fix)}</p>` : ''}${links ? `<p class="f-detail f-links">${links}</p>` : ''}`
    const head = `<span class="lvl l-${f.lvl}">${T().lvl[f.lvl]}</span><span class="f-title">${esc(f.title())}</span>`
    return body && f.lvl !== 'pass'
      ? `<li class="find"><details${f.lvl === 'fail' ? ' open' : ''}><summary>${head}</summary>${body}</details></li>`
      : `<li class="find"><div class="row">${head}</div>${body}</li>`
  }

  /* ---------- ejecución ---------- */
  async function run(name, text) {
    $('report').hidden = false
    state = { kind: '', pkgs: [], progress: 0.05, stage: 'read', error: '' }
    let kind, list
    try {
      [kind, list] = window.Lock.detect(name, text)
    } catch (e) {
      state.error = e.message === 'package.json' ? T().pkgJson : T().badFile
      state.progress = 0
      paint()
      return
    }
    const pkgs = window.Lock.dedupe(list)
    Object.assign(state, { kind, pkgs })
    if (!pkgs.length) { state.error = T().empty; paint(); return }
    paint()
    $('report').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    try {
      const [o, f] = await Promise.all([
        window.Checks.osv(pkgs, (n) => { state.progress = 0.1 + 0.6 * (n / pkgs.length); paint() }),
        pkgs[0].eco === 'npm' ? window.Checks.freshness(pkgs) : Promise.resolve(null),
      ])
      state.osv = o
      state.fresh = f
    } catch (e) {
      state.error = tr(T().netErr, { e: e.message })
    }
    state.progress = 1
    state.stage = 'done'
    paint()
  }

  /* ---------- entrada: arrastrar, elegir o pegar ---------- */
  const readFile = (file) => file.text().then((t) => run(file.name, t))
  $('file').addEventListener('change', (e) => e.target.files[0] && readFile(e.target.files[0]))
  const drop = $('drop')
  ;['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over') }))
  ;['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over') }))
  drop.addEventListener('drop', (e) => e.dataTransfer.files[0] && readFile(e.dataTransfer.files[0]))
  $('paste-toggle').addEventListener('click', () => { $('paste-box').hidden = !$('paste-box').hidden; if (!$('paste-box').hidden) $('paste').focus() })
  $('paste-go').addEventListener('click', () => $('paste').value.trim() && run('', $('paste').value))
  $('again').addEventListener('click', () => { $('report').hidden = true; state = null; scrollTo({ top: 0 }) })

  /* Ejemplo: versiones reales con problemas conocidos (solo nombres y versiones) */
  $('sample').addEventListener('click', () => {
    const pkg = (name, version, extra = {}) => ({ version, resolved: `https://registry.npmjs.org/${name}/-/${name.split('/').pop()}-${version}.tgz`, integrity: 'sha512-ejemplo', ...extra })
    const lock = {
      name: 'tienda-ejemplo', lockfileVersion: 3,
      packages: {
        '': { name: 'tienda-ejemplo', dependencies: { 'event-stream': '3.3.6', lodash: '4.17.15', axios: '0.21.0', minimist: '1.2.0', crossenv: '1.0.0', esbuild: '0.18.0' } },
        'node_modules/event-stream': pkg('event-stream', '3.3.6'),
        'node_modules/flatmap-stream': pkg('flatmap-stream', '0.1.1'),
        'node_modules/lodash': pkg('lodash', '4.17.15'),
        'node_modules/axios': pkg('axios', '0.21.0'),
        'node_modules/minimist': pkg('minimist', '1.2.0'),
        'node_modules/crossenv': pkg('crossenv', '1.0.0'),
        'node_modules/esbuild': pkg('esbuild', '0.18.0', { hasInstallScript: true }),
        'node_modules/left-pad': { version: '1.3.0', resolved: 'git+https://github.com/stevemao/left-pad.git#abc123' },
      },
    }
    run('package-lock.json', JSON.stringify(lock, null, 2))
  })

  /* ---------- exportar ---------- */
  $('md').addEventListener('click', async () => {
    if (!state?.findings) return
    const { g } = grade(state.findings)
    const lines = [`### AXM Lockcheck: ${g}`, '', `**${state.kind}**: ${state.pkgs.length} ${lang === 'es' ? 'paquetes' : 'packages'}`, '', `> ${T().sumH[g]}`, '']
    for (const sec of SECS) {
      const list = state.findings.filter((f) => f.sec === sec && f.lvl !== 'pass')
      if (!list.length) continue
      lines.push(`#### ${T().sec[sec]}`)
      for (const f of list) lines.push(`- **${T().lvl[f.lvl]}**: ${f.title()}${f.fix ? ` — ${f.fix()}` : ''}`)
      lines.push('')
    }
    lines.push(`<sub>${lang === 'es' ? 'Generado con' : 'Generated with'} [AXM Lockcheck](${location.origin}${location.pathname})</sub>`)
    try { await navigator.clipboard.writeText(lines.join('\n')); $('md').textContent = T().copied } catch { /* sin portapapeles */ }
    setTimeout(() => ($('md').textContent = T().md), 1600)
  })
  $('json').addEventListener('click', () => {
    if (!state?.findings) return
    const data = { tool: 'AXM Lockcheck', generated: new Date().toISOString(), file: state.kind, packages: state.pkgs.length, grade: grade(state.findings).g, findings: state.findings.map((f) => ({ section: f.sec, level: f.lvl, package: f.pkg || null, severity: f.sev || null, title: f.title(), detail: f.detail(), fix: f.fix?.() || null, advisories: f.links || [] })) }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'axm-lockcheck.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  })

  applyLang()
})()
