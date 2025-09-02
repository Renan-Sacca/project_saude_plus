import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Home() {
  const { loginWithGoogle, isAuthenticated, user } = useAuth()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Saúde Plus</h1>
      {!isAuthenticated ? (
        <div className="flex flex-wrap gap-3">
          <Link className="px-4 py-2 rounded-xl bg-blue-600 text-white" to="/login">
            Entrar com Email/Senha
          </Link>
          <button
            onClick={loginWithGoogle}
            className="px-4 py-2 rounded-xl bg-red-600 text-white"
          >
            Entrar com Google
          </button>
        </div>
      ) : (
        <p className="text-gray-700">Bem-vindo, <span className="font-semibold">{user?.email}</span>!</p>
      )}
      <p className="text-sm text-gray-600">
        A conexão com o Calendar será pedida somente quando você acessar a página de calendário.
      </p>
    </div>
  )
}
