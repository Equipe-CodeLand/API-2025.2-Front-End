// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";
import { getToken } from "../utils/auth";


export const api = axios.create({
  baseURL: "http://localhost:4000",
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

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function cadastrarUsuario(nome: string, email: string, senha: string, cargo: string, receberEmails: boolean) {
  const response = await api.post("/cadastro/usuario", {
    nome,
    email,
    senha,
    cargo,
    receberEmails,
  });

  return response.data;
}

export async function listarUsuarios() {
  const response = await api.get("/usuarios");
  return response.data;
}

export async function listarUsuario(id: number) {
  const response = await api.get(`/usuarios/${id}`);
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
