const steps = [
  {
    label: 'System Verification Success',
    date:  '20 Oct 2023, 14:32:10',
    note:  '"Invoice data matches FBR Annexure-A record. No discrepancies found."',
    done:  true,
    active: false,
  },
  {
    label: 'Internal Audit Approval',
    date:  '20 Oct 2023, 14:32:10',
    note:  'Approved by: Sarah Khan (Finance Lead)',
    done:  true,
    active: true,
  },
  {
    label: 'Draft Conversion',
    date:  '20 Oct 2023, 16:55:22',
    note:  'Converted from FR-DFT-01 to Final',
    done:  false,
    active: false,
  },
  {
    label: 'Invoice Uploaded',
    date:  '18 Oct 2023, 10:35:00',
    note:  'Origin: GRP Connector API',
    done:  false,
    active: false,
  },
]

const LifecycleCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <p className="text-xs font-black text-[#1e3a5f] tracking-widest uppercase mb-6">Invoice Lifecycle</p>

    {/* Progress rail */}
    <div className="relative flex items-start gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex-1 flex flex-col items-start relative">

          {/* Connector line behind circles */}
          {i < steps.length - 1 && (
            <div
              className={`absolute top-[9px] left-1/2 w-full h-0.5 z-0 ${step.done ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`}
              style={{ left: '50%' }}
            />
          )}

          {/* Circle */}
          <div className="relative z-10 mb-3" style={{ marginLeft: i === 0 ? 0 : undefined }}>
            {step.done ? (
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.active ? 'bg-[#1e3a5f]' : 'bg-green-500'}`}>
                {step.active
                  ? <span className="w-2 h-2 rounded-full bg-white" />
                  : <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/></svg>
                }
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
            )}
          </div>

          {/* Step info */}
          <p className="text-[11px] font-bold text-gray-700 pr-3 leading-tight">{step.label}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 pr-2">{step.date}</p>
          <p className="text-[10px] text-gray-400 mt-1 pr-2 leading-relaxed">{step.note}</p>
        </div>
      ))}
    </div>
  </div>
)

export default LifecycleCard
