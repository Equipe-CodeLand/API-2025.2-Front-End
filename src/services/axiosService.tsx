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

export async function forgotPassword(email: string) {
  const response = await api.post(`/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token: string, password: string) {
  const response = await api.post(`/auth/reset-password`, { token, password });
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
  return response.data.conteudo;
}

export async function enviarMensagem(texto:string) {
  const response = await api.post(
    "/api/chat", { texto },
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

export async function solicitarRelatorio(
  dataInicio: string,
  dataFim: string,
  topicos: string[],
  incluirTodosSkus: boolean,
  skus: string[]
) {
  const requestBody = {
    data_inicio: dataInicio,
    data_fim: dataFim,
    topicos,
    incluir_todos_skus: incluirTodosSkus,
    skus: incluirTodosSkus ? [] : skus
  };

  const response = await api.post(
    "/api/relatorio/skus",
    requestBody,
    {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

export async function atualizarRelatorio(
  id: number,
  dados: { titulo: string },
) {
  const token = getToken();
  const response = await api.put(`/api/relatorio/atualizar/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}


export async function excluirRelatorio(relatorioId: number) {
  const token = getToken();
  const response = await api.delete(`/api/relatorio/${relatorioId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function obterUsuarioAtual() {
  const response = await api.get("api/usuario/atual");
  return response.data;
}

export async function listarMensagensDoChat(chatId: number) {
  const response = await api.get(`/api/chat/${chatId}/mensagens`, {
    headers: authHeader(),
  });

  return response.data;
}

export async function listarChats() {
  const response = await api.get("/api/chats", {
    headers: authHeader(),
  });
  return response.data.chats;
}

export async function criarChat(primeiraMensagem?: { texto: string }) {
  const usuarioId = Number(localStorage.getItem("userId"));

  const payload = primeiraMensagem
    ? { usuario_id: usuarioId, primeira_mensagem: primeiraMensagem.texto }
    : { usuario_id: usuarioId };

  const response = await api.post("/api/chat/criar", payload, {
    headers: authHeader(),
  });

  return response.data;
}


export async function enviarMensagemParaChat(chatId: number, texto: string) {
  const response = await api.post(
    "/api/chat",
    { chat_id: chatId, texto },
    { headers: authHeader() }
  );

  return response.data;
}

export async function atualizarTituloChat(chatId: number, titulo: string) {
  const response = await api.put(
    `/api/chat/${chatId}/titulo`,
    { titulo },
    { headers: authHeader() },
  );
  return response.data;
}
