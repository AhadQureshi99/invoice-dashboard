import { supabase } from '../lib/supabase'

export async function listVerifications({ limit = 50, offset = 0 } = {}) {
  const { data, error, count } = await supabase
    .from('verifications')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function recordVerification(row) {
  const { data: { user } } = await supabase.auth.getUser()
  const insert = { ...row, user_id: user?.id }
  const { data, error } = await supabase.from('verifications').insert(insert).select().single()
  if (error) throw error
  return data
}

export async function verificationStats() {
  const { data, error } = await supabase.from('verifications').select('status,response_time_ms')
  if (error) throw error
  const rows = data || []
  const verified = rows.filter(r => r.status === 'verified').length
  const invalid  = rows.filter(r => r.status === 'invalid').length
  const avg      = rows.length
    ? rows.reduce((s, r) => s + (r.response_time_ms || 0), 0) / rows.length / 1000
    : 0
  const compliance = rows.length ? (verified / rows.length) * 100 : 0
  return { verified, invalid, avgSeconds: avg, compliance }
}
