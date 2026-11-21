/* Calor MTY: pronóstico horario por municipio + climatología de 30 años. */
(function () {
  'use strict'

  const MUNIS = [
    { name: 'Monterrey', lat: 25.6866, lon: -100.3161 },
    { name: 'San Pedro', lat: 25.6573, lon: -100.4024 },
    { name: 'San Nicolás', lat: 25.7417, lon: -100.3022 },
    { name: 'Guadalupe', lat: 25.6775, lon: -100.2597 },
    { name: 'Apodaca', lat: 25.7817, lon: -100.1886 },
    { name: 'Escobedo', lat: 25.7933, lon: -100.3381 },
    { name: 'Santa Catarina', lat: 25.6733, lon: -100.458 },
    { name: 'García', lat: 25.8086, lon: -100.5878 },
    { name: 'Juárez', lat: 25.6464, lon: -100.0953 },
    { name: 'Cadereyta', lat: 25.5833, lon: -99.9833 },
  ]

  const RISK = [
    { max: 27, key: 'r0', name: 'Sin riesgo' },
    { max: 32, key: 'r1', name: 'Precaución' },
    { max: 41, key: 'r2', name: 'Precaución extrema' },
    { max: 54, key: 'r3', name: 'Peligro' },
    { max: Infinity, key: 'r4', name: 'Peligro extremo' },
  ]
  const riskOf = (t) => RISK.find((r) => t < r.max)
  const ADVICE = {
    r0: 'Puedes hacer tu día normal.',
    r1: 'Hidrátate y busca sombra en las horas fuertes.',
    r2: 'Evita el ejercicio y el trabajo pesado al sol en las horas marcadas.',
    r3: 'Quédate en interiores en las horas fuertes. Vigila a personas mayores, bebés y mascotas.',
    r4: 'Riesgo alto de golpe de calor. No salgas al sol si no es necesario.',
  }

  const $ = (id) => document.getElementById(id)
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const fmtDay = new Intl.DateTimeFormat('es-MX', { weekday: 'short' })
  const day = (t) => fmtDay.format(new Date(+t.slice(0, 4), +t.slice(5, 7) - 1, +t.slice(8, 10))).replace('.', '')
  const hr = (t) => +t.slice(11, 13)
  const r1 = (n) => Math.round(n * 10) / 10

  let data = null
  let sel = 0
  const climo = new Map()

  function nowIdx(times) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]))
    const i = times.indexOf(`${p.year}-${p.month}-${p.day}T${p.hour}:00`)
    return i < 0 ? 0 : i
  }

  /* ---------- Respuesta principal ---------- */
  function hero() {
    const m = data[sel]
    const h = m.hourly
    const today = h.time[0].slice(0, 10)
    const idx = h.time.map((t, i) => (t.startsWith(today) ? i : -1)).filter((i) => i >= 0)
    let peak = idx[0]
    for (const i of idx) if (h.apparent_temperature[i] > h.apparent_temperature[peak]) peak = i
    const at = h.apparent_temperature[peak]
    const risk = riskOf(at)
    const uvMax = Math.max(...idx.map((i) => h.uv_index[i] ?? 0))
    const night = m.daily.temperature_2m_min[1]
    $('hero').dataset.r = risk.key
    $('answer').textContent = `${risk.name}.`
    $('lede').textContent = `Hoy en ${MUNIS[sel].name} la sensación térmica llega a ${Math.round(at)} °C a las ${hr(h.time[peak])}:00. ${ADVICE[risk.key]}`
    const safe = windows(h, idx).map(([a, b]) => `${a}–${b + 1} h`).join(', ')
    $('facts').innerHTML = [
      ['Máxima', `${Math.round(m.daily.temperature_2m_max[0])} °C`],
      ['Sensación máxima', `${Math.round(at)} °C`],
      ['UV máximo', `${r1(uvMax)}${uvMax >= 8 ? ' (muy alto)' : uvMax >= 6 ? ' (alto)' : ''}`],
      ['Mínima esta noche', `${Math.round(night)} °C${night >= 24 ? ', sin alivio' : ''}`],
      ['Horas seguras hoy', safe || 'ninguna'],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')
  }

  /* Tramos seguros: sensación < 32 °C, UV < 6, entre 6 y 22 h */
  function windows(h, idx) {
    const out = []
    let start = null
    let prev = null
    for (const i of idx) {
      const H = hr(h.time[i])
      const ok = H >= 6 && H <= 21 && h.apparent_temperature[i] < 32 && (h.uv_index[i] ?? 0) < 6
      if (ok && start === null) start = H
      if (!ok && start !== null) { out.push([start, prev]); start = null }
      prev = H
    }
    if (start !== null) out.push([start, prev])
    return out
  }

  /* ---------- Gráfica de línea (SVG) ---------- */
  function chart() {
    const h = data[sel].hourly
    const n = h.time.length
    const W = 960, H = 280, L = 40, R = 12, T = 14, B = 34
    const vals = h.apparent_temperature.concat(h.temperature_2m)
    const lo = Math.floor(Math.min(...vals) / 5) * 5
    const hi = Math.max(Math.ceil(Math.max(...vals) / 5) * 5, lo + 15)
    const x = (i) => L + (i / (n - 1)) * (W - L - R)
    const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B)
    const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
    const ni = nowIdx(h.time)

    let g = ''
    for (let v = lo; v <= hi; v += 5) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="grid-l"/><text x="${L - 6}" y="${y(v) + 4}" class="tick" text-anchor="end">${v}°</text>`
    /* bandas de riesgo desde 32 °C */
    for (const r of RISK.slice(2)) {
      const from = RISK[RISK.indexOf(r) - 1].max
      if (from >= hi) continue
      g += `<rect x="${L}" width="${W - L - R}" y="${y(Math.min(r.max, hi))}" height="${y(from) - y(Math.min(r.max, hi))}" class="band ${r.key}"/>`
    }
    h.time.forEach((t, i) => {
      if (t.endsWith('T00:00')) g += `<line x1="${x(i)}" x2="${x(i)}" y1="${T}" y2="${H - B}" class="day-l"/><text x="${x(i) + 4}" y="${H - 12}" class="tick">${day(t)}</text>`
    })
    g += `<line x1="${x(ni)}" x2="${x(ni)}" y1="${T}" y2="${H - B}" class="now-l"/><text x="${x(ni) + 4}" y="${T + 10}" class="tick now-t">ahora</text>`
    g += `<path d="${path(h.temperature_2m)}" class="ln ln-t"/><path d="${path(h.apparent_temperature)}" class="ln ln-a"/>`
    g += `<line id="cross" x1="0" x2="0" y1="${T}" y2="${H - B}" class="cross" visibility="hidden"/><circle id="dot" r="5" class="dot" visibility="hidden"/>`
    g += `<rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent" id="hit"/>`
    $('chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sensación térmica y temperatura por hora">${g}</svg>
      <figcaption><span class="k k-a"></span>Sensación térmica <span class="k k-t"></span>Temperatura</figcaption>`

    const svg = $('chart').querySelector('svg')
    const hit = $('hit')
    const move = (e) => {
      const pt = svg.createSVGPoint()
      pt.x = e.clientX; pt.y = e.clientY
      const p = pt.matrixTransform(svg.getScreenCTM().inverse())
      const i = Math.max(0, Math.min(n - 1, Math.round(((p.x - L) / (W - L - R)) * (n - 1))))
      $('cross').setAttribute('x1', x(i)); $('cross').setAttribute('x2', x(i)); $('cross').setAttribute('visibility', 'visible')
      $('dot').setAttribute('cx', x(i)); $('dot').setAttribute('cy', y(h.apparent_temperature[i])); $('dot').setAttribute('visibility', 'visible')
      showTip(e.clientX, e.clientY, `${day(h.time[i])} ${hr(h.time[i])}:00\nSensación ${r1(h.apparent_temperature[i])} °C · ${riskOf(h.apparent_temperature[i]).name}\nTemperatura ${r1(h.temperature_2m[i])} °C · Humedad ${h.relative_humidity_2m[i]}%\nUV ${r1(h.uv_index[i] ?? 0)}`)
    }
    hit.addEventListener('pointermove', move)
    hit.addEventListener('pointerleave', () => { $('cross').setAttribute('visibility', 'hidden'); $('dot').setAttribute('visibility', 'hidden'); hideTip() })

    /* tramos seguros por día */
    const days = [...new Set(h.time.map((t) => t.slice(0, 10)))]
    $('windows').innerHTML = days.map((d) => {
      const idx = h.time.map((t, i) => (t.startsWith(d) ? i : -1)).filter((i) => i >= 0)
      const w = windows(h, idx)
      return `<p><strong>${day(d + 'T00:00')}</strong> ${w.length ? w.map(([a, b]) => `<span class="win">${a}:00–${b + 1}:00</span>`).join(' ') : '<span class="none">sin horas seguras al aire libre</span>'}</p>`
    }).join('')
  }

  /* ---------- Rejilla del área metropolitana ---------- */
  function grid() {
    const times = data[0].hourly.time
    const ni = nowIdx(times)
    const el = $('grid')
    el.style.setProperty('--cols', times.length)
    el.innerHTML = data.map((m, k) => {
      const cells = m.hourly.apparent_temperature.map((a, i) => {
        const r = riskOf(a)
        const info = `${MUNIS[k].name}, ${day(times[i])} ${hr(times[i])}:00\nSensación ${r1(a)} °C · ${r.name}\nUV ${r1(m.hourly.uv_index[i] ?? 0)}`
        return `<button type="button" class="cell ${r.key}${i === ni ? ' is-now' : ''}" data-info="${esc(info)}" aria-label="${esc(info.replace(/\n/g, '. '))}"></button>`
      }).join('')
      const mx = Math.round(Math.max(...m.daily.apparent_temperature_max.slice(0, 1)))
      return `<button type="button" class="mname${k === sel ? ' is-sel' : ''}" data-k="${k}"><span>${MUNIS[k].name}</span><span class="mx">${mx}°</span></button><div class="strip">${cells}</div>`
    }).join('')
    $('axis').style.setProperty('--cols', times.length)
    $('axis').innerHTML = times.map((t, i) => (t.endsWith('T00:00') || i === ni ? `<span style="grid-column:${i + 1}"${i === ni ? ' class="ax-now"' : ''}>${i === ni ? 'ahora' : day(t)}</span>` : '')).join('')
    $('legend').innerHTML = RISK.map((r, i) => `<li><span class="sw ${r.key}"></span>${r.name}<span class="rng">${i === 0 ? 'bajo 27 °C' : r.max === Infinity ? '54 °C o más' : `${RISK[i - 1].max}–${r.max} °C`}</span></li>`).join('')
  }

  /* ---------- Climatología ---------- */
  async function history() {
    const m = MUNIS[sel]
    const key = m.name
    if (!climo.has(key)) {
      const end = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10)
      const cacheKey = `calor-mty:${key}:${end}`
      let cached = null
      try { cached = JSON.parse(localStorage.getItem(cacheKey)) } catch { /* sin almacenamiento */ }
      const u = `https://archive-api.open-meteo.com/v1/archive?latitude=${m.lat}&longitude=${m.lon}&start_date=1995-01-01&end_date=${end}&daily=temperature_2m_max&timezone=America%2FMonterrey`
      climo.set(key, cached ? Promise.resolve(cached) : fetch(u)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
        .then((d) => {
          const slim = { daily: { time: d.daily.time, temperature_2m_max: d.daily.temperature_2m_max } }
          try {
            Object.keys(localStorage).filter((k) => k.startsWith(`calor-mty:${key}:`)).forEach((k) => localStorage.removeItem(k))
            localStorage.setItem(cacheKey, JSON.stringify(slim))
          } catch { /* cuota llena o modo privado */ }
          return slim
        }))
    }
    let d
    try { d = await climo.get(key) } catch { $('hist-note').textContent = 'No pude traer la historia ahora. Recarga en un momento.'; return }
    if (MUNIS[sel].name !== key) return
    const today = data[sel].daily.time[0]
    const doy = (s) => { const t = new Date(s + 'T12:00'); return Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 864e5) }
    const td = doy(today)
    const sample = []
    d.daily.time.forEach((t, i) => {
      const v = d.daily.temperature_2m_max[i]
      if (v == null) return
      const dd = Math.abs(doy(t) - td)
      if (Math.min(dd, 365 - dd) <= 7) sample.push(v)
    })
    const fc = data[sel].daily.temperature_2m_max[0]
    const below = sample.filter((v) => v < fc).length
    const pct = Math.round((below / sample.length) * 100)
    /* histograma por grado */
    const lo = Math.floor(Math.min(...sample, fc)), hi = Math.ceil(Math.max(...sample, fc))
    const bins = Array.from({ length: hi - lo + 1 }, () => 0)
    sample.forEach((v) => bins[Math.floor(v) - lo]++)
    const W = 960, H = 200, L = 10, R = 10, T = 18, B = 30
    const bw = (W - L - R) / bins.length
    const top = Math.max(...bins)
    let g = bins.map((c, i) => {
      const hh = (c / top) * (H - T - B)
      const t = lo + i
      return `<rect x="${L + i * bw + 1}" y="${H - B - hh}" width="${Math.max(1, bw - 2)}" height="${hh}" rx="2" class="bar ${t + 1 <= fc ? 'below' : 'above'}"><title>${t}–${t + 1} °C: ${c} días</title></rect>`
    }).join('')
    for (let t = Math.ceil(lo / 5) * 5; t <= hi; t += 5) g += `<text x="${L + (t - lo) * bw}" y="${H - 10}" class="tick" text-anchor="middle">${t}°</text>`
    const fx = L + (fc - lo) * bw
    g += `<line x1="${fx}" x2="${fx}" y1="${T - 6}" y2="${H - B}" class="fc-l"/><text x="${fx + 6}" y="${T + 4}" class="tick now-t">hoy ${r1(fc)}°</text>`
    $('hist').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histograma de máximas históricas">${g}</svg>`
    const yrs = `${d.daily.time[0].slice(0, 4)}–${d.daily.time.at(-1).slice(0, 4)}`
    $('hist-note').textContent = `Hoy (${r1(fc)} °C) está más caliente que el ${pct}% de los ${sample.length} días comparables entre ${yrs}. ` +
      (pct >= 90 ? 'Es un día anormalmente caluroso para la época.' : pct <= 10 ? 'Es un día más fresco de lo normal para la época.' : 'Está dentro de lo normal para la época.')
  }

  /* ---------- Tooltip ---------- */
  const tip = $('tip')
  function showTip(cx, cy, text) {
    tip.textContent = text
    tip.hidden = false
    const w = tip.offsetWidth, h = tip.offsetHeight
    tip.style.left = `${Math.min(Math.max(8, cx - w / 2), innerWidth - w - 8)}px`
    tip.style.top = `${cy - h - 14 < 8 ? cy + 18 : cy - h - 14}px`
  }
  const hideTip = () => (tip.hidden = true)
  $('grid').addEventListener('pointerover', (e) => {
    const c = e.target.closest('.cell')
    if (c) { const r = c.getBoundingClientRect(); showTip(r.left + r.width / 2, r.top, c.dataset.info) }
  })
  $('grid').addEventListener('pointerleave', hideTip)
  $('grid').addEventListener('focusin', (e) => {
    const c = e.target.closest('.cell')
    if (c) { const r = c.getBoundingClientRect(); showTip(r.left + r.width / 2, r.top, c.dataset.info) }
  })
  $('grid').addEventListener('focusout', hideTip)
  $('grid').addEventListener('click', (e) => {
    const b = e.target.closest('.mname')
    if (b) select(+b.dataset.k, true)
  })
  addEventListener('scroll', hideTip, { passive: true })

  function select(k, scroll) {
    sel = k
    $('muni').value = String(k)
    hero(); chart(); grid(); history()
    if (scroll) $('hero').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  $('muni').innerHTML = MUNIS.map((m, i) => `<option value="${i}">${m.name}</option>`).join('')
  $('muni').addEventListener('change', (e) => select(+e.target.value))

  const q = new URLSearchParams({
    latitude: MUNIS.map((m) => m.lat).join(','),
    longitude: MUNIS.map((m) => m.lon).join(','),
    hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,uv_index',
    daily: 'temperature_2m_max,temperature_2m_min,apparent_temperature_max',
    timezone: 'America/Monterrey',
    forecast_days: '3',
  })
  fetch(`https://api.open-meteo.com/v1/forecast?${q}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`La API respondió ${r.status}`))))
    .then((d) => { data = Array.isArray(d) ? d : [d]; select(0) })
    .catch((e) => { $('answer').textContent = 'No pude traer el pronóstico.'; $('lede').textContent = `${e.message}. Recarga la página en un momento.` })
})()
