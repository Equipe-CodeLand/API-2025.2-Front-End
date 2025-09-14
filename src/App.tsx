import React from 'react';
import './App.css';
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
