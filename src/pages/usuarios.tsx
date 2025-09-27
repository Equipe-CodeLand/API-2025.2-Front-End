import React, { useEffect, useState } from "react";
import "../styles/usuario.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import { useNavigate } from "react-router-dom";
import { listarUsuarios, deletarUsuario, atualizarUsuario } from "../services/axiosService";
import Swal from "sweetalert2";


type Filters = {
  nome: string;
  email: string;
  cargo: string;
};

export default function Usuarios() {
  const [filters, setFilters] = useState({
    nome: "",
    email: "",
    cargo: "",
  });
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const nomeMatch = usuario.nome.toLowerCase().includes(filters.nome.toLowerCase());
    const emailMatch = usuario.email.toLowerCase().includes(filters.email.toLowerCase());
    const cargoMatch = filters.cargo ? usuario.cargo === filters.cargo : true;
    return nomeMatch && emailMatch && cargoMatch;
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CC1C1C",
      cancelButtonColor: "#8A00C4",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletarUsuario(id);
          Swal.fire("Excluído!", "O usuário foi removido com sucesso.", "success");

          setUsuarios((prev) => prev.filter((u) => u.id !== id));
        } catch (error: any) {
          console.error("Erro ao excluir usuário:", error);

          if (error.response) {
            if (error.response.status === 403) {
              Swal.fire("Atenção", "Você não pode excluir sua própria conta.", "warning");
            } else if (error.response.data?.error) {
              Swal.fire("Erro", error.response.data.error, "error");
            } else {
              Swal.fire("Erro", "Não foi possível excluir o usuário.", "error");
            }
          } else {
            Swal.fire("Erro", "Falha de conexão com o servidor.", "error");
          }
        }
      }
    });
  };

  const handleEditClick = (usuario: any) => {
    setEditId(usuario.id);
    setEditData({ ...usuario });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    Swal.fire({
      title: "Salvar alterações?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      confirmButtonColor: "#8A00C4",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#CC1C1C",
    }).then(async (result) => {
      if (result.isConfirmed && editId !== null) {
        try {
          await atualizarUsuario(editId, editData);
          setUsuarios((prev) =>
            prev.map((u) => (u.id === editId ? { ...u, ...editData } : u))
          );
          Swal.fire({
            title: "Salvo!",
            text: "As alterações foram aplicadas.",
            icon: "success",
            confirmButtonColor: "#8A00C4",
          });
          handleCancelEdit();
        } catch (error: any) {
          console.error("Erro ao atualizar usuário:", error);
          Swal.fire("Erro", error.response?.data?.error || "Não foi possível atualizar o usuário.", "error");
        }
      }
    });
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

const handleEditChange = (field: keyof Filters | string, value: any) => {
  setEditData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
};

  return (
    <div className="usuario-container">
      <div className="title-content">
        <div className="title-text">
          <div className="line-content">
            <div className="line"></div>
            <div className="line line-last"></div>
            <h1 className="main-title">Usuários</h1>
          </div>
          <h1 className="subtitle">Você pode filtrar por:</h1>
        </div>
      </div>

      <div className="usuario-filter-container">
        <div className="usuario-filter-content">
          <div className="usuario-filter-item">
            <Input
              type={"text"}
              placeholder="Nome"
              value={filters.nome}
              onChange={(e) => handleFilterChange("nome", e.target.value)}
            />
            <Input
              type={"text"}
              placeholder="Email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
            />

            <select
              value={filters.cargo}
              onChange={(e) => handleFilterChange("cargo", e.target.value)}
            >
              <option value="" disabled>Cargo</option>
              <option value="" >Todos</option>
              <option value="Administrador">Administrador</option>
              <option value="Funcionário">Funcionário</option>
            </select>

          </div>
          <div className="usuario-item">
            <Button
              label="Novo Usuário"
              onClick={() => navigate("/cadastro/usuario")}
            />
          </div>
        </div>
      </div>
      <div className="usuario-listing-content">
        {usuariosFiltrados.map((usuario) => (
          <div className="usuario-content" key={usuario.id}>
            <details className="usuario-details">
              <summary className="usuario-summary">

                <div className="usuario-summary-left">
                  {editId === usuario.id ? (
                    <>
                      <Input
                        type="text"
                        value={editData.nome}
                        onChange={(e) => handleEditChange("nome", e.target.value)}
                      />
                      <select
                        value={editData.cargo}
                        onChange={(e) => handleEditChange("cargo", e.target.value)}
                      >
                        <option value={editData.cargo}>{editData.cargo}</option>
                        <option value={editData.cargo === "Administrador" ? "Funcionário" : "Administrador"}>
                          {editData.cargo === "Administrador" ? "Funcionário" : "Administrador"}
                        </option>
                      </select>

                      <Input
                        type="text"
                        value={editData.email}
                        onChange={(e) => handleEditChange("email", e.target.value)}
                      />
                      <label style={{ marginLeft: "8px" }}>
                        <input
                          type="checkbox"
                          checked={editData.receberEmails}
                          onChange={(e) => handleEditChange("receberEmails", e.target.checked)}
                        />
                        Recebe Emails
                      </label>
                    </>
                  ) : (
                    <>
                      <h3>{usuario.nome}</h3>
                      <span>{usuario.cargo}</span>
                      <span>{usuario.email}</span>
                      <span>{usuario.receberEmails ? "Recebe Emails" : "Não Recebe Emails"}</span>
                    </>
                  )}
                </div>

                <div className="usuario-summary-buttons">
                  {editId === usuario.id ? (
                    <>
                      <button className="btn-save" onClick={handleSaveEdit}>Salvar</button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => handleEditClick(usuario)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(usuario.id)}>Excluir</button>
                    </>
                  )}
                </div>
              </summary>

            </details>
          </div>
        ))}

      </div>
    </div>
  );
}