import { useCurrency } from './currency-context'
import { CURRENCIES } from '../data'

/*
  Control segmentado USD | MXN. El indicador es una copia de la fila con el estilo
  activo recortada con clip-path, así el color del texto cambia al mismo ritmo que el fondo.
*/
export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()
  const index = CURRENCIES.indexOf(currency)
  const clip = index === 0 ? 'inset(0 50% 0 0 round 6px)' : 'inset(0 0 0 50% round 6px)'

  function onKeyDown(e) {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = CURRENCIES[(index + delta + CURRENCIES.length) % CURRENCIES.length]
    setCurrency(next)
    e.currentTarget.querySelector(`[data-currency="${next}"]`)?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Moneda de los precios"
      onKeyDown={onKeyDown}
      className="relative inline-grid grid-cols-2 rounded-lg border border-line-strong p-0.5 text-sm"
    >
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          data-currency={c}
          aria-checked={currency === c}
          tabIndex={currency === c ? 0 : -1}
          onClick={() => setCurrency(c)}
          className="min-h-10 min-w-[4.5rem] rounded-md px-3 font-medium text-muted transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
        >
          {c}
        </button>
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0.5 grid grid-cols-2 bg-fg text-on-fg"
        style={{ clipPath: clip, transition: 'clip-path 240ms var(--ease-out)' }}
      >
        {CURRENCIES.map((c) => (
          <span key={c} className="grid place-items-center font-medium">
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
