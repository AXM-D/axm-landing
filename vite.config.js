import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/axm-landing/${font}`, crossorigin: '' },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

export default defineConfig({
  base: '/axm-landing/',
  plugins: [react(), tailwindcss(), preloadDisplayFont()],
})
