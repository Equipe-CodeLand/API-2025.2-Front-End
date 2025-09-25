// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function enviarMensagem(pergunta: string) {
  const response = await api.post("/chat", { pergunta });
  return response.data;
}

export async function buscarResposta() {
  const response = await api.get("/chat/resposta");
  return response.data;
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


export async function buscarRelatoriosGerais(){
  const response = await api.get("/relatorios/geral");
  return response.data;
}

export async function buscarRelatoriosSkus(){
  const response = await api.get("/relatorios/skus");
  return response.data;
}