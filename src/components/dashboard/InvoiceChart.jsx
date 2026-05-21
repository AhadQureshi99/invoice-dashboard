import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineTable } from 'react-icons/hi'
import { monthlyTotals } from '../../services/invoices'
import { downloadCSV } from '../../lib/export'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function smoothLine(points) {
  if (points.length === 0) return ''
  const d = [`M${points[0][0]},${points[0][1]}`]
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const cx = (x0 + x1) / 2
    d.push(`C${cx},${y0} ${cx},${y1} ${x1},${y1}`)
  }
  return d.join(' ')
}

const InvoiceChart = () => {
  const navigate = useNavigate()
  const [totals, setTotals] = useState(Array(12).fill(0))

  useEffect(() => { monthlyTotals().then(setTotals).catch(() => {}) }, [])

  const { linePath, areaPath, max, pts } = useMemo(() => {
    const max = Math.max(1, ...totals)
    const xs = [55, 95, 135, 175, 215, 255, 295, 335, 375, 415, 455, 495]
    const yTop = 18, yBot = 168
    const pts = totals.map((v, i) => [xs[i], yBot - (v / max) * (yBot - yTop)])
    const linePath = smoothLine(pts)
    const areaPath = pts.length ? `${linePath} L495,168 L55,168 Z` : ''
    return { linePath, areaPath, max, pts }
  }, [totals])

  const fmtCurrency = (v) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0)
  const yGrid = [
    { y: 18,  label: `PKR ${fmtCurrency(max)}` },
    { y: 78,  label: `PKR ${fmtCurrency(max * 0.6)}` },
    { y: 148, label: `PKR ${fmtCurrency(max * 0.13)}` },
    { y: 168, label: 'PKR 0' },
  ]

  const exportCSV = () => {
    const rows = months.map((m, i) => ({ month: m, total_pkr: totals[i] }))
    downloadCSV(rows, ['month','total_pkr'], `monthly-totals-${new Date().getFullYear()}.csv`)
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <div>
          <p className="text-sm font-bold text-[#1e3a5f]">Monthly Invoice Trend</p>
          <p className="text-xs text-gray-400 mt-0.5">Processing volume for {new Date().getFullYear()}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={exportCSV} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            <HiOutlineTable className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button onClick={() => navigate('/dashboard/reports')} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            Full Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-1">
        <svg viewBox="0 0 530 195" className="w-full min-w-[320px]" style={{ height: 220 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.22" />
              <stop offset="80%"  stopColor="#6366f1" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"    />
            </linearGradient>
          </defs>

          {yGrid.map(({ y, label }) => (
            <g key={label}>
              <line x1="55" y1={y} x2="495" y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={y === 168 ? '0' : '4 3'} />
              <text x="50" y={y + 4} textAnchor="end" style={{ fontSize: 10, fill: '#9ca3af' }}>{label}</text>
            </g>
          ))}

          {pts.map(([x], i) => (
            <text key={months[i]} x={x} y={185} textAnchor="middle" style={{ fontSize: 10, fill: '#9ca3af' }}>{months[i]}</text>
          ))}

          {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
          {linePath && <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
    </div>
  )
}

export default InvoiceChart
