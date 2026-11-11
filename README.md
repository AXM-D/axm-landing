# AXM — Portafolio y estudio

Landing de AXM: portafolio personal y microempresa. El protagonista es **TaQ**, el motor de inteligencia contextual defensiva escrito en Rust ([AXM-DEVs/TaQ](https://github.com/AXM-DEVs/TaQ)), junto con Retro, Project Analyzer y la generación anterior TaQ Engine 1.x.

## Desarrollo

```bash
npm ci
npm run dev      # servidor local
npm run build    # build de producción en dist/
npm run deploy   # publica dist/ en GitHub Pages (base: /axm-landing/)
```

## Estructura

- `src/data.js` — todo el contenido editable: proyectos, etapas del motor, servicios, contacto.
- `src/components/` — secciones (Hero, Engine, Projects, Studio, Contact) y piezas reutilizables (Reveal, Toast, CopyEmail).
- `src/index.css` — tokens de color, tipografía y movimiento.

## Movimiento

Las animaciones siguen los principios de diseño de interfaces de Emil Kowalski:

- Curvas propias: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` para entradas y respuestas; `--ease-in-out` solo para lo que se desplaza en pantalla. Nunca `ease-in`.
- Duraciones de UI por debajo de 300 ms; las salidas son más rápidas que las entradas.
- Botones con `scale(0.97)` al presionar; nada aparece desde `scale(0)` (mínimo 0.95, o 0.5 con blur en iconos).
- El menú móvil crece desde su disparador (`transform-origin: top right`).
- Pestañas del motor con indicador por `clip-path`, para que texto y fondo cambien a la vez.
- Revelados con opacidad + desplazamiento corto + `blur(4px)`, escalonados 60 ms.
- Hover solo en `(hover: hover) and (pointer: fine)`.
- Toast estilo Sonner con transiciones CSS interrumpibles.
- `prefers-reduced-motion`: se mantiene la opacidad y se elimina el movimiento.
- Solo se animan `transform`, `opacity`, `filter` y `clip-path`.
