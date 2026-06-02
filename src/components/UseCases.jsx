import useScrollReveal from '../hooks/useScrollReveal'

const cases = [
  {
    title: 'Threat intelligence analyst',
    desc: 'Receives a suspicious email. Submits it to DySH — playbook checks breach databases, extracts username, enumerates social profiles, analyzes the domain, and returns a threat score. Seconds, not hours.',
    tags: ['email', 'breach', 'domain', 'scoring'],
  },
  {
    title: 'SOC team',
    desc: 'Hundreds of alerts per day. Each feeds into a scoring playbook that correlates freshness, source reputation, and historical data. Priority score is ready before a human looks at the alert.',
    tags: ['triage', 'automation', 'correlation'],
  },
  {
    title: 'OSINT researcher',
    desc: 'Investigating a threat actor. Queries past data in plain language — "find all domains registered by this email" — without writing SQL. The engine translates and returns results.',
    tags: ['research', 'query', 'nlp'],
  },
  {
    title: 'Platform integrator',
    desc: 'Building an OSINT platform. Embeds DySH as the intelligence engine. Writes a custom connector, registers it, and calls it from playbooks alongside built-in steps.',
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
            From individual researchers to SOC teams — same engine, different scale.
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
