import React, { useState } from "react";
import "../styles/relatorio.css";
import { Button } from "../components/button";
import Input from "../components/filter-input";

type Filters = {
  nome: string;
  data: string;
  quantidade: string;
};

export default function Relatorios() {
  const [filters, setFilters] = useState({
    nome: "",
    data: "",
    quantidade: "",
  });

  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
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
            <Button label={"Novo Relatório"} />
          </div>
        </div>
      </div>

      <div className="relatorio-listing-content">
        <div className="relatorio-content">
          <details className="relatorio-details">
            <summary className="relatorio-summary">
              <div className="summary-left">
                <h1>Relatório 1</h1>
                <span>19/09/2025</span>
              </div>
              <Button label={"Enviar por Email"} />
            </summary>

            <div className="relatorio-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas mattis justo dui, et porta odio pellentesque et. Donec
                facilisis rhoncus eleifend. Etiam ligula ex, fermentum porttitor
                auctor a, vestibulum eget ipsum. Aenean mollis posuere turpis,
                vel molestie nibh convallis a. Etiam a nibh non odio gravida
                ornare. Mauris vel ante ultricies lorem placerat ultricies.
                Donec commodo, tortor in efficitur ultrices, ligula erat
                hendrerit ligula, ut vulputate lorem mauris at justo. Nullam
                tristique, odio ac faucibus viverra, massa nulla sollicitudin
                erat, nec faucibus felis elit quis leo. Ut auctor ac felis et
                scelerisque. Nullam luctus sodales orci sed cursus. Quisque
                mattis vitae dolor id hendrerit. Aenean iaculis pulvinar est.
                Fusce ultrices auctor orci, vitae interdum purus interdum eu.
                Donec pharetra nunc sed interdum feugiat. Sed nec imperdiet
                orci, vel aliquam nibh. Phasellus ac elit massa.
              </p>
            </div>
          </details>
          <details className="relatorio-details">
            <summary className="relatorio-summary">
              <div className="summary-left">
                <h1>Relatório 2</h1>
                <span>19/09/2025</span>
              </div>
              <Button label={"Enviar por Email"} />
            </summary>

            <div className="relatorio-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas mattis justo dui, et porta odio pellentesque et. Donec
                facilisis rhoncus eleifend. Etiam ligula ex, fermentum porttitor
                auctor a, vestibulum eget ipsum. Aenean mollis posuere turpis,
                vel molestie nibh convallis a. Etiam a nibh non odio gravida
                ornare. Mauris vel ante ultricies lorem placerat ultricies.
                Donec commodo, tortor in efficitur ultrices, ligula erat
                hendrerit ligula, ut vulputate lorem mauris at justo. Nullam
                tristique, odio ac faucibus viverra, massa nulla sollicitudin
                erat, nec faucibus felis elit quis leo. Ut auctor ac felis et
                scelerisque. Nullam luctus sodales orci sed cursus. Quisque
                mattis vitae dolor id hendrerit. Aenean iaculis pulvinar est.
                Fusce ultrices auctor orci, vitae interdum purus interdum eu.
                Donec pharetra nunc sed interdum feugiat. Sed nec imperdiet
                orci, vel aliquam nibh. Phasellus ac elit massa.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
