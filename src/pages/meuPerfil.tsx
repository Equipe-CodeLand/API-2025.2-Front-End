import React, { useEffect, useState } from "react";
import "../styles/usuario.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import { listarUsuarios, atualizarUsuario, obterUsuarioAtual } from "../services/axiosService";
import Swal from "sweetalert2";

export default function MeuPerfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const user = await obterUsuarioAtual();
        setUsuario(user);
        setEditData(user);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Swal.fire({
          title: "Erro",
          text: "Não foi possível carregar seu perfil.",
          icon: "error",
          confirmButtonColor: "#8A00C4",
        });
      }
    }

    fetchUsuario();
  }, []);


const handleEditChange = (field: string, value: any) => {
  setEditData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
};

const handleSave = async () => {
  Swal.fire({
    title: "Salvar alterações?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#8A00C4",
    cancelButtonColor: "#8A00C4",
  }).then(async (result) => {
    if (result.isConfirmed && usuario) {
      try {
        await atualizarUsuario(usuario.id, editData);
        setUsuario(editData);
        setEditMode(false);
        Swal.fire({
          title: "Salvo!",
          text: "Suas informações foram atualizadas.",
          icon: "success",
          confirmButtonColor: "#8A00C4",
        });
      } catch (error: any) {
        console.error("Erro ao salvar perfil:", error);
        Swal.fire({
          title: "Erro",
          text: error.response?.data?.error || "Não foi possível atualizar seu perfil.",
          icon: "error",
          confirmButtonColor: "#8A00C4",
        });
      }
    }
  });
};

if (!usuario) {
  return <p className="loading">Carregando perfil...</p>;
}

return (
  <div className="usuario-container">
    <div className="title-content">
      <div className="title-text">
        <div className="line-content">
          <div className="line"></div>
          <div className="line line-last"></div>
          <h1 className="main-title">Meu Perfil</h1>
        </div>
        <h1 className="subtitle">Gerencie suas informações pessoais</h1>
      </div>
    </div>

    <div className="usuario-listing-content">
      <div className="usuario-content">
        <div className="usuario-details">
          <div className="usuario-summary">
            <div className="usuario-summary-left">
              {editMode ? (
                <>
                  <Input
                    type="text"
                    value={editData.nome}
                    placeholder="Nome"
                    onChange={(e) => handleEditChange("nome", e.target.value)}
                  />
                  <Input
                    type="text"
                    value={editData.email}
                    placeholder="Email"
                    onChange={(e) => handleEditChange("email", e.target.value)}
                  />
                  <select
                    title="Cargo"
                    value={editData.cargo}
                    onChange={(e) => handleEditChange("cargo", e.target.value)}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Funcionário">Funcionário</option>
                  </select>

                  <label className="checkbox-label-edit">
                    <input
                      type="checkbox"
                      checked={editData.receberEmails}
                      onChange={(e) =>
                        handleEditChange("receberEmails", e.target.checked)
                      }
                    />
                    Receber emails
                  </label>
                </>
              ) : (
                <>
                  <h3>{usuario.nome}</h3>
                  <span>{usuario.email}</span>
                  <span>{usuario.cargo}</span>
                  <span>
                    {usuario.receberEmails ? "Recebe Emails" : "Não Recebe Emails"}
                  </span>
                </>
              )}
            </div>

            <div className="usuario-summary-buttons">
              {editMode ? (
                <>
                  <button className="btn-save" onClick={handleSave}>
                    Salvar
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button className="btn-edit" onClick={() => setEditMode(true)}>
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
