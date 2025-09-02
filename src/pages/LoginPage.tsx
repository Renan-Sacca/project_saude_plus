import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginWithGoogle, loginWithToken, refresh } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isGoogleAccount, setIsGoogleAccount] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsGoogleAccount(false)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        // Se em algum fluxo você emitir JWT, mantém compatibilidade:
        if (data?.token) loginWithToken(data.token)

        // 🔑 Atualiza o AuthContext imediatamente com a sessão do back
        await refresh()

        // Agora a Navbar re-renderiza já logada
        navigate('/profile', { replace: true })
      } else {
        if (data.error === 'ACCOUNT_NO_PASSWORD') {
          setIsGoogleAccount(true)
          setError(data.message || 'Sua conta foi criada via Google. Defina uma senha em “Esqueci minha senha”.')
        } else {
          setError(data.error || 'Ocorreu um erro no login.')
        }
      }
    } catch (e) {
      setError('Não foi possível conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {error && (
            <div className={`text-center mb-4 p-3 rounded-lg ${isGoogleAccount ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
              <p>{error}</p>
              {isGoogleAccount && (
                <Link to="/forgot-password" className="font-bold underline hover:text-blue-600">
                  Clique aqui para criar uma senha.
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Entrar com Google
        </button>

        <div className="text-center mt-4 flex justify-between">
          <Link to="/register" className="text-sm text-blue-600 hover:underline">Criar conta</Link>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Esqueci minha senha</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
