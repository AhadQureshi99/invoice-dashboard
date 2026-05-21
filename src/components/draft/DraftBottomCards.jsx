import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const OrangeSparkline = () => (
  <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
    <path d="M0 28 C10 28 12 22 20 20 C28 18 30 24 40 22 C50 20 52 10 60 8 C68 6 70 4 80 2"
          stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="2" r="3.5" fill="#F97316" />
  </svg>
)
const GreenSparkline = () => (
  <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
    <path d="M0 30 C10 28 14 26 22 22 C30 18 34 20 42 16 C50 12 56 10 64 8 C72 6 76 4 80 2"
          stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="80" cy="2" r="3.5" fill="#10B981" />
  </svg>
)
const ComplianceDecor = () => (
  <svg className="absolute right-4 bottom-4 opacity-20" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M30 4L52 14V30C52 43 42 53 30 56C18 53 8 43 8 30V14L30 4Z" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M20 30l7 7 13-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const fmt = (v) => v >= 1e6 ? `PKR ${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `PKR ${(v / 1e3).toFixed(1)}K` : `PKR ${Math.round(v)}`

const DraftBottomCards = ({ refreshKey = 0 }) => {
  const [stats, setStats] = useState({ pipeline: 0, pendingTax: 0, total: 0, compliance: 100 })

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('drafts').select('total_amount,tax_amount,status')
      const rows = data || []
      setStats({
        pipeline:   rows.reduce((s, r) => s + Number(r.total_amount || 0), 0),
        pendingTax: rows.reduce((s, r) => s + Number(r.tax_amount   || 0), 0),
        total:      rows.length,
        compliance: rows.length ? 100 : 100,
      })
    })()
  }, [refreshKey])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Draft Pipeline</p>
          <span className="text-xs font-semibold text-orange-500">{stats.total} drafts</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-900">{fmt(stats.pipeline)}</p>
          <OrangeSparkline />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Pending Taxes</p>
          <span className="text-xs font-semibold text-green-500">GST</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-900">{fmt(stats.pendingTax)}</p>
          <GreenSparkline />
        </div>
      </div>

      <div className="relative bg-[#1e3a5f] rounded-2xl p-5 overflow-hidden">
        <ComplianceDecor />
        <p className="text-sm font-bold text-white mb-1.5 relative z-10">Compliance Check</p>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-4 relative z-10">
          All current drafts adhere to FBR sandbox schema. Verify before finalizing.
        </p>
        <Link to="/dashboard/verification" className="relative z-10 inline-block border border-slate-500 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10 transition-colors">
          Review &amp; Verify
        </Link>
      </div>

    </div>
  )
}

export default DraftBottomCards
