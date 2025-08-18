import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // CAMINHO ATUALIZADO

const Navbar: React.FC = () => {
  const { isAuthenticated, token, logout } = useAuth();

  let user: any = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = payload;
    } catch (e) {
      console.error('Erro ao decodificar token JWT', e);
    }
  }

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-md border-b border-gray-200">
      <div>
        <Link to="/" className="text-xl font-semibold text-blue-600">MeuApp</Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <Link to="/calendar" className="text-gray-700 hover:underline">
                Calendário
            </Link>
            <Link to="/profile" className="text-gray-700 hover:underline">
              {user.name || 'Perfil'}
            </Link>
            {user.picture && (
              <img
                src={user.picture}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
              />
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;