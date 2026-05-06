const lineItems = [
  {
    description: 'Customs Clearance Services – Container 40ft',
    qty:         12,
    unitPrice:   '75,000.00',
    tax:         '163,000.00',
    total:       '1,053,000.00',
  },
  {
    description: 'Documentation & Port Handling Fees',
    qty:         1,
    unitPrice:   '160,256.41',
    tax:         '27,243.59',
    total:       '187,500.00',
  },
]

const thClass = 'text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-3'

const InvoiceInfoCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">

    {/* Invoice ID + amount */}
    <div className="flex items-start justify-between">
      <div>
        <p className="text-base font-bold text-gray-800">Invoice</p>
        <p className="text-xs text-gray-500 mt-0.5">ID: FR-LIST-05-8821</p>
        <p className="text-xs text-gray-400">INTERNAL REF: FR-DFT-01-V2</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-[#1e3a5f]">PKR 1,240,500.00</p>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Total Amount Due</p>
      </div>
    </div>

    {/* Issuer / Recipient */}
    <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-5">
      {/* Issuer */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Issuer Information</p>
        <p className="text-sm font-black text-gray-800">Global Logistics Solutions Ltd.</p>
        <p className="text-xs text-gray-500 mt-2">NTN: 7288192-4</p>
        <p className="text-xs text-gray-500">STRN: 12-00-9912-334-17</p>
        <p className="text-xs text-gray-500 mt-1">Plot 44-C, Lane 2, Ittehad Commercial, Karachi</p>
      </div>
      {/* Recipient */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Recipient Information</p>
        <p className="text-sm font-black text-gray-800">Indus Manufacturing Co.</p>
        <p className="text-xs text-gray-500 mt-2">NTN: 1122334-9</p>
        <p className="text-xs text-gray-500">STRN: 17-01-2233-445-55</p>
        <p className="text-xs text-gray-500 mt-1">Industrial Area, Hub, Balochistan</p>
      </div>
    </div>

    {/* Line items table */}
    <div className="border-t border-gray-100 pt-5 overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass}>Description</th>
            <th className={`${thClass} text-center`}>Quantity</th>
            <th className={`${thClass} text-right`}>Unit Price</th>
            <th className={`${thClass} text-right`}>Tax (17%)</th>
            <th className={`${thClass} text-right`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, i) => (
            <tr key={i} className="border-b border-gray-50">
              <td className="text-xs text-gray-700 py-3.5 pr-4 max-w-[240px]">{item.description}</td>
              <td className="text-xs text-gray-500 py-3.5 text-center">{item.qty}</td>
              <td className="text-xs text-gray-500 py-3.5 text-right">{item.unitPrice}</td>
              <td className="text-xs text-gray-500 py-3.5 text-right">{item.tax}</td>
              <td className="text-xs text-gray-700 font-semibold py-3.5 text-right">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-4 flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-12">
          <span className="text-xs text-gray-500">Subtotal</span>
          <span className="text-xs font-semibold text-gray-700 w-32 text-right">1,060,256.41</span>
        </div>
        <div className="flex items-center gap-12">
          <span className="text-xs text-gray-500">Sales Tax (STR)</span>
          <span className="text-xs font-semibold text-gray-700 w-32 text-right">180,243.59</span>
        </div>
        <div className="flex items-center gap-12 border-t border-gray-200 pt-2 mt-1">
          <span className="text-sm font-bold text-gray-800">Total Amount</span>
          <span className="text-sm font-black text-[#1e3a5f] w-32 text-right">PKR 1,240,500.00</span>
        </div>
      </div>
    </div>

  </div>
)

export default InvoiceInfoCard
