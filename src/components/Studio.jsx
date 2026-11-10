import Reveal from './Reveal'
import { PRINCIPLES, SERVICES } from '../data'

export default function Studio() {
  return (
    <section id="estudio" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">Estudio · AXM</p>
              <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                Una microempresa <span className="font-serif italic tracking-normal text-mute">con criterio técnico.</span>
              </h2>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mute">
                AXM es mi estudio. Trabajo directamente con cada cliente, sin intermediarios: tú hablas con quien diseña y escribe el código. Uso la misma forma de construir que aplico en TaQ.
              </p>
            </Reveal>
          </div>

          <div>
            <ul className="divide-y divide-line border-y border-line">
              {SERVICES.map((s, i) => (
                <Reveal as="li" key={s.title} index={i} className="grid gap-2 py-7 sm:grid-cols-[2.5rem_1fr]">
                  <span className="font-mono text-xs text-dim sm:pt-1.5">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.015em]">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-mute">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal className="mt-16">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-dim">Cómo trabajo</p>
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.k} index={i} className="rounded-2xl border border-line bg-ink-2 p-6">
                  <span className="font-mono text-[11px] text-signal">{p.k}</span>
                  <h4 className="mt-3 font-medium">{p.t}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
