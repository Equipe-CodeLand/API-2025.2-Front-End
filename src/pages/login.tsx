import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from "../utils/auth";
import "../styles/login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // More aggressive cleaning of the password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.replace(/\s+/g, '').trim();

    console.log(`Login attempt for ${trimmedEmail} (password length: ${trimmedPassword.length})`);
    try {
      console.log("Tentando fazer login com URL:", API_URL);
      
      const res = await axios.post(`${API_URL}/api/login`, { 
        email: trimmedEmail, 
        password: trimmedPassword 
      });
      
      if (res.data.token) {
        setToken(res.data.token);
        navigate("/home");
      } else {
        setError(res.data.error || "Erro no login");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      console.error("Detalhes do erro:", err.response?.data);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Erro de conexão. Verifique se o backend está rodando.");
      } else {
        setError(err.response?.data?.error || "Usuário ou senha inválidos");
      }
    }
  }

  return (
    <div className="login-container">
      <img src="/logoDomRock.png" alt="Logo" className="logo-login" />
      <form onSubmit={handleLogin}>
        <input 
        type="text" 
        placeholder="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        autoComplete="username"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        autoComplete="current-password"
      />
        <button type="submit">LOG IN</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}