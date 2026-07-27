import { useEffect, useRef, useState } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'

/**
 * Date field that always reads DD/MM/YYYY (day first, month in the middle) —
 * a native <input type="date"> renders in the browser's locale instead, which
 * shows MM/DD/YYYY on en-US machines and is ambiguous on an invoice.
 *
 * The visible field is a text input we format ourselves; a hidden native date
 * input is kept only to open the OS calendar picker. The value in/out stays the
 * ISO yyyy-mm-dd string the rest of the app (and FBR) uses, and onChange is
 * called with an event-like object so existing `set('invoice_date')` handlers
 * keep working unchanged.
 */

// 'yyyy-mm-dd' -> 'dd/mm/yyyy' ('' when absent/unparseable)
export const isoToDMY = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ''
}

// 'dd/mm/yyyy' -> 'yyyy-mm-dd' (null when incomplete or not a real calendar date)
export const dmyToISO = (text) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((text || '').trim())
  if (!m) return null
  const [, d, mo, y] = m
  const dt = new Date(`${y}-${mo}-${d}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return null
  // Rejects 31/02/2026 and friends, which Date would roll over silently.
  if (dt.getMonth() + 1 !== Number(mo) || dt.getDate() !== Number(d)) return null
  return `${y}-${mo}-${d}`
}

const DateInput = ({ value, onChange, className = '', placeholder = 'DD/MM/YYYY' }) => {
  const [text, setText] = useState(() => isoToDMY(value))
  const native = useRef(null)

  // Re-sync when the parent changes the date (form reset, loading a draft, …).
  useEffect(() => { setText(isoToDMY(value)) }, [value])

  const emit = (iso) => onChange?.({ target: { value: iso } })

  const handleText = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    const next = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/')
    setText(next)
    if (next === '') { emit(''); return }
    const iso = dmyToISO(next)
    if (iso) emit(iso)
  }

  // A half-typed or impossible date snaps back to the last committed value.
  const handleBlur = () => { if (dmyToISO(text) === null) setText(isoToDMY(value)) }

  const openPicker = () => {
    const el = native.current
    if (!el) return
    if (typeof el.showPicker === 'function') {
      try { el.showPicker(); return } catch (_) { /* fall through */ }
    }
    el.focus()
    el.click()
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={text}
        onChange={handleText}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label="Open calendar"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-[#0e5f4f] transition-colors"
      >
        <HiOutlineCalendar className="w-4 h-4" />
      </button>
      {/* Picker-only twin: invisible, unfocusable, anchored to the field so the
          calendar popup opens beneath it. */}
      <input
        ref={native}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value || ''}
        onChange={(e) => emit(e.target.value)}
        className="absolute right-2 bottom-0 w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  )
}

export default DateInput
