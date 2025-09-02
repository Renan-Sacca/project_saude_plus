import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react'

type User = { email: string }

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  loginWithGoogle: () => void
  loginWithToken: (newToken: string) => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const r = await fetch('/api/me', { credentials: 'include' })
      if (!r.ok) throw new Error(await r.text())
      const data = await r.json()
      if (data?.email) setUser({ email: data.email })
      else setUser(null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token')
    if (storedToken) setToken(storedToken)
    refresh()
  }, [])

  // >>> ROTA NOVA via proxy do Vite
  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google/login'
  }

  const loginWithToken = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken)
    setToken(newToken)
  }

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) } catch {}
    localStorage.removeItem('jwt_token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user || !!token,
      loading,
      loginWithGoogle,
      loginWithToken,
      logout,
      refresh,
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
