import useScrollReveal from '../hooks/useScrollReveal'

const stats = [
  { value: '15+', label: 'API endpoints' },
  { value: '3', label: 'Score types' },
  { value: '4', label: 'Scoring factors' },
  { value: '6', label: 'Playbook step types' },
]

export default function About() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-start transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              About AXM
            </h2>
            <p className="mt-6 text-base text-slate-500 leading-relaxed">
              AXM builds embeddable engines for OSINT platforms — playbook automation, multi-factor scoring, and natural language to SQL/Cypher translation.
            </p>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              Researchers, SOC teams, and enterprises use these engines to automate investigations and query data without writing code.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">GitHub</span>
                <br />
                <a href="https://github.com/AXM-D" className="text-blue-600 hover:underline font-medium">github.com/AXM-D</a>
              </div>
              <div>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Email</span>
                <br />
                <a href="mailto:axm.central@outlook.com" className="text-blue-600 hover:underline font-medium">axm.central@outlook.com</a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{s.value}</div>
                <div className="mt-1 text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
