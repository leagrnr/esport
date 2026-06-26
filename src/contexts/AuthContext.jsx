import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.email)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.email)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(email) {
    const { data } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('email', email)
      .maybeSingle()
    setProfile(data)
  }

  async function signUp(email, password, pseudo, role, camp = null) {
    const safeRole = role === 'admin' ? 'spectateur' : role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { pseudo, role: safeRole } },
    })
    if (error) throw error

    const { data: existing } = await supabase
      .from('utilisateur')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      await supabase.from('utilisateur').update({ pseudo }).eq('id', existing.id)
    } else {
      await supabase.from('utilisateur').insert({ email, pseudo, role: safeRole, camp, points_classement: 0 })
    }

    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
