import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [msg, setMsg] = useState('Finalizando login…')

  useEffect(() => {
    const run = async () => {
      try {
        await refresh()
        setMsg('Login concluído! Redirecionando…')
        navigate('/', { replace: true })
      } catch {
        setMsg('Erro ao finalizar login. Tente novamente.')
        navigate('/login', { replace: true })
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Autenticando…</h1>
      <p className="text-gray-600">{msg}</p>
    </div>
  )
}
