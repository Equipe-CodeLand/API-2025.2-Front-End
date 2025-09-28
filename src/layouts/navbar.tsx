import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logoDomRock.png";
import { Button } from "../components/button";
import { removeToken, isAdmin } from "../utils/auth"; // Import isAdmin function

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    sessionStorage.removeItem('loginFormState');
    navigate("/", { replace: true });
  };

  // Check if user is admin
  const userIsAdmin = isAdmin();

  return (
    <nav className="container">
      <NavLink to="/home">
        <img src={logo} alt="Logo" className="logo" />
      </NavLink>
      <div className="rotas">
        <NavLink to="/home" className="nav-link">
          Início
        </NavLink>
        <NavLink to="/chat" className="nav-link">
          Chat
        </NavLink>
        {userIsAdmin && ( // Only show "Usuários" link for admins
          <NavLink to="/usuarios" className="nav-link">
            Usuários
          </NavLink>
        )}
        <NavLink to="/relatorios" className="nav-link">
          Relatórios
        </NavLink>
        <Button label={"Sair"} onClick={handleLogout} />
      </div>
    </nav>
  );
}