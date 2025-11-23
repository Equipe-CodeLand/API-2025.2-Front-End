import React, { useEffect, useState } from "react";
import "../styles/chat.css";
import { useParams } from "react-router-dom";
import { listarMensagensDoChat, enviarMensagemParaChat } from "../services/axiosService";

type MensagemChat = {
    id: number;
    chat_id: number;
    usuario_id: number;
    mensagem: string;
    tipo: "usuario" | "bot";
    criado_em: string;
};

export default function ChatMensagens() {
    const { chatId } = useParams<{ chatId: string }>();
    const [messages, setMessages] = useState<MensagemChat[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        async function fetchMensagens() {
            try {
                const data = await listarMensagensDoChat(Number(chatId));

                const saudacao = gerarSaudacao();

                const msgInicial: MensagemChat = {
                    id: -1,
                    chat_id: Number(chatId),
                    usuario_id: 0,
                    mensagem: saudacao,
                    tipo: "bot",
                    criado_em: new Date().toISOString(),
                };

                setMessages([msgInicial, ...data.mensagens]);
            } catch (err) {
                console.error("Erro ao carregar mensagens:", err);
            }
        }

        fetchMensagens();
    }, [chatId]);

    function gerarSaudacao() {
        const hora = new Date().getHours();
        if (hora < 12) return "Bom dia! No que posso te ajudar hoje?";
        if (hora < 18) return "Boa tarde! No que posso te ajudar hoje?";
        return "Boa noite! No que posso te ajudar hoje?";
    }

    const sendMessage = async () => {
        if (!input.trim()) return;

        const textoEnviar = input;
        setInput("");

        const msgLocal: MensagemChat = {
            id: Date.now(),
            chat_id: Number(chatId),
            usuario_id: 0,
            mensagem: textoEnviar,
            tipo: "usuario",
            criado_em: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, msgLocal]);

        try {
            await enviarMensagemParaChat(Number(chatId), textoEnviar);

            const data = await listarMensagensDoChat(Number(chatId));

            setMessages((prev) => [
                prev[0],
                ...data.mensagens,
            ]);
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
        }

    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-bubble ${msg.tipo === "usuario" ? "me" : "other"}`}
                        style={{ whiteSpace: "pre-line" }}
                    >
                        {msg.mensagem}
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
                <button className="btn-enviar" onClick={sendMessage}>
                    Enviar
                </button>
            </div>
        </div>
    );
}
