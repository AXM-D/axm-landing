import useScrollReveal from '../hooks/useScrollReveal'

const rows = [
  { feature: 'License', general: 'MIT', custom: 'Private', premium: 'Annual subscription' },
  { feature: 'Price', general: 'Free', custom: 'Custom quote', premium: 'Contact us' },
  { feature: 'Playbook steps', general: '≤ 8', custom: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Concurrent investigations', general: '≤ 3', custom: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Scoring engine', general: true, custom: true, premium: true },
  { feature: 'LLM integration', general: true, custom: true, premium: true },
  { feature: 'Custom connectors', general: true, custom: true, premium: true },
  { feature: 'All API endpoints', general: false, custom: true, premium: true },
  { feature: 'Web dashboard', general: false, custom: 'Optional', premium: true },
  { feature: 'WebSocket events', general: false, custom: false, premium: true },
  { feature: 'ML scoring', general: false, custom: false, premium: true },
  { feature: 'Multi-user & RBAC', general: false, custom: 'Optional', premium: true },
  { feature: 'Custom branding', general: false, custom: true, premium: true },
  { feature: 'Dedicated support', general: false, custom: true, premium: 'SLA 24/7' },
]

function Cell({ value }) {
  if (value === true) {
    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    )
  }
  if (value === false) {
    return <span className="text-slate-300">—</span>
  }
  return <span className="text-slate-500">{value}</span>
}

export default function ComparisonTable() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="compare" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`max-w-2xl mb-14 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Compare Editions</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Every edition shares the same core engine. Differences are in scale, support, and enterprise features.
          </p>
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-4 pr-8 font-semibold text-slate-400 text-xs uppercase tracking-widest w-[180px]">Feature</th>
                <th className="text-left py-4 pr-8 font-semibold text-slate-900">General</th>
                <th className="text-left py-4 pr-8 font-semibold text-slate-900">Custom</th>
                <th className="text-left py-4 font-semibold text-blue-600">Premium</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 pr-8 text-slate-500 font-medium">{r.feature}</td>
                  <td className="py-3.5 pr-8"><Cell value={r.general} /></td>
                  <td className="py-3.5 pr-8"><Cell value={r.custom} /></td>
                  <td className="py-3.5"><Cell value={r.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
