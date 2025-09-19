import React from 'react';
import { Navbar } from './layouts/navbar';
import { AppRoutes } from './routes/routes';

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}

export default App;
