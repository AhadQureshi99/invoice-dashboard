import { supabase } from '../lib/supabase'

export async function listReports({ limit = 50, offset = 0 } = {}) {
  const { data, error, count } = await supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function createReport(row) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('reports')
    .insert({ user_id: user?.id, ...row })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateReport(id, patch) {
  const { data, error } = await supabase.from('reports').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteReport(id) {
  const { error } = await supabase.from('reports').delete().eq('id', id)
  if (error) throw error
}
