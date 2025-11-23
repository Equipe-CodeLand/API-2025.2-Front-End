import React, { useEffect, useState } from "react";
import "../styles/chatList.css";
import { atualizarTituloChat, listarChats } from "../services/axiosService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "../components/button";
import Input from "../components/filter-input";

export default function ChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

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

  async function handleSave(chatId: number) {
    try {
      await atualizarTituloChat(chatId, editValue);

      setChats((prev) =>
        prev.map((chat) =>
          chat.chat_id === chatId ? { ...chat, titulo: editValue } : chat,
        ),
      );

      setEditId(null);

      Swal.fire({
        title: "Salvo!",
        text: "O título foi atualizado com sucesso.",
        icon: "success",
        confirmButtonColor: "#8A00C4",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Erro",
        text:
          error.response?.data?.error || "Não foi possível atualizar o título.",
        icon: "error",
        confirmButtonColor: "#8A00C4",
      });
    }
  }

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
          <Button label="Novo Chat" onClick={() => navigate("/chat")} />
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
              >
                <div className="chat-summary">
                  <div className="chat-summary-left">
                    <h3>Chat #{chat.chat_id}</h3>
                    {editId === chat.chat_id ? (
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditId(chat.chat_id);
                          setEditValue(chat.titulo);
                        }}
                      >
                        {chat.titulo}
                      </span>
                    )}

                    <span>
                      Criado em:{" "}
                      {new Date(chat.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="chat-summary-buttons">
                    {editId === chat.chat_id ? (
                      <>
                        <button
                          className="btn-save"
                          onClick={() => handleSave(chat.chat_id)}
                        >
                          Salvar
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditId(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-open"
                          onClick={() => navigate(`/chat/${chat.chat_id}`)}
                        >
                          Abrir Chat
                        </button>
                        <button
                          className="btn-edit"
                          onClick={(e) => {
                            e.stopPropagation(); // impede abrir o chat
                            setEditId(chat.chat_id);
                            setEditValue(chat.titulo);
                          }}
                        >
                          Editar
                        </button>
                      </>
                    )}
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
