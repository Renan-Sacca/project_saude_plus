// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Importação dos componentes
import App from './App';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar'; // ✅ Import da nova página
import PrivateRoute from './components/PrivateRoute';

import './index.css'; // ✅ Tailwind v4

// Definição das rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: 'calendar', // ✅ Nova rota protegida
        element: (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <h1>404: Página Não Encontrada</h1>,
  }
]);

// Renderização do app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
``
