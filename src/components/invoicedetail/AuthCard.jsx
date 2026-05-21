import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const md5ish = (str) => {
  // tiny non-crypto hash for display only
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(8, '0').slice(0, 8)
}

const AuthCard = () => {
  const { id } = useParams()
  const [inv, setInv]         = useState(null)
  const [latest, setLatest]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    (async () => {
      const { data: invoice } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle()
      setInv(invoice)
      if (invoice?.invoice_number) {
        const { data: v } = await supabase
          .from('verifications')
          .select('*')
          .eq('invoice_number', invoice.invoice_number)
          .order('created_at', { ascending: false })
          .limit(1)
        setLatest(v?.[0] || null)
      }
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-400">Loading…</div>
  if (!inv)    return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-xs text-gray-400">No invoice</div>

  const status = latest?.status || inv.status
  const checksum = md5ish(`${inv.id}-${inv.invoice_number}-${inv.total_amount}`)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          status === 'verified' ? 'bg-green-50 border-green-200' :
          status === 'invalid'  ? 'bg-red-50 border-red-200' :
                                  'bg-gray-50 border-gray-200'
        }`}>
          <svg className={`w-5 h-5 ${status === 'verified' ? 'text-green-500' : status === 'invalid' ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className={`text-sm font-bold capitalize ${
            status === 'verified' ? 'text-green-600' :
            status === 'invalid'  ? 'text-red-600' :
                                    'text-gray-600'
          }`}>{status || 'unverified'}</p>
          <p className="text-[11px] text-gray-400">FBR Sandbox Clearance</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-xl border-2 border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 40 40" className="w-16 h-16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="1" fill="#1e3a5f"/>
            <rect x="4" y="4" width="8" height="8" rx="0.5" fill="white"/>
            <rect x="5.5" y="5.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
            <rect x="26" y="2" width="12" height="12" rx="1" fill="#1e3a5f"/>
            <rect x="28" y="4" width="8" height="8" rx="0.5" fill="white"/>
            <rect x="29.5" y="5.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
            <rect x="2" y="26" width="12" height="12" rx="1" fill="#1e3a5f"/>
            <rect x="4" y="28" width="8" height="8" rx="0.5" fill="white"/>
            <rect x="5.5" y="29.5" width="5" height="5" rx="0.3" fill="#1e3a5f"/>
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">FBR Invoice No</p>
          <p className="text-sm font-mono text-[#1e3a5f] font-bold leading-snug break-all">
            {latest?.fbr_invoice_no || inv.fbr_invoice_no || '—'}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Hash Checksum</span>
          <span className="text-xs font-mono font-semibold text-gray-700">{checksum} · · · {checksum.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Response Time</span>
          <span className="text-xs font-semibold text-blue-600">{latest?.response_time_ms ? `${(latest.response_time_ms / 1000).toFixed(2)}s` : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Verified On</span>
          <span className="text-xs font-semibold text-gray-700">{latest?.created_at ? new Date(latest.created_at).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
        </div>
      </div>
    </div>
  )
}

export default AuthCard
