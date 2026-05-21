import { useEffect, useState } from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'
import { supabase } from '../../lib/supabase'
import { updateInvoice } from '../../services/invoices'

const CheckIcon = () => (
  <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 11l5 5 7-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)
const DuplicateIcon = () => (
  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="6" width="12" height="14" rx="2" fill="#93C5FD"/>
      <rect x="7" y="2" width="12" height="14" rx="2" fill="#3B82F6"/>
    </svg>
  </div>
)
const InfoIcon = () => (
  <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 7v5M11 15h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  </div>
)

const UploadStatusCards = ({ refreshKey = 0 }) => {
  const [stats, setStats] = useState({ ok: 0, dup: 0, fail: 0 })
  const [busy,  setBusy]  = useState(false)

  const load = async () => {
    const { data } = await supabase.from('invoices').select('status')
    const rows = data || []
    setStats({
      ok:   rows.filter(r => r.status === 'verified' || r.status === 'ready' || r.status === 'pending').length,
      dup:  rows.filter(r => r.status === 'duplicate').length,
      fail: rows.filter(r => r.status === 'invalid' || r.status === 'failed').length,
    })
  }
  useEffect(() => { load() }, [refreshKey])

  const reuploadFailed = async () => {
    setBusy(true)
    try {
      const { data } = await supabase.from('invoices').select('id').in('status', ['invalid', 'failed'])
      await Promise.all((data || []).map(r => updateInvoice(r.id, { status: 'pending' })))
      await load()
    } finally { setBusy(false) }
  }

  return (
    <div className="flex flex-col gap-3 flex-1 min-w-0">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><CheckIcon /><span className="text-sm font-semibold text-gray-700">Successful</span></div>
        <span className="text-3xl font-bold text-gray-900">{stats.ok.toLocaleString()}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><DuplicateIcon /><span className="text-sm font-semibold text-gray-700">Skipped (Duplicate)</span></div>
        <span className="text-3xl font-bold text-gray-900">{stats.dup.toLocaleString()}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><InfoIcon /><span className="text-sm font-semibold text-gray-700">Validation Failed</span></div>
        <span className="text-3xl font-bold text-gray-900">{stats.fail.toLocaleString()}</span>
      </div>

      <button
        onClick={reuploadFailed}
        disabled={busy || stats.fail === 0}
        className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <HiOutlineRefresh className="w-4 h-4" />
        {busy ? 'WORKING…' : 'RE-QUEUE FAILED'}
      </button>
    </div>
  )
}

export default UploadStatusCards
