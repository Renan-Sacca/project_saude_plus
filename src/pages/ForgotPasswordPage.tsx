import React, { useState } from 'react'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const r = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credenciais não são necessárias aqui, mas não atrapalham
        credentials: 'include',
        body: JSON.stringify({ email }),
      })
      if (!r.ok) {
        const t = await r.text()
        throw new Error(t || 'Falha ao enviar e-mail')
      }
      setSent(true)
    } catch (e: any) {
      setError('Não foi possível enviar o e-mail. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Recuperar senha</h2>

        {sent ? (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            Se o e-mail existir, você receberá um link para redefinir a senha.
          </div>
        ) : (
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

            {error && (
              <div className="mb-4 bg-red-100 text-red-800 p-3 rounded">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Enviando…' : 'Enviar link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
