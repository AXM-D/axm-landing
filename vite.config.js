import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
  CONTACT_EMAIL,
  FAQ,
  FREE_CALL,
  LINKS,
  MONTHLY,
  PROJECTS,
  SERVICES,
  SITE_URL,
  formatMoney,
  minPrice,
} from './src/data.js'

/* La base sale de SITE_URL: al pasar a un dominio propio solo hay que cambiarlo allí. */
const BASE = new URL(SITE_URL).pathname

const TITLE = 'AXM | Ingeniería de datos y seguridad defensiva en Rust y Python'
const DESCRIPTION = `Ingeniería de datos y seguridad defensiva en Rust y Python: pipelines, vigilancia de marca y dominios, backends y APIs. Desde ${formatMoney(minPrice('USD'), 'USD')}, precio fijo. ${FREE_CALL.label}.`

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const money = (p) => `${formatMoney(p.USD, 'USD')} (${formatMoney(p.MXN, 'MXN')})`

/* Datos estructurados: solo hechos reales. Sin dirección, teléfono, reseñas ni valoraciones. */
function jsonLd() {
  const orgId = `${SITE_URL}#organization`
  const offer = (name, description, price, itemDescription) => ({
    '@type': 'Offer',
    name,
    description,
    price: String(price),
    priceCurrency: 'USD',
    itemOffered: { '@type': 'Service', name, description: itemDescription, provider: { '@id': orgId } },
  })
  const graph = [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': orgId,
      name: 'AXM',
      url: SITE_URL,
      logo: `${SITE_URL}icon-512.png`,
      image: `${SITE_URL}og.png`,
      email: CONTACT_EMAIL,
      description: DESCRIPTION,
      sameAs: [LINKS.githubDevs, LINKS.githubD],
      availableLanguage: 'es',
      knowsAbout: [
        'Ingeniería de datos',
        'Pipelines de datos',
        'Seguridad defensiva',
        'Vigilancia de marca y dominios',
        'Inteligencia de fuentes abiertas (OSINT) defensiva',
        'Backends y APIs',
        'Rust',
        'Python',
      ],
      makesOffer: [
        ...SERVICES.map((s) => offer(s.title, s.scope, s.price.USD, s.desc)),
        offer(MONTHLY.title, MONTHLY.desc, MONTHLY.price.USD, MONTHLY.desc),
      ],
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: 'AXM', inLanguage: 'es', publisher: { '@id': orgId } },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

/* Contenido en HTML plano dentro de #root. Buscadores y crawlers de IA que no ejecutan JavaScript lo leen;
   React lo sustituye al arrancar. */
function staticContent() {
  return `<div style="max-width:48rem;margin:0 auto;padding:2rem 1.25rem;font-family:system-ui,sans-serif;line-height:1.55;color:#ededed;background:#0a0a0b">
<header><p><strong>AXM</strong>, estudio independiente</p>
<h1>Ingeniería de datos y seguridad defensiva, sin intermediarios.</h1>
<p>AXM construye pipelines de datos, vigilancia de marca y dominios con fuentes públicas, y backends y APIs en Rust y Python. Es el autor de TaQ, un motor de inteligencia contextual en desarrollo. Hablas directamente con quien diseña y escribe el código.</p>
<p>${esc(FREE_CALL.label)}. Escribe a <a href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a>.</p></header>
<main>
<section><h2>Servicios y precios</h2>
${SERVICES.map(
  (s) => `<article><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><p><strong>${esc(money(s.price))}</strong>, precio fijo, ${esc(s.time)}. ${esc(s.scope)}</p><p>Te llevas: ${s.gets.map(esc).join('; ')}.</p><p>Fuera del paquete, se cotiza aparte: ${esc(s.out)}</p></article>`,
).join('\n')}
<article><h3>${esc(MONTHLY.title)}</h3><p><strong>${esc(money(MONTHLY.price))} al mes.</strong> ${esc(MONTHLY.desc)}</p></article></section>
<section><h2>Proyectos</h2>
<p><a href="${esc(LINKS.taq)}">TaQ</a>: motor modular de inteligencia contextual defensiva escrito en Rust, en desarrollo.</p>
${PROJECTS.map((p) => `<p><a href="${esc(p.href)}">${esc(p.name)}</a>: ${esc(p.desc)}</p>`).join('\n')}</section>
<section><h2>Preguntas frecuentes</h2>
${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('\n')}</section>
</main>
<footer><p>Código: <a href="${esc(LINKS.githubDevs)}">github.com/AXM-DEVs</a> y <a href="${esc(LINKS.githubD)}">github.com/AXM-D</a></p></footer>
</div>`
}

function llmsTxt() {
  return `# AXM

> AXM es un estudio independiente de ingeniería de datos y seguridad defensiva. Construye pipelines de datos, vigilancia de marca y dominios con fuentes públicas, y backends y APIs en Rust y Python. Es el autor de TaQ, un motor de inteligencia contextual que sigue en desarrollo y no es un servicio público.

## Servicios y precios (precio fijo, por escrito)

${SERVICES.map((s) => `- ${s.title}: ${money(s.price)}, ${s.time}. ${s.scope}`).join('\n')}
- ${MONTHLY.title}: ${money(MONTHLY.price)} al mes. ${MONTHLY.desc}

${FREE_CALL.label}. Precios en USD y MXN; el precio publicado es el precio final.

## Proyectos (código público)

- [TaQ](${LINKS.taq}): motor modular de inteligencia contextual defensiva en Rust, en desarrollo.
${PROJECTS.map((p) => `- [${p.name}](${p.href}): ${p.desc}`).join('\n')}

## Contacto

- Email: ${CONTACT_EMAIL}
- Web: ${SITE_URL}
- GitHub: ${LINKS.githubDevs} y ${LINKS.githubD}
`
}

function seo() {
  return {
    name: 'axm-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replaceAll('__SITE_URL__', SITE_URL)
          .replaceAll('__TITLE__', esc(TITLE))
          .replaceAll('__DESCRIPTION__', esc(DESCRIPTION))
          .replace('<!--JSON-LD-->', `<script type="application/ld+json">${jsonLd()}</script>`)
          .replace('<div id="root"></div>', `<div id="root">${staticContent()}</div>`)
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
      })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
    },
  }
}

/* Precarga la fuente de los títulos (subconjunto latino) para que el primer pintado no espere al CSS. */
function preloadDisplayFont() {
  return {
    name: 'preload-display-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const font = Object.keys(ctx.bundle ?? {}).find((f) => /archivo-latin-wdth-normal.*\.woff2$/.test(f))
        if (!font) return []
        return [
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${BASE}${font}`, crossorigin: '' },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), seo(), preloadDisplayFont()],
})
