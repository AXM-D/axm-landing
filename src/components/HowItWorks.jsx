import useScrollReveal from '../hooks/useScrollReveal'

const steps = [
  {
    title: '1. Write a playbook',
    desc: 'YAML file describing the investigation: connectors to call, data transforms, conditions, and notifications.',
    detail: 'Step types: connector_call, transform, condition, notify, scoring.compute.',
  },
  {
    title: '2. Submit a seed',
    desc: 'POST an entity — email, IP, domain, username — to the API. The engine creates an investigation and attaches the playbook.',
    detail: 'Each investigation has a status (pending/running/completed/failed) and stores results and errors.',
  },
  {
    title: '3. Engine runs it',
    desc: 'The executor iterates steps in order, interpolating variables from previous results. Conditional branching decides which path to take.',
    detail: 'Steps retry automatically (configurable). One failed step does not crash the whole investigation.',
  },
  {
    title: '4. Scoring + storage',
    desc: 'After execution, the scoring engine computes threat, confidence, or priority scores. Everything goes into SQLite or PostgreSQL.',
    detail: 'Repository pattern keeps storage separate from logic. Swap databases by changing one config line.',
  },
  {
    title: '5. Query results',
    desc: 'Past investigations are queryable via REST or plain language. The engine parses the intent and builds SQL or Cypher.',
    detail: 'Templates exist for find entities, find relations, score lookup, investigation status, and more.',
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
            Submit an entity → playbook executes steps → engine scores results → stored and queryable.
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
