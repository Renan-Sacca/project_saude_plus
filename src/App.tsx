// src/App.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;