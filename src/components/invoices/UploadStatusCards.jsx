import { HiOutlineRefresh } from 'react-icons/hi'

/* Green check circle */
const CheckIcon = () => (
  <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 11l5 5 7-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

/* Blue duplicate / document icon */
const DuplicateIcon = () => (
  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="6" width="12" height="14" rx="2" fill="#93C5FD"/>
      <rect x="7" y="2" width="12" height="14" rx="2" fill="#3B82F6"/>
      <path d="M10 8h6M10 11h6M10 14h3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  </div>
)

/* Red info circle */
const InfoIcon = () => (
  <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 7v5M11 15h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  </div>
)

const UploadStatusCards = () => (
  <div className="flex flex-col gap-3 flex-1 min-w-0">

    {/* Successful */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CheckIcon />
        <span className="text-sm font-semibold text-gray-700">Successful</span>
      </div>
      <span className="text-3xl font-bold text-gray-900">429</span>
    </div>

    {/* Skipped Duplicate */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <DuplicateIcon />
        <span className="text-sm font-semibold text-gray-700">Skipped (Duplicate)</span>
      </div>
      <span className="text-3xl font-bold text-gray-900">12</span>
    </div>

    {/* Validation Failed */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <InfoIcon />
        <span className="text-sm font-semibold text-gray-700">Validation Failed</span>
      </div>
      <span className="text-3xl font-bold text-gray-900">10</span>
    </div>

    {/* Re-upload button */}
    <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-sm font-semibold
                       flex items-center justify-center gap-2 transition-colors">
      <HiOutlineRefresh className="w-4 h-4" />
      RE-UPLOAD FAILED
    </button>
  </div>
)

export default UploadStatusCards
