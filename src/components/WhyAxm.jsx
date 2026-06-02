import useScrollReveal from '../hooks/useScrollReveal'

const points = [
  {
    title: 'Engine, not a platform',
    desc: 'MISP, TheHive, SENTINEL are platforms. DySH is an embeddable engine — connects to your existing stack via API and plugins instead of replacing it.',
  },
  {
    title: 'Scoring without manual work',
    desc: 'Most OSINT tools leave scoring to the analyst. DySH computes threat, confidence, and priority scores from freshness, source reliability, correlation, and reputation automatically.',
  },
  {
    title: 'Natural language to query',
    desc: 'Stop writing SQL or Cypher by hand. Ask a question in plain language — the engine parses intent, extracts entities, and generates the query.',
  },
  {
    title: 'Playbook-driven automation',
    desc: 'Custom scripts break over time. DySH playbooks are declarative YAML files with branching, retry, and variable interpolation — reusable without writing code.',
  },
  {
    title: 'Open core, commercial options',
    desc: 'DySH General is MIT open source. Teams that need more scale or custom workflows can move to Custom or Premium without changing their playbooks.',
  },
  {
    title: 'Plugin connector system',
    desc: 'No hardcoded integrations. Implement BaseConnector, register it, and call it from any playbook. The engine does not need modifications.',
  },
]

export default function WhyAxn() {
  const [ref, visible] = useScrollReveal()

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Why AXM?</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Not another platform. An engine that integrates into what you already use.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-blue-600 font-bold text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
