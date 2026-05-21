import { useEffect, useRef, useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { useSearch } from '../../lib/SearchContext'
import { supabase } from '../../lib/supabase'

const initials = (s) => (s || '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '·'

const TopBar = () => {
  const { user, profile, signOut } = useAuth()
  const { query, setQuery } = useSearch()
  const navigate = useNavigate()
  const [local, setLocal]     = useState(query)
  const [results, setResults] = useState([])
  const [open,    setOpen]    = useState(false)
  const [menu,    setMenu]    = useState(false)
  const wrap = useRef(null)

  const name = profile?.entity_name || user?.email || 'Account'
  const role = profile?.role || 'Member'

  // debounce search → invoice quick results
  useEffect(() => {
    const t = setTimeout(async () => {
      setQuery(local)
      if (!local || local.length < 2) { setResults([]); return }
      const { data } = await supabase
        .from('invoices')
        .select('id,invoice_number,buyer_ntn,buyer_name,total_amount,status')
        .or(`invoice_number.ilike.%${local}%,buyer_ntn.ilike.%${local}%,buyer_name.ilike.%${local}%,seller_ntn.ilike.%${local}%`)
        .limit(8)
      setResults(data || [])
    }, 200)
    return () => clearTimeout(t)
  }, [local, setQuery])

  // close dropdowns on outside click
  useEffect(() => {
    const onClick = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); setMenu(false) } }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header ref={wrap} className="sticky top-0 z-40 bg-[#f0f4f8] border-b border-[#dce4ef] px-6 py-3 hidden lg:flex items-center gap-4">

      <div className="relative w-80">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={local}
          onChange={(e) => { setLocal(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search invoices, NTNs, buyer name..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
        />
        {open && results.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
            {results.map(r => (
              <button
                key={r.id}
                onClick={() => { navigate(`/dashboard/invoices/${r.id}`); setOpen(false); setLocal('') }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-800">{r.invoice_number}</p>
                  <p className="text-[11px] text-gray-400">{r.buyer_ntn || '—'} · {r.buyer_name || '—'}</p>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase">{r.status}</span>
              </button>
            ))}
          </div>
        )}
        {open && local.length >= 2 && results.length === 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-400">
            No matches
          </div>
        )}
      </div>

      <Link to="/dashboard/verification" className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
        Verify Invoice
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5 cursor-default">
        <span className="text-lg leading-none">🇵🇰</span>
        <span className="text-sm font-medium text-gray-600">EN</span>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="relative">
        <button onClick={() => setMenu(m => !m)} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white">{initials(name)}</span>
          </div>
          <div className="leading-tight text-left">
            <p className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">{name}</p>
            <p className="text-[10px] text-gray-400 capitalize">{role}</p>
          </div>
        </button>
        {menu && (
          <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            <Link to="/dashboard/settings" onClick={() => setMenu(false)} className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Settings</Link>
            <Link to="/dashboard/notifications" onClick={() => setMenu(false)} className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Notifications</Link>
            <button onClick={async () => { await signOut(); navigate('/login') }} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Sign out</button>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
