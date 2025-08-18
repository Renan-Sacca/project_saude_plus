import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const response = await fetch('http://localhost:5000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    if (response.ok) {
        setMessage(data.message + " Você será redirecionado para o login.");
        setTimeout(() => navigate('/login'), 3000);
    } else {
        setError(data.error || "Ocorreu um erro.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Defina sua Nova Senha</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Nova Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" disabled={!!message}>
            Salvar Nova Senha
          </button>
        </form>
         {message && (
             <p className="text-center mt-4">
                <Link to="/login" className="text-blue-600 hover:underline">Ir para Login Agora</Link>
            </p>
         )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;