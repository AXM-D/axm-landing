import { useEffect, useRef, useState } from 'react'
import { CTA_LABEL, NAV } from '../data'
import { Wordmark } from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (e) => {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <header className="band-dark fixed inset-x-0 top-0 z-40 !bg-transparent">
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-line bg-bg/85 backdrop-blur-md"
        style={{ opacity: scrolled || open ? 1 : 0, transition: 'opacity 200ms ease' }}
      />
      <div className="wrap relative flex h-16 items-center justify-between gap-6">
        <a href="#inicio" className="-ml-2 flex h-11 items-center px-2" aria-label="AXM, ir al inicio">
          <Wordmark className="h-[15px] w-auto" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="nav-link py-2 text-[14.5px] text-muted transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contacto" className="btn btn-primary btn-sm hidden md:inline-flex">
          {CTA_LABEL}
        </a>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="btn btn-ghost -mr-1 size-11 min-h-0 p-0 md:hidden"
        >
          <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M3 7h14" style={{ transformOrigin: '10px 7px', transform: open ? 'translateY(3px) rotate(45deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} />
            <path d="M3 13h14" style={{ transformOrigin: '10px 13px', transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none', transition: 'transform 200ms var(--ease-out)' }} />
          </svg>
        </button>
      </div>

      {/* Menú móvil: nace de su botón (origen arriba a la derecha) y nunca desde escala 0 */}
      <div
        id="menu-movil"
        ref={menuRef}
        inert={!open}
        className="absolute inset-x-4 top-[4.25rem] origin-top-right rounded-xl border border-line-strong bg-surface p-2 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)] md:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1)' : 'scale(0.96)',
          visibility: open ? 'visible' : 'hidden',
          transition: open
            ? 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out), visibility 0s'
            : 'opacity 140ms var(--ease-out), transform 140ms var(--ease-out), visibility 0s 140ms',
        }}
      >
        <nav aria-label="Principal, móvil">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-lg px-3 text-base text-fg active:bg-surface-2">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#contacto" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full">
          {CTA_LABEL}
        </a>
      </div>
    </header>
  )
}
