import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const fmt = (iso) => iso ? new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const buildSteps = ({ inv, verification, voidAction }) => {
  const steps = []
  if (inv) {
    steps.push({ label: 'Invoice Created', date: fmt(inv.created_at), note: `Status: ${inv.status}`, done: true, active: !verification && inv.status === 'draft' })
  }
  if (verification) {
    steps.push({
      label: verification.status === 'verified' ? 'FBR Verification Success' : 'FBR Verification Failed',
      date:  fmt(verification.created_at),
      note:  verification.fbr_message || `${verification.status} (${(verification.response_time_ms || 0) / 1000}s)`,
      done:  true,
      active: !voidAction && inv.status === 'verified',
    })
  }
  if (inv?.status === 'pending') steps.push({ label: 'Pending Audit Approval', date: fmt(inv.updated_at), note: 'Awaiting internal approval', done: false, active: true })
  if (inv?.status === 'verified' && !voidAction) steps.push({ label: 'Cleared', date: fmt(inv.updated_at), note: 'Ready for export', done: false, active: false })
  if (voidAction) steps.push({ label: 'Void Requested', date: fmt(voidAction.created_at), note: voidAction.subject || 'Manual void', done: true, active: true })
  return steps
}

const LifecycleCard = () => {
  const { id } = useParams()
  const [inv, setInv]         = useState(null)
  const [verif, setVerif]     = useState(null)
  const [voidAction, setVoid] = useState(null)

  useEffect(() => {
    if (!id) return
    (async () => {
      const { data: invoice } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle()
      setInv(invoice)
      if (invoice?.invoice_number) {
        const { data: v } = await supabase
          .from('verifications')
          .select('*')
          .eq('invoice_number', invoice.invoice_number)
          .order('created_at', { ascending: false })
          .limit(1)
        setVerif(v?.[0] || null)
        const { data: va } = await supabase
          .from('activity_log')
          .select('*')
          .eq('subject', invoice.invoice_number)
          .eq('action', 'Invoice Voided')
          .order('created_at', { ascending: false })
          .limit(1)
        setVoid(va?.[0] || null)
      }
    })()
  }, [id])

  const steps = buildSteps({ inv, verification: verif, voidAction })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-xs font-black text-[#1e3a5f] tracking-widest uppercase mb-6">Invoice Lifecycle</p>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="relative flex items-start gap-0 min-w-[480px]">
          {steps.length === 0 && <p className="text-xs text-gray-400">No lifecycle events yet.</p>}
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-start relative">
              {i < steps.length - 1 && (
                <div className={`absolute top-[9px] left-1/2 w-full h-0.5 z-0 ${step.done ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} style={{ left: '50%' }} />
              )}
              <div className="relative z-10 mb-3">
                {step.done ? (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.active ? 'bg-[#1e3a5f]' : 'bg-green-500'}`}>
                    {step.active
                      ? <span className="w-2 h-2 rounded-full bg-white" />
                      : <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/></svg>}
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                )}
              </div>
              <p className="text-[11px] font-bold text-gray-700 pr-3 leading-tight">{step.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 pr-2">{step.date}</p>
              <p className="text-[10px] text-gray-400 mt-1 pr-2 leading-relaxed line-clamp-3">{step.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LifecycleCard
