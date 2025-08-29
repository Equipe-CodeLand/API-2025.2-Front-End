// componentes reutilizáveis (botões, inputs, tabelas, etc.)
import React from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
