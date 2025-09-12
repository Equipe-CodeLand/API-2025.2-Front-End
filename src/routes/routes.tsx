import '../index.css';
import reportWebVitals from '../reportWebVitals'; 
import { Route, Routes } from 'react-router-dom';
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
