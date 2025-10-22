import '../index.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import Chat from '../pages/chat';
import Login from '../pages/login';
import { isAuthenticated } from '../utils/auth';
import CadastroUsuario from '../pages/cadastroUsuario';
import Relatorios from '../pages/relatorios';
import Usuarios from '../pages/usuarios';
import MeuPerfil from '../pages/meuPerfil';

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
      <Route 
        path="/relatorios" 
        element={
          <ProtectedRoute>
            <Relatorios />
          </ProtectedRoute>
        }
       />
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
       />
             <Route 
        path="/meuperfil" 
        element={
          <ProtectedRoute>
            <MeuPerfil />
          </ProtectedRoute>
        }
       />
    </Routes>
  );
}