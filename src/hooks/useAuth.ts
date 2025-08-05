// src/hooks/useAuth.ts
import { useState, useMemo } from 'react';

export const useAuth = () => {
  // Pega o token do localStorage para saber o estado inicial
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  // useMemo garante que o valor de 'isAuthenticated' só seja recalculado quando o 'token' mudar.
  const isAuthenticated = useMemo(() => !!token, [token]);

  return { token, isAuthenticated, login, logout };
};