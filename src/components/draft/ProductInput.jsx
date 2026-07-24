import { useEffect, useRef, useState } from 'react'
import { loadProductSuggestions, searchProducts } from '../../services/products'

/**
 * Searchable product description field — same UX as the HS Code picker. Type
 * a product name and pick from previously used products (this seller's own
 * drafts + invoices), which also fills the matching HS code. Still accepts
 * free text so a brand-new product can just be typed.
 *
 * @param {string}   value    current description
 * @param {string}   sellerId the selected company — suggestions are scoped to it
 * @param {function} onChange (description: string) => void — fired on every keystroke
 * @param {function} onPick   (item: {description, hs_code, unit_price}) => void — fired when a suggestion is chosen
 */
const ProductInput = ({ value, sellerId, onChange, onPick, className, placeholder = 'Product / item description' }) => {
  const [query, setQuery]     = useState(value || '')
  const [list, setList]       = useState(null)
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])
  // Reset the cached list when the selected company changes so the next open
  // loads that company's catalog.
  useEffect(() => { setList(null); setResults([]) }, [sellerId])

  // Close the dropdown on any click outside this field.
  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const ensureList = async () => {
    if (list) return list
    setLoading(true)
    const l = await loadProductSuggestions(sellerId)
    setList(l); setLoading(false)
    return l
  }

  const openWith = async (q) => {
    setOpen(true)
    const l = await ensureList()
    setResults(searchProducts(l, q))
  }

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange(v)               // keep free-text in sync so a brand-new product still works
    openWith(v)
  }

  const pick = (item) => {
    setQuery(item.description)
    setOpen(false)
    onPick ? onPick(item) : onChange(item.description)
  }

  const hasHistory = !!(list && list.length > 0)

  return (
    <div className="relative" ref={boxRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => openWith(query)}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && (loading || results.length > 0 || hasHistory) && (
        <div className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg text-xs">
          {loading && <div className="px-3 py-2 text-gray-400">Loading your products…</div>}
          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-gray-400">No matching saved product — this will be added as new.</div>
          )}
          {!loading && results.map((item, i) => (
            <button
              type="button"
              key={`${item.description}-${i}`}
              onMouseDown={(e) => { e.preventDefault(); pick(item) }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
            >
              <span className="font-semibold text-gray-800">{item.description}</span>
              {item.hs_code && <span className="text-[#0e5f4f] ml-2">HS {item.hs_code}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductInput
