/* AXM Scan: interfaz, nota y exportación. */
(function () {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  /* ---------- idioma ---------- */
  let lang = 'es'
  try { lang = localStorage.getItem('axm-scan-lang') || (navigator.language || 'es').slice(0, 2) } catch { /* sin almacenamiento */ }
  if (!window.I18N[lang]) lang = 'en'
  const T = () => window.I18N[lang]
  const tr = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k])

  function applyLang() {
    document.documentElement.lang = lang
    document.querySelectorAll('[data-i]').forEach((el) => { el.textContent = T()[el.dataset.i] })
    document.querySelectorAll('[data-i-html]').forEach((el) => { el.innerHTML = T()[el.dataset.iHtml] })
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
    $('domain').placeholder = lang === 'es' ? 'tuempresa.com' : 'yourcompany.com'
    if (state) paint()
  }
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang
    try { localStorage.setItem('axm-scan-lang', lang) } catch { /* sin almacenamiento */ }
    applyLang()
  }))

  /* ---------- estado ---------- */
  let state = null
  const SECS = ['mail', 'dns', 'web', 'reg', 'look']
  const ORDER = { fail: 0, warn: 1, info: 2, pass: 3 }

  function grade(findings) {
    const score = Math.max(0, 100 - findings.reduce((s, f) => s + (f.cost || 0), 0))
    const g = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 65 ? 'C' : score >= 50 ? 'D' : 'F'
    return { score, g }
  }

  function paint() {
    const s = state
    const fs = s.findings
    const { score, g } = grade(fs)
    const count = (l) => fs.filter((f) => f.lvl === l).length
    $('grade').dataset.g = s.done < s.total ? '' : g
    $('grade-l').textContent = s.done < s.total ? '…' : g
    $('sum-dom').textContent = s.domain
    $('sum-h').textContent = s.done < s.total ? tr(T().running, { done: s.done, total: s.total }) : T().sumH[g]
    $('sum-p').textContent = s.done < s.total ? '' : `${tr(T().sumP, { fail: count('fail'), warn: count('warn'), pass: count('pass') })} ${lang === 'es' ? 'Puntuación' : 'Score'}: ${score}/100.`
    $('bar').style.width = `${(s.done / s.total) * 100}%`
    $('sections').innerHTML = SECS.map((sec) => {
      const list = fs.filter((f) => f.sec === sec).sort((a, b) => ORDER[a.lvl] - ORDER[b.lvl])
      if (!list.length && s.pending.has(sec)) return `<section class="sec"><h3>${T().sec[sec]}</h3><p class="wait">${T().going}</p></section>`
      if (!list.length) return ''
      return `<section class="sec"><h3>${T().sec[sec]}</h3><ul class="finds">${list.map(item).join('')}</ul></section>`
    }).join('')
  }

  function item(f) {
    const hasMore = f.fix || f.record
    const body = `<p class="f-detail">${esc(f.detail[lang])}</p>${f.fix ? `<p class="f-fix"><strong>${T().fix}.</strong> ${esc(f.fix[lang])}</p>` : ''}${f.record ? `<p class="f-rec-l">${T().record}</p><pre class="f-rec">${esc(f.record)}</pre>` : ''}`
    const head = `<span class="lvl l-${f.lvl}">${T().lvl[f.lvl]}</span><span class="f-title">${esc(f.title[lang])}</span>`
    return hasMore && f.lvl !== 'pass'
      ? `<li class="find"><details${f.lvl === 'fail' ? ' open' : ''}><summary>${head}</summary>${body}</details></li>`
      : `<li class="find"><div class="row">${head}</div>${body}</li>`
  }

  /* ---------- ejecución ---------- */
  function clean(v) {
    const d = String(v).trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#:\s]/)[0]
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) ? d : null
  }

  let running = false
  async function run(domain) {
    if (running) return
    running = true
    $('go').disabled = true
    $('go').textContent = T().going
    $('report').hidden = false
    state = { domain, findings: [], done: 0, total: 6, pending: new Set(SECS), started: new Date().toISOString() }
    paint()
    const tick = () => { state.done++; paint() }
    const add = (sec) => (list) => { state.findings.push(...list); state.pending.delete(sec); tick() }
    const fail = (sec) => () => { state.pending.delete(sec); tick() }
    await Promise.all([
      window.Scan.mail(domain).then(add('mail'), fail('mail')),
      window.Scan.dnsChecks(domain).then(add('dns'), fail('dns')),
      window.Scan.web(domain, tick).then((r) => add('web')(r.out), () => { fail('web')(); tick() }),
      window.Scan.reg(domain).then(add('reg'), fail('reg')),
      window.Scan.look(domain).then(add('look'), fail('look')),
    ])
    state.done = state.total
    state.finished = new Date().toISOString()
    paint()
    running = false
    $('go').disabled = false
    $('go').textContent = T().go
    $('report').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  $('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const d = clean($('domain').value)
    if (!d) { $('hint').textContent = T().bad; $('hint').classList.add('is-error'); return }
    $('hint').classList.remove('is-error')
    $('hint').textContent = T().hint
    $('domain').value = d
    history.replaceState(null, '', `?d=${encodeURIComponent(d)}`)
    run(d)
  })

  $('print').addEventListener('click', () => {
    document.querySelectorAll('.find details').forEach((d) => (d.open = true))
    print()
  })
  $('json').addEventListener('click', () => {
    if (!state) return
    const { score, g } = grade(state.findings)
    const data = { tool: 'AXM Scan', url: location.href, domain: state.domain, started: state.started, finished: state.finished, grade: g, score, findings: state.findings.map((f) => ({ section: f.sec, level: f.lvl, title: f.title[lang], detail: f.detail[lang], fix: f.fix?.[lang] ?? null, record: f.record ?? null })) }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `axm-scan-${state.domain}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  })
  $('share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); $('share').textContent = T().copied } catch { /* sin portapapeles */ }
    setTimeout(() => ($('share').textContent = T().share), 1600)
  })

  applyLang()
  const q = new URLSearchParams(location.search).get('d')
  if (q && clean(q)) { $('domain').value = clean(q); run(clean(q)) }
})()
