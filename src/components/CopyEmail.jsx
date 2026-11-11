import { useState } from 'react'
import { CONTACT_EMAIL } from '../data'
import { useToast } from './toast-context'

export default function CopyEmail({ className = 'btn btn-ghost', label }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      toast('Email copiado al portapapeles')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`
    }
  }

  return (
    <button type="button" onClick={copy} className={className}>
      <span className="relative grid size-4 place-items-center" aria-hidden="true">
        {/* Intercambio de icono: escala desde 0.5 (nunca desde 0) + opacidad + blur */}
        <svg
          viewBox="0 0 16 16"
          className="absolute size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            opacity: copied ? 0 : 1,
            transform: copied ? 'scale(0.5)' : 'scale(1)',
            filter: copied ? 'blur(2px)' : 'none',
            transition: 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out), filter 200ms var(--ease-out)',
          }}
        >
          <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
          <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" />
        </svg>
        <svg
          viewBox="0 0 16 16"
          className="absolute size-4 text-signal"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            opacity: copied ? 1 : 0,
            transform: copied ? 'scale(1)' : 'scale(0.5)',
            filter: copied ? 'none' : 'blur(2px)',
            transition: 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out), filter 200ms var(--ease-out)',
          }}
        >
          <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label ?? CONTACT_EMAIL}
    </button>
  )
}
