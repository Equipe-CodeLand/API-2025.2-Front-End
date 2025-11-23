import '../index.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import Chat from '../pages/chat';
import Login from '../pages/login';
import EsqueciSenha from '../pages/esqueciSenha';
import ResetSenha from '../pages/resetSenha';
import { isAuthenticated } from '../utils/auth';
import CadastroUsuario from '../pages/cadastroUsuario';
import Relatorios from '../pages/relatorios';
import Usuarios from '../pages/usuarios';
import FormsSolicitarRelatorio from '../pages/formsGerarRelatorio';
import MeuPerfil from '../pages/meuPerfil';
import ChatList from '../pages/chatLista';
import ChatMensagens from '../pages/chatView';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/reset-senha" element={<ResetSenha />} />
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
            <CadastroUsuario />
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
        path="/solicitar/relatorio"
        element={
          <ProtectedRoute>
            <FormsSolicitarRelatorio />
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
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <ChatList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute>
            <ChatMensagens />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}