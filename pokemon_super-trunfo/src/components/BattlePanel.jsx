import React from "react";
import "../CSS/battle.css";

const BattlePanel = ({ compararAtributo, placar, resultado }) => {
  const atributos = [
    { id: "btnHP", attr: "hp", label: "HP" },
    { id: "btnAttack", attr: "attack", label: "Attack" },
    { id: "btnDefense", attr: "defense", label: "Defense" },
    { id: "btnSpecialAttack", attr: "specialAttack", label: "Special Attack" },
    {
      id: "btnSpecialDefense",
      attr: "specialDefense",
      label: "Special Defense",
    },
    { id: "btnSpeed", attr: "speed", label: "Speed" },
  ];

  return (
    <section className="battle">
      <div className="game_buttons">
        {atributos.map(({ id, attr, label }) => (
          <button key={id} id={id} onClick={() => compararAtributo(attr)}>
            {label}
          </button>
        ))}
      </div>
      <div className="battle__result" id="result">
        {resultado}
      </div>
      <div className="battle__score">
        <p>
          Placar: Jogador <span id="scoreJogador">{placar.jogador}</span> x{" "}
          <span id="scoreMaquina">{placar.maquina}</span> Máquina
        </p>
      </div>
    </section>
  );
};

export default BattlePanel;
