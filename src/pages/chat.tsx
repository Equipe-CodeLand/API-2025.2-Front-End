import React, { useState } from "react";
import "./chat.css";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá, tudo bem?", sender: "other" },
    { id: 2, text: "Oi! Estou bem e você?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "me",
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
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
        <input
          type="text"
          placeholder="Digite sua mensagem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
