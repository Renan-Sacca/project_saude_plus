// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import Home from './pages/Home'
import AuthCallback from './pages/AuthCallback'
import Profile from './pages/Profile'
import Calendar from './pages/Calendar'
import PrivateRoute from './components/PrivateRoute'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfessionalPage from './pages/Professional' // NOVA PÁGINA

import { AuthProvider } from './context/AuthContext'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      // NOVA ROTA DE DETALHE DO PROFISSIONAL
      { path: 'p/:id', element: <ProfessionalPage /> },
      {
        path: 'profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: 'calendar',
        element: (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: '*', element: <h1>404: Página Não Encontrada</h1> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
