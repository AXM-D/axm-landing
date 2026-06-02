import useScrollReveal from '../hooks/useScrollReveal'

const cases = [
  {
    title: 'Threat intelligence analyst',
    desc: 'An analyst receives a suspicious email. They submit it to DySH, which runs a playbook: checks breach databases, extracts the username, enumerates social media profiles, analyzes the domain, and computes a threat score — all in seconds.',
    tags: ['email', 'breach', 'domain', 'scoring'],
  },
  {
    title: 'SOC team',
    desc: 'A SOC handles hundreds of alerts daily. DySH automates the initial triage: each alert feeds into a scoring playbook that correlates freshness, source reputation, and historical data to produce a priority score before a human ever looks at it.',
    tags: ['triage', 'automation', 'correlation'],
  },
  {
    title: 'OSINT researcher',
    desc: 'A researcher investigating a threat actor collects data from multiple sources. Using DySH\'s natural language query engine, they ask questions like "find all domains registered by this email" and get results without writing SQL.',
    tags: ['research', 'query', 'nlp'],
  },
  {
    title: 'Platform integrator',
    desc: 'A team building an OSINT platform embeds DySH as its intelligence engine. They implement a custom connector for their data source, register it with the connector registry, and call it from playbooks alongside built-in steps.',
    tags: ['integration', 'plugin', 'api'],
  },
]

export default function UseCases() {
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Use Cases</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            DySH adapts to different workflows — from individual researchers to enterprise SOC teams.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={c.title} case={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseCard({ case: c, index }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`bg-white border border-slate-200 rounded-xl p-7 transition-all duration-500 hover:shadow-sm ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
      <p className="mt-3 text-sm text-slate-500 leading-relaxed">{c.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-md">{t}</span>
        ))}
      </div>
    </div>
  )
}
