import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const response = await fetch('http://localhost:5000/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
        setMessage(data.message);
    } else {
        setError(data.error || "Ocorreu um erro.")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-2">Criar / Redefinir Senha</h2>
        <p className="text-center text-gray-600 mb-6">Digite seu e-mail para receber o link.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          
          {message && <p className="text-green-600 text-center mb-4">{message}</p>}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Enviar Link
          </button>
        </form>
        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">Voltar para o Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;