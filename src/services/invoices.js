import { supabase } from '../lib/supabase'

export async function listInvoices({
  search = '', status = '', type = '', minAmount = null, maxAmount = null,
  rangeDays = null, limit = 50, offset = 0,
} = {}) {
  let q = supabase
    .from('invoices')
    .select('*, items:invoice_items(*)', { count: 'exact' })
    .order('invoice_date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) q = q.eq('status', status)
  if (type)   q = q.eq('invoice_type', type)
  if (minAmount != null && minAmount !== '') q = q.gte('total_amount', Number(minAmount))
  if (maxAmount != null && maxAmount !== '') q = q.lte('total_amount', Number(maxAmount))
  if (rangeDays) {
    const since = new Date(Date.now() - Number(rangeDays) * 86400000).toISOString().slice(0, 10)
    q = q.gte('invoice_date', since)
  }
  if (search) {
    q = q.or(`invoice_number.ilike.%${search}%,buyer_ntn.ilike.%${search}%,buyer_name.ilike.%${search}%,seller_ntn.ilike.%${search}%`)
  }

  const { data, error, count } = await q
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function getInvoice(id) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, items:invoice_items(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createInvoice(payload) {
  const { items = [], ...header } = payload
  const { data: { user } } = await supabase.auth.getUser()
  const { data: inv, error } = await supabase
    .from('invoices')
    .insert({ user_id: user?.id, ...header })
    .select()
    .single()
  if (error) throw error
  if (items.length) {
    const withId = items.map(it => ({ ...it, invoice_id: inv.id }))
    const { error: itemsErr } = await supabase.from('invoice_items').insert(withId)
    if (itemsErr) throw itemsErr
  }
  return inv
}

export async function updateInvoice(id, patch) {
  const { data, error } = await supabase
    .from('invoices')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteInvoice(id) {
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw error
}

export async function getStats() {
  const { data, error } = await supabase.rpc('invoice_stats')
  if (error) {
    const { data: all } = await supabase.from('invoices').select('status,total_amount')
    const rows = all || []
    return {
      total:    rows.length,
      verified: rows.filter(r => r.status === 'verified').length,
      pending:  rows.filter(r => r.status === 'pending' || r.status === 'draft' || r.status === 'ready').length,
      failed:   rows.filter(r => r.status === 'invalid' || r.status === 'failed').length,
    }
  }
  return data
}

export async function monthlyTotals(year = new Date().getFullYear()) {
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_date,total_amount')
    .gte('invoice_date', `${year}-01-01`)
    .lte('invoice_date', `${year}-12-31`)
  if (error) throw error
  const buckets = Array(12).fill(0)
  for (const r of data || []) {
    const m = new Date(r.invoice_date).getMonth()
    buckets[m] += Number(r.total_amount || 0)
  }
  return buckets
}
