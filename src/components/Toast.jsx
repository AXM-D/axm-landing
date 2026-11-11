import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './toast-context'
import { Check } from './icons'

/**
 * Toast mínimo al estilo Sonner: entra desde abajo con curva de drawer, sale más
 * rápido de lo que entra y se puede interrumpir (transiciones CSS, no keyframes).
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [open, setOpen] = useState(false)
  const timer = useRef()

  const show = useCallback((message) => {
    clearTimeout(timer.current)
    setOpen(false)
    setToast({ message, id: Date.now() })
    // Dos frames: se monta cerrado y después transiciona.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    timer.current = setTimeout(() => setOpen(false), 2400)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div role="status" className="band-dark pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center !bg-transparent px-4 md:bottom-8">
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-2.5 rounded-lg border border-line-strong bg-surface-2 py-2.5 pl-3 pr-4 text-sm font-medium text-fg shadow-[0_12px_30px_-8px_rgb(0_0_0/0.6)]"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
              opacity: open ? 1 : 0,
              transition: open ? 'transform 400ms var(--ease-drawer), opacity 250ms var(--ease-out)' : 'transform 200ms var(--ease-out), opacity 200ms var(--ease-out)',
            }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-ok text-on-fg">
              <Check className="size-3" />
            </span>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
