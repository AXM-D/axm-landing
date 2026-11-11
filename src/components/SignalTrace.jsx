import { useEffect, useState } from 'react'
import { DEMO_SIGNALS, DEMO_STAGES } from '../data'
import useInView from '../hooks/useInView'
import useReducedMotion from '../hooks/useReducedMotion'
import { ArrowRight, Check, Cross } from './icons'

/*
  La pieza central del hero: una señal ficticia recorre las etapas de TaQ y se
  detiene en «Coordinar» hasta que la persona que mira decide. Así funciona el
  motor: la máquina propone y alguien aprueba.

  `step` = número de etapas completadas. En 3 espera la revisión; la decisión
  completa las dos últimas.
*/
const REVIEW = 3

const OUTCOME = {
  approved: {
    review: 'Aprobado por ti. La acción se escribe en el outbox; nada sale solo.',
    learn: 'Tu aprobación se guarda como muestra para proponer mejoras.',
    live: 'Hallazgo aprobado. La acción se escribe en el outbox.',
  },
  discarded: {
    review: 'Descartado por ti. La decisión también queda registrada.',
    learn: 'Tu descarte se guarda como muestra: propone ajustar la regla, no la cambia.',
    live: 'Hallazgo descartado. La decisión queda registrada.',
  },
}

function Mark({ state }) {
  // state: idle | done | waiting | approved | discarded
  const tone = {
    idle: 'border-line-strong bg-surface text-transparent',
    done: 'border-fg bg-fg text-on-fg',
    waiting: 'border-wait bg-surface text-wait',
    approved: 'border-ok bg-ok text-on-fg',
    discarded: 'border-dim bg-surface-2 text-fg',
  }[state]
  return (
    <span className={`trace-mark relative z-10 grid size-6 shrink-0 place-items-center rounded-full border ${tone}`} data-on={state !== 'idle' && state !== 'waiting'}>
      {state === 'waiting' ? <span className="dot dot-live size-1.5" /> : state === 'discarded' ? <Cross className="trace-check size-3" /> : <Check className="trace-check size-3" />}
    </span>
  )
}

export default function SignalTrace() {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView({ once: true, threshold: 0.35 })
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [decision, setDecision] = useState(null)

  const signal = DEMO_SIGNALS[index]
  // Con movimiento reducido no hay recorrido: la señal aparece ya esperando revisión.
  const step = decision ? DEMO_STAGES.length : reduced ? REVIEW : progress

  useEffect(() => {
    if (!inView || reduced || decision || progress >= REVIEW) return
    const id = setTimeout(() => setProgress((s) => s + 1), progress === 0 ? 700 : 850)
    return () => clearTimeout(id)
  }, [inView, reduced, decision, progress])

  function next() {
    setIndex((i) => (i + 1) % DEMO_SIGNALS.length)
    setProgress(0)
    setDecision(null)
  }

  const waiting = step === REVIEW && !decision
  const outcome = decision ? OUTCOME[decision] : null

  function detail(i) {
    if (i < REVIEW) return signal.steps[i]
    if (i === REVIEW) return outcome ? outcome.review : `${signal.steps[3]} Espera tu revisión.`
    return outcome ? outcome.learn : 'Lo que decidas se guarda para mejorar las reglas.'
  }

  function markState(i) {
    if (i === REVIEW) return decision ?? (waiting ? 'waiting' : 'idle')
    return step > i ? 'done' : 'idle'
  }

  return (
    <figure ref={ref} className="overflow-hidden rounded-xl border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 text-[13px] text-muted sm:px-5">
        <span className="font-medium text-fg">Así trabaja TaQ</span>
        <span>Demostración con datos ficticios</span>
      </figcaption>

      <div key={index} className="swap-in border-b border-line px-4 py-4 sm:px-5">
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <span className="rounded-[4px] border border-line-strong px-1.5 py-px font-mono text-[12px] text-fg">{signal.source}</span>
          Señal {index + 1} de {DEMO_SIGNALS.length}
        </p>
        <p className="mt-2 font-mono text-[13.5px] leading-snug text-fg">{signal.text}</p>
      </div>

      <ol className="px-4 pb-2 pt-5 sm:px-5">
        {DEMO_STAGES.map((name, i) => {
          const on = i >= REVIEW ? step >= REVIEW : step > i
          const strong = i > REVIEW ? step > i : on
          const last = i === DEMO_STAGES.length - 1
          return (
            <li key={name} className="relative flex gap-3.5 pb-4">
              {!last && (
                <span aria-hidden="true" className="absolute bottom-0 left-[11.5px] top-6 w-px bg-line">
                  <span className="trace-seg absolute inset-0 bg-fg" data-on={step > i} />
                </span>
              )}
              <Mark state={markState(i)} />
              <div className="min-w-0 flex-1">
                <p className={`text-[15px] font-medium leading-6 transition-colors duration-200 ${strong ? 'text-fg' : 'text-dim'}`}>{name}</p>
                <p className="trace-detail mt-0.5 min-h-[2.5rem] text-[13.5px] leading-5 text-muted" data-on={on} aria-hidden={!on}>
                  {on ? detail(i) : signal.steps[Math.min(i, 3)]}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex min-h-[4.75rem] items-center gap-3 border-t border-line bg-surface-2/60 px-4 py-3.5 sm:px-5">
        {decision ? (
          <div key="after" className="swap-in flex w-full items-center justify-between gap-3">
            <p className={`flex items-center gap-2 text-sm font-medium ${decision === 'approved' ? 'text-ok' : 'text-muted'}`}>
              {decision === 'approved' ? <Check /> : <Cross />}
              {decision === 'approved' ? 'Aprobado' : 'Descartado'}
            </p>
            <button type="button" onClick={next} className="btn btn-ghost btn-sm">
              Siguiente señal
              <ArrowRight className="btn-arrow size-3.5" />
            </button>
          </div>
        ) : (
          <div key="before" className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
            <p className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${waiting ? 'text-wait' : 'text-dim'}`}>
              <span className={`dot ${waiting ? 'dot-live' : ''}`} />
              {waiting ? 'Tú decides' : 'Procesando la señal…'}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDecision('discarded')} disabled={!waiting} className="btn btn-ghost btn-sm disabled:cursor-default disabled:opacity-40">
                Descartar
              </button>
              <button type="button" onClick={() => setDecision('approved')} disabled={!waiting} className="btn btn-primary btn-sm disabled:cursor-default disabled:opacity-40">
                Aprobar
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="sr-only" role="status">
        {outcome ? outcome.live : waiting ? 'El hallazgo espera tu revisión: puedes aprobarlo o descartarlo.' : ''}
      </p>
    </figure>
  )
}
