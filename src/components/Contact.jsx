import CopyEmail from './CopyEmail'
import { Mail } from './icons'
import { CONTACT_EMAIL, LINKS, TOPICS } from '../data'

function mailto(topic) {
  const t = TOPICS.find((x) => x.id === topic)
  const subject = t && t.id !== 'otro' ? `Proyecto: ${t.label}` : 'Proyecto para AXM'
  const body = ['Hola AXM:', '', t && t.id !== 'otro' ? `Me interesa: ${t.label}.` : 'Me interesa:', '', 'Qué necesito:', '', 'Qué tengo ya:', '', 'Para cuándo:', ''].join('\n')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function Contact({ topic, onTopic }) {
  return (
    <section id="contacto" className="band-dark section">
      <div className="wrap">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <h2 className="display text-[2.35rem] sm:text-6xl">Cuéntame tu proyecto</h2>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
              Elige el tema y se abre un email ya preparado. Lo leo yo y te respondo yo.
            </p>
          </div>

          <div>
            <fieldset>
              <legend className="text-sm font-medium">¿Sobre qué quieres hablar?</legend>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {TOPICS.map((t) => {
                  const on = topic === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onTopic(on ? null : t.id)}
                      className={`chip min-h-11 cursor-pointer rounded-lg border px-3.5 text-[15px] transition-[transform,background-color,border-color,color] duration-200 ease-[var(--ease-out)] active:scale-[0.97] ${
                        on ? 'border-fg bg-fg font-medium text-on-fg' : 'border-line-strong text-fg'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={mailto(topic)} className="btn btn-primary">
                <Mail />
                Escribir el email
              </a>
              <CopyEmail />
            </div>
            <p className="mt-4 text-sm text-dim">Si el botón no abre tu correo, copia la dirección y escríbeme desde donde prefieras.</p>
          </div>
        </div>

        <p className="mt-16 border-t border-line pt-6 text-sm text-muted md:mt-24">
          El código está en{' '}
          <a href={LINKS.githubDevs} target="_blank" rel="noreferrer" className="tlink text-fg" translate="no">
            github.com/AXM-DEVs
          </a>{' '}
          y{' '}
          <a href={LINKS.githubD} target="_blank" rel="noreferrer" className="tlink text-fg" translate="no">
            github.com/AXM-D
          </a>
          .
        </p>
      </div>
    </section>
  )
}
