import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logoDomRock.png";
import { Button } from "../components/button";

export function Navbar() {
  return (
    <nav className="container">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="rotas">
        <Link to="/home" className="nav-link">
          Início
        </Link>
        <Link to="/chat" className="nav-link">
          Chat
        </Link>
        <Link to="/usuarios" className="nav-link">
          Usuários
        </Link>
        <Link to="/relatorios" className="nav-link">
          Relatórios
        </Link>
        <Button label={"Sair"}  />
      </div>
    </nav>
  );
}