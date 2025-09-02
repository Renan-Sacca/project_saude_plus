import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function App() {
  const { isAuthenticated, loading, user, loginWithGoogle, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  const linkBase =
    'px-4 py-2 rounded-xl transition font-medium'
  const linkInactive =
    'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
  const linkActive =
    'bg-blue-600 text-white shadow'

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-xl font-bold">
            Saúde <span className="text-blue-600">Plus</span>
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Calendário
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Perfil
            </NavLink>

            {/* Lado direito: estado de auth */}
            {loading ? (
              <span className="ml-2 text-sm text-gray-600">Carregando…</span>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="hidden sm:inline text-sm text-gray-700">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl bg-gray-800 text-white hover:bg-black disabled:opacity-60"
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Saindo…' : 'Sair'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  Entrar
                </NavLink>
                <button
                  onClick={loginWithGoogle}
                  className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Google
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Conteúdo das rotas filhas */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      {/* Rodapé */}
      <footer className="mt-10 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Saúde Plus. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
