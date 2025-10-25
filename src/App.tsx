import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './layouts/navbar';
import { AppRoutes } from './routes/routes';

function App() {
  const location = useLocation();
  const publicPaths = ['/', '/login', '/esqueci-senha', '/reset-senha'];
  const hideNavbar = publicPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;