import { createContext, useContext } from 'react'

export const CurrencyContext = createContext({ currency: 'USD', setCurrency: () => {} })

export function useCurrency() {
  return useContext(CurrencyContext)
}
