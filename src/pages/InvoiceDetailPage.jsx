import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import AuthCard        from '../components/invoicedetail/AuthCard'
import LifecycleCard   from '../components/invoicedetail/LifecycleCard'
import VoidBanner      from '../components/invoicedetail/VoidBanner'
import InvoiceInfoCard from '../components/invoicedetail/InvoiceInfoCard'
import PageTopBar      from '../components/common/PageTopBar'
import VerifyButton    from '../components/common/VerifyButton'
import { HiOutlineDocumentText, HiOutlineDocumentDownload, HiOutlineDocumentDuplicate, HiOutlineTrash } from 'react-icons/hi'
import { getInvoice, createInvoice, updateInvoice, deleteInvoice } from '../services/invoices'
import { logActivity } from '../services/activity'
import { downloadCSV } from '../lib/export'

const InvoiceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inv, setInv] = useState(null)
  const [verifyMsg, setVerifyMsg] = useState(null)

  useEffect(() => {
    if (!id) return
    getInvoice(id).then(setInv).catch(() => {})
  }, [id])

  const handleVerified = async (result) => {
    if (result.error) {
      setVerifyMsg({ kind: 'invalid', text: result.error })
      return
    }
    const rec = result.record || {}
    try {
      await updateInvoice(id, {
        status:          result.status,
        fbr_status_code: rec.fbr_status_code || null,
        fbr_message:     rec.fbr_message || null,
        fbr_invoice_no:  rec.fbr_invoice_no || null,
      })
    } catch (_) { /* status persist is best-effort */ }
    const fresh = await getInvoice(id).catch(() => null)
    if (fresh) setInv(fresh)
    setVerifyMsg({
      kind: result.status,
      text: result.status === 'verified'
        ? `Verified by FBR in ${(result.durationMs / 1000).toFixed(1)}s`
        : (result.response?.validationResponse?.error || rec.fbr_message || 'FBR rejected the invoice'),
    })
  }

  const exportExcel = () => {
    if (!inv) return
    const items = inv.items || []
    downloadCSV(
      items.length ? items.map(it => ({
        invoice_number: inv.invoice_number,
        description: it.description, quantity: it.quantity, value_excl_st: it.value_excl_st,
        sales_tax: it.sales_tax, total: it.total,
      })) : [{ invoice_number: inv.invoice_number, total_amount: inv.total_amount }],
      items.length
        ? ['invoice_number','description','quantity','value_excl_st','sales_tax','total']
        : ['invoice_number','total_amount'],
      `${inv.invoice_number}.csv`
    )
  }

  const remove = async () => {
    if (!inv) return
    if (!confirm(`Delete invoice ${inv.invoice_number}? This cannot be undone.`)) return
    await deleteInvoice(inv.id)
    await logActivity({ action: 'Invoice Deleted', subject: inv.invoice_number, status: 'Deleted', type: 'deleted' })
    navigate('/dashboard/invoices')
  }

  const duplicate = async () => {
    if (!inv) return
    const items = (inv.items || []).map(({ id: _ignored, invoice_id, created_at, ...rest }) => rest)
    const { id: _drop, created_at, updated_at, items: _i, ...rest } = inv
    const next = await createInvoice({
      ...rest,
      items,
      invoice_number: `${inv.invoice_number}-COPY`,
      status: 'draft',
    })
    navigate(`/dashboard/invoices/${next.id}`)
  }

  return (
    <DashboardLayout>
        <PageTopBar title={`Invoices: ${inv?.invoice_number || '...'}`} />

        <main className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-5">

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full ${
                    inv?.status === 'verified' ? 'bg-green-500' :
                    inv?.status === 'invalid'  ? 'bg-red-500' :
                    inv?.status === 'void'     ? 'bg-gray-500' :
                                                 'bg-orange-400'
                  }`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5"/>
                    </svg>
                    {inv?.status || '—'}
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 pl-1">Last updated: {inv?.updated_at ? new Date(inv.updated_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
              </div>
              <div className="no-print flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineDocumentText className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button onClick={exportExcel} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineDocumentDownload className="w-3.5 h-3.5" />
                  CSV
                </button>
                <button onClick={duplicate} className="flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <HiOutlineDocumentDuplicate className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                {inv && <VerifyButton invoice={inv} onVerified={handleVerified} />}
                <button onClick={remove} className="flex items-center gap-1.5 border border-red-200 bg-white rounded-xl px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors shadow-sm">
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {verifyMsg && (
              <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${
                verifyMsg.kind === 'verified' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-700 bg-red-50 border-red-100'
              }`}>
                {verifyMsg.text}
              </div>
            )}

            {/* Verification/audit info (FBR status, lifecycle, void) is
                operational UI, not part of the legal invoice document — kept
                off the printed PDF so the invoice + total always land on one
                printed page. Lifecycle now sits directly under the FBR status
                card instead of as a separate wide block. */}
            <div className="no-print flex flex-col lg:flex-row gap-5 items-start">
              <div className="w-full lg:w-64 lg:flex-shrink-0 flex flex-col gap-4">
                <AuthCard />
                <LifecycleCard />
              </div>
              <div className="flex-1">
                <VoidBanner />
              </div>
            </div>

            <InvoiceInfoCard />

            <p className="text-[11px] text-gray-400 pb-2">
              © 2026{' '}
              <a href="/" className="text-[#0e5f4f] hover:underline">Name</a>
              {' '}All rights reserved.
            </p>

          </div>
        </main>
    </DashboardLayout>
  )
}

export default InvoiceDetailPage