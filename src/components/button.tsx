// componentes reutilizáveis (botões, inputs, tabelas, etc.)
import React from "react";
import '../styles/button.css';

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
