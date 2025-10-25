import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function ResetSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token ausente. Verifique o link no email.');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Senhas não conferem');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, { token, password });
      setMessage(res.data.message || 'Senha alterada com sucesso');
      // redireciona ao login após 2s
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao redefinir senha');
    }
  }

  return (
    <div className="login-container">
      <img src="/logoDomRock.png" alt="Logo" className="logo-login" />
      <form onSubmit={handleSubmit}>
        <h2>Nova senha</h2>
        <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirme a senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <button type="submit">Alterar senha</button>
      </form>
      {message && <p className="login-error success">{message}</p>}
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
