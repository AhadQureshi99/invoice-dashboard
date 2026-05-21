import { supabase } from '../lib/supabase'

export async function listDrafts({ limit = 50 } = {}) {
  const { data, error, count } = await supabase
    .from('drafts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function createDraft(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  const insert = { ...payload, user_id: user?.id }
  const { data, error } = await supabase.from('drafts').insert(insert).select().single()
  if (error) throw error
  return data
}

export async function updateDraft(id, patch) {
  const { data, error } = await supabase.from('drafts').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteDraft(id) {
  const { error } = await supabase.from('drafts').delete().eq('id', id)
  if (error) throw error
}

export async function duplicateDraft(id) {
  const { data: src, error } = await supabase.from('drafts').select('*').eq('id', id).single()
  if (error) throw error
  const { id: _drop, created_at: _c, updated_at: _u, ...rest } = src
  return createDraft({ ...rest, invoice_number: `${rest.invoice_number || 'DFT'}-COPY` })
}
