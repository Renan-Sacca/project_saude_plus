import React from 'react';
import { Link } from 'react-router-dom';

const BACKEND_LOGIN_URL = 'http://localhost:5000/login/google';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-10 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao MeuApp!</h1>
        <p className="text-gray-600 mb-8">Escolha um método para continuar.</p>
        
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          <Link to="/login">
            <button className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
              Entrar com E-mail e Senha
            </button>
          </Link>
          
          <a href={BACKEND_LOGIN_URL}>
            <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition flex items-center justify-center">
              <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5 mr-3"/>
              Login com Google
            </button>
          </a>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Novo por aqui? <Link to="/register" className="text-blue-600 hover:underline">Crie uma conta</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;