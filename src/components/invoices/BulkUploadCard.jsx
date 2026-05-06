import { HiOutlineCloudUpload } from 'react-icons/hi'

const BulkUploadCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-[1.4] min-w-0">

    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-sm font-bold text-[#1e3a5f]">Bulk Invoice Processing</p>
        <p className="text-xs text-gray-400 mt-0.5">Drag and drop your XML or CSV ledger files here</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Current Status</p>
        <p className="text-xs font-bold text-green-500 mt-0.5">Processing 450/500</p>
      </div>
    </div>

    {/* Progress bar */}
    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
      <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
    </div>

    {/* Drop zone */}
    <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center
                    justify-center py-12 cursor-pointer hover:border-[#1e3a5f]/40 transition-colors bg-[#fafbfc]">
      <HiOutlineCloudUpload className="w-9 h-9 text-gray-300 mb-3" />
      <p className="text-sm font-semibold text-gray-700">Click to upload or drag and drop</p>
      <p className="text-xs text-gray-400 mt-1">Maximum file size 50MB (FBR Schema v2.1 Supported)</p>
    </div>
  </div>
)

export default BulkUploadCard
