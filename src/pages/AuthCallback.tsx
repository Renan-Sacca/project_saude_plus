// src/pages/AuthCallback.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthCallback: React.FC = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Extrai token JWT enviado pelo backend
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      login(token);  // salva no localStorage
      navigate('/profile', { replace: true }); // redireciona para perfil
    } else {
      // 🔹 Se não há token, volta para home
      console.error("Nenhum token recebido no callback.");
      navigate('/', { replace: true });
    }
  }, [location, login, navigate]);

  return <div>✅ Autenticando com o Google, aguarde...</div>;
};

export default AuthCallback;
