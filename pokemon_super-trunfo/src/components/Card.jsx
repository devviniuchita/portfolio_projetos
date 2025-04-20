import React from "react";
import "../CSS/card.css";

const Card = ({ cartasJogador, cartasMaquina, resultado, getColorForStat }) => {
  const isPlayerLoose = resultado === "Máquina venceu!";
  const isMachineLoose = resultado === "Jogador venceu!";

  const renderCard = (carta, idPrefix, index, isLoose) => {
    const {
      gradientes,
      nome,
      imagem,
      tipo,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed,
      total,
    } = carta;
    const stats = [
      { id: `${idPrefix}_attribute2`, label: "HP", value: hp, name: "hp" },
      {
        id: `${idPrefix}_attribute3`,
        label: "Attack",
        value: attack,
        name: "attack",
      },
      {
        id: `${idPrefix}_attribute4`,
        label: "Defense",
        value: defense,
        name: "defense",
      },
      {
        id: `${idPrefix}_attribute5`,
        label: "Spc.Attack",
        value: specialAttack,
        name: "specialAttack",
      },
      {
        id: `${idPrefix}_attribute6`,
        label: "Spc.Defense",
        value: specialDefense,
        name: "specialDefense",
      },
      {
        id: `${idPrefix}_attribute7`,
        label: "Speed",
        value: speed,
        name: "speed",
      },
    ];

    return (
      <div
        className={`card-wrap ${isLoose ? "loose" : ""}`}
        style={{ background: gradientes.cardGradient }}
      >
        <div
          className={`card-header ${["one", "two", "three", "four"][index]}`}
          style={{ background: gradientes.headerGradient }}
        >
          <img
            id={`${idPrefix}_image`}
            src={imagem}
            alt={`Pokémon ${nome}`}
            loading="lazy"
          />
          <h2
            className="pokemon-name"
            id={`${idPrefix}_animal`}
            style={{
              background: `linear-gradient(to right, ${gradientes.tipos[0]})`,
            }}
          >
            {nome}
          </h2>
        </div>
        <div
          className="card-content"
          id={`card${idPrefix.replace(
            /^(player|machine)\d/,
            (m) => m.charAt(0).toUpperCase() + m.slice(1)
          )}`}
        >
          <p
            className="pokemon-type"
            id={`${idPrefix}_attribute1`}
            style={{ background: gradientes.btnGradient }}
          >
            {gradientes.tipos.join(" / ")}
          </p>
          <div className="card-text" id={`${idPrefix}_stats`}>
            {stats.map((stat) => (
              <div key={stat.id}>
                <p id={stat.id}>{`${stat.label}: ${stat.value}`}</p>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{
                      width: `${Math.min(stat.value / 1.3, 100)}%`,
                      backgroundColor: getColorForStat(stat.name),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            className={`card-btn ${["one", "two", "three", "four"][index]}`}
            style={{ background: gradientes.btnGradient }}
          >
            <p id={`${idPrefix}_attribute8`}>Power {total}</p>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="cards">
      <div className="cards__player">
        {cartasJogador.map((carta, index) => (
          <React.Fragment key={`player${index}`}>
            {renderCard(carta, `player${index + 1}`, index, isPlayerLoose)}
            {index === 0 && <div className="plus">+</div>}
          </React.Fragment>
        ))}
      </div>
      <div className="vs">VS</div>
      <div className="cards__machine">
        {cartasMaquina.map((carta, index) => (
          <React.Fragment key={`machine${index}`}>
            {renderCard(
              carta,
              `machine${index + 1}`,
              index + 2,
              isMachineLoose
            )}
            {index === 0 && <div className="plus">+</div>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Card;
