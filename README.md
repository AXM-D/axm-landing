# AXM: estudio de ingeniería de datos y seguridad defensiva

Landing de AXM. Sirve de destino para los vídeos de Instagram y TikTok: dice qué hace AXM, enseña cómo trabaja con una demostración del motor **TaQ** ([AXM-DEVs/TaQ](https://github.com/AXM-DEVs/TaQ)) y lleva al contacto.

Publicada en <https://axm-d.github.io/axm-landing/>.

## Desarrollo

```bash
npm ci
npm run dev      # servidor local
npm run lint
npm run build    # build de producción en dist/
npm run preview  # sirve dist/ en /axm-landing/
npm run deploy   # publica dist/ en GitHub Pages (base: /axm-landing/)
```

## Estructura

- `src/data.js`: todo el contenido editable (servicios, proceso, etapas de TaQ, proyectos, preguntas, señales de la demostración, email).
- `src/index.css`: tokens de color, tipografía y movimiento.
- `src/components/`
  - `Navbar`, `MobileCta` (barra de contacto fija en móvil), `Footer`, `Logo` (logotipo en vector).
  - `Hero` + `SignalTrace`: la demostración interactiva. Una señal ficticia recorre las etapas de TaQ y se detiene hasta que quien mira aprueba o descarta.
  - `Services` (cada servicio preselecciona su tema en el contacto), `Process`, `Engine` (TaQ), `Projects`, `Faq`, `Contact`.
  - `Toast`, `CopyEmail`, `icons`.
- `public/`: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`, `og.png` (1200×630) y `brand/axm-wordmark.svg`.
- `brand-src/axm-logo-original.jpeg`: el logotipo original. No se publica; el vector de `Logo.jsx` se trazó midiendo sus proporciones.

Orden de la página: hero, servicios, proceso, TaQ, proyectos, preguntas, contacto.

## Reglas de contenido

Vienen del `PRODUCT.md` de TaQ y son obligatorias:

- TaQ está en desarrollo y no es un servicio público. Se dice así en la página.
- Nada de testimonios, logos de clientes, métricas, benchmarks, precios ni años de experiencia inventados. La prueba son los repositorios públicos.
- La demostración del hero usa datos ficticios (dominios `.example`) y lo indica.
- Uso defensivo de información pública.
- La acción principal tiene un solo nombre (`CTA_LABEL` en `data.js`) en la barra, el hero y la barra móvil.

## Reglas de diseño

- **Dos bandas.** Oscura para la máquina (hero, TaQ, proyectos, contacto) y clara para la parte humana (servicios, proceso, preguntas). Cada banda redefine los mismos tokens (`.band-dark`, `.band-light`), así que los componentes no saben en cuál están.
- **Blanco y negro del logotipo.** No hay color de marca decorativo.
- **El color es estado.** Verde (`--ok`) solo para aprobado, disponible o hecho. Ámbar (`--wait`) solo para pendiente o en desarrollo.
- **Tipografía.** Archivo variable: expandida (`font-stretch` 112–118 %) en títulos, que repite el gesto ancho del logotipo, y normal en texto. Geist Mono solo para datos reales: nombres de crates, ids y la señal de la demostración. Las dos se sirven desde el propio sitio (`@fontsource-variable`), sin peticiones a terceros.
- **Sin plantilla.** No hay etiquetas en mayúsculas sobre los títulos, ni palabras sueltas en cursiva, ni rejillas de tarjetas iguales. Solo se numera lo que es una secuencia: el proceso y las etapas de TaQ.
- **Radios por función.** 4 px en datos, 8 px en botones, 12 px en marcos.
- **Contraste.** Todo el texto cumple WCAG AA en las dos bandas (el más bajo, `--dim`, queda en 4,65:1) y los bordes de los controles superan 3:1.
- **Móvil primero.** Objetivos táctiles de 44 px o más, barra de contacto fija con `safe-area-inset-bottom`, sin scroll horizontal desde 320 px.

## Reglas de movimiento

Siguen los principios de Emil Kowalski:

- Curvas propias: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para lo que entra o responde, `--ease-in-out` para lo que se desplaza en pantalla, `--ease-drawer` para el toast y la barra móvil. Nunca `ease-in`.
- La UI responde en menos de 300 ms y las salidas son más rápidas que las entradas.
- Botones y chips con `scale(0.97)` al presionar.
- Nada nace desde `scale(0)`: el menú móvil parte de 0,96 con origen en su botón y los iconos de 0,5 con blur.
- Pestañas de TaQ con indicador por `clip-path`, para que texto y fondo cambien a la vez.
- Toast al estilo Sonner, con transiciones CSS que se pueden interrumpir.
- Hover solo en `(hover: hover) and (pointer: fine)`.
- Solo se animan `transform`, `opacity`, `filter` y `clip-path`, y los colores de elementos pequeños.
- Un único momento orquestado al cargar (la entrada del hero) y uno al hacer scroll (la línea del proceso). El resto del contenido no se anima al entrar.
- No hay bucles automáticos: la demostración avanza tres etapas y espera a la persona.
- `prefers-reduced-motion`: se mantiene la opacidad y se elimina el desplazamiento; la demostración aparece ya en el punto de decisión.

## Accesibilidad

Enlace para saltar al contenido, foco visible en las dos bandas, pestañas con flechas, Inicio y Fin, menú móvil que se cierra con Escape y devuelve el foco, preguntas con `<details>` nativo, y avisos por `role="status"` para el toast y el resultado de la demostración.
