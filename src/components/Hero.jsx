import { useEffect, useState } from 'react'
import CopyEmail from './CopyEmail'

/* Secuencia ilustrativa del recorrido de una señal por TaQ (no son datos reales). */
const SCRIPT = [
  { stage: 'ingest', src: 'rss', text: 'evento normalizado · id 3f9a…c21' },
  { stage: 'dedup', src: 'rss', text: 'único en ventana · publicado en events.raw' },
  { stage: 'ingest', src: 'bluesky', text: 'post · did:plc:…7kq · cursor guardado' },
  { stage: 'context', src: 'tenant/acme', text: 'coincide con dominio vigilado' },
  { stage: 'rule', src: 'r-012 v3', text: 'patrón “suplantación de marca” · explicable' },
  { stage: 'finding', src: 'h-0481', text: 'hallazgo creado · pendiente de revisión' },
  { stage: 'review', src: 'analista', text: 'aprobado → outbox (sin efectos externos)' },
  { stage: 'ingest', src: 'wikimedia', text: 'cambio reciente · Last-Event-ID reanudable' },
  { stage: 'dedup', src: 'wikimedia', text: 'duplicado descartado' },
  { stage: 'feedback', src: 'h-0481', text: 'muestra inmutable añadida al dataset' },
]

const STAGE_TONE = {
  ingest: 'text-mute',
  dedup: 'text-dim',
  context: 'text-paper',
  rule: 'text-amber',
  finding: 'text-signal',
  review: 'text-signal',
  feedback: 'text-mute',
}

const VISIBLE = 7

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

function SignalLog() {
  const reduced = useReducedMotion()
  const [tick, setTick] = useState(VISIBLE)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setTick((t) => t + 1), 1500)
    return () => clearInterval(id)
  }, [reduced])

  const lines = Array.from({ length: VISIBLE }, (_, i) => {
    const n = tick - VISIBLE + i
    return { n, ...SCRIPT[((n % SCRIPT.length) + SCRIPT.length) % SCRIPT.length] }
  })

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-line-2" />
          <span className="size-2.5 rounded-full bg-line-2" />
          <span className="size-2.5 rounded-full bg-line-2" />
        </div>
        <span className="font-mono text-[11px] text-dim">taq-ingestd → taq-api</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-signal">
          <span className="pulse-dot size-1.5 rounded-full bg-signal" />
          simulación
        </span>
      </div>
      <ol className="space-y-0.5 px-2 py-3 font-mono text-[12px] leading-relaxed sm:text-[12.5px]" aria-label="Simulación ilustrativa de eventos">
        {lines.map((l, i) => (
          <li
            key={l.n}
            className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-md px-2 py-1 sm:grid-cols-[5rem_6.5rem_1fr]"
            style={{
              opacity: i === 0 ? 0.35 : i === VISIBLE - 1 ? 1 : 0.55 + i * 0.06,
              animation: !reduced && i === VISIBLE - 1 ? 'log-in 350ms var(--ease-out) both' : undefined,
              background: i === VISIBLE - 1 ? 'rgb(255 255 255 / 0.03)' : undefined,
            }}
          >
            <span className={STAGE_TONE[l.stage]}>{l.stage}</span>
            <span className="hidden truncate text-dim sm:block">{l.src}</span>
            <span className="truncate text-paper/85">{l.text}</span>
          </li>
        ))}
      </ol>
      <style>{`@keyframes log-in { from { opacity: 0; transform: translateY(6px); filter: blur(3px); } }`}</style>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgb(104 184 151 / 0.18), transparent)' }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="hero-in flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-mute" style={{ '--d': '0ms' }}>
            <span className="pulse-dot size-1.5 rounded-full bg-signal" />
            Estudio independiente · Abierto a proyectos
          </p>
          <h1
            className="hero-in mt-6 text-[2.6rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]"
            style={{ '--d': '80ms' }}
          >
            Construyo motores que dan <span className="font-serif text-[1.08em] italic tracking-normal text-signal">contexto</span> a cada señal.
          </h1>
          <p className="hero-in mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg" style={{ '--d': '160ms' }}>
            Soy AXM: desarrollador y microempresa. Diseño sistemas de datos, inteligencia defensiva y backends en Rust y Python. Mi trabajo principal es <span className="text-paper">TaQ</span>, un motor de inteligencia contextual.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ '--d': '240ms' }}>
            <a href="#motor" className="btn btn-primary">
              Conoce el motor TaQ
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 3v10M3.5 8.5L8 13l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <CopyEmail label="Copiar email" />
          </div>
        </div>

        <div className="hero-in" style={{ '--d': '320ms' }}>
          <SignalLog />
          <p className="mt-3 text-center text-xs text-dim">Recorrido ilustrativo de una señal por TaQ. No son datos reales.</p>
        </div>
      </div>
      <style>{`
        .hero-in { animation: hero-in 700ms var(--ease-out) both; animation-delay: var(--d); }
        @keyframes hero-in { from { opacity: 0; transform: translateY(14px); filter: blur(6px); } }
        @media (prefers-reduced-motion: reduce) {
          .hero-in { animation: fade 300ms ease both; }
          @keyframes fade { from { opacity: 0; } }
        }
      `}</style>
    </section>
  )
}
