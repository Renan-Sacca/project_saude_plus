import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
// Nenhuma importação de 'useAuth' ou de './AuthContext' deve existir aqui!

// 1. Definir o tipo do valor que o contexto irá fornecer
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

// 2. Criar o Contexto com um valor padrão
// O "!" é um non-null assertion, dizendo ao TypeScript que vamos prover um valor.
const AuthContext = createContext<AuthContextType>(null!);

// 3. Criar o "Provedor" (AuthProvider)
// Este componente irá conter o estado e a lógica
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // Efeito para inicializar o token a partir do localStorage ao carregar a app
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  // Memoizar o valor para evitar re-renderizações desnecessárias
  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Criar e exportar o Hook customizado `useAuth`
// A exportação acontece aqui no final do arquivo, depois que tudo foi definido.
export const useAuth = () => {
  return useContext(AuthContext);
};