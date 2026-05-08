import { HiOutlineTable } from 'react-icons/hi'

/* ── Data ───────────────────────────────────────────────────── */
// Non-linear y-scale to match image ($8500 top, $4000 mid, $350 near-bottom)
// Chart area: x[55,495], y[18,168]
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
// SVG y positions (hand-tuned to image proportions)
const pts = [
  [55,  151], // Jan  ~$350
  [95,  143], // Feb  ~$450
  [135, 154], // Mar  ~$320
  [175, 147], // Apr  ~$400
  [215,  74], // May  ~$3900 ← spike
  [255, 144], // Jun  ~$430
  [295, 152], // Jul  ~$360
  [335, 144], // Aug  ~$440
  [375, 148], // Sep  ~$390
  [415, 151], // Oct  ~$360
  [455, 153], // Nov  ~$345
  [495, 144], // Dec  ~$430
]

/* Smooth cubic bezier through points (midpoint method) */
function smoothLine(points) {
  const d = [`M${points[0][0]},${points[0][1]}`]
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const cx = (x0 + x1) / 2
    d.push(`C${cx},${y0} ${cx},${y1} ${x1},${y1}`)
  }
  return d.join(' ')
}

const linePath = smoothLine(pts)
const areaPath = `${linePath} L495,168 L55,168 Z`

/* Y-axis grid config */
const yGrid = [
  { y: 18,  label: '$8500' },
  { y: 78,  label: '$4000' },
  { y: 148, label: '$350'  },
  { y: 168, label: '$0'    },
]

/* ── Component ──────────────────────────────────────────────── */
const InvoiceChart = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

    {/* Header */}
    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Monthly Invoice Trend</p>
        <p className="text-xs text-gray-400 mt-0.5">Processing Volume for H2 2023</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5
                           text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          <HiOutlineTable className="w-3.5 h-3.5" />
          Export CSV
        </button>
        <button className="border border-gray-200 rounded-lg px-3 py-1.5
                           text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          Full Report
        </button>
      </div>
    </div>

    {/* SVG Chart — scrollable on very small screens */}
    <div className="overflow-x-auto -mx-1">
    <svg viewBox="0 0 530 195" className="w-full min-w-[320px]" style={{ height: 220 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.22" />
          <stop offset="80%"  stopColor="#6366f1" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Y-axis gridlines + labels */}
      {yGrid.map(({ y, label }) => (
        <g key={label}>
          <line
            x1="55" y1={y} x2="495" y2={y}
            stroke="#e5e7eb" strokeWidth="1"
            strokeDasharray={y === 168 ? '0' : '4 3'}
          />
          <text
            x="50" y={y + 4}
            textAnchor="end"
            className="fill-gray-400"
            style={{ fontSize: 10, fill: '#9ca3af' }}
          >
            {label}
          </text>
        </g>
      ))}

      {/* X-axis month labels */}
      {pts.map(([x], i) => (
        <text
          key={months[i]}
          x={x} y={185}
          textAnchor="middle"
          style={{ fontSize: 10, fill: '#9ca3af' }}
        >
          {months[i]}
        </text>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Peak dot (May) */}
      <circle cx={215} cy={74} r="4" fill="#6366f1" />
      <circle cx={215} cy={74} r="7" fill="#6366f1" fillOpacity="0.18" />
    </svg>
    </div>
  </div>
)

export default InvoiceChart
