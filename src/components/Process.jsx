import { PROCESS, PRINCIPLES } from '../data'
import useInView from '../hooks/useInView'

export default function Process() {
  const [ref, inView] = useInView({ once: true, threshold: 0.3 })

  return (
    <section id="proceso" className="band-light section !pt-0">
      <div className="wrap">
        <h2 className="display max-w-2xl text-[2rem] sm:text-5xl">Cómo trabajo contigo</h2>

        <ol ref={ref} data-inview={inView} className="relative mt-12 grid gap-y-8 md:mt-16 md:grid-cols-4 md:gap-x-8">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.125rem] hidden h-px bg-line md:block">
            <span className="draw-line absolute inset-0 bg-fg" />
          </span>
          <span aria-hidden="true" className="absolute bottom-6 left-[1.125rem] top-2 w-px bg-line md:hidden" />
          {PROCESS.map((p, i) => (
            <li key={p.t} className="draw-step relative flex gap-4 md:block" style={{ '--n': i }}>
              <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-fg text-sm font-semibold tabular-nums text-on-fg ring-8 ring-bg">{i + 1}</span>
              <div className="md:mt-6">
                <h3 className="display-sm text-lg">{p.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted md:max-w-[16rem]">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-x-12 gap-y-8 border-t border-line pt-10 md:mt-24 md:grid-cols-[0.8fr_2fr]">
          <h3 className="display-sm text-xl">Cuatro reglas que no negocio</h3>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.t}>
                <dt className="font-medium">{p.t}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
