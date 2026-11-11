import { PROJECTS } from '../data'
import { ArrowUpRight } from './icons'

export default function Projects() {
  return (
    <section id="proyectos" className="band-dark section !pt-0">
      <div className="wrap">
        <div className="grid gap-6 border-t border-line pt-16 md:grid-cols-[1fr_1fr] md:items-end md:gap-16 md:pt-24">
          <h2 className="display text-[2rem] sm:text-5xl">Otros proyectos propios</h2>
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted md:justify-self-end">
            Herramientas de seguridad, datos y arquitectura. Todas nacen de un problema real y están publicadas en GitHub.
          </p>
        </div>

        <ul className="mt-12 border-t border-line-strong md:mt-16">
          {PROJECTS.map((p) => (
            <li key={p.name} className="border-b border-line">
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="row-link -mx-5 grid gap-x-10 gap-y-3 px-5 py-7 transition-colors duration-200 sm:-mx-4 sm:rounded-lg sm:px-4 md:grid-cols-[0.9fr_1.6fr_auto] md:items-baseline md:py-9"
              >
                <div>
                  <h3 className="display-sm text-2xl">{p.name}</h3>
                  <p className="mt-1.5 text-sm text-dim">
                    {p.kind}, {p.status}
                  </p>
                </div>
                <div>
                  <p className="max-w-[36rem] leading-relaxed text-muted">{p.desc}</p>
                  <p className="mt-3 font-mono text-[13px] text-dim">{p.stack}</p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-fg md:justify-self-end">
                  Ver en GitHub
                  <ArrowUpRight className="row-arrow size-4 text-muted" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
