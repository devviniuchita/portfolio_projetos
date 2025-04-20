import React, { useState, useEffect } from "react";
import "../CSS/header.css";

const Header = ({
  reiniciarJogo,
  ativarModoPikachu,
  musicEnabled,
  musicVolume,
  cycleVolume,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const volumeIcons = ["🔇", "🔈", "🔉", "🔊"];
  const volumeTitles = [
    "Música Muda",
    "Volume Baixo (5%)",
    "Volume Médio (15%)",
    "Volume Alto (25%)",
  ];
  const volumeLevels = [0, 0.05, 0.15, 0.25];
  const currentVolumeIndex = volumeLevels.indexOf(musicVolume);

  const handleEasterEggClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        ativarModoPikachu();
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    const volumeControl = document.getElementById("volumeControl");
    if (volumeControl) volumeControl.value = musicVolume;
  }, [musicVolume]);

  return (
    <header className="header">
      <div
        className="easter-egg-trigger"
        title="Clique 5x para uma surpresa!"
        onClick={handleEasterEggClick}
      ></div>
      <div className="header__content">
        <h1 className="header__title">
          <a href="/" className="header__link">
            POKÉMON
          </a>
        </h1>
        <div className="music-controls">
          <button
            id="toggleMusic"
            className="music-toggle"
            title={volumeTitles[currentVolumeIndex]}
            onClick={cycleVolume}
          >
            {volumeIcons[currentVolumeIndex]}
          </button>
          <div className="volume-container">
            <span className="volume-label">
              {Math.round(musicVolume * 100)}%
            </span>
            <input
              type="range"
              id="volumeControl"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                cycleVolume(newVolume);
              }}
            />
          </div>
        </div>
        <nav className="nav">
          <div className="nav__group">
            <p className="nav__description">
              Super Trunfo Card Game Battle - Escolha o Atributo e vença!
            </p>
            <button
              className="floating-button"
              id="restartButton"
              title="Reiniciar Jogo"
              onClick={reiniciarJogo}
            >
              <img
                className="floating-button__icon"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Pokebola para reiniciar o jogo"
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
