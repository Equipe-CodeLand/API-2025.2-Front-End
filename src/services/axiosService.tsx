// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const relatorioApi = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function enviarMensagem(pergunta: string) {
  const response = await api.post("/chat", { pergunta });
  return response.data;
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  const response = await api.delete(`api/usuario/deletar/${id}`, {
    headers: authHeader()
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
  const response = await api.put(`api/usuario/atualizar/${id}`, dados, {
    headers: authHeader()
  });
  return response.data;
}

export async function buscarRelatoriosGerais() {
  const response = await api.post(
    "/api/relatorio/geral",
    {},
    { headers: authHeader() },
  );
  return response.data;
}

export async function buscarRelatoriosSkus() {
  const response = await api.post(
    "/api/relatorio/skus",
    {},
    { headers: authHeader() },
  );
  return response.data;
}

export async function buscarRelatoriosDoUsuario() {
  const token = getToken(); // função que você já tem
  const response = await api.get("/api/relatorio/listar", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function enviarRelatorioPorEmail(relatorioId: number) {
  const response = await api.post(
    "/api/relatorio/enviar-email",
    { relatorioId },
    { headers: authHeader() }
  );
  return response.data;
}
