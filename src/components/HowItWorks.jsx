import useScrollReveal from '../hooks/useScrollReveal'

const steps = [
  {
    title: '1. Define a playbook',
    desc: 'Write a YAML file describing the investigation flow: which connectors to call, how to transform data, what conditions to evaluate, and where to send results.',
    detail: 'Playbooks support up to 6 step types: connector_call, transform, condition, notify, scoring.compute, and sentinel_call (in Sentinel edition).',
  },
  {
    title: '2. Submit a seed',
    desc: 'Send an entity — email, IP, domain, username — to the REST API. The engine creates an investigation and optionally associates it with a playbook.',
    detail: 'Each investigation tracks its status (pending/running/completed/failed), stores results, and logs errors for debugging.',
  },
  {
    title: '3. Engine executes',
    desc: 'The playbook executor runs each step sequentially, interpolating variables from previous results. Conditional branching decides which paths to follow.',
    detail: 'Steps have automatic retry (configurable), and the executor handles errors gracefully without crashing the entire investigation.',
  },
  {
    title: '4. Scoring & storage',
    desc: 'After execution, the scoring engine computes threat, confidence, or priority scores. Results are stored in SQLite or PostgreSQL via SQLAlchemy.',
    detail: 'The repository pattern separates storage logic from business logic, making it straightforward to swap databases or add caching.',
  },
  {
    title: '5. Query & retrieve',
    desc: 'Analysts can query past investigations using either the REST API or natural language. The query engine parses intent and generates SQL or Cypher automatically.',
    detail: 'Translation templates exist for multiple entity types and intents: find entities, find relations, score lookup, investigation status, and more.',
  },
]

export default function HowItWorks() {
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="mx-auto max-w-4xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">How It Works</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            DySH takes a seed entity through a playbook pipeline, executes automated steps, scores the results, and stores everything for later querying.
          </p>
        </div>
        <div className="mt-14 space-y-10">
          {steps.map((s, i) => (
            <StepRow key={s.title} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepRow({ step: s, index }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row gap-6 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="sm:w-48 shrink-0">
        <h3 className="text-sm font-semibold text-blue-600">{s.title}</h3>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.detail}</p>
      </div>
    </div>
  )
}
