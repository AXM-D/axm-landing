import { CTA_LABEL, FREE_CALL, LINKS, formatMoney, minPrice } from '../data'
import { useCurrency } from './currency-context'
import SignalTrace from './SignalTrace'
import { ArrowRight } from './icons'

export default function Hero() {
  const { currency } = useCurrency()
  return (
    <section id="inicio" className="band-dark overflow-hidden pb-16 pt-24 sm:pt-36 md:pb-24">
      <div className="wrap grid items-start gap-x-16 gap-y-10 lg:grid-cols-[1.22fr_0.78fr] lg:grid-rows-[auto_1fr] lg:gap-y-8">
        <div className="min-w-0 lg:pt-6">
          <p className="enter flex items-center gap-2.5 text-sm text-muted" style={{ '--n': 0 }}>
            <span className="dot dot-live text-ok" />
            Estudio independiente, abierto a proyectos
          </p>
          <h1 className="display enter mt-5 text-[clamp(1.7rem,8.8vw,2.35rem)] sm:text-[3.25rem] lg:text-[2.8rem] xl:text-[3.25rem]" style={{ '--n': 1 }}>
            Ingeniería de datos y seguridad defensiva, sin intermediarios.
          </h1>
          <p className="enter mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted sm:text-lg" style={{ '--n': 2 }}>
            Soy AXM. Construyo pipelines de datos, vigilancia de marca con fuentes públicas y backends en Rust y Python. Hablas directamente con quien diseña y escribe el código.
          </p>
          <div className="enter mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--n': 3 }}>
            <a href="#contacto" className="btn btn-primary">
              {CTA_LABEL}
              <ArrowRight className="btn-arrow size-4" />
            </a>
            <a href="#servicios" className="btn btn-ghost">
              Ver servicios
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            <a href="#servicios" className="tlink font-medium text-fg tabular-nums">
              Desde {formatMoney(minPrice(currency), currency)}
            </a>
            , precio fijo por escrito. {FREE_CALL.label}.
          </p>
        </div>

        <div className="enter min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1" style={{ '--n': 4 }}>
          <SignalTrace />
        </div>
        <p className="enter max-w-md text-sm leading-relaxed text-dim lg:col-start-1 lg:row-start-2" style={{ '--n': 4 }}>
          Autor de TaQ, un motor de inteligencia contextual en Rust.{' '}
          <a href={LINKS.githubDevs} target="_blank" rel="noreferrer" className="tlink text-muted">
            4 proyectos propios con el código en GitHub
          </a>
          .
        </p>
      </div>
    </section>
  )
}
