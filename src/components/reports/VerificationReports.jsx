import { useEffect, useState } from 'react'
import { HiOutlineDownload, HiOutlineRefresh } from 'react-icons/hi'
import { listReports, createReport, updateReport, deleteReport } from '../../services/reports'
import { listVerifications } from '../../services/verifications'
import { downloadCSV } from '../../lib/export'

const GreenCheck = () => (
  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)
const ProcessingIcon = () => (
  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="10 8"/>
    </svg>
  </div>
)

const ago = (iso) => {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 3600) return `Updated ${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `Updated ${Math.floor(diff / 3600)}h ago`
  return `Updated ${Math.floor(diff / 86400)}d ago`
}

const VerificationReports = ({ refreshKey = 0, onChange }) => {
  const [rows, setRows] = useState([])
  const load = () => listReports({ limit: 6 }).then(({ rows }) => setRows(rows.filter(r => r.kind !== 'bulk-export')))
  useEffect(load, [refreshKey])

  const generate = async (kind, name) => {
    const placeholder = await createReport({ kind, name, status: 'processing', progress: 30 })
    const { rows } = await listVerifications({ limit: 500 })
    downloadCSV(rows, ['created_at','invoice_number','seller_ntn','buyer_ntn','amount','status'], `${name}.csv`)
    await updateReport(placeholder.id, { status: 'ready', progress: 100, size_bytes: JSON.stringify(rows).length })
    load(); onChange?.()
  }

  const presets = [
    { name: 'Audit Compliance 2026', kind: 'audit' },
    { name: 'Tax Liability Summary', kind: 'tax-liability' },
    { name: 'Annual Reconciliation', kind: 'reconciliation' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#1e3a5f]">Verification Reports</p>
        <button onClick={load} className="p-1 text-gray-400 hover:text-[#1e3a5f]"><HiOutlineRefresh className="w-4 h-4" /></button>
      </div>

      <div className="flex flex-col gap-1">
        {rows.length === 0 && presets.map(p => (
          <div key={p.kind} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <ProcessingIcon />
              <div>
                <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Click to generate</p>
              </div>
            </div>
            <button onClick={() => generate(p.kind, p.name)} className="text-gray-400 hover:text-[#1e3a5f] transition-colors p-1">
              <HiOutlineDownload className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              {r.status === 'ready' ? <GreenCheck /> : <ProcessingIcon />}
              <div>
                <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.status === 'ready' ? ago(r.updated_at) : `Processing… (${r.progress}%)`}</p>
              </div>
            </div>
            <button
              onClick={() => generate(r.kind, r.name)}
              className="text-gray-400 hover:text-[#1e3a5f] transition-colors p-1"
              title="Regenerate"
            >
              {r.status === 'ready' ? <HiOutlineDownload className="w-4 h-4" /> : <HiOutlineRefresh className="w-4 h-4" />}
            </button>
            <button onClick={() => deleteReport(r.id).then(load)} className="text-gray-300 hover:text-red-500 transition-colors p-1 ml-1">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VerificationReports
