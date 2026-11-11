import { FREE_CALL, MONTHLY, SERVICES, formatMoney } from '../data'
import { ArrowRight, ArrowUpRight } from './icons'
import CurrencyToggle from './CurrencyToggle'
import { useCurrency } from './currency-context'

export default function Services({ onPick }) {
  const { currency } = useCurrency()

  return (
    <section id="servicios" className="band-light section">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
          <h2 className="display text-[2rem] sm:text-5xl">Qué puedes encargarme, y cuánto cuesta</h2>
          <div className="md:justify-self-end">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted">
              Cuatro paquetes de precio fijo, por escrito. En cada uno hay un proyecto propio, con el código público, donde puedes ver cómo lo hago.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <CurrencyToggle />
              <p className="text-sm text-muted">{FREE_CALL.label}.</p>
            </div>
          </div>
        </div>

        <ul className="mt-12 border-t border-fg md:mt-16">
          {SERVICES.map((s) => (
            <li key={s.id} className="grid gap-x-12 gap-y-6 border-b border-line py-8 md:grid-cols-[1.05fr_1fr] md:py-10">
              <div>
                <h3 className="display-sm text-[1.375rem] sm:text-[1.625rem]">{s.title}</h3>
                <p className="mt-3 max-w-[30rem] leading-relaxed text-muted">{s.desc}</p>
                <p className="mt-4 text-sm text-dim">
                  Lo puedes ver en{' '}
                  <a href={s.proof.href} target="_blank" rel="noreferrer" className="tlink inline-flex items-center gap-1 font-medium text-fg">
                    {s.proof.label}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="display-sm text-[1.75rem] tabular-nums sm:text-[2rem]">{formatMoney(s.price[currency], currency)}</span>
                    <span className="text-sm text-muted">precio fijo · {s.time}</span>
                  </p>
                  <p className="mt-2 max-w-[28rem] text-[15px] leading-relaxed text-muted">{s.scope}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Te llevas</p>
                  <ul className="mt-2.5 space-y-2 text-[15px] text-muted">
                    {s.gets.map((g) => (
                      <li key={g} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
                        {g}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-[28rem] text-sm leading-relaxed text-dim">Fuera del paquete, se cotiza aparte: {s.out}</p>
                </div>
                <a href="#contacto" onClick={() => onPick(s.id)} className="btn btn-ghost btn-sm self-start">
                  Pedir este trabajo
                  <ArrowRight className="btn-arrow size-3.5" />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-x-12 gap-y-3 rounded-xl border border-line bg-surface p-6 md:grid-cols-[1.05fr_1fr] md:items-baseline md:p-8">
          <div>
            <h3 className="display-sm text-[1.25rem]">{MONTHLY.title}</h3>
            <p className="mt-2 text-sm text-muted">Opcional, después de entregar.</p>
          </div>
          <div>
            <p className="display-sm text-[1.5rem] tabular-nums">
              {formatMoney(MONTHLY.price[currency], currency)}
              <span className="ml-2 text-sm font-normal text-muted">al mes</span>
            </p>
            <p className="mt-2 max-w-[28rem] text-[15px] leading-relaxed text-muted">{MONTHLY.desc}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
