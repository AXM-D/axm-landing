import { FAQ } from '../data'
import { Plus } from './icons'

export default function Faq() {
  return (
    <section id="preguntas" className="band-light section">
      <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <h2 className="display text-[2rem] sm:text-5xl">Preguntas antes de escribirme</h2>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            Las respuestas cortas. Lo demás, por email.
          </p>
        </div>
        <div className="border-t border-fg">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium sm:text-lg">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong">
                  <Plus className="faq-icon size-3.5" />
                </span>
              </summary>
              <p className="faq-body max-w-[38rem] pb-6 pr-10 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
