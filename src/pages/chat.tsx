import React, { useState, useEffect } from "react";
import "../styles/chat.css";
import Mensagem from "../types/mensagem";
import { Button } from "../components/button";
import feather from "feather-icons";
import { buscarResposta, enviarMensagem } from "../services/axiosService";

export default function Chat() {
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    feather.replace();
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Mensagem = {
      id: Date.now(),
      text: input,
      sender: "me",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      await enviarMensagem(input);

      const respostaData = await buscarResposta();
      const resposta = respostaData.resposta;

      const botMessage: Mensagem = {
        id: Date.now() + 1,
        text: resposta,
        sender: "other",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Erro ao buscar resposta do servidor.",
          sender: "other",
        },
      ]);
    }
  };

  const hora = new Date().getHours();
  let saudacao = "";
  if (hora >= 5 && hora < 12) {
    saudacao = "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde";
  } else {
    saudacao = "Boa noite";
  }

  return (
    <div className="chat-container">
      {messages.length === 0 && (
        <div className="greeting-container">
          <h2 className="chat-greeting">{saudacao}!</h2>
          <p className="chat-instruction">No que posso te ajudar hoje?</p>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.sender === "me" ? "me" : "other"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <i 
            data-feather="plus-circle" 
            className="chat-plus-icon"
            onClick={() => {
                setMessages([]);
                setInput("");
            }}
            style={{ cursor: "pointer" }}
            title="Novo chat">
        </i>
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