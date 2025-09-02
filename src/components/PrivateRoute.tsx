import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="p-6 text-gray-600">Carregando…</div>
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
