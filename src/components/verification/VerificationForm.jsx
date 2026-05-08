import { useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'

const VerificationForm = () => {
  const [tab, setTab] = useState('single')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-[1.75] min-w-0 flex flex-col">

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-6">
        {[
          { key: 'single', label: 'Single Verification' },
          { key: 'bulk',   label: 'Bulk Verification'   },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-sm font-semibold transition-colors ${
              tab === key
                ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'single' ? (
        <div className="flex flex-col gap-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice Number</label>
              <input
                type="text"
                placeholder="e.g INV-2024-00"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                           placeholder:text-gray-300 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date of Insurance</label>
              <input
                type="text"
                placeholder="mm/dd/yy"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                           placeholder:text-gray-300 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seller NTN</label>
              <input
                type="text"
                placeholder="xxxxxxxxx-x"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                           placeholder:text-gray-300 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer NTN</label>
              <input
                type="text"
                placeholder="xxxxxxxxx-x"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
                           placeholder:text-gray-300 text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
              />
            </div>
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <HiInformationCircle className="w-4 h-4 flex-shrink-0 text-gray-400" />
              Data is cross referenced with FRAL central Database
            </div>
            <div className="flex items-center gap-3">
              <button className="border border-gray-300 rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-700
                                 hover:bg-gray-50 transition-colors">
                Clear Form
              </button>
              <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-7 py-2.5 text-sm font-semibold
                                 transition-colors">
                Verify Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <p className="text-sm">Drag &amp; drop your Excel or CSV file here</p>
          <p className="text-xs mt-1">Supports up to 500 records</p>
        </div>
      )}
    </div>
  )
}

export default VerificationForm
