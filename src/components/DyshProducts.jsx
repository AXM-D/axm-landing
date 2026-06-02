import useScrollReveal from '../hooks/useScrollReveal'

const editions = [
  {
    name: 'DySH General',
    tagline: 'Open source',
    price: 'Free',
    license: 'MIT',
    desc: 'Full engine for individuals and small teams. Community support. MIT license.',
    features: ['Up to 8 playbook steps', 'Up to 3 concurrent investigations', 'Multi-factor scoring', 'REST API (15 endpoints)', 'SQLite / PostgreSQL', 'Community support'],
    href: 'https://github.com/AXM-D',
    cta: 'View on GitHub',
  },
  {
    name: 'DySH Custom',
    tagline: 'Tailored for your team',
    price: 'Custom',
    license: 'Private',
    desc: 'Engine adapted to your workflows, data sources, and branding. Private license.',
    features: ['Unlimited playbook steps', 'Unlimited concurrent investigations', 'Full scoring engine', 'All API endpoints', 'Custom integrations', 'Dedicated support'],
    href: '#contact',
    cta: 'Contact us',
    featured: true,
  },
  {
    name: 'DySH Premium',
    tagline: 'Enterprise platform',
    price: 'Subscription',
    license: 'Annual',
    desc: 'Full engine + dashboard, WebSocket events, ML scoring, multi-user, and SLA.',
    features: ['Everything in Custom', 'Web dashboard (React)', 'WebSocket real-time events', 'ML-powered scoring', 'Multi-user & RBAC', 'SLA 24/7 support'],
    href: '#contact',
    cta: 'Contact us',
  },
]

export default function DyshProducts() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="dysh" className="py-20 md:py-28 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">DySH — Three Editions</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Same core engine. Different scale.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6 items-start">
          {editions.map((e, i) => (
            <EditionCard key={e.name} edition={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EditionCard({ edition: e, index }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`relative rounded-xl border p-7 flex flex-col transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${
        e.featured
          ? 'border-blue-200 bg-white shadow-sm ring-1 ring-blue-100 scale-105 md:scale-105'
          : 'border-slate-200 bg-white'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {e.featured && (
        <span className="absolute -top-3 left-5 px-3 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
          Most popular
        </span>
      )}
      <div className={e.featured ? 'mt-2' : ''}>
        <h3 className="text-lg font-semibold text-slate-900">{e.name}</h3>
        <p className="text-sm text-slate-400 mt-0.5">{e.tagline}</p>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-2xl font-bold text-slate-900">{e.price}</span>
          <span className="text-xs text-slate-400">{e.license}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500 leading-relaxed">{e.desc}</p>
      <ul className="mt-5 space-y-2.5 flex-1">
        {e.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={e.href}
        className={`mt-7 w-full text-center text-sm font-medium px-4 py-2.5 rounded-lg transition-all ${
          e.featured
            ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
            : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
        }`}
      >
        {e.cta}
      </a>
    </div>
  )
}
