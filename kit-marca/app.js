/* Kit de marca: dibuja fondo, bloqueo, carpeta y terminal a partir de un nombre y un color. */
(function () {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const PRESETS = ['#2f7d6d', '#2873c8', '#7a4bd1', '#c2410c', '#be185d', '#3f6212', '#1f2937']

  /* ---------- color ---------- */
  const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
  const css = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

  function state() {
    const name = $('name').value.trim() || 'Tu negocio'
    return {
      name,
      initial: [...name][0].toUpperCase(),
      color: hex2rgb($('color').value),
      style: document.querySelector('input[name="style"]:checked').value,
      slug: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mi-negocio',
    }
  }

  /* ---------- fondo ---------- */
  function background(ctx, w, h, s) {
    const deep = mix(s.color, [8, 9, 12], 0.86)
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, css(mix(deep, [0, 0, 0], 0.35)))
    g.addColorStop(1, css(deep))
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    const glow = ctx.createRadialGradient(w * 0.62, h * 0.58, 0, w * 0.62, h * 0.58, w * 0.55)
    glow.addColorStop(0, css(s.color, 0.32))
    glow.addColorStop(1, css(s.color, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

    if (s.style === 'ondas') {
      for (let k = 0; k < 7; k++) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += 8) {
          const y = h * 0.62 + k * h * 0.022 + Math.sin(x / (w * 0.11) + k * 0.6) * h * 0.035 + Math.sin(x / (w * 0.043) - k) * h * 0.012
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
        }
        ctx.strokeStyle = css(mix(s.color, [255, 255, 255], 0.25), 0.1 + k * 0.05)
        ctx.lineWidth = w / 900
        ctx.stroke()
      }
    } else if (s.style === 'rejilla') {
      ctx.strokeStyle = css(mix(s.color, [255, 255, 255], 0.3), 0.08)
      ctx.lineWidth = w / 1600
      const step = w / 32
      for (let x = step; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = step; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    }
  }

  function mark(ctx, x, y, size, s, alpha) {
    ctx.save()
    ctx.fillStyle = `rgba(237,237,237,${alpha})`
    ctx.font = `900 ${size}px Archivo, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(s.initial, x, y)
    ctx.restore()
  }

  function wordmark(ctx, x, y, size, s, alpha, align = 'center') {
    ctx.save()
    ctx.fillStyle = `rgba(237,237,237,${alpha})`
    ctx.font = `600 ${size}px Archivo, system-ui, sans-serif`
    ctx.textAlign = align
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${size * 0.32}px`
    ctx.fillText(s.name.toUpperCase(), x, y)
    ctx.restore()
  }

  function drawWall(cv, s) {
    const ctx = cv.getContext('2d')
    const { width: w, height: h } = cv
    background(ctx, w, h, s)
    mark(ctx, w - w * 0.075, h * 0.12, h * 0.085, s, 0.8)
    wordmark(ctx, w - w * 0.075, h * 0.205, h * 0.016, s, 0.55)
  }

  function drawLock(cv, s) {
    const ctx = cv.getContext('2d')
    const { width: w, height: h } = cv
    background(ctx, w, h, s)
    const now = new Date()
    ctx.fillStyle = 'rgba(237,237,237,.95)'
    ctx.textAlign = 'center'
    ctx.font = `300 ${h * 0.14}px Archivo, system-ui, sans-serif`
    ctx.fillText(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }), w / 2, h * 0.3)
    ctx.font = `500 ${h * 0.03}px Archivo, system-ui, sans-serif`
    ctx.fillText(now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }), w / 2, h * 0.37)
    mark(ctx, w / 2, h * 0.62, h * 0.13, s, 0.9)
    wordmark(ctx, w / 2, h * 0.73, h * 0.024, s, 0.7)
  }

  /* ---------- carpeta ---------- */
  function drawFolder(cv, s) {
    const ctx = cv.getContext('2d')
    const S = cv.width
    ctx.clearRect(0, 0, S, S)
    const back = mix(s.color, [0, 0, 0], 0.25)
    const light = mix(s.color, [255, 255, 255], 0.28)
    const r = S * 0.06
    const rr = (x, y, w, h, rad) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, rad) }
    ctx.fillStyle = css(back)
    rr(S * 0.08, S * 0.16, S * 0.36, S * 0.16, r)
    ctx.fill()
    rr(S * 0.08, S * 0.22, S * 0.84, S * 0.6, r)
    ctx.fill()
    const g = ctx.createLinearGradient(0, S * 0.3, 0, S * 0.84)
    g.addColorStop(0, css(light))
    g.addColorStop(1, css(s.color))
    ctx.fillStyle = g
    rr(S * 0.08, S * 0.3, S * 0.84, S * 0.54, r)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,.95)'
    ctx.font = `900 ${S * 0.3}px Archivo, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(s.initial, S / 2, S * 0.585)
  }

  /* ---------- terminal ---------- */
  function drawTerm(s) {
    const t = $('term')
    const deep = mix(s.color, [8, 9, 12], 0.88)
    const accent = mix(s.color, [255, 255, 255], 0.35)
    t.style.background = css(deep)
    t.style.setProperty('--accent', css(accent))
    const line = '─'.repeat(Math.min(30, s.name.length + 8))
    t.innerHTML = `<span class="a">╭${line}╮</span>
<span class="a">│</span>  <b>${s.name.replace(/</g, '&lt;')}</b>
<span class="a">╰${line}╯</span>
<span class="d">equipo-01 · Windows · 8 GB</span>

<span class="a">${s.slug}</span> <span class="d">~/proyectos</span>
<span class="a">❯</span> _`
  }

  /* ---------- escritorio ---------- */
  function drawDesk(s) {
    const icons = $('desk-icons')
    const url = folderURL
    icons.innerHTML = ['Clientes', 'Facturas', 'Fotos', 'Pedidos'].map((n) => `<span class="dicon"><img src="${url}" alt=""><span>${n}</span></span>`).join('')
  }

  let folderURL = ''
  function render() {
    const s = state()
    drawWall($('wall'), s)
    drawLock($('lock'), s)
    const fc = document.createElement('canvas')
    fc.width = fc.height = 256
    drawFolder(fc, s)
    folderURL = fc.toDataURL('image/png')
    drawDesk(s)
    drawTerm(s)
  }

  function download(canvas, file) {
    canvas.toBlob((b) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.download = file
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    }, 'image/png')
  }

  /* ---------- eventos ---------- */
  $('swatches').innerHTML = PRESETS.map((c) => `<button type="button" class="sw" style="--c:${c}" data-c="${c}" aria-label="Usar el color ${c}"></button>`).join('')
  $('swatches').addEventListener('click', (e) => {
    const c = e.target.dataset.c
    if (!c) return
    $('color').value = c
    mark_active()
    render()
  })
  function mark_active() {
    document.querySelectorAll('.sw').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === $('color').value)))
  }
  $('controls').addEventListener('input', () => { mark_active(); render() })
  $('dl-wall').addEventListener('click', () => download($('wall'), `fondo-${state().slug}.png`))
  $('dl-lock').addEventListener('click', () => download($('lock'), `bloqueo-${state().slug}.png`))
  $('dl-folder').addEventListener('click', () => {
    const c = document.createElement('canvas')
    c.width = c.height = 512
    drawFolder(c, state())
    download(c, `carpeta-${state().slug}.png`)
  })

  mark_active()
  render()
  document.fonts.load('900 100px Archivo').then(render)
})()
