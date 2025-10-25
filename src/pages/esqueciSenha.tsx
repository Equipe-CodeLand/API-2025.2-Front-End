import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || 'Se o email existir, enviamos um link para redefinir a senha.');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao enviar email');
    }
  }

  return (
    <div className="login-container">
      <img src="/logoDomRock.png" alt="Logo" className="logo-login" />
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Recuperar senha</h2>
        <input type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Enviar link</button>
      </form>
  {message && <p className="login-error success">{message}</p>}
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
