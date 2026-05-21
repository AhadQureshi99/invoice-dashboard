import { HiOutlineDownload } from 'react-icons/hi'
import { downloadCSV } from '../../lib/export'

const TEMPLATE_HEADERS = [
  'invoice_number','invoice_date','seller_ntn','seller_name','seller_province','seller_address',
  'buyer_ntn','buyer_name','buyer_province','buyer_address','buyer_reg_type',
  'scenario_id','hs_code','description','rate','uom','quantity','value_excl_st','sales_tax','total','sale_type',
]

const FileIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#EEF2FF" />
    <path d="M11 10a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H13a2 2 0 01-2-2V10z" fill="#0e5f4f" />
    <path d="M21 8l6 6h-4a2 2 0 01-2-2V8z" fill="#93a8c4" />
  </svg>
)

const ApiIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#EEF2FF" />
    <circle cx="18" cy="18" r="7" stroke="#0e5f4f" strokeWidth="2" fill="none" />
    <path d="M14 18h8M18 14v8" stroke="#0e5f4f" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const VerificationSidecards = ({ onBulkClick }) => {
  const downloadTemplate = () => {
    downloadCSV([{
      invoice_number: 'INV-2026-0001',
      invoice_date:   new Date().toISOString().slice(0, 10),
      seller_ntn:     '0000000000000',
      seller_name:    'Your Business',
      seller_province:'Punjab',
      seller_address: 'Lahore',
      buyer_ntn:      '0000000000000',
      buyer_name:     'Buyer Co',
      buyer_province: 'Punjab',
      buyer_address:  'Karachi',
      buyer_reg_type: 'Registered',
      scenario_id:    'SN000',
      hs_code:        '0000.0000',
      description:    'Sample item',
      rate:           '18%',
      uom:            'Numbers, pieces, units',
      quantity:       1,
      value_excl_st:  1000,
      sales_tax:      180,
      total:          1180,
      sale_type:      'Goods at standard rate (default)',
    }], TEMPLATE_HEADERS, 'fbr-bulk-template.csv')
  }

  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center justify-center">
        <div className="mb-3"><FileIcon /></div>
        <p className="text-sm font-bold text-[#0e5f4f] mb-1.5">Bulk Upload</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Use the CSV template to verify up to 500 invoices in a single batch.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button onClick={downloadTemplate} className="flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Download Template
            <HiOutlineDownload className="w-3.5 h-3.5" />
          </button>
          {onBulkClick && (
            <button onClick={onBulkClick} className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors">
              Switch to Bulk Tab
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center justify-center">
        <div className="mb-3"><ApiIcon /></div>
        <p className="text-sm font-bold text-[#0e5f4f] mb-1.5">Verification API</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          POST /di_data/v1/di/postinvoicedata_sb on https://gw.fbr.gov.pk
        </p>
        <a
          href="https://gw.fbr.gov.pk"
          target="_blank"
          rel="noreferrer"
          className="bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors w-full text-center"
        >
          API Documentation
        </a>
      </div>
    </div>
  )
}

export default VerificationSidecards
