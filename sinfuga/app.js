/* Sinfuga: interfaz. */
(function () {
  'use strict'
  const { scan, mask } = window.Sinfuga

  const input = document.getElementById('input')
  const mirror = document.getElementById('mirror')
  const list = document.getElementById('findings')
  const status = document.getElementById('status')
  const btnSample = document.getElementById('sample')
  const btnCopy = document.getElementById('copy')
  const btnClear = document.getElementById('clear')

  let hits = []

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  function render() {
    const text = input.value
    hits = scan(text)

    /* Espejo con las marcas, detrás del textarea */
    let html = ''
    let pos = 0
    hits.forEach((h, i) => {
      html += esc(text.slice(pos, h.start)) + `<mark data-i="${i}">${esc(text.slice(h.start, h.end))}</mark>`
      pos = h.end
    })
    mirror.innerHTML = html + esc(text.slice(pos)) + '\n'

    /* Informe */
    list.innerHTML = ''
    hits.forEach((h, i) => {
      const li = document.createElement('li')
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'finding'
      b.innerHTML = `<span class="f-name">${esc(h.rule.name)}</span><span class="f-line">línea ${h.line}</span><code class="f-val">${esc(mask(h.value))}</code><span class="f-fix">${esc(h.rule.fix)}</span>`
      b.addEventListener('click', () => select(i))
      li.appendChild(b)
      list.appendChild(li)
    })

    const n = hits.length
    if (!text.trim()) status.textContent = 'Pega algo para revisarlo.'
    else if (n === 0) status.textContent = 'No encontré nada que parezca una clave. Revisa igual los valores que solo tú sabes que son secretos.'
    else status.textContent = n === 1 ? '1 cosa no debería salir de aquí.' : `${n} cosas no deberían salir de aquí.`
    status.classList.toggle('is-bad', n > 0)

    btnCopy.disabled = n === 0
    btnClear.disabled = !text
  }

  function select(i) {
    const h = hits[i]
    input.focus()
    input.setSelectionRange(h.start, h.end)
    const mark = mirror.querySelector(`mark[data-i="${i}"]`)
    if (mark) input.scrollTop = mark.offsetTop - input.clientHeight / 3
  }

  function redacted() {
    let out = ''
    let pos = 0
    for (const h of hits) {
      out += input.value.slice(pos, h.start) + '[TACHADO]'
      pos = h.end
    }
    return out + input.value.slice(pos)
  }

  /* Ejemplo con valores aleatorios: se generan aquí para que el repositorio no contenga nada que parezca una clave real. */
  function rand(n, abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789') {
    const a = new Uint32Array(n)
    crypto.getRandomValues(a)
    return Array.from(a, (x) => abc[x % abc.length]).join('')
  }
  function sample() {
    const up = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    return [
      '# .env de producción de Café Bruma (negocio ficticio, valores inventados)',
      'APP_NAME=cafe-bruma',
      'DEBUG=false',
      'PUBLIC_URL=https://cafe-bruma.example',
      '',
      `DATABASE_URL=postgres://admin:${rand(14)}@db.cafe-bruma.example:5432/pedidos`,
      `STRIPE_SECRET_KEY=${'sk_' + 'live_'}${rand(24)}`,
      `OPENAI_API_KEY=${'sk-' + 'proj-'}${rand(40)}`,
      `GITHUB_TOKEN=${'gh' + 'p_'}${rand(36)}`,
      `AWS_ACCESS_KEY_ID=${'AK' + 'IA'}${rand(16, up)}`,
      `MAPS_KEY=${'AI' + 'za'}${rand(35)}`,
      '',
      'SMTP_USER=pedidos@cafe-bruma.example',
      `SMTP_PASSWORD="${rand(12)}"`,
      'ADMIN_PASSWORD=changeme',
    ].join('\n')
  }

  input.addEventListener('input', render)
  input.addEventListener('scroll', () => {
    mirror.scrollTop = input.scrollTop
    mirror.scrollLeft = input.scrollLeft
  })
  btnSample.addEventListener('click', () => {
    input.value = sample()
    render()
    input.focus()
  })
  btnClear.addEventListener('click', () => {
    input.value = ''
    render()
    input.focus()
  })
  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(redacted())
      btnCopy.textContent = 'Copiada'
    } catch {
      btnCopy.textContent = 'Tu navegador no dejó copiar'
    }
    setTimeout(() => (btnCopy.textContent = 'Copiar versión tachada'), 1800)
  })

  render()
})()
