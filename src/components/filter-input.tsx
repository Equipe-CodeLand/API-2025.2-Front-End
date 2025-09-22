import React from "react";
import "../styles/filter-input.css";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ type = "text", placeholder, value, onChange }: InputProps) {
  return (
    <input
      type={type}
      className="filter-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
