import React, { useEffect, useState } from "react";
import "../styles/chatList.css";
import { listarChats } from "../services/axiosService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../components/button";

export default function ChatList() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchChats() {
            try {
                const data = await listarChats();
                setChats(data);
            } catch (error) {
                console.error("Erro ao carregar chats:", error);
                Swal.fire({
                    title: "Erro",
                    text: "Não foi possível carregar seus chats.",
                    icon: "error",
                    confirmButtonColor: "#8A00C4",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchChats();
    }, []);

    if (loading) return <p className="loading">Carregando chats...</p>;
    return (
        <div className="chat-container">
            <div className="chat-title-content">
                <div className="title-text">
                    <div className="line-content">
                        <div className="line"></div>
                        <div className="line line-last"></div>
                        <h1 className="main-title">Meus Chats</h1>
                    </div>
                    <h1 className="subtitle">Veja suas conversas iniciadas</h1>
                </div>

                <div className="new-chat-button">
                    <Button
                        label="Novo Chat"
                        onClick={() => navigate("/chat")}
                    />
                </div>
            </div>

            <div className="chat-listing-content">
                <div className="chat-content">
                    {chats.length === 0 ? (
                        <p className="no-chats">Nenhum chat encontrado.</p>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.chat_id}
                                onClick={() => navigate(`/chat/${chat.chat_id}`)}

                            >
                                <div className="chat-summary">
                                    <div className="chat-summary-left">
                                        <h3>Chat #{chat.chat_id}</h3>
                                        <span>
                                            {chat.titulo
                                                ? chat.titulo.substring(0, 40) + (chat.titulo.length > 40 ? "..." : "")
                                                : "Sem título"}
                                        </span>


                                        <span>
                                            Criado em:{" "}
                                            {new Date(chat.criado_em).toLocaleDateString("pt-BR")}

                                        </span>
                                    </div>

                                    <div className="chat-summary-buttons">
                                        <button className="btn-open">Abrir Chat</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
