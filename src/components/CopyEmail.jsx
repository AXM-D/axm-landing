import { useRef, useState } from 'react'
import { CONTACT_EMAIL } from '../data'
import { useToast } from './toast-context'
import { Check, Copy } from './icons'

const swap = 'opacity 200ms var(--ease-out), transform 200ms var(--ease-out), filter 200ms var(--ease-out)'

export default function CopyEmail({ className = 'btn btn-ghost' }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const timer = useRef()

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      toast('Email copiado')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      // Sin acceso al portapapeles (algunos navegadores integrados): se abre el correo.
      window.location.href = `mailto:${CONTACT_EMAIL}`
    }
  }

  return (
    <button type="button" onClick={copy} className={className} aria-label={`Copiar el email ${CONTACT_EMAIL}`}>
      <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
        {/* Intercambio de icono: desde 0.5 (nunca desde 0), con opacidad y blur */}
        <span className="absolute grid" style={{ opacity: copied ? 0 : 1, transform: copied ? 'scale(0.5)' : 'none', filter: copied ? 'blur(2px)' : 'none', transition: swap }}>
          <Copy />
        </span>
        <span className="absolute grid text-ok" style={{ opacity: copied ? 1 : 0, transform: copied ? 'none' : 'scale(0.5)', filter: copied ? 'none' : 'blur(2px)', transition: swap }}>
          <Check />
        </span>
      </span>
      <span translate="no" className="min-w-0 truncate">{CONTACT_EMAIL}</span>
    </button>
  )
}
