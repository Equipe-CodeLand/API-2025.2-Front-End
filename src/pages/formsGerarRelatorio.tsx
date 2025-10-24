import React, { useState } from "react";
import "../styles/relatorio.css";
import { solicitarRelatorio } from "../services/axiosService";
import Swal from "sweetalert2";

export default function SolicitarRelatorio() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [topicosSelecionados, setTopicosSelecionados] = useState<string[]>([]);
  const [incluirTodosSkus, setIncluirTodosSkus] = useState(true);
  const [skuInput, setSkuInput] = useState("");
  const [skusSelecionados, setSkusSelecionados] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  // 🔹 Mapeamento entre nomes do back e labels do front
  const topicosDisponiveis = [
    { key: "1. Estoque consumido (ton)", label: "Estoque consumido em toneladas" },
    { key: "2. Frequência de compra (meses)", label: "Frequência de compra em meses" },
    { key: "3. Aging médio do estoque (semanas)", label: "Aging médio do estoque em semanas" },
    { key: "4. Nº clientes distintos", label: "Quantidades de clientes que consomem o SKU" },
    { key: "5. SKUs de alto giro sem estoque", label: "SKUs de alto giro sem estoque" },
    { key: "6. Itens a repor", label: "Itens a repor" },
    { key: "7. Risco de desabastecimento", label: "Risco de desabastecimento do SKU" },
  ];

  const toggleTopico = (key: string) => {
    setTopicosSelecionados((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  };

  const adicionarSku = (e: React.FormEvent) => {
    e.preventDefault();
    const novoSku = skuInput.trim().toUpperCase();

    //Regex para permitir apenas "SKU" + número
    const skuRegex = /^SKU\d+$/;

    if (!skuRegex.test(novoSku)) {
      Swal.fire({
        icon: "warning",
        title: "Formato inválido",
        text: "O SKU deve seguir o formato 'SKU' seguido de números. Exemplo: SKU123",
        confirmButtonColor: "#8A00C4",
      });
      return;
    }

    if (!skusSelecionados.includes(novoSku)) {
      setSkusSelecionados((prev) => [...prev, novoSku]);
      setSkuInput("");
    } else {
      Swal.fire({
        icon: "info",
        title: "SKU já adicionado",
        text: "Esse SKU já foi incluído na lista.",
        confirmButtonColor: "#8A00C4",
      });
    }
  };

  const removerSku = (sku: string) => {
    setSkusSelecionados((prev) => prev.filter((s) => s !== sku));
  };

  const handleSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataInicio || !dataFim) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Por favor, selecione o intervalo de datas!",
        confirmButtonColor: "#8A00C4",
      });
      return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "A data de início não pode ser posterior à data de fim!",
        confirmButtonColor: "#8A00C4",
      });
      return;
    }

    if (topicosSelecionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Por favor, selecione ao menos um tópico para o relatório!",
        confirmButtonColor: "#8A00C4",
      });
      return;
    }




    try {
      setEnviando(true);
      const response = await solicitarRelatorio(
        dataInicio,
        dataFim,
        topicosSelecionados, // ✅ envia as keys corretas para o backend
        incluirTodosSkus,
        skusSelecionados
      );

      Swal.fire({
        icon: "success",
        title: "Relatório Gerado!",
        text: "Os dados foram obtidos com sucesso.",
        confirmButtonColor: "#8A00C4",
      });

      setEnviando(false);
      setMensagem(response.conteudo);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erro ao Gerar Relatório",
        text:
          error.response?.data?.mensagem ||
          "Falha ao obter os dados do relatório.",
        confirmButtonColor: "#8A00C4",
      });
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Gerar Relatório</h2>

      <form onSubmit={handleSolicitacao} className="cadastro-form">
        <label>
          Data de Início
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </label>

        <label>
          Data de Fim
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </label>

        <label>
          Selecione os tópicos do relatório:
          <div className="button-group">
            {topicosDisponiveis.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`topic-button ${topicosSelecionados.includes(key) ? "selected" : ""
                  }`}
                onClick={() => toggleTopico(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={incluirTodosSkus}
            onChange={(e) => setIncluirTodosSkus(e.target.checked)}
          />
          Incluir todos os SKUs no relatório
        </label>

        {!incluirTodosSkus && (
          <label>
            Adicionar SKUs específicos:
            <div className="sku-input-group">
              <input
                type="text"
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                placeholder="Ex: SKU123"
              />
              <button
                onClick={adicionarSku}
                className="add-sku-button"
                type="button"
              >
                +
              </button>
            </div>

            <div className="sku-list">
              {skusSelecionados.map((sku) => (
                <span key={sku} className="sku-chip">
                  <b>{sku}</b>
                  <button
                    type="button"
                    className="remove-sku"
                    onClick={() => removerSku(sku)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </label>
        )}

        <button type="submit" className="custom-button">
          {enviando ? "Gerando..." : "Gerar Relatório"}
        </button>
      </form>

      <br />
      {mensagem &&
        (
          <div
            className="relatorio-body"
            style={{ whiteSpace: "pre-line" }}
          >
            <p>{Array.isArray(mensagem) ? mensagem.join("\n\n") : mensagem}</p>
          </div>
        )}
    </div>
  );
}
