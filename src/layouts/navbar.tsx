import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logoDomRock.png";
import { Button } from "../components/button";

export function Navbar() {
  return (
    <nav className="container">
      <NavLink to="/">
        <img src={logo} alt="Logo" className="logo" />
      </NavLink>
      <div className="rotas">
        <NavLink to="/home" className="nav-link">
          Início
        </NavLink>
        <NavLink to="/chat" className="nav-link">
          Chat
        </NavLink>
        <NavLink to="/usuarios" className="nav-link">
          Usuários
        </NavLink>
        <NavLink to="/relatorios" className="nav-link">
          Relatórios
        </NavLink>
        <Button label={"Sair"}  />
      </div>
    </nav>
  );
}