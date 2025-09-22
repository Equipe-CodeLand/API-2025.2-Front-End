import React, { useState } from "react";
import "../styles/cadastro.css";
import { cadastrarUsuario } from "../services/axiosService";
import Swal from "sweetalert2";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [receberEmails, setReceberEmails] = useState(true);
  const [mensagem, setMensagem] = useState("");

const handleCadastro = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!nome.trim() || !email.trim() || !senha.trim() || !cargo.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Atenção",
      text: "Por favor, preencha todos os campos!",
      confirmButtonColor: "#8A00C4",
    });
    return;
  }

  try {
    await cadastrarUsuario(nome, email, senha, cargo, receberEmails);

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Usuário cadastrado com sucesso!",
      confirmButtonColor: "#8A00C4",
    });

    setNome("");
    setEmail("");
    setSenha("");
    setCargo("");
    setReceberEmails(true);
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: error.response?.data?.mensagem || "Erro ao cadastrar usuário. Tente novamente.",
      confirmButtonColor: "#8A00C4",
    });
  }
};


  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>

      <form onSubmit={handleCadastro} className="cadastro-form">
        <label>
          Nome
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        <label>
          Cargo
          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="">Selecione um cargo</option>
            <option value="Administrador">Administrador</option>
            <option value="Funcionario">Funcionário</option>
          </select>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={receberEmails}
            onChange={(e) => setReceberEmails(e.target.checked)}
          />
          Deseja receber os emails automáticos?
        </label>


        <button type="submit" className="custom-button">
          Cadastrar
        </button>
      </form>

      {mensagem && <p className="cadastro-mensagem">{mensagem}</p>}
    </div>
  );
}
