// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function enviarMensagem(pergunta: string) {
  const response = await api.post("/chat", { pergunta });
  return response.data;
}

export async function buscarResposta() {
  const response = await api.get("/chat/resposta");
  return response.data;
}

export async function cadastrarUsuario(nome: string, email: string, password: string, cargo: string, receberEmails: boolean) {
  const response = await api.post("api/usuario/cadastrar", {
    nome,
    email,
    password,
    cargo,
    receberEmails,
  });

  return response.data;
}

export async function listarUsuarios() {
  const response = await api.get("api/usuario/listar");
  return response.data;
}

export async function listarUsuario(id: number) {
  const response = await api.get(`api/usuarios/${id}`);
  return response.data;
}

export async function deletarUsuario(id: number) {
  const token = localStorage.getItem("token");
  const response = await api.delete(`api/usuario/deletar/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function atualizarUsuario(
  id: number,
  dados: {
    nome?: string;
    email?: string;
    cargo?: string;
    status?: string;
    receberEmails?: boolean;
    password?: string;
  }
) {
  const response = await api.put(`api/usuario/atualizar/${id}`, dados);
  return response.data;
}
