import React, { useEffect, useState } from "react";
import "../styles/relatorio.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import {
  atualizarRelatorio,
  buscarRelatoriosDoUsuario,
  enviarRelatorioPorEmail,
  excluirRelatorio,
} from "../services/axiosService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type Filters = {
  nome: string;
  data: string;
};

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [filters, setFilters] = useState({ nome: "", data: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRelatorios() {
      const dados = await buscarRelatoriosDoUsuario();
      setRelatorios(dados);
    }
    fetchRelatorios();
  }, []);

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const limparFiltros = () => {
    setFilters({ nome: "", data: "" });
  };

  const filtrarRelatorios = relatorios.filter((r) => {
    const nomeOk = r.titulo.toLowerCase().includes(filters.nome.toLowerCase());

    const dataOk = (() => {
      if (!filters.data) return true;

      let dataRelatorioFormatada = "";

      if (r.criado_em.includes("/")) {
        const [dia, mes, ano] = r.criado_em.split("/");
        dataRelatorioFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(
          2,
          "0",
        )}`;
      } else {
        const dataRelatorio = new Date(r.criado_em);
        const ano = dataRelatorio.getFullYear();
        const mes = String(dataRelatorio.getMonth() + 1).padStart(2, "0");
        const dia = String(dataRelatorio.getDate()).padStart(2, "0");
        dataRelatorioFormatada = `${ano}-${mes}-${dia}`;
      }

      return dataRelatorioFormatada === filters.data;
    })();
    return nomeOk && dataOk;
  });

  const handleEnviarEmail = async (
    relatorioId: number,
    tituloRelatorio: string,
  ) => {
    try {
      const result = await Swal.fire({
        title: "Confirmar envio",
        text: `Enviar "${tituloRelatorio}" por email?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#8A00C4",
        cancelButtonColor: "#d33",
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Enviando...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const response = await enviarRelatorioPorEmail(relatorioId);

        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: `Email enviado para: ${response.emailEnviado}`,
          confirmButtonColor: "#8A00C4",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.response?.data?.error || "Erro ao enviar email",
        confirmButtonColor: "#8A00C4",
      });
    }
  };

  const handleExcluirRelatorio = async (
    id: number,
    tituloRelatorio: string,
  ) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Deseja realmente excluir o relatório "${tituloRelatorio}"? Essa ação não poderá ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#8A00C4",
      cancelButtonColor: "#CC1C1C",
    });

    if (result.isConfirmed) {
      try {
        await excluirRelatorio(id);

        // Atualiza lista local
        setRelatorios((prev) => prev.filter((r) => r.id !== id));

        await Swal.fire({
          title: "Excluído!",
          text: "O relatório foi removido com sucesso.",
          icon: "success",
          confirmButtonColor: "#8A00C4",
        });
      } catch (error: any) {
        console.error("Erro ao excluir relatório:", error);

        if (error.response) {
          if (error.response.status === 403) {
            Swal.fire({
              title: "Atenção",
              text: "Você não tem permissão para excluir este relatório.",
              icon: "warning",
              confirmButtonColor: "#8A00C4",
            });
          } else if (error.response.data?.error) {
            Swal.fire({
              title: "Erro",
              text: error.response.data.error,
              icon: "error",
              confirmButtonColor: "#8A00C4",
            });
          } else {
            Swal.fire({
              title: "Erro",
              text: "Não foi possível excluir o relatório.",
              icon: "error",
              confirmButtonColor: "#8A00C4",
            });
          }
        } else {
          Swal.fire({
            title: "Erro",
            text: "Falha de conexão com o servidor.",
            icon: "error",
            confirmButtonColor: "#8A00C4",
          });
        }
      }
    }
  };

  const handleEditClick = (rel: any) => {
    setEditId(rel.id);
    setEditTitulo(rel.titulo);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitulo("");
  };

  const handleSaveEdit = async () => {
    if (!editTitulo.trim()) {
      Swal.fire("Atenção", "O título não pode estar vazio.", "warning");
      return;
    }

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
          await atualizarRelatorio(editId, { titulo: editTitulo });

          setRelatorios((prev) =>
            prev.map((r) =>
              r.id === editId ? { ...r, titulo: editTitulo } : r,
            ),
          );

          Swal.fire({
            title: "Salvo!",
            text: "O título foi atualizado com sucesso.",
            icon: "success",
            confirmButtonColor: "#8A00C4",
          });

          handleCancelEdit();
        } catch (error: any) {
          console.error("Erro ao atualizar relatório:", error);
          Swal.fire(
            "Erro",
            error.response?.data?.error ||
              "Não foi possível atualizar o relatório.",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="relatorio-container">
      <div className="title-content">
        <div className="title-text">
          <div className="line-content">
            <div className="line"></div>
            <div className="line line-last"></div>
            <h1 className="main-title">Relatórios</h1>
          </div>
          <h1 className="subtitle">Você pode filtrar por:</h1>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-content">
          <div className="filter-item">
            <Input
              type={"text"}
              placeholder="Nome"
              value={filters.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
            <Input
              type={"date"}
              placeholder="Data"
              value={filters.data}
              onChange={(e) => handleChange("data", e.target.value)}
            />
          </div>
          <div className="filter-item">
            <Button label={"Limpar filtros"} onClick={limparFiltros} />
            <Button
              label={"Novo Relatório"}
              onClick={() => navigate("/solicitar/relatorio")}
            />
          </div>
        </div>
      </div>

      <div className="relatorio-listing-content">
        <div className="relatorio-content">
          {filtrarRelatorios.map((rel) => (
            <details key={rel.id} className="relatorio-details">
              <summary className="relatorio-summary">
                <div className="summary-left">
                  {editId === rel.id ? (
                    <Input
                      type="text"
                      value={editTitulo}
                      onChange={(e) => setEditTitulo(e.target.value)}
                    />
                  ) : (
                    <h1>{rel.titulo}</h1>
                  )}
                  <span>{new Date(rel.criado_em).toLocaleDateString()}</span>
                </div>
                <div className="usuario-summary-buttons">
                  {editId === rel.id ? (
                    <>
                      <button className="btn-save" onClick={handleSaveEdit} >Salvar</button>
                      <button onClick={handleCancelEdit} className="btn-delete">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        label={"Enviar por Email"}
                        onClick={() => handleEnviarEmail(rel.id, rel.titulo)}
                      />
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(rel)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleExcluirRelatorio(rel.id, rel.titulo)
                        }
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </summary>
              <div
                className="relatorio-body"
                style={{ whiteSpace: "pre-line" }}
              >
                <p>
                  {Array.isArray(rel.conteudo)
                    ? rel.conteudo.join("\n\n")
                    : rel.conteudo}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
