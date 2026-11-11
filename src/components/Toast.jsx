import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './toast-context'

/**
 * Toast mínimo al estilo Sonner: entra desde abajo con una curva tipo drawer,
 * sale más rápido de lo que entra y se puede interrumpir (transiciones CSS, no keyframes).
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [open, setOpen] = useState(false)
  const timer = useRef()

  const show = useCallback((message) => {
    clearTimeout(timer.current)
    setOpen(false)
    setToast({ message, id: Date.now() })
    // Un frame para montar en estado cerrado y luego transicionar.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    timer.current = setTimeout(() => setOpen(false), 2400)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 rounded-full border border-line-2 bg-ink-3/95 py-2.5 pl-3 pr-4 text-sm text-paper shadow-[0_8px_30px_rgb(0_0_0/0.45)] backdrop-blur"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
              opacity: open ? 1 : 0,
              transition: open
                ? 'transform 400ms var(--ease-drawer), opacity 300ms var(--ease-out)'
                : 'transform 200ms var(--ease-out), opacity 200ms var(--ease-out)',
            }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-signal text-ink">
              <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
