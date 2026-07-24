import { supabase } from '../lib/supabase'

// Per-company product catalog (public.products). Each product is linked to a
// seller company (seller_id), so the draft's product search can be scoped to
// whichever company is selected. Products are managed in Settings → Product
// Catalog (manual add or CSV upload).

export async function listProducts(sellerId) {
  let q = supabase.from('products').select('*').order('description', { ascending: true })
  if (sellerId) q = q.eq('seller_id', sellerId)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function createProduct(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('products')
    .insert({ ...payload, user_id: user?.id })
    .select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id, patch) {
  const { data, error } = await supabase.from('products')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// Bulk insert (used by CSV upload). rows: [{description, hs_code, uom, unit_price}]
export async function bulkCreateProducts(sellerId, rows) {
  const { data: { user } } = await supabase.auth.getUser()
  const clean = (rows || [])
    .map(r => ({
      user_id:     user?.id,
      seller_id:   sellerId || null,
      description: String(r.description || '').trim(),
      hs_code:     String(r.hs_code || '').trim(),
      uom:         String(r.uom || '').trim(),
      unit_price:  Number(r.unit_price) || 0,
    }))
    .filter(r => r.description)
  if (clean.length === 0) return []
  const { data, error } = await supabase.from('products').insert(clean).select()
  if (error) throw error
  return data || []
}

// ── Suggestion cache for the draft's ProductInput ─────────────────────────
// Cached per seller so typing filters locally with no repeated network calls.
// Falls back to an empty list if the products table is unavailable (e.g. the
// migration hasn't run yet) so the field still works as free text.
const _cache = new Map()      // sellerId (or '_all') -> product[]
const _promise = new Map()

export async function loadProductSuggestions(sellerId) {
  const key = sellerId || '_all'
  if (_cache.has(key)) return _cache.get(key)
  if (_promise.has(key)) return _promise.get(key)
  const p = listProducts(sellerId)
    .then(rows => {
      const mapped = rows.map(r => ({
        description: r.description || '',
        hs_code:     r.hs_code || '',
        unit_price:  Number(r.unit_price) || 0,
      })).filter(r => r.description)
      _cache.set(key, mapped)
      return mapped
    })
    .catch(() => { _promise.delete(key); return [] })
  _promise.set(key, p)
  return p
}

// Clear the cache after edits so the draft picker reflects new products.
export function clearProductCache() { _cache.clear(); _promise.clear() }

export function searchProducts(list, query, limit = 20) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return list.slice(0, limit)
  const out = []
  for (const item of list) {
    if (item.description.toLowerCase().includes(q)) { out.push(item); if (out.length >= limit) break }
  }
  return out
}
