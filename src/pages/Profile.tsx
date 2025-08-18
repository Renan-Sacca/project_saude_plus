import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // CAMINHO ATUALIZADO
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  user_id: string;
  email: string;
  name?: string;
  picture?: string;
  locale?: string;
  verified_email?: boolean;
  exp?: number;
}

const Profile: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
        setLoading(false);
        return;
    };

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          // Se o token for inválido no backend (expirado, etc), faz logout
          logout();
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <h2 className="text-lg text-red-700">Erro: {error}</h2>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Voltar para Home
        </button>
      </div>
    );
  }

  if (!user) return <p>Nenhum usuário logado.</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        {user.picture && (
          <img
            src={user.picture}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md border border-gray-200"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{user.name || 'Usuário'}</h1>

        <p className="text-gray-700 mb-1"><strong>ID:</strong> {user.user_id}</p>
        <p className="text-gray-700 mb-1"><strong>Email:</strong> {user.email}</p>

        {user.locale && (
          <p className="text-gray-700 mb-1"><strong>Idioma:</strong> {user.locale}</p>
        )}

        {user.verified_email !== undefined && (
          <p className={`mb-2 font-medium ${user.verified_email ? 'text-green-600' : 'text-red-600'}`}>
            {user.verified_email ? 'Email verificado ✅' : 'Email não verificado ❌'}
          </p>
        )}

        {user.exp && (
          <p className="text-gray-500 text-sm mb-4">
            <strong>Token expira em:</strong> {new Date(user.exp * 1000).toLocaleString()}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          Sair
        </button>
      </div>
    </div>
  );
};

export default Profile;