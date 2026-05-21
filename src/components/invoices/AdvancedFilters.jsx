import { useState } from 'react'
import { HiOutlineRefresh } from 'react-icons/hi'

const empty = { status: '', range: '30', type: '', min: '', max: '' }

const AdvancedFilters = ({ onApply }) => {
  const [f, setF] = useState(empty)
  const set = (k) => (e) => setF(prev => ({ ...prev, [k]: e.target.value }))

  const apply = () => onApply?.(f)
  const reset = () => { setF(empty); onApply?.(empty) }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
      <p className="text-sm font-bold text-[#1e3a5f] mb-4">Advanced Filters</p>

      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Status</label>
          <select value={f.status} onChange={set('status')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white cursor-pointer min-w-[130px]">
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="draft">Draft</option>
            <option value="invalid">Invalid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Date Range</label>
          <select value={f.range} onChange={set('range')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white cursor-pointer min-w-[130px]">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last 365 Days</option>
            <option value="">All Time</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Type</label>
          <select value={f.type} onChange={set('type')} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white cursor-pointer min-w-[120px]">
            <option value="">All Types</option>
            <option value="Sale Invoice">Sale Invoice</option>
            <option value="Debit Note">Debit Note</option>
            <option value="Credit Note">Credit Note</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Amount Range</label>
          <div className="flex items-center gap-2">
            <input type="number" value={f.min} onChange={set('min')} placeholder="Min" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 w-24 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
            <input type="number" value={f.max} onChange={set('max')} placeholder="Max" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 w-24 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={apply} className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors">
            Apply Filters
          </button>
          <button onClick={reset} title="Reset" className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters
