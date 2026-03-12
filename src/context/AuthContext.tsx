import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { generateUID, generateReferralCode, generateDeviceId } from '../lib/utils'

function detectDeviceInfo() {
  var ua = navigator.userAgent;
  var model = "Computing Node", os = "Unknown OS", br = "Browser";
  if (ua.indexOf("iPhone") > -1) {
    model = "iPhone";
    var m = ua.match(/iPhone OS ([d_]+)/); os = m ? "iOS " + m[1].replace(/_/g, ".") : "iOS";
  } else if (ua.indexOf("Android") > -1) {
    var mm = ua.match(/Android [d.]+; ([^;)]+)/); model = mm ? mm[1].trim() : "Android Device";
    var vm = ua.match(/Android ([d.]+)/); os = vm ? "Android " + vm[1] : "Android";
  } else if (ua.indexOf("Windows") > -1) {
    model = "Windows PC"; os = "Windows 10/11";
  } else if (ua.indexOf("Macintosh") > -1) {
    model = "MacBook";
    var mc = ua.match(/Mac OS X ([d_]+)/); os = mc ? "macOS " + mc[1].replace(/_/g, ".") : "macOS";
  } else if (ua.indexOf("Linux") > -1) {
    model = "Linux PC"; os = "Linux";
  }
  if (ua.includes("Edg/")) br = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) br = "Opera";
  else if (ua.includes("Chrome/") && !ua.includes("Chromium")) br = "Chrome";
  else if (ua.includes("Firefox/")) br = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) br = "Safari";
  return { model: model, platform: br + " · NanoGPT Node", os: os };
}


interface Profile {
  id: string
  username: string
  uid: string
  referral_code: string
  referred_by: string | null
  level: number
  language: string
}

interface Assets {
  user_id: string
  task_balance: number
  vault_balance: number
  withdrawal_balance: number
  daily_yield: number
  total_yield: number
}

interface AuthContextType {
  user: import('@supabase/supabase-js').User | null
  session: import('@supabase/supabase-js').Session | null
  profile: Profile | null
  assets: Assets | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, username: string, referralCode?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  refreshAssets: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [assets, setAssets] = useState<Assets | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchAssets(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchAssets(session.user.id)
      } else {
        setProfile(null)
        setAssets(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  async function fetchAssets(userId: string) {
    const { data } = await supabase.from('assets').select('*').eq('user_id', userId).single()
    if (data) setAssets(data)
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email: string, password: string, username: string, referralCode?: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error || !data.user) return { error: error || new Error('Signup failed') }

    let referredById: string | null = null
    if (referralCode) {
      const { data: refProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single()
      if (refProfile) referredById = refProfile.id
    }

    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      uid: generateUID(),
      referral_code: generateReferralCode(),
      referred_by: referredById,
      level: 0,
      language: 'EN',
    })

    await supabase.from('assets').insert({
      user_id: data.user.id,
      task_balance: 0,
      vault_balance: 0,
      withdrawal_balance: 0,
      daily_yield: 0,
      total_yield: 0,
    })

    var di = detectDeviceInfo()
    await supabase.from('devices').insert({
      user_id:   data.user.id,
      device_id: generateDeviceId(),
      model:     di.model,
      platform:  di.platform,
      os:        di.os,
    })

    await supabase.from('kyc').insert({
      user_id: data.user.id,
      status: 'unverified',
    })

    if (referredById) {
      await supabase.from('referrals').insert([
        { referrer_id: referredById, referred_id: data.user.id, tier: 1 },
      ])
    }

    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  async function refreshAssets() {
    if (user) await fetchAssets(user.id)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, assets, loading,
      signIn, signUp, signOut, refreshProfile, refreshAssets
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
