import React, { useEffect, useState } from "react";
import "../styles/usuario.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import { useNavigate } from "react-router-dom";
import { listarUsuarios } from "../services/axiosService";

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

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
              onChange={(e) => handleChange("nome", e.target.value)}
            />
            <Input
              type={"text"}
              placeholder="Email"
              value={filters.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <select
              value={filters.cargo}
              onChange={(e) => handleChange("cargo", e.target.value)}
            >
              <option value="" disabled>Cargo</option>
              <option value="" >Todos</option>
              <option value="Administrador">Administrador</option>
              <option value="Funcionario">Funcionário</option>
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
                  <h3>{usuario.nome}</h3>
                  <span>{usuario.cargo}</span>
                  <span>{usuario.email}</span>
                </div>
                <div className="usuario-summary-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => console.log("Editar", usuario.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => console.log("Excluir", usuario.id)}
                  >
                    Excluir
                  </button>
                </div>
              </summary>

              <div className="usuario-body">
                <p>
                  <b>Cargo:</b> {usuario.cargo} <br />
                  <b>Recebe Emails: </b>{usuario.receberEmails ? "Sim" : "Não"} <br />
                  <b>Status: </b>{usuario.status}
                </p>
              </div>
            </details>
          </div>
        ))}
      </div>



    </div>
  );
}
