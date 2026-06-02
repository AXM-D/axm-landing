import useScrollReveal from '../hooks/useScrollReveal'

const specs = [
  { category: 'Core', items: [
    { label: 'Language', value: 'Python 3.12+' },
    { label: 'Framework', value: 'FastAPI + Uvicorn (async)' },
    { label: 'ORM', value: 'SQLAlchemy 2.0 (async)' },
    { label: 'Validation', value: 'Pydantic v2' },
    { label: 'Configuration', value: 'YAML + environment variables' },
  ]},
  { category: 'API', items: [
    { label: 'Protocol', value: 'REST (HTTP/1.1)' },
    { label: 'Documentation', value: 'Swagger /docs, Redoc /redoc' },
    { label: 'Endpoints', value: '15+ (investigations, playbooks, scoring, query, connectors)' },
    { label: 'Serialization', value: 'JSON (Pydantic models)' },
  ]},
  { category: 'Storage', items: [
    { label: 'Development', value: 'SQLite (aiosqlite)' },
    { label: 'Production', value: 'PostgreSQL (asyncpg)' },
    { label: 'Pattern', value: 'Repository pattern' },
    { label: 'Tables', value: 'Investigations, entities, scores, playbooks' },
  ]},
  { category: 'LLM', items: [
    { label: 'Local', value: 'Ollama (any model)' },
    { label: 'Cloud', value: 'OpenAI API' },
    { label: 'Use', value: 'Natural language parsing, insight generation' },
    { label: 'Timeout', value: '60 seconds (configurable)' },
  ]},
  { category: 'Playbooks', items: [
    { label: 'Format', value: 'YAML' },
    { label: 'Step types', value: 'connector_call, transform, condition, notify, scoring.compute' },
    { label: 'Branching', value: 'Conditional (if/else)' },
    { label: 'Retry', value: 'Configurable per step' },
  ]},
  { category: 'Scoring', items: [
    { label: 'Score types', value: 'Threat, Confidence, Priority' },
    { label: 'Factors', value: 'Freshness, Source reliability, Correlation, Reputation' },
    { label: 'Range', value: '0.0 – 1.0' },
    { label: 'Weights', value: 'Configurable per score type' },
  ]},
]

export default function TechSpecs() {
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Technical Specifications</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Python async stack. FastAPI, SQLAlchemy, and minimal dependencies.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <SpecCard key={s.category} spec={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SpecCard({ spec: s, index }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`bg-white border border-slate-200 rounded-xl p-6 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{s.category}</h3>
      <dl className="mt-4 space-y-3">
        {s.items.map((item) => (
          <div key={item.label} className="flex justify-between items-baseline gap-4">
            <dt className="text-sm text-slate-400 shrink-0">{item.label}</dt>
            <dd className="text-sm text-slate-700 text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
