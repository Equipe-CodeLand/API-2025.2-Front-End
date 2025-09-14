import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="home-container">
        <div className="title-content">
          <h1 className="main-title">Bem-vindo ao Painel de Gestão!</h1>
          <p className="subtitle">
            Gere relatórios, consulte informações detalhadas via chat ou insira
            novos dados para manter sua análise sempre atualizada.
          </p>
        </div>
        <div className="home-content">
          <Link to="/chat" className="home-button">
            Gerar Relatório
          </Link>
          <Link to="/chat" className="home-button">
            Consultar Informações
          </Link>
          <Link to="/chat" className="home-button">
            Inserir Dados
          </Link>
        </div>
      </div>
    </>
  );
}
