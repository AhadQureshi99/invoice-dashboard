import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (uid) => {
    if (!uid) { setProfile(null); return }
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
    setProfile(data || null)
  }, [])

  // Record / refresh the current session row for this browser
  const recordSession = useCallback(async (uid) => {
    if (!uid) return
    try {
      const ua = navigator.userAgent
      const browser  = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Browser'
      const platform = navigator.platform || 'Unknown'
      await supabase.from('user_sessions').update({ is_current: false }).eq('user_id', uid)
      await supabase.from('user_sessions').insert({
        user_id: uid, device: platform, browser,
        location: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        is_current: true,
      })
    } catch (_) {/* ignore */}
  }, [])

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      const u = session?.user ?? null
      setUser(u)
      loadProfile(u?.id).finally(() => setLoading(false))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      loadProfile(u?.id)
      if (event === 'SIGNED_IN' && u?.id) recordSession(u.id)
    })

    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [loadProfile, recordSession])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password, profileData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: profileData },
    })
    if (!error && data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email, ...profileData })
    }
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = () => loadProfile(user?.id)

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
