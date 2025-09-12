import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from '../reportWebVitals'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App'; // corrigido
import Home from '../pages/home';
import Chat from '../pages/chat';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      {/* Adicione outras rotas aqui */}
    </Routes>
  );
}

reportWebVitals();
