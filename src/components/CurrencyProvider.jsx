import { useCallback, useMemo, useState } from 'react'
import { CurrencyContext } from './currency-context'
import { CURRENCIES } from '../data'

const KEY = 'axm-currency'

/* Moneda guardada, si no la del idioma del navegador (es-MX → MXN) y si no USD. */
function initialCurrency() {
  try {
    const saved = localStorage.getItem(KEY)
    if (CURRENCIES.includes(saved)) return saved
  } catch {
    // Sin almacenamiento (modo privado, bloqueado): se sigue sin recordar la elección.
  }
  try {
    if (/-MX$/i.test(navigator.language)) return 'MXN'
  } catch {
    // Sin navigator: se usa USD.
  }
  return 'USD'
}

export function CurrencyProvider({ children }) {
  const [currency, setState] = useState(initialCurrency)

  const setCurrency = useCallback((next) => {
    setState(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Sin almacenamiento: la elección vale solo para esta visita.
    }
  }, [])

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
