import { useLayoutEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { LINKS, STACK, STAGES, STATUS } from '../data'

/**
 * Pestañas con indicador por clip-path: se dibuja una segunda copia de la lista
 * con el estilo activo y se recorta a la posición de la pestaña seleccionada.
 * El color del texto cambia exactamente al ritmo del fondo, sin desfase.
 */
function StageTabs({ active, onChange }) {
  const listRef = useRef(null)
  const [clip, setClip] = useState('inset(0 100% 0 0 round 999px)')

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      const btn = list.querySelector(`[data-id="${active}"]`)
      if (!btn) return
      const { offsetLeft, offsetWidth } = btn
      const right = list.scrollWidth - offsetLeft - offsetWidth
      setClip(`inset(0 ${right}px 0 ${offsetLeft}px round 999px)`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(list)
    return () => ro.disconnect()
  }, [active])

  function onKeyDown(e) {
    const i = STAGES.findIndex((s) => s.id === active)
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = STAGES[(i + delta + STAGES.length) % STAGES.length].id
    onChange(next)
    listRef.current?.querySelector(`[data-id="${next}"]`)?.focus()
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      <div className="relative w-max rounded-full border border-line bg-ink-2 p-1">
        <div ref={listRef} role="tablist" aria-label="Etapas del motor" className="relative flex" onKeyDown={onKeyDown}>
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              data-id={s.id}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active === s.id}
              aria-controls={`panel-${s.id}`}
              tabIndex={active === s.id ? 0 : -1}
              onClick={() => onChange(s.id)}
              className="link-hover flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-mute transition-colors duration-200"
            >
              <span className="font-mono text-[11px] text-dim">0{i + 1}</span>
              {s.label}
            </button>
          ))}
          {/* Copia activa recortada */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex rounded-full bg-paper"
            style={{ clipPath: clip, transition: 'clip-path 260ms var(--ease-out)' }}
          >
            {STAGES.map((s, i) => (
              <span key={s.id} className="flex h-9 items-center gap-2 px-4 text-sm font-medium text-ink">
                <span className="font-mono text-[11px] text-ink/50">0{i + 1}</span>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Architecture() {
  const nodes = [
    { k: 'Fuentes', v: 'Wikimedia · Bluesky · RSS' },
    { k: 'Ingesta', v: 'taq-ingestd' },
    { k: 'Transporte', v: 'Redpanda' },
    { k: 'Estado', v: 'PostgreSQL · ClickHouse' },
    { k: 'Producto', v: 'taq-api · taqctl' },
  ]
  return (
    <div className="relative grid gap-3 sm:grid-cols-5 sm:gap-0">
      {/* Línea con paquetes que viajan (solo escritorio) */}
      <div aria-hidden="true" className="flow-line pointer-events-none absolute inset-x-[10%] top-[1.375rem] hidden h-px overflow-hidden sm:block">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="flow-packet absolute top-0 h-px w-[16%] bg-gradient-to-r from-transparent via-signal to-transparent"
            style={{ '--i': i * 3, '--travel': '700%' }}
          />
        ))}
      </div>
      {nodes.map((n, i) => (
        <Reveal key={n.k} index={i} className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
          <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-line-2 bg-ink-2 font-mono text-xs text-mute">
            0{i + 1}
          </span>
          <div className="sm:mt-3">
            <div className="text-xs uppercase tracking-[0.12em] text-dim">{n.k}</div>
            <div className="mt-1 font-mono text-[13px] text-paper">{n.v}</div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default function Engine() {
  const [active, setActive] = useState(STAGES[0].id)
  const stage = STAGES.find((s) => s.id === active)

  return (
    <section id="motor" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">El motor · TaQ</p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Del dato a la decisión, <span className="font-serif italic tracking-normal text-mute">sin perder el porqué.</span>
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="max-w-md text-base leading-relaxed text-mute md:ml-auto">
              TaQ es un motor modular de inteligencia contextual defensiva, escrito en Rust. Recorre cinco etapas: ingerir, contextualizar, inferir, coordinar y aprender.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14" index={2}>
          <StageTabs active={active} onChange={setActive} />

          <div
            id={`panel-${stage.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${stage.id}`}
            className="mt-6 grid gap-6 rounded-3xl border border-line bg-ink-2 p-6 sm:p-10 md:grid-cols-[1.4fr_1fr]"
          >
            <div key={stage.id} className="stage-in">
              <p className="text-xs uppercase tracking-[0.12em] text-dim">{stage.kind}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] sm:text-3xl">{stage.title}</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-mute">{stage.body}</p>
            </div>
            <div key={`${stage.id}-code`} className="stage-in self-end md:justify-self-end" style={{ animationDelay: '50ms' }}>
              <p className="text-xs uppercase tracking-[0.12em] text-dim">En el código</p>
              <ul className="mt-3 flex flex-wrap gap-2 md:justify-end">
                {stage.code.map((c) => (
                  <li key={c} className="rounded-md border border-line-2 bg-ink px-2.5 py-1 font-mono text-[12px] text-paper/85">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <style>{`
            .stage-in { animation: stage-in 320ms var(--ease-out) both; }
            @keyframes stage-in { from { opacity: 0; transform: translateY(6px); filter: blur(3px); } }
            @media (prefers-reduced-motion: reduce) { .stage-in { animation: none; } }
          `}</style>
        </Reveal>

        <div className="mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Arquitectura</p>
          </Reveal>
          <div className="mt-8">
            <Architecture />
          </div>
        </div>

        <div className="mt-24 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-ink-2 p-7 sm:p-8">
            <h3 className="flex items-center gap-2.5 text-lg font-medium">
              <span className="grid size-6 place-items-center rounded-full bg-signal/15 text-signal">
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              En el código hoy
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] text-mute">
              {STATUS.today.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-line-2" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} className="rounded-3xl border border-line p-7 sm:p-8">
            <h3 className="flex items-center gap-2.5 text-lg font-medium">
              <span className="grid size-6 place-items-center rounded-full bg-amber/15 text-amber">
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 11l6-6M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Próximos frentes
            </h3>
            <ul className="mt-5 space-y-3 text-[15px] text-mute">
              {STATUS.next.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-line-2" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-6 flex flex-col gap-6 rounded-3xl border border-line p-7 sm:p-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-mute">
            <span className="text-paper">Estado honesto:</span> TaQ está en desarrollo activo y todavía no es un servicio público. Se construye con la intención de ofrecerse gratis; primero, evidencia.
          </p>
          <a href={LINKS.taq} target="_blank" rel="noreferrer" className="btn btn-ghost shrink-0">
            Ver el código
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 11l6-6M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>

        <Reveal className="marquee mt-16 overflow-hidden">
          <div className="marquee-track flex w-max gap-10 font-mono text-sm text-dim">
            {[...STACK, ...STACK].map((s, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap">
                {s}
                <span className="size-1 rounded-full bg-line-2" />
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
