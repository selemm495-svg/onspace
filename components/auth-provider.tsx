'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

type User = {
  id: string
  email: string
  name: string
  username: string
  role: string
  status: string
  phone: string | null
  phoneCountryCode: string | null
  country: string | null
  timezone: string
  language: string
  userType: string | null
  profession: string | null
  specialty: string | null
  jobTitle: string | null
  bio: string | null
  website: string | null
  socialLinks: Record<string, string>
  avatarUrl: string | null
  coverUrl: string | null
  credits: number
  planId: number
  planName: string | null
  subscriptionStatus: string
  subscriptionExpiresAt: string | null
  createdAt: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
