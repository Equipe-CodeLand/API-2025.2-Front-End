import React, { useState, useEffect } from "react";
import "../styles/chat.css";
import Mensagem from "../types/mensagem";
import { Button } from "../components/button";
import feather from "feather-icons";
import { enviarMensagem, criarChat, enviarMensagemParaChat } from "../services/axiosService";

export default function Chat() {
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    feather.replace();
    const hora = new Date().getHours();
    let saudacao = "";
    if (hora >= 5 && hora < 12) saudacao = "Bom dia";
    else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    const mensagemInicial: Mensagem = {
      id: Date.now(),
      sender: "other",
      text: `${saudacao}! No que posso te ajudar hoje?`,
    };
    setMessages([mensagemInicial]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const textoEnviar = input;
    setInput("");

    let currentChatId = chatId;

    if (!currentChatId) {
      try {
        const chat = await criarChat({ texto: textoEnviar });
        currentChatId = chat.chat_id;
        setChatId(chat.chat_id);
      } catch (error) {
        console.error("Erro ao criar chat:", error);
        return;
      }
    }

    const userMessage: Mensagem = {
      id: Date.now(),
      text: textoEnviar,
      sender: "me",
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await enviarMensagemParaChat(currentChatId!, textoEnviar);

      const respostaBot = response.resposta
        ? response.resposta
        : "Desculpe, não consegui entender sua pergunta, tente novamente mais";

      const botMessage: Mensagem = {
        id: Date.now() + 1,
        text: respostaBot,
        sender: "other",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Erro ao enviar mensagem ao servidor.",
          sender: "other",
        },
      ]);
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.sender === "me" ? "me" : "other"}`}
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          ></div>
        ))}
      </div>

      <div className="chat-input">
        <i
          data-feather="plus-circle"
          className="chat-plus-icon"
          onClick={() => {
            setMessages([]);
            setInput("");
            setChatId(null); // reseta chat
          }}
          style={{ cursor: "pointer" }}
          title="Novo chat"
        ></i>
        <input
          type="text"
          placeholder="Digite sua mensagem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} label="Enviar" />
      </div>
    </div>
  );
}
