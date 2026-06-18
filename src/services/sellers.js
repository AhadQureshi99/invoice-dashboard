import { supabase } from '../lib/supabase'

// Each seller is one company the signed-in user files invoices for, together
// with that company's own FBR token + registration number. An FBR token is
// bound to a single seller NTN, so multi-company support means storing one
// token per seller and using the matching one when verifying an invoice.

export async function listSellers() {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createSeller(payload) {
  const { data: { user } } = await supabase.auth.getUser()
  const insert = { ...payload, user_id: user?.id }
  // If this is the user's first seller, make it the default.
  const existing = await listSellers()
  if (existing.length === 0) insert.is_default = true
  const { data, error } = await supabase.from('sellers').insert(insert).select().single()
  if (error) throw error
  return data
}

export async function updateSeller(id, patch) {
  const { data, error } = await supabase
    .from('sellers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSeller(id) {
  const { error } = await supabase.from('sellers').delete().eq('id', id)
  if (error) throw error
}

// Make one seller the default and clear the flag on the others.
export async function setDefaultSeller(id) {
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('sellers').update({ is_default: false }).eq('user_id', user?.id)
  return updateSeller(id, { is_default: true })
}
