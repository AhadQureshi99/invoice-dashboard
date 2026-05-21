import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext({ query: '', setQuery: () => {} })

export const SearchProvider = ({ children }) => {
  const [query, _setQuery] = useState('')
  const setQuery = useCallback((q) => _setQuery(q || ''), [])
  return <Ctx.Provider value={{ query, setQuery }}>{children}</Ctx.Provider>
}

export const useSearch = () => useContext(Ctx)
