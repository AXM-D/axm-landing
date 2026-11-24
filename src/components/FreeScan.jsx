import { useState } from 'react'
import { LOCKCHECK, SCAN, TOOLS_PAGE } from '../data'
import { ArrowRight, ArrowUpRight } from './icons'

/* Franja compacta: prueba AXM Scan aquí mismo; el resto vive en /herramientas/ */
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
        <div className="grid gap-8 border-t border-line pt-14 md:grid-cols-[1fr_1fr] md:items-end md:gap-16 md:pt-20">
          <div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
              {SCAN.badge}
            </p>
            <h2 className="display mt-3 text-[1.875rem] sm:text-[2.6rem]">{SCAN.title}</h2>
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
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-muted">
          <span>
            También gratis:{' '}
            <a href={LOCKCHECK.href} className="tlink font-medium text-fg">AXM Lockcheck</a>, para saber si tu proyecto instaló un paquete comprometido.
          </span>
          <a href={TOOLS_PAGE.href} className="tlink inline-flex items-center gap-1 font-medium text-fg">
            Ver las {TOOLS_PAGE.count} herramientas y demos
            <ArrowUpRight className="size-3.5" />
          </a>
        </p>
      </div>
    </section>
  )
}
