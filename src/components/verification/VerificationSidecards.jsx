import { HiOutlineDownload } from 'react-icons/hi'

/* File icon */
const FileIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#EEF2FF" />
    <path d="M11 10a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H13a2 2 0 01-2-2V10z"
          fill="#1e3a5f" />
    <path d="M21 8l6 6h-4a2 2 0 01-2-2V8z" fill="#93a8c4" />
    <rect x="14" y="19" width="8" height="1.5" rx="0.75" fill="white" opacity="0.7" />
    <rect x="14" y="22" width="5" height="1.5" rx="0.75" fill="white" opacity="0.7" />
  </svg>
)

/* API icon */
const ApiIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#EEF2FF" />
    <circle cx="18" cy="18" r="7" stroke="#1e3a5f" strokeWidth="2" fill="none" />
    <path d="M14 18h8M18 14v8" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="18" r="2" fill="#1e3a5f" />
  </svg>
)

const VerificationSidecards = () => (
  <div className="flex flex-col gap-4 flex-1 min-w-0">

    {/* Bulk Upload */}
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center justify-center">
      <div className="mb-3">
        <FileIcon />
      </div>
      <p className="text-sm font-bold text-[#1e3a5f] mb-1.5">Bulk Upload</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">
        Drop your Excel or CSV here to verify up to 500 research at once.
      </p>
      <button className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold
                         text-gray-700 hover:bg-gray-50 transition-colors">
        Download Template
        <HiOutlineDownload className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Verification API */}
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center justify-center">
      <div className="mb-3">
        <ApiIcon />
      </div>
      <p className="text-sm font-bold text-[#1e3a5f] mb-1.5">Verification API</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">
        Drop your Excel or CSV here to verify up to 500 research at once.
      </p>
      <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-lg px-4 py-2 text-xs font-semibold
                         transition-colors w-full">
        API Documentation
      </button>
    </div>
  </div>
)

export default VerificationSidecards
