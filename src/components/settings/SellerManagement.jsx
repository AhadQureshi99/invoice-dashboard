import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineStar, HiOutlineOfficeBuilding } from 'react-icons/hi'
import { listSellers, createSeller, updateSeller, deleteSeller, setDefaultSeller } from '../../services/sellers'

const inputClass = `w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white
  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

// New companies default to sandbox: FBR issues a sandbox token first and only
// releases the production token after the sandbox test cases pass.
const blankForm = () => ({ company_name: '', ntn: '', fbr_token: '', fbr_mode: 'sandbox', province: '', address: '' })
const maskToken = (t) => (t && t.length > 8 ? `${t.slice(0, 4)}…${t.slice(-4)}` : '••••')
const ntnOk = (v) => { const d = String(v || '').replace(/\D/g, ''); return d.length === 7 || d.length === 13 }

const SellerManagement = () => {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(blankForm())
  const [editId, setEditId]   = useState(null)
  const [open, setOpen]       = useState(false)
  const [busy, setBusy]       = useState(false)
  const [msg, setMsg]         = useState(null)

  const load = () => {
    setLoading(true)
    listSellers().then(setRows).catch(e => setMsg({ kind: 'err', text: e.message })).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const startAdd  = () => { setForm(blankForm()); setEditId(null); setOpen(true); setMsg(null) }
  const startEdit = (s) => { setForm({ company_name: s.company_name, ntn: s.ntn, fbr_token: s.fbr_token, fbr_mode: s.fbr_mode || 'production', province: s.province || '', address: s.address || '' }); setEditId(s.id); setOpen(true); setMsg(null) }
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setMsg(null)
    if (!form.company_name.trim()) return setMsg({ kind: 'err', text: 'Company name is required.' })
    if (!ntnOk(form.ntn))          return setMsg({ kind: 'err', text: 'NTN/CNIC must be 7 digits (NTN) or 13 digits (CNIC).' })
    if (!form.fbr_token.trim())    return setMsg({ kind: 'err', text: 'FBR token is required — get it from your FBR IRIS account.' })
    setBusy(true)
    try {
      const payload = { ...form, ntn: form.ntn.replace(/\D/g, '') }
      if (editId) await updateSeller(editId, payload)
      else        await createSeller(payload)
      setOpen(false); setForm(blankForm()); setEditId(null)
      setMsg({ kind: 'ok', text: editId ? 'Company updated.' : 'Company added.' })
      load()
    } catch (e) { setMsg({ kind: 'err', text: e.message }) }
    finally { setBusy(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this company and its FBR token?')) return
    try { await deleteSeller(id); load() } catch (e) { setMsg({ kind: 'err', text: e.message }) }
  }
  const makeDefault = async (id) => { try { await setDefaultSeller(id); load() } catch (e) { setMsg({ kind: 'err', text: e.message }) } }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineOfficeBuilding className="w-5 h-5 text-[#0e5f4f]" />
          <div>
            <p className="text-sm font-bold text-[#0e5f4f]">My Companies (Sellers)</p>
            <p className="text-[11px] text-gray-400">Each company files with its own FBR token. Get the token from that company's FBR IRIS account.</p>
          </div>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {msg && (
        <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${msg.kind === 'ok' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-700 bg-red-50 border-red-100'}`}>
          {msg.text}
        </div>
      )}

      {open && (
        <div className="rounded-xl border border-gray-200 p-4 bg-[#fafbfc] flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-700">{editId ? 'Edit Company' : 'New Company'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Company Name</label>
              <input value={form.company_name} onChange={set('company_name')} placeholder="ABC Traders (Pvt) Ltd" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Seller NTN / CNIC</label>
              <input value={form.ntn} onChange={set('ntn')} placeholder="7-digit NTN or 13-digit CNIC" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">FBR Token <span className="text-gray-400 font-normal">(from FBR IRIS → Digital Invoicing)</span></label>
              <input value={form.fbr_token} onChange={set('fbr_token')} placeholder="e.g. d9defe7b-a7af-355f-9b8c-95b4e0d487d9" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">FBR Mode</label>
              <select value={form.fbr_mode} onChange={set('fbr_mode')} className={inputClass}>
                <option value="sandbox">Sandbox (testing — default)</option>
                <option value="production">Production (live filing)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Province</label>
              <input value={form.province} onChange={set('province')} placeholder="Sindh" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Address</label>
              <input value={form.address} onChange={set('address')} placeholder="Business address" className={inputClass} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => { setOpen(false); setEditId(null) }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={save} disabled={busy} className="bg-[#0e5f4f] text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#083f33] disabled:opacity-60">{busy ? 'Saving…' : 'Save Company'}</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-gray-400 py-4 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-gray-400 py-6 text-center">No companies yet. Add one with its FBR token to start filing invoices.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left border-b border-gray-100">
                <th className="pb-2">Company</th><th className="pb-2">NTN/CNIC</th><th className="pb-2">Token</th><th className="pb-2">Mode</th><th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(s => (
                <tr key={s.id} className="text-sm text-gray-600">
                  <td className="py-3 font-medium text-gray-800 flex items-center gap-1.5">
                    {s.is_default && <HiOutlineStar className="w-4 h-4 text-amber-400" title="Default company" />}
                    {s.company_name}
                  </td>
                  <td className="py-3">{s.ntn}</td>
                  <td className="py-3 font-mono text-xs text-gray-400">{maskToken(s.fbr_token)}</td>
                  <td className="py-3"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.fbr_mode === 'production' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{s.fbr_mode}</span></td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      {!s.is_default && <button onClick={() => makeDefault(s.id)} className="p-1 text-gray-400 hover:text-amber-500" title="Set as default"><HiOutlineStar className="w-4 h-4" /></button>}
                      <button onClick={() => startEdit(s)} className="p-1 text-gray-400 hover:text-[#0e5f4f]" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(s.id)} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SellerManagement
