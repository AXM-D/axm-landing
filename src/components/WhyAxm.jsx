import useScrollReveal from '../hooks/useScrollReveal'

const points = [
  {
    title: 'Engine, not a platform',
    desc: 'Unlike MISP, TheHive, or SENTINEL — which are complete platforms — DySH is an embeddable engine. It connects to your existing OSINT stack via API and plugins, rather than replacing it.',
  },
  {
    title: 'Multi-factor scoring out of the box',
    desc: 'Most OSINT tools leave scoring to the analyst\'s judgment. DySH computes threat, confidence, and priority scores automatically from freshness, source reliability, correlation, and reputation factors.',
  },
  {
    title: 'Natural language to query',
    desc: 'Instead of writing SQL or Cypher manually, analysts can ask questions in plain language. The engine parses intent, extracts entities, and generates the appropriate query automatically.',
  },
  {
    title: 'Playbook-driven automation',
    desc: 'Custom scripts are brittle and one-off. DySH playbooks are declarative YAML files with branching, retry, and variable interpolation — reusable across investigations without writing code.',
  },
  {
    title: 'Open core, commercial options',
    desc: 'DySH General is fully open source under MIT. Teams that need scale, custom workflows, or enterprise features can move to Custom or Premium without rebuilding their automation.',
  },
  {
    title: 'Plugin connector architecture',
    desc: 'Instead of hardcoding integrations, DySH uses a registry pattern. Anyone can write a connector implementing BaseConnector and plug it in without modifying the engine.',
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
            DySH is not another OSINT platform. It is an intelligence engine that integrates into existing workflows.
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
