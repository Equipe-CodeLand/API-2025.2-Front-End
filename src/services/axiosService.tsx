// serviços externos (APIs, Firebase, Axios, etc.)
import axios from "axios";

export const api = axios.create({
  baseURL: "https://seu-backend.com/api", // ajuste para sua URL real
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
