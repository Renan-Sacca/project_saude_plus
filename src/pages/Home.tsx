// src/pages/Home.tsx
import React from 'react';

// 🔹 Agora usa a URL do backend que inicia o login Google
const BACKEND_LOGIN_URL = 'http://localhost:5000/login/google';

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo ao nosso App!</h1>
      <p>Por favor, faça o login para continuar.</p>
      {/* 🔹 Redireciona diretamente para o backend */}
      <a href={BACKEND_LOGIN_URL}>
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Login com Google
        </button>
      </a>
    </div>
  );
};

export default Home;
