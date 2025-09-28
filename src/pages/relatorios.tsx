import React, { useEffect, useState } from "react";
import "../styles/relatorio.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";
import { buscarRelatoriosDoUsuario, enviarRelatorioPorEmail } from "../services/axiosService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type Filters = {
  nome: string;
  data: string;
  quantidade: string;
};

export default function Relatorios() {
 const [relatorios, setRelatorios] = useState<any[]>([]);
 const [filters, setFilters] = useState({ nome: "", data: "", quantidade: "" });
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

 const filtrarRelatorios = relatorios.filter((r) => {
   const nomeOk = r.titulo.toLowerCase().includes(filters.nome.toLowerCase());
   const dataOk = filters.data ? r.criado_em.startsWith(filters.data) : true;
   return nomeOk && dataOk;
 });

 const handleEnviarEmail = async (relatorioId: number, tituloRelatorio: string) => {
  try {
    const result = await Swal.fire({
      title: 'Confirmar envio',
      text: `Enviar "${tituloRelatorio}" por email?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8A00C4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Enviando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const response = await enviarRelatorioPorEmail(relatorioId);
      
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: `Email enviado para: ${response.emailEnviado}`,
        confirmButtonColor: '#8A00C4'
      });
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: error.response?.data?.error || 'Erro ao enviar email',
      confirmButtonColor: '#8A00C4'
    });
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
            <Input
              type={"number"}
              placeholder="Quantidade"
              value={filters.quantidade}
              onChange={(e) => handleChange("quantidade", e.target.value)}
            />
          </div>
          <div className="filter-item">
            <Button
              label={"Novo Relatório"}
              onClick={() => navigate("/chat")}
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
                  <h1>{rel.titulo}</h1>
                  <span>{new Date(rel.criado_em).toLocaleDateString()}</span>
                </div>
                <Button 
                  label={"Enviar por Email"} 
                  onClick={() => handleEnviarEmail(rel.id, rel.titulo)}
                />
              </summary>
              <div
                className="relatorio-body"
                style={{ whiteSpace: "pre-line" }}
              >
                <p>{rel.conteudo}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
