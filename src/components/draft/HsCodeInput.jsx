import { useEffect, useRef, useState } from 'react'
import { loadHsCodes, searchHsCodes } from '../../services/fbr'

/**
 * Searchable FBR HS-code field. Type a code or a keyword (e.g. "analyzer",
 * "urine container") and pick the exact valid FBR HS code from the dropdown.
 * Still accepts free text so a known code can be typed directly. This prevents
 * the "HS Code does not match with provided sale type" rejection caused by
 * pasting non-FBR (e.g. Google) codes.
 *
 * @param {string}   value    current hs_code
 * @param {function} onChange (code: string) => void
 */
const HsCodeInput = ({ value, onChange, className, placeholder = 'Search HS code or keyword (e.g. analyzer)' }) => {
  const [query, setQuery]     = useState(value || '')
  const [list, setList]       = useState(null)
  const [results, setResults] = useState([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  // Close the dropdown on any click outside this field.
  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const ensureList = async () => {
    if (list) return list
    setLoading(true)
    const l = await loadHsCodes()
    setList(l); setLoading(false)
    return l
  }

  const openWith = async (q) => {
    setOpen(true)
    const l = await ensureList()
    setResults(searchHsCodes(l, q))
  }

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange(v)               // keep free-text in sync so a typed code still works
    openWith(v)
  }

  const pick = (item) => {
    setQuery(item.code)
    onChange(item.code)
    setOpen(false)
  }

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
      {open && (
        <div className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg text-xs">
          {loading && <div className="px-3 py-2 text-gray-400">Loading FBR HS codes…</div>}
          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-gray-400">No matching FBR HS code. Try a keyword like “analyzer” or “container”.</div>
          )}
          {!loading && results.map((item) => (
            <button
              type="button"
              key={item.code}
              onMouseDown={(e) => { e.preventDefault(); pick(item) }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
              title={item.description}
            >
              <span className="font-semibold text-[#0e5f4f]">{item.code}</span>
              <span className="text-gray-500 ml-2">{item.description.slice(0, 72)}{item.description.length > 72 ? '…' : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HsCodeInput
