import React from "react";
import Header from "./components/Header";
import Card from "./components/Card";
import BattlePanel from "./components/BattlePanel";
import Footer from "./components/Footer";
import { useGameLogic } from "./hooks/useGameLogic";
import "./CSS/App.css";

function App() {
  const {
    cartasJogador,
    cartasMaquina,
    placar,
    resultado,
    loading,
    compararAtributo,
    reiniciarJogo,
    ativarModoPikachu,
    ativarModoLendario,
    modoPikachu,
    modoLendario,
    pikachuPop,
    musicEnabled,
    musicVolume,
    cycleVolume,
    getColorForStat,
  } = useGameLogic();

  return (
    <div
      className={`page ${modoPikachu ? "modo-pikachu" : ""} ${
        modoLendario ? "modo-lendario" : ""
      }`}
    >
      <Header
        reiniciarJogo={reiniciarJogo}
        ativarModoPikachu={ativarModoPikachu}
        musicEnabled={musicEnabled}
        musicVolume={musicVolume}
        cycleVolume={cycleVolume}
      />
      <main className="content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Card
              cartasJogador={cartasJogador}
              cartasMaquina={cartasMaquina}
              resultado={resultado}
              getColorForStat={getColorForStat}
            />
            <BattlePanel
              compararAtributo={compararAtributo}
              placar={placar}
              resultado={resultado}
            />
          </>
        )}
        {modoLendario && (
          <div className="legendary-label">⚡🔥 MODO LENDÁRIO 🔥⚡</div>
        )}
        {pikachuPop && (
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
            alt="Pikachu Pop"
            className="pika-pop"
            style={{
              position: "fixed",
              right: "40%",
              top: "50%",
              zIndex: 9999,
              width: "200px",
              height: "200px",
            }}
          />
        )}
      </main>
      <Footer
        ativarModoLendario={ativarModoLendario}
        modoLendario={modoLendario}
      />
    </div>
  );
}

export default App;
