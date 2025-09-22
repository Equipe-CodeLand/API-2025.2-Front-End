import '../index.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import Chat from '../pages/chat';
import Login from '../pages/login';
import { isAuthenticated } from '../utils/auth';
import CadastroUsuario from '../pages/cadastroUsuario';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/cadastro/usuario"
        element={
          <ProtectedRoute>
            <CadastroUsuario/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}