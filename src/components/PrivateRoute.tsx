import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // CAMINHO ATUALIZADO

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redireciona para a página inicial se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;