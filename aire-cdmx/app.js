/* Aire CDMX: una petición, cinco zonas, 72 horas. */
(function () {
  'use strict'

  const ZONES = [
    { name: 'Centro', lat: 19.4326, lon: -99.1332 },
    { name: 'Azcapotzalco', lat: 19.4869, lon: -99.1844 },
    { name: 'Santa Fe', lat: 19.3594, lon: -99.2596 },
    { name: 'Coyoacán', lat: 19.3467, lon: -99.1617 },
    { name: 'Iztapalapa', lat: 19.3574, lon: -99.0926 },
  ]

  /* Categorías de la EPA para el índice US AQI. */
  const CATS = [
    { max: 50, key: 'c1', name: 'Buena', advice: 'Buen momento para salir a correr o abrir las ventanas.' },
    { max: 100, key: 'c2', name: 'Aceptable', advice: 'Puedes salir. Si eres muy sensible a la contaminación, baja la intensidad.' },
    { max: 150, key: 'c3', name: 'Mala para grupos sensibles', advice: 'Niños, personas mayores y con asma: mejor evitar el ejercicio fuerte al aire libre.' },
    { max: 200, key: 'c4', name: 'Mala', advice: 'Evita el ejercicio al aire libre. Cierra ventanas si puedes.' },
    { max: 300, key: 'c5', name: 'Muy mala', advice: 'Quédate en interiores en lo posible.' },
    { max: Infinity, key: 'c6', name: 'Extremadamente mala', advice: 'Quédate en interiores y sigue los avisos oficiales.' },
  ]
  const catOf = (v) => CATS.find((c) => v <= c.max)

  const $ = (id) => document.getElementById(id)
  const fmtDay = new Intl.DateTimeFormat('es-MX', { weekday: 'short' })
  const fmtClock = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' })

  function url() {
    const p = new URLSearchParams({
      latitude: ZONES.map((z) => z.lat).join(','),
      longitude: ZONES.map((z) => z.lon).join(','),
      hourly: 'us_aqi,pm2_5',
      timezone: 'America/Mexico_City',
      past_days: '2',
      forecast_days: '1',
    })
    return `https://air-quality-api.open-meteo.com/v1/air-quality?${p}`
  }

  /* "2026-11-21T14:00" en hora de la CDMX -> Date local del navegador, sin depender de su zona horaria */
  function nowIndex(times) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date())
        .map((p) => [p.type, p.value]),
    )
    const key = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:00`
    const i = times.indexOf(key)
    return i === -1 ? times.length - 1 : i
  }

  function day(t) {
    const [y, m, d] = t.slice(0, 10).split('-').map(Number)
    return fmtDay.format(new Date(y, m - 1, d)).replace('.', '')
  }
  const hour = (t) => String(Number(t.slice(11, 13)))
  const label = (t) => `${day(t)} ${hour(t)}`

  function render(data) {
    const times = data[0].hourly.time
    const ni = nowIndex(times)
    const rows = ZONES.map((z, k) => ({ ...z, aqi: data[k].hourly.us_aqi, pm: data[k].hourly.pm2_5 }))

    /* Respuesta principal: el Centro */
    const c = rows[0]
    const v = c.aqi[ni]
    if (v == null) {
      $('now-answer').textContent = 'Sin dato para esta hora.'
    } else {
      const cat = catOf(v)
      $('now').dataset.cat = cat.key
      $('now-answer').textContent = `${cat.name}.`
      $('now-detail').textContent = `Índice ${v} a las ${hour(times[ni])}:00. ${cat.advice}`
    }

    /* Rejilla */
    const grid = $('grid')
    grid.style.setProperty('--cols', times.length)
    grid.style.setProperty('--now', ni)
    grid.innerHTML = ''
    for (const r of rows) {
      const name = document.createElement('div')
      name.className = 'zname'
      const cur = r.aqi[ni]
      name.innerHTML = `<span>${r.name}</span><span class="znow">${cur ?? '–'}</span>`
      grid.appendChild(name)
      const strip = document.createElement('div')
      strip.className = 'strip'
      r.aqi.forEach((a, i) => {
        const cell = document.createElement('button')
        cell.type = 'button'
        cell.className = `cell ${a == null ? 'none' : catOf(a).key}${i > ni ? ' fc' : ''}${i === ni ? ' is-now' : ''}`
        cell.dataset.info = a == null
          ? `${r.name}, ${label(times[i])}:00\nSin dato`
          : `${r.name}, ${label(times[i])}:00${i > ni ? ' (pronóstico)' : ''}\nÍndice ${a}: ${catOf(a).name}\nPM2.5: ${r.pm[i] ?? '–'} µg/m³`
        cell.setAttribute('aria-label', cell.dataset.info.replace(/\n/g, '. '))
        strip.appendChild(cell)
      })
      grid.appendChild(strip)
    }

    /* Eje: medianoches y "ahora" */
    const axis = $('axis')
    axis.style.setProperty('--cols', times.length)
    axis.innerHTML = ''
    times.forEach((t, i) => {
      if (t.endsWith('T00:00') || i === ni) {
        const s = document.createElement('span')
        s.style.gridColumn = `${i + 1}`
        s.textContent = i === ni ? 'ahora' : day(t)
        if (i === ni) s.className = 'ax-now'
        axis.appendChild(s)
      }
    })

    /* Leyenda */
    $('legend').innerHTML = CATS.map((k) => `<li><span class="sw ${k.key}"></span>${k.name}<span class="rng">${k.max === Infinity ? '301+' : `hasta ${k.max}`}</span></li>`).join('')
      + '<li><span class="sw c2 fc"></span>Pronóstico</li>'

    /* Tabla */
    $('table').innerHTML = '<thead><tr><th scope="col">Zona</th><th scope="col">Índice</th><th scope="col">Categoría</th><th scope="col">PM2.5 (µg/m³)</th></tr></thead><tbody>'
      + rows.map((r) => `<tr><th scope="row">${r.name}</th><td>${r.aqi[ni] ?? '–'}</td><td>${r.aqi[ni] == null ? '–' : catOf(r.aqi[ni]).name}</td><td>${r.pm[ni] ?? '–'}</td></tr>`).join('')
      + '</tbody>'

    $('fetched').textContent = `Última consulta: ${fmtClock.format(new Date()).replace(/\.$/, '')}.`
  }

  /* Tooltip: cursor, toque y teclado */
  const tip = $('tip')
  function show(cell) {
    tip.textContent = cell.dataset.info
    tip.hidden = false
    const r = cell.getBoundingClientRect()
    const w = tip.offsetWidth
    const x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8)
    const y = r.top - tip.offsetHeight - 8
    tip.style.left = `${x}px`
    tip.style.top = `${y < 8 ? r.bottom + 8 : y}px`
  }
  const hide = () => (tip.hidden = true)
  const grid = $('grid')
  grid.addEventListener('pointerover', (e) => e.target.classList.contains('cell') && show(e.target))
  grid.addEventListener('pointerleave', hide)
  grid.addEventListener('focusin', (e) => e.target.classList.contains('cell') && show(e.target))
  grid.addEventListener('focusout', hide)
  window.addEventListener('scroll', hide, { passive: true })

  fetch(url())
    .then((r) => {
      if (!r.ok) throw new Error(`La API respondió ${r.status}`)
      return r.json()
    })
    .then((d) => render(Array.isArray(d) ? d : [d]))
    .catch((err) => {
      $('now-answer').textContent = 'No pude traer los datos.'
      $('now-detail').textContent = `${err.message}. Recarga la página en un momento; si sigue fallando, Open-Meteo puede estar caído.`
    })
})()
