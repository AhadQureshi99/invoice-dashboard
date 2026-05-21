import { supabase } from '../lib/supabase'

async function myOrgId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('org_id').eq('id', user.id).single()
  return data?.org_id || user.id
}

export async function listTeam({ search = '', role = '' } = {}) {
  const org_id = await myOrgId()
  if (!org_id) return []
  let q = supabase.from('team_members').select('*').eq('org_id', org_id).order('created_at', { ascending: false })
  if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  if (role)   q = q.eq('role', role)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function inviteMember({ name, email, role }) {
  const org_id = await myOrgId()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('team_members')
    .insert({ org_id, invited_by: user?.id, name, email, role, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateMember(id, patch) {
  const { data, error } = await supabase.from('team_members').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function removeMember(id) {
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  if (error) throw error
}

export async function resendInvite(id) {
  return updateMember(id, { status: 'pending', updated_at: new Date().toISOString() })
}
