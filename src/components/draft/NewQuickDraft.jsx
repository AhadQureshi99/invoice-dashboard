import { HiOutlineEye } from 'react-icons/hi'

const inputClass = `w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm
  placeholder:text-gray-300 text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors`

const NewQuickDraft = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-[#1e3a5f]">New Quick Draft</p>
      <span className="text-[10px] text-gray-400 font-medium">ID: DFT-2023-0800</span>
    </div>

    {/* Invoice Date */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Invoice Date</label>
      <input type="text" defaultValue="10/27/2023" className={inputClass} />
    </div>

    {/* Seller / Buyer NTN */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Seller NTN</label>
        <input type="text" defaultValue="23444-8023" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Buyer NTN</label>
        <input type="text" defaultValue="8765432-1" className={inputClass} />
      </div>
    </div>

    {/* Description */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
      <textarea
        rows={2}
        placeholder="Item details..."
        className={`${inputClass} resize-none`}
      />
    </div>

    {/* QTY / Unit Price */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">QTY</label>
        <input type="text" defaultValue="1" className={inputClass} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Unit Price (PKR)</label>
        <input type="text" defaultValue="5,000" className={inputClass} />
      </div>
    </div>

    {/* Totals */}
    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Subtotal</span>
        <span className="text-xs font-medium text-gray-700">PKR 5,000.00</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          GST (18%)
          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] flex items-center justify-center text-gray-400 cursor-help">i</span>
        </span>
        <span className="text-xs font-semibold text-green-500">+ PKR 900.00</span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-800">Total Payable</span>
        <span className="text-sm font-bold text-[#1e3a5f]">PKR 5,900.00</span>
      </div>
    </div>

    {/* Actions */}
    <div className="grid grid-cols-2 gap-3 pt-1">
      <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        <HiOutlineEye className="w-4 h-4" />
        Preview
      </button>
      <button className="bg-[#1e3a5f] hover:bg-[#0f2040] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
        Save Draft
      </button>
    </div>
  </div>
)

export default NewQuickDraft
