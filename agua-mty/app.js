/* Agua MTY: lluvia y balance hídrico por cuenca, este año frente a 1995-2024 y frente a 2022. */
(function () {
  'use strict'

  const BASINS = [
    { id: 'cuchillo', name: 'El Cuchillo', river: 'río San Juan', pts: [[25.6, -100.05], [25.73, -99.3]] },
    { id: 'cerro', name: 'Cerro Prieto', river: 'río Pablillo', pts: [[24.72, -99.85], [24.93, -99.4]] },
    { id: 'boca', name: 'La Boca', river: 'río Ramos', pts: [[25.33, -100.27], [25.43, -100.13]] },
  ]
  const DRY = 2022
  const NORMAL = [1995, 2024]
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

  const $ = (id) => document.getElementById(id)
  const r0 = (n) => Math.round(n)
  const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); const i = (s.length - 1) * p; const lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo) }

  let stats = null
  let sel = 0

  async function load() {
    const end = new Date(Date.now() - 5 * 864e5).toISOString().slice(0, 10)
    const pts = BASINS.flatMap((b) => b.pts)
    const p = new URLSearchParams({
      latitude: pts.map((x) => x[0]).join(','),
      longitude: pts.map((x) => x[1]).join(','),
      start_date: '1995-01-01',
      end_date: end,
      daily: 'precipitation_sum,et0_fao_evapotranspiration',
      timezone: 'America/Monterrey',
    })
    const KEY = `agua-mty:${end}`
    try {
      const hit = localStorage.getItem(KEY)
      if (hit) return JSON.parse(hit)
    } catch { /* sin almacenamiento: se descarga */ }
    const r = await fetch(`https://archive-api.open-meteo.com/v1/archive?${p}`)
    if (r.status === 429) throw new Error('Open-Meteo pide esperar un minuto antes de otra consulta')
    if (!r.ok) throw new Error(`La API respondió ${r.status}`)
    const d = await r.json()
    const list = (Array.isArray(d) ? d : [d]).map((x) => ({ daily: { time: x.daily.time, precipitation_sum: x.daily.precipitation_sum, et0_fao_evapotranspiration: x.daily.et0_fao_evapotranspiration } }))
    /* Guarda solo lo necesario y solo la versión de hoy */
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('agua-mty:')).forEach((k) => localStorage.removeItem(k))
      localStorage.setItem(KEY, JSON.stringify(list))
    } catch { /* cuota llena o modo privado */ }
    return list
  }

  /* Promedio de los puntos de cada cuenca -> serie diaria por año */
  function build(raw) {
    const time = raw[0].daily.time
    const thisYear = +time.at(-1).slice(0, 4)
    const lastDoy = doy(time.at(-1))
    return BASINS.map((b, k) => {
      const a = raw[k * 2].daily, c = raw[k * 2 + 1].daily
      const years = new Map()
      time.forEach((t, i) => {
        const y = +t.slice(0, 4)
        if (!years.has(y)) years.set(y, { p: [], e: [] })
        const P = ((a.precipitation_sum[i] ?? 0) + (c.precipitation_sum[i] ?? 0)) / 2
        const E = ((a.et0_fao_evapotranspiration[i] ?? 0) + (c.et0_fao_evapotranspiration[i] ?? 0)) / 2
        years.get(y).p.push(P)
        years.get(y).e.push(E)
      })
      const cum = (arr) => arr.reduce((acc, v, i) => (acc.push((acc[i - 1] ?? 0) + v), acc), [])
      const series = new Map()
      for (const [y, v] of years) series.set(y, { p: cum(v.p), bal: cum(v.p.map((x, i) => x - v.e[i])), month: monthly(y, v.p) })
      const normals = [...series.keys()].filter((y) => y >= NORMAL[0] && y <= NORMAL[1])
      /* banda normal por día del año (hasta 365) */
      const band = (key) => Array.from({ length: 365 }, (_, d) => {
        const vals = normals.map((y) => series.get(y)[key][Math.min(d, series.get(y)[key].length - 1)])
        return [q(vals, 0.1), q(vals, 0.5), q(vals, 0.9)]
      })
      const now = series.get(thisYear)
      const di = now.p.length - 1
      const ytdNormals = normals.map((y) => series.get(y).p[Math.min(di, series.get(y).p.length - 1)])
      const ytd = now.p[di]
      const med = q(ytdNormals, 0.5)
      const rank = ytdNormals.filter((v) => v < ytd).length
      const dry = series.get(DRY).p[Math.min(di, series.get(DRY).p.length - 1)]
      const monthMed = Array.from({ length: 12 }, (_, m) => q(normals.map((y) => series.get(y).month[m]), 0.5))
      return { ...b, thisYear, lastDoy, series, bandP: band('p'), bandB: band('bal'), ytd, med, pctNormal: (ytd / med) * 100, rank, n: ytdNormals.length, dry, monthMed }
    })
  }
  function doy(s) { const t = new Date(s + 'T12:00'); return Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 864e5) }
  function monthly(y, p) {
    const out = Array(12).fill(0)
    p.forEach((v, i) => { out[new Date(y, 0, i + 1).getMonth()] += v })
    return out
  }

  function verdict(pct) {
    if (pct < 60) return ['Muy por debajo de lo normal.', 'muy seco']
    if (pct < 85) return ['Más seco que lo normal.', 'seco']
    if (pct <= 115) return ['Dentro de lo normal.', 'normal']
    return ['Más lluvioso que lo normal.', 'húmedo']
  }

  function hero() {
    const avg = stats.reduce((s, b) => s + b.pctNormal, 0) / stats.length
    const [title] = verdict(avg)
    const last = new Date(stats[0].thisYear, 0, stats[0].lastDoy)
    $('answer').textContent = title
    $('lede').textContent = `Del 1 de enero al ${last.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} de ${stats[0].thisYear}, en las tres cuencas ha llovido en promedio el ${r0(avg)}% de lo normal para la fecha.`
    $('dams').innerHTML = stats.map((b, k) => {
      const [, word] = verdict(b.pctNormal)
      const vsDry = b.ytd >= b.dry ? `más que en ${DRY}` : `menos que en ${DRY}`
      return `<button type="button" class="dam${k === sel ? ' is-sel' : ''}" data-k="${k}" data-v="${word}">
        <span class="dname">${b.name}</span>
        <span class="dpct">${r0(b.pctNormal)}<small>% de lo normal</small></span>
        <span class="dline">${r0(b.ytd)} mm en el año · mediana ${r0(b.med)} mm</span>
        <span class="dline">${vsDry} (${r0(b.dry)} mm a esta fecha) · en ${b.rank} de ${b.n} años había llovido menos</span>
      </button>`
    }).join('')
  }

  /* Línea acumulada con banda p10–p90 */
  function lineChart(el, b, key, band, unit, opts = {}) {
    const W = 960, H = 320, L = 52, R = 70, T = 16, B = 30
    const cur = b.series.get(b.thisYear)[key]
    const dry = b.series.get(DRY)[key]
    const all = band.flat().concat(cur, dry)
    let lo = Math.min(0, ...all), hi = Math.max(...all)
    const step = niceStep(hi - lo)
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step
    const x = (d) => L + (d / 364) * (W - L - R)
    const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B)
    const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
    let g = ''
    for (let v = lo; v <= hi; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="gl${v === 0 ? ' zero' : ''}"/><text x="${L - 8}" y="${y(v) + 4}" class="tick" text-anchor="end">${v}</text>`
    MONTHS.forEach((m, i) => { const d = doy(`2001-${String(i + 1).padStart(2, '0')}-01`) - 1; g += `<text x="${x(d) + 4}" y="${H - 8}" class="tick">${m}</text><line x1="${x(d)}" x2="${x(d)}" y1="${H - B}" y2="${H - B + 5}" class="gl"/>` })
    const up = band.map((v) => v[2]), dn = band.map((v) => v[0])
    g += `<path d="${path(up)}L${dn.map((v, i) => `${x(dn.length - 1 - i).toFixed(1)},${y(dn[dn.length - 1 - i]).toFixed(1)}`).join('L')}Z" class="band"/>`
    g += `<path d="${path(band.map((v) => v[1]))}" class="ln ln-med"/>`
    g += `<path d="${path(dry)}" class="ln ln-dry"/>`
    g += `<path d="${path(cur)}" class="ln ln-cur"/>`
    const ci = cur.length - 1
    g += `<circle cx="${x(ci)}" cy="${y(cur[ci])}" r="5" class="dot"/>`
    /* etiquetas directas al final */
    const labels = [[y(cur[ci]), `${b.thisYear}`, 'lab-cur', x(ci) + 9], [y(dry.at(-1)), `${DRY}`, 'lab-dry', W - R + 6], [y(band[364][1]), 'normal', 'lab-med', W - R + 6]]
    labels.sort((a, c) => a[0] - c[0])
    for (let i = 1; i < labels.length; i++) if (labels[i][0] - labels[i - 1][0] < 14) labels[i][0] = labels[i - 1][0] + 14
    g += labels.map(([yy, t, c, xx]) => `<text x="${xx}" y="${yy + 4}" class="lab ${c}">${t}</text>`).join('')
    g += `<line id="${el.id}-x" y1="${T}" y2="${H - B}" class="cross" visibility="hidden"/><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent" class="hit"/>`
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.aria}">${g}</svg>
      <figcaption><span class="k k-cur"></span>${b.thisYear} <span class="k k-dry"></span>${DRY} <span class="k k-med"></span>Mediana ${NORMAL[0]}–${NORMAL[1]} <span class="k k-band"></span>8 de cada 10 años</figcaption>`
    const svg = el.querySelector('svg'), hit = el.querySelector('.hit'), cross = $(`${el.id}-x`)
    hit.addEventListener('pointermove', (e) => {
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY
      const p = pt.matrixTransform(svg.getScreenCTM().inverse())
      const d = Math.max(0, Math.min(364, Math.round(((p.x - L) / (W - L - R)) * 364)))
      cross.setAttribute('x1', x(d)); cross.setAttribute('x2', x(d)); cross.setAttribute('visibility', 'visible')
      const date = new Date(2001, 0, d + 1).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
      tipAt(e.clientX, e.clientY, `${date}\n${b.thisYear}: ${cur[d] != null ? r0(cur[d]) + ' ' + unit : 'aún sin dato'}\n${DRY}: ${r0(dry[d])} ${unit}\nNormal: ${r0(band[d][1])} ${unit} (${r0(band[d][0])} a ${r0(band[d][2])})`)
    })
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); hideTip() })
  }
  function niceStep(span) { const raw = span / 6; const p = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) }

  function months(b) {
    const W = 960, H = 260, L = 52, R = 12, T = 16, B = 30
    const cur = b.series.get(b.thisYear).month
    const curMonth = new Date(b.thisYear, 0, b.lastDoy).getMonth()
    const hi = Math.max(...b.monthMed, ...cur.slice(0, curMonth)) * 1.1
    const step = niceStep(hi)
    const top = Math.ceil(hi / step) * step
    const y = (v) => T + (1 - v / top) * (H - T - B)
    const cw = (W - L - R) / 12
    let g = ''
    for (let v = 0; v <= top; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="gl"/><text x="${L - 8}" y="${y(v) + 4}" class="tick" text-anchor="end">${v}</text>`
    MONTHS.forEach((m, i) => {
      const x0 = L + i * cw
      const med = b.monthMed[i]
      g += `<text x="${x0 + cw / 2}" y="${H - 8}" class="tick" text-anchor="middle">${m}</text>`
      if (i < curMonth) {
        const v = cur[i]
        const cls = v < med * 0.75 ? 'mb dry' : v > med * 1.25 ? 'mb wet' : 'mb ok'
        g += `<rect x="${x0 + cw * 0.22}" y="${y(v)}" width="${cw * 0.56}" height="${Math.max(0, y(0) - y(v))}" rx="4" class="${cls}"><title>${m} ${b.thisYear}: ${r0(v)} mm (normal ${r0(med)} mm)</title></rect>`
      }
      g += `<line x1="${x0 + cw * 0.12}" x2="${x0 + cw * 0.88}" y1="${y(med)}" y2="${y(med)}" class="medl"><title>Normal de ${m}: ${r0(med)} mm</title></line>`
    })
    $('months').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Lluvia mensual frente a la normal">${g}</svg>
      <figcaption><span class="sw dry"></span>Bajo 75% de lo normal <span class="sw ok"></span>Normal <span class="sw wet"></span>Sobre 125% <span class="k k-med"></span>Normal del mes (mm)</figcaption>`
  }

  function render() {
    const b = stats[sel]
    hero()
    $('tabs').innerHTML = stats.map((s, k) => `<button role="tab" type="button" aria-selected="${k === sel}" data-k="${k}">${s.name}</button>`).join('')
    lineChart($('cum'), b, 'p', b.bandP, 'mm', { aria: `Lluvia acumulada en la cuenca de ${b.name}` })
    $('cum-cap').textContent = `Cuenca de ${b.name} (${b.river}). En ${b.thisYear} van ${r0(b.ytd)} mm, el ${r0(b.pctNormal)}% de la mediana a esta fecha. En ${DRY}, el año de la crisis del agua, a esta fecha iban ${r0(b.dry)} mm.`
    months(b)
    lineChart($('bal'), b, 'bal', b.bandB, 'mm', { aria: `Balance hídrico acumulado en la cuenca de ${b.name}` })
  }

  function pick(e) {
    const t = e.target.closest('[data-k]')
    if (!t) return
    sel = +t.dataset.k
    render()
  }
  $('dams').addEventListener('click', pick)
  $('tabs').addEventListener('click', pick)

  const tip = $('tip')
  function tipAt(cx, cy, text) {
    tip.textContent = text; tip.hidden = false
    const w = tip.offsetWidth, h = tip.offsetHeight
    tip.style.left = `${Math.min(Math.max(8, cx - w / 2), innerWidth - w - 8)}px`
    tip.style.top = `${cy - h - 14 < 8 ? cy + 18 : cy - h - 14}px`
  }
  const hideTip = () => (tip.hidden = true)
  addEventListener('scroll', hideTip, { passive: true })

  load().then((raw) => { stats = build(raw); render() }).catch((e) => {
    $('answer').textContent = 'No pude traer los datos.'
    $('lede').textContent = `${e.message}. Recarga la página en un momento; si sigue fallando, Open-Meteo puede estar saturado.`
  })
})()
