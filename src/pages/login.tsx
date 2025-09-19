import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from "../utils/auth";
import "../styles/login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      console.log("Tentando fazer login com URL:", API_URL);
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      
      if (res.data.token) {
        setToken(res.data.token);
        navigate("/home");
      } else {
        setError(res.data.error || "Erro no login");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      
      if (err.code === 'ERR_NETWORK') {
        setError("Erro de conexão. Verifique se o backend está rodando.");
      } else {
        setError("Usuário ou senha inválidos");
      }
    }
  }

  return (
    <div className="login-container">
      <img src="/logoDomRock.png" alt="Logo" className="logo-login" />
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">LOG IN</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}