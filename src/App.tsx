import React from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';
import { Navbar } from './layouts/navbar';
import { AppRoutes } from './routes/routes';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;