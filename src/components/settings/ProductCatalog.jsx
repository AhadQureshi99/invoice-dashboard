import { useEffect, useMemo, useRef, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCube, HiOutlineUpload } from 'react-icons/hi'
import { listSellers } from '../../services/sellers'
import { listProducts, createProduct, updateProduct, deleteProduct, bulkCreateProducts, clearProductCache } from '../../services/products'
import { parseCSV } from '../../lib/export'

const inputClass = `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white
  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0e5f4f]/20 focus:border-[#0e5f4f] transition-colors`

const blankForm = () => ({ description: '', hs_code: '', uom: '', unit_price: '' })

/**
 * Per-company product catalog. Pick a company, then add products (manually or
 * via CSV upload). These feed the searchable product picker on the draft form,
 * scoped to whichever company is selected there.
 */
const ProductCatalog = () => {
  const [sellers, setSellers]   = useState([])
  const [sellerId, setSellerId] = useState('')
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState(blankForm())
  const [editId, setEditId]     = useState(null)
  const [open, setOpen]         = useState(false)
  const [busy, setBusy]         = useState(false)
  const [msg, setMsg]           = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    listSellers().then(list => {
      setSellers(list)
      const def = list.find(s => s.is_default) || list[0]
      if (def) setSellerId(def.id)
    }).catch(e => setMsg({ kind: 'err', text: e.message }))
  }, [])

  const load = () => {
    if (!sellerId) return
    setLoading(true)
    listProducts(sellerId)
      .then(setRows)
      .catch(e => setMsg({ kind: 'err', text: e.message.includes('products') ? 'Product table not set up yet — run the products migration.' : e.message }))
      .finally(() => setLoading(false))
  }
  useEffect(load, [sellerId])

  const seller = useMemo(() => sellers.find(s => s.id === sellerId) || null, [sellers, sellerId])
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const startAdd  = () => { setForm(blankForm()); setEditId(null); setOpen(true); setMsg(null) }
  const startEdit = (p) => { setForm({ description: p.description, hs_code: p.hs_code || '', uom: p.uom || '', unit_price: p.unit_price ?? '' }); setEditId(p.id); setOpen(true); setMsg(null) }

  const save = async () => {
    if (!form.description.trim()) return setMsg({ kind: 'err', text: 'Product name is required.' })
    if (!sellerId)                return setMsg({ kind: 'err', text: 'Select a company first.' })
    setBusy(true); setMsg(null)
    try {
      const payload = {
        seller_id:   sellerId,
        description: form.description.trim(),
        hs_code:     form.hs_code.trim(),
        uom:         form.uom.trim(),
        unit_price:  Number(form.unit_price) || 0,
      }
      if (editId) await updateProduct(editId, payload)
      else        await createProduct(payload)
      clearProductCache()
      setOpen(false); setForm(blankForm()); setEditId(null)
      setMsg({ kind: 'ok', text: editId ? 'Product updated.' : 'Product added.' })
      load()
    } catch (e) { setMsg({ kind: 'err', text: e.message }) }
    finally { setBusy(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await deleteProduct(id); clearProductCache(); load() } catch (e) { setMsg({ kind: 'err', text: e.message }) }
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file || !sellerId) return
    setBusy(true); setMsg(null)
    try {
      const text = await file.text()
      const { records } = parseCSV(text)
      // Accept common header spellings: description/product/name, hs_code/hs, uom/unit, unit_price/price.
      const pick = (r, ...keys) => { for (const k of Object.keys(r)) { if (keys.includes(k.toLowerCase().replace(/\s+/g, '_'))) return r[k] } return '' }
      const mapped = records.map(r => ({
        description: pick(r, 'description', 'product', 'name', 'item'),
        hs_code:     pick(r, 'hs_code', 'hs', 'hscode'),
        uom:         pick(r, 'uom', 'unit', 'unit_of_measure'),
        unit_price:  pick(r, 'unit_price', 'price', 'rate'),
      }))
      const created = await bulkCreateProducts(sellerId, mapped)
      clearProductCache()
      setMsg({ kind: 'ok', text: `Imported ${created.length} product${created.length === 1 ? '' : 's'} from CSV.` })
      load()
    } catch (err) { setMsg({ kind: 'err', text: `CSV import failed: ${err.message}` }) }
    finally { setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HiOutlineCube className="w-5 h-5 text-[#0e5f4f]" />
          <div>
            <p className="text-sm font-bold text-[#0e5f4f]">Product Catalog</p>
            <p className="text-[11px] text-gray-400">Products for each company. These appear as suggestions when creating a draft for that company.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sellers.length > 0 && (
            <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 bg-white max-w-[220px]">
              {sellers.map(s => <option key={s.id} value={s.id}>{s.company_name}{s.is_default ? ' (default)' : ''}</option>)}
            </select>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={!sellerId || busy} className="flex items-center gap-1.5 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
            <HiOutlineUpload className="w-4 h-4" /> Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
          <button onClick={startAdd} disabled={!sellerId} className="flex items-center gap-1.5 bg-[#0e5f4f] hover:bg-[#083f33] text-white rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-60">
            <HiOutlinePlus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {sellers.length === 0 && (
        <a href="/dashboard/settings" className="block border border-dashed border-amber-300 bg-amber-50 rounded-lg px-3.5 py-2.5 text-xs text-amber-700">
          Add a company first (in My Companies above) — products are linked to a company.
        </a>
      )}

      {msg && (
        <div className={`text-xs font-medium rounded-lg px-3 py-2 border ${msg.kind === 'ok' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-700 bg-red-50 border-red-100'}`}>
          {msg.text}
        </div>
      )}

      {open && (
        <div className="rounded-xl border border-gray-200 p-4 bg-[#fafbfc] flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-700">{editId ? 'Edit Product' : 'New Product'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Product Name / Description</label>
              <input value={form.description} onChange={set('description')} placeholder="e.g. Sugar Test Strip" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">HS Code</label>
              <input value={form.hs_code} onChange={set('hs_code')} placeholder="e.g. 9018.9090" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Unit Price</label>
              <input type="number" min="0" value={form.unit_price} onChange={set('unit_price')} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">UoM (optional)</label>
              <input value={form.uom} onChange={set('uom')} placeholder="e.g. Numbers, pieces, units" className={inputClass} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => { setOpen(false); setEditId(null) }} className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={save} disabled={busy} className="bg-[#0e5f4f] text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-[#083f33] disabled:opacity-60">{busy ? 'Saving…' : 'Save Product'}</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-gray-400 py-4 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-xs text-gray-400 py-6 text-center">No products for this company yet. Add one, or upload a CSV (columns: description, hs_code, unit_price).</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left border-b border-gray-100">
                <th className="pb-2">Product</th><th className="pb-2">HS Code</th><th className="pb-2 text-right">Unit Price</th><th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(p => (
                <tr key={p.id} className="text-sm text-gray-600">
                  <td className="py-2.5 font-medium text-gray-800">{p.description}</td>
                  <td className="py-2.5 text-[#0e5f4f] font-mono text-xs">{p.hs_code || '—'}</td>
                  <td className="py-2.5 text-right">{Number(p.unit_price || 0).toLocaleString()}</td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(p)} className="p-1 text-gray-400 hover:text-[#0e5f4f]" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
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

export default ProductCatalog
