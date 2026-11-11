import { useLayoutEffect, useRef, useState } from 'react'
import { ARCHITECTURE, LINKS, STACK, STAGES, STATUS } from '../data'
import { ArrowRight, ArrowUpRight } from './icons'

/**
 * Pestañas con indicador por clip-path: una segunda copia de la lista, con el
 * estilo activo, se recorta a la pestaña seleccionada. Texto y fondo cambian a
 * la vez, sin desfase.
 */
function StageTabs({ active, onChange }) {
  const scrollerRef = useRef(null)
  const listRef = useRef(null)
  const [clip, setClip] = useState('inset(0 100% 0 0 round 6px)')

  useLayoutEffect(() => {
    const list = listRef.current
    const scroller = scrollerRef.current
    if (!list || !scroller) return
    const update = () => {
      const btn = list.querySelector(`[data-id="${active}"]`)
      if (!btn) return
      const { offsetLeft, offsetWidth } = btn
      setClip(`inset(0 ${list.offsetWidth - offsetLeft - offsetWidth}px 0 ${offsetLeft}px round 6px)`)
      // En móvil la lista se desplaza: se centra la pestaña activa sin mover la página.
      if (scroller.scrollWidth > scroller.clientWidth) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        scroller.scrollTo({ left: offsetLeft - (scroller.clientWidth - offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(list)
    return () => ro.disconnect()
  }, [active])

  function onKeyDown(e) {
    const i = STAGES.findIndex((s) => s.id === active)
    const last = STAGES.length - 1
    const to = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (to === undefined) return
    e.preventDefault()
    const next = STAGES[to].id
    onChange(next)
    listRef.current?.querySelector(`[data-id="${next}"]`)?.focus({ preventScroll: true })
  }

  return (
    <div ref={scrollerRef} className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div className="w-max rounded-[10px] border border-line bg-surface p-1">
        <div ref={listRef} role="tablist" aria-label="Etapas del motor TaQ" className="relative flex" onKeyDown={onKeyDown}>
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              data-id={s.id}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active === s.id}
              aria-controls="panel-etapa"
              tabIndex={active === s.id ? 0 : -1}
              onClick={() => onChange(s.id)}
              className="nav-link flex h-11 cursor-pointer items-center gap-2 rounded-md px-4 text-[15px] font-medium text-muted transition-colors duration-200"
            >
              <span className="text-[13px] tabular-nums text-dim">{i + 1}</span>
              {s.label}
            </button>
          ))}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex bg-fg" style={{ clipPath: clip, transition: 'clip-path 260ms var(--ease-out)' }}>
            {STAGES.map((s, i) => (
              <span key={s.id} className="flex h-11 items-center gap-2 px-4 text-[15px] font-medium text-on-fg">
                <span className="text-[13px] tabular-nums opacity-60">{i + 1}</span>
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
  return (
    <ol className="relative grid gap-y-5 sm:grid-cols-5 sm:gap-x-4">
      <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-line-strong sm:bottom-auto sm:left-0 sm:right-0 sm:top-[5px] sm:h-px sm:w-auto" />
      {ARCHITECTURE.map((n) => (
        <li key={n.k} className="relative flex items-baseline gap-4 sm:block">
          <span aria-hidden="true" className="relative z-10 block size-[11px] shrink-0 translate-y-px rounded-full border-2 border-fg bg-bg sm:translate-y-0" />
          <div className="sm:mt-4">
            <p className="text-sm text-muted">{n.k}</p>
            <p className="mt-0.5 font-mono text-[13px] text-fg">{n.v}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function StatusList({ title, tone, items }) {
  return (
    <div>
      <h3 className={`flex items-center gap-2.5 text-[15px] font-medium ${tone}`}>
        <span className="dot" />
        <span className="text-fg">{title}</span>
      </h3>
      <ul className="mt-4 border-t border-line">
        {items.map((t) => (
          <li key={t} className="border-b border-line py-3 text-[15px] text-muted">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Engine() {
  const [active, setActive] = useState(STAGES[0].id)
  const index = STAGES.findIndex((s) => s.id === active)
  const stage = STAGES[index]
  const next = STAGES[(index + 1) % STAGES.length]

  return (
    <section id="taq" className="band-dark section">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-2.5 text-sm text-wait">
              <span className="dot" />
              En desarrollo. Todavía no es un servicio público.
            </p>
            <h2 className="display mt-5 text-[2rem] sm:text-5xl">TaQ, el motor que estoy construyendo</h2>
          </div>
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted md:justify-self-end">
            Un motor modular de inteligencia contextual defensiva, escrito en Rust. Lleva señales públicas hasta hallazgos que una persona revisa, en cinco etapas.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <StageTabs active={active} onChange={setActive} />

          <div id="panel-etapa" role="tabpanel" aria-labelledby={`tab-${stage.id}`} tabIndex={0} className="mt-4 rounded-xl border border-line bg-surface p-6 sm:p-9">
            <div key={stage.id} className="swap-in grid gap-8 md:grid-cols-[1.5fr_1fr] md:gap-12">
              <div>
                <h3 className="display-sm text-2xl sm:text-[1.75rem]">{stage.title}</h3>
                <p className="mt-4 max-w-[36rem] leading-relaxed text-muted md:min-h-[7.5rem]">{stage.body}</p>
              </div>
              <div>
                <p className="text-sm text-muted">En el código</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {stage.code.map((c) => (
                    <li key={c} className="code !bg-bg">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
              <p className="whitespace-nowrap text-sm tabular-nums text-dim">
                <span className="max-sm:sr-only">Etapa </span>
                {index + 1} de {STAGES.length}
              </p>
              <button type="button" onClick={() => setActive(next.id)} className="btn btn-ghost btn-sm">
                {index === STAGES.length - 1 ? 'Volver a empezar' : `Siguiente: ${next.label}`}
                <ArrowRight className="btn-arrow size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <h3 className="display-sm text-xl">Por dónde pasa cada evento</h3>
          <div className="mt-8">
            <Architecture />
          </div>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-10 md:mt-24 md:grid-cols-2">
          <StatusList title="Ya está en el código" tone="text-ok" items={STATUS.today} />
          <StatusList title="Falta antes de abrirlo" tone="text-wait" items={STATUS.next} />
        </div>

        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="leading-relaxed text-muted">
              TaQ se construye con la intención de ofrecerse gratis. Antes de abrirlo tiene que estar medido y validado, y eso todavía no ha pasado.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-dim">Hecho con {STACK.join(', ')}.</p>
          </div>
          <a href={LINKS.taq} target="_blank" rel="noreferrer" className="btn btn-ghost shrink-0 self-start md:self-auto">
            Ver el código de TaQ
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}
