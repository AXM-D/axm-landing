import { useState } from 'react'
import { LOCKCHECK, SCAN } from '../data'
import { ArrowRight } from './icons'

/* Servicio gratuito: el formulario lleva directo al informe de AXM Scan */
export default function FreeScan() {
  const [domain, setDomain] = useState('')

  const go = (e) => {
    e.preventDefault()
    const d = domain.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#\s]/)[0]
    window.location.href = d ? `${SCAN.href}?d=${encodeURIComponent(d)}` : SCAN.href
  }

  return (
    <section id="scan" className="band-dark section !pt-0">
      <div className="wrap">
        <div className="grid gap-10 border-t border-line pt-16 md:grid-cols-[1fr_1fr] md:items-end md:gap-16 md:pt-24">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
              {SCAN.badge}
            </p>
            <h2 className="display mt-3 text-[2rem] sm:text-5xl">{SCAN.title}</h2>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted">{SCAN.desc}</p>
          </div>
          <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="scan-domain" className="sr-only">Dominio a revisar</label>
            <input
              id="scan-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="tuempresa.com"
              inputMode="url"
              spellCheck="false"
              autoComplete="off"
              className="min-h-12 flex-1 rounded-lg border border-line-strong bg-surface px-4 font-mono text-fg placeholder:text-dim focus:border-fg focus:outline-none"
            />
            <button type="submit" className="btn btn-primary">
              Revisar gratis
              <ArrowRight className="btn-arrow size-3.5" />
            </button>
          </form>
        </div>
        <ul className="mt-10 grid gap-x-10 gap-y-3 text-[15px] text-muted sm:grid-cols-2 md:grid-cols-4">
          {SCAN.checks.map((c) => (
            <li key={c} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
              {c}
            </li>
          ))}
        </ul>

        {/* Segunda herramienta gratuita, para equipos de desarrollo */}
        <a
          href={LOCKCHECK.href}
          className="row-link mt-12 grid gap-x-10 gap-y-2 rounded-xl border border-line px-5 py-6 transition-colors duration-200 md:grid-cols-[1fr_auto] md:items-center md:px-7"
        >
          <div>
            <p className="text-sm text-muted">{LOCKCHECK.badge}</p>
            <h3 className="display-sm mt-1.5 text-[1.375rem] sm:text-[1.625rem]">{LOCKCHECK.title}</h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{LOCKCHECK.desc}</p>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-medium text-fg">
            {LOCKCHECK.cta}
            <ArrowRight className="row-arrow size-4 text-muted" />
          </span>
        </a>
      </div>
    </section>
  )
}
