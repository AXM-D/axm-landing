import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const faqs = [
  {
    q: 'What is DySH?',
    a: 'DySH is the product line built on AXM\'s intelligence engine. It comes in three editions: General (open source, MIT), Custom (tailored for organizations), and Premium (enterprise subscription with full features).',
  },
  {
    q: 'How does DySH compare to MISP or TheHive?',
    a: 'MISP and TheHive are complete OSINT platforms. DySH is an embeddable engine — it provides the automation, scoring, and query layer that you integrate into your existing platform rather than replacing it.',
  },
  {
    q: 'Do I need an LLM to use DySH?',
    a: 'No. The LLM is optional — only used for natural language parsing and insights. Playbooks, scoring, connectors, and the API all work without one. When enabled, it supports Ollama (local) or OpenAI.',
  },
  {
    q: 'Can I write my own connectors?',
    a: 'Yes. The connector system uses a plugin architecture. You implement BaseConnector (name, health, call methods), register it with the ConnectorRegistry, and it becomes available in playbooks via the connector_call step. No engine modifications needed.',
  },
  {
    q: 'What databases does DySH support?',
    a: 'SQLite for development (aiosqlite driver) and PostgreSQL for production (asyncpg driver). The SQLAlchemy async layer makes it straightforward to add other databases if needed.',
  },
  {
    q: 'Is DySH General really free?',
    a: 'Yes. MIT license — free to use, modify, and distribute. Full engine with limits (8 playbook steps, 3 concurrent investigations) for individual researchers and small teams.',
  },
  {
    q: 'How do I upgrade from General to Premium?',
    a: 'Contact us at axm.central@outlook.com. Since all editions share the same core, your playbooks and integrations are portable. Premium adds unlimited concurrency, web dashboard, WebSocket events, ML scoring, multi-user support, and SLA.',
  },
  {
    q: 'Does DySH work with SENTINEL?',
    a: 'There is a dedicated edition — TaQ Engine for SENTINEL — that provides native integration with the SENTINEL OSINT platform. Contact us for details on compatibility and licensing.',
  },
]

function FaqItem({ faq, open, toggle }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-blue-600"
      >
        <span className="text-sm font-medium text-slate-900">{faq.q}</span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
      </div>
    </div>
  )
}

export default function Faq() {
  const [ref, visible] = useScrollReveal()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className={`max-w-2xl transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} ref={ref}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Editions, licensing, and technical details.
          </p>
        </div>
        <div className="mt-10">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} open={openIndex === i} toggle={() => setOpenIndex(openIndex === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
