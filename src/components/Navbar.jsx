import { useEffect, useState } from 'react'

const links = [
  { label: 'Motor', href: '#motor' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Estudio', href: '#estudio' },
  { label: 'Contacto', href: '#contacto' },
]

const logo = `${import.meta.env.BASE_URL}axm-logo.jpeg`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b border-line bg-ink/75 backdrop-blur-md md:hidden ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 300ms var(--ease-out)' }}
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label="AXM, inicio">
          <img src={logo} alt="" className="size-7 rounded-md object-cover ring-1 ring-line-2" />
          <span className="text-[15px] font-semibold tracking-tight">AXM</span>
        </a>

        <nav
          aria-label="Principal"
          className={`hidden items-center gap-1 rounded-full border px-1.5 py-1.5 md:flex ${
            scrolled ? 'border-line bg-ink-2/80 backdrop-blur-md' : 'border-transparent'
          }`}
          style={{ transition: 'background-color 300ms var(--ease-out), border-color 300ms var(--ease-out)' }}
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} className="link-hover rounded-full px-3.5 py-1.5 text-sm text-mute transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contacto" className="btn btn-primary hidden h-9 px-4 text-sm md:inline-flex">
          Hablemos
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="btn btn-ghost size-10 p-0 md:hidden"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d={open ? 'M5 5l10 10' : 'M3 7h14'} style={{ transition: 'd 200ms var(--ease-out)' }} />
            <path d={open ? 'M15 5L5 15' : 'M3 13h14'} style={{ transition: 'd 200ms var(--ease-out)' }} />
          </svg>
        </button>
      </div>

      {/* Menú móvil: crece desde su disparador (origen arriba a la derecha), sin partir de escala 0 */}
      <div
        id="menu-movil"
        className="absolute right-4 top-16 w-56 origin-top-right rounded-2xl border border-line-2 bg-ink-2/95 p-2 shadow-[0_16px_40px_rgb(0_0_0/0.5)] backdrop-blur-md md:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1)' : 'scale(0.95)',
          pointerEvents: open ? 'auto' : 'none',
          visibility: open ? 'visible' : 'hidden',
          transition: open
            ? 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out), visibility 0s'
            : 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out), visibility 0s 150ms',
        }}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm text-mute active:bg-ink-3"
          >
            {l.label}
          </a>
        ))}
      </div>
    </header>
  )
}
