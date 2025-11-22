import React, { useEffect, useState } from "react";
import "../styles/relatorio.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import {
  atualizarRelatorio,
  buscarRelatoriosDoUsuario,
  enviarRelatorioPorEmail,
  excluirRelatorio,
  gerarAssertividadeSkus,
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
  const [assertividade, setAssertividade] = useState<any>(null);
  const [loadingAssert, setLoadingAssert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRelatorios() {
      try {
        const dados = await buscarRelatoriosDoUsuario();
        setRelatorios(dados || []);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setRelatorios([]);
      }
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

  const handleGerarAssertividade = async () => {
    try {
      setLoadingAssert(true);
      // Use date range that covers available data (Aug 2025)
      const result = await gerarAssertividadeSkus(
        "2025-08-01",  // Start from August 1st
        "2025-11-30",  // End at Nov 30th to ensure we catch all data
        true,
        []
      );
      
      console.log("Resultado assertividade:", result);
      
      // Validar resposta
      if (result && result.resumo) {
        setAssertividade(result);
        
        // Recarregar lista de relatórios após gerar
        const dadosAtualizados = await buscarRelatoriosDoUsuario();
        setRelatorios(dadosAtualizados || []);
        
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Relatório de assertividade gerado e salvo com sucesso",
          confirmButtonColor: "#8A00C4",
        });
      } else if (result && result.status === "sem_dados") {
        Swal.fire({
          icon: "info",
          title: "Sem Dados",
          text: "Não há dados de SKU disponíveis para o período selecionado.",
          confirmButtonColor: "#8A00C4",
        });
        setAssertividade(null);
      } else {
        console.error("Resposta inválida:", result);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Resposta do servidor inválida ou sem dados",
          confirmButtonColor: "#8A00C4",
        });
        setAssertividade(null);
      }
    } catch (error: any) {
      console.error("Erro ao gerar assertividade:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: error.response?.data?.error || error.message || "Erro ao gerar relatório de assertividade",
        confirmButtonColor: "#8A00C4",
      });
      setAssertividade(null);
    } finally {
      setLoadingAssert(false);
    }
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
            <Button
              label={"Assertividade"}
              onClick={handleGerarAssertividade}
            />
          </div>
        </div>
      </div>

      <div className="relatorio-listing-content">
        {assertividade && (
          <div className="assertividade-container">
            <div className="assertividade-header">
              <h2 className="assertividade-title">Relatório de Assertividade dos SKUs</h2>
              <button
                className="assertividade-btn"
                onClick={() => setAssertividade(null)}
              >
                Fechar
              </button>
            </div>

            {loadingAssert ? (
              <div className="loading-assert">Carregando relatório...</div>
            ) : assertividade && assertividade.resumo ? (
              <>
                <div className="assertividade-resumo">
                  <div className="resumo-card">
                    <div className="resumo-label">Classificação Geral</div>
                    <div className={`resumo-valor classificacao-${assertividade.resumo.classificacao_geral.toLowerCase()}`}>
                      {assertividade.resumo.classificacao_geral}
                    </div>
                  </div>
                  <div className="resumo-card">
                    <div className="resumo-label">Média de Assertividade</div>
                    <div className="resumo-valor">{assertividade.resumo.media_assertividade}%</div>
                  </div>
                  <div className="resumo-card">
                    <div className="resumo-label">SKUs Analisados</div>
                    <div className="resumo-valor">{assertividade.resumo.total_skus}</div>
                  </div>
                  <div className="resumo-card">
                    <div className="resumo-label">SKUs Assertivos</div>
                    <div className="resumo-valor resumo-assert-positivo">
                      {assertividade.resumo.skus_assertivos} ({assertividade.resumo.percentual_assertivo}%)
                    </div>
                  </div>
                  <div className="resumo-card">
                    <div className="resumo-label">SKUs Críticos</div>
                    <div className="resumo-valor resumo-assert-critico">
                      {assertividade.resumo.skus_criticos} ({assertividade.resumo.percentual_critico}%)
                    </div>
                  </div>
                </div>

                <div className="assertividade-detalhes">
                  <div className="detalhes-titulo">Top 5 Melhores SKUs</div>
                  <div className="skus-list">
                    {assertividade.melhores_skus && assertividade.melhores_skus.map((item: any, idx: number) => (
                      <div key={idx} className="sku-assertividade score-alto">
                        <span>{item.sku}</span>
                        <span className="sku-assert-score">{item.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {assertividade.piores_skus && assertividade.piores_skus.length > 0 && (
                  <div className="assertividade-detalhes">
                    <div className="detalhes-titulo">Top 5 SKUs com Atenção Necessária</div>
                    <div className="skus-list">
                      {assertividade.piores_skus.map((item: any, idx: number) => (
                        <div key={idx} className="sku-assertividade score-baixo">
                          <div>
                            <div>{item.sku} - {item.score}%</div>
                            {item.razoes && item.razoes.length > 0 && (
                              <ul className="assertividade-razoes">
                                {item.razoes.map((razao: string, i: number) => (
                                  <li key={i}>{razao}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="loading-assert">Erro ao carregar assertividade ou sem dados disponíveis</div>
            )}
          </div>
        )}

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
              <div className="relatorio-body">
                <p>
                  {Array.isArray(rel.conteudo)
                    ? rel.conteudo.join("\n\n")
                    : typeof rel.conteudo === "object"
                    ? JSON.stringify(rel.conteudo, null, 2)
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
