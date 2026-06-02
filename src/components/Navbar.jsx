import { useState, useEffect } from 'react'

const links = [
  { label: 'Engine', href: '#engine' },
  { label: 'DySH', href: '#dysh' },
  { label: 'Pricing', href: '#compare' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-slate-200/50' : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-6xl px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/axm-logo.jpeg" alt="AXM" className="h-8 w-8 md:h-9 md:w-9 rounded-lg object-cover ring-1 ring-slate-200" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">AXM</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contact" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all">
            Get in touch
          </a>
        </div>

        <button className="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-4 shadow-lg">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-slate-600 hover:text-slate-900">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg text-center">
            Get in touch
          </a>
        </div>
      )}
    </nav>
  )
}
