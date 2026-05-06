import { useState } from 'react'
import { HiOutlineDownload } from 'react-icons/hi'

const BulkExportCard = () => {
  const [format, setFormat] = useState('zip')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <p className="text-sm font-bold text-[#1e3a5f]">Bulk Invoice Export</p>

      {/* Date Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date Range</label>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white">
          <option>Current Quarter (Q3 2023)</option>
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
          <option>Custom Range</option>
        </select>
      </div>

      {/* Format Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Format Type</label>
        <div className="grid grid-cols-2 gap-3">
          {/* ZIP */}
          <button
            onClick={() => setFormat('zip')}
            className={`flex items-center gap-2.5 border rounded-xl p-3 transition-colors ${
              format === 'zip' ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">ZIP</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">ZIP (PDFs)</span>
          </button>

          {/* CSV */}
          <button
            onClick={() => setFormat('csv')}
            className={`flex items-center gap-2.5 border rounded-xl p-3 transition-colors ${
              format === 'csv' ? 'border-[#1e3a5f] bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">CSV</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">CSV/Excel</span>
          </button>
        </div>
      </div>

      {/* Initialize button */}
      <button className="w-full bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl py-3 text-sm font-semibold
                         flex items-center justify-center gap-2 transition-colors mt-auto">
        <HiOutlineDownload className="w-4 h-4" />
        Initialize Bulk Download
      </button>
      <p className="text-[11px] text-gray-400 text-center -mt-2">Estimated file size: 142.5 MB</p>
    </div>
  )
}

export default BulkExportCard
