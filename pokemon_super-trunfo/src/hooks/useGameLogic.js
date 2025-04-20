import { useState, useEffect, useCallback } from "react";
import { fetchPokemonDetails } from "../utils/fetchPokemon";

// Gradientes por tipo
const tipoGradienteMap = {
  default: ["#473e3e", "#2a2a2a"],
  water: ["#3f2b96", "#a8c0ff"],
  grass: ["#11998e", "#38ef7d"],
  poison: ["#e100ff", "#1d8348"],
  fire: ["#ff0000", "#f5af19"],
  electric: ["#ff8c00", "#ffa500"],
  bug: ["#8bc34a", "#cddc39"],
  rock: ["#313131", "#8B8B8B"],
  ground: ["#BA8B02", "#5D3A03"],
  fighting: ["#C31432", "#313131"],
  ghost: ["#e100ff", "#3A007F"],
  normal: ["#c8be82", "#696969"],
  flying: ["#11d3f3", "#96b9cd"],
  ice: ["#0083B0", "#00B4DB"],
  psychic: ["#5c03bc", "#e536ab"],
  dragon: ["#43cea2", "#C31432"],
  fairy: ["#f756aa", "#f75672"],
  steel: ["#696969", "#a9a9a9"],
  dark: ["#4b6cb7", "#182848"],
};

// Gradientes especiais por nome
const pokemonEspecialMap = {
  venusaur: ["#102e2b", "#0e4625"],
  charizard: ["#980e0e", "#c00000"],
  blastoise: ["#061453", "#1F45A9"],
  gengar: ["#0d052f", "#300958"],
  alakazam: ["#4dad0d", "#6a0dad"],
  machamp: ["#3c020c", "#5d7480"],
  dragonite: ["#5F1378", "#184E4C"],
  zapdos: ["#ffad05", "#a59e45"],
  moltres: ["#ff4500", "#ffcb05"],
  mew: ["#4b264b", "#e54536"],
  mewtwo: ["#150527", "#210F1B"],
};

// Cores das barras por atributo
export const getColorForStat = (stat) => {
  const statColors = {
    hp: "#F9B32F",
    attack: "#FF7C6C",
    defense: "#22A7F0",
    specialAttack: "#3EDC81",
    specialDefense: "#AB69C6",
    speed: "#9CAAB9",
  };
  return statColors[stat] || "#ccc";
};

// Função para aplicar gradientes a um Pokémon
const aplicarGradiente = (tipoPokemon, nomePokemon) => {
  const nomeLower = nomePokemon.toLowerCase();
  const coresEspeciais = pokemonEspecialMap[nomeLower];
  const tipos = tipoPokemon.split(",").map((t) => t.trim().toLowerCase());

  const coresTipo1 =
    coresEspeciais || tipoGradienteMap[tipos[0]] || tipoGradienteMap.default;
  const coresTipo2 =
    coresEspeciais ||
    (tipos[1]
      ? tipoGradienteMap[tipos[1]] || tipoGradienteMap.default
      : coresTipo1);

  const headerGradient = `linear-gradient(to bottom left, ${coresTipo1[0]}, ${coresTipo2[1]})`;
  const btnGradient = `linear-gradient(to left, ${coresTipo1[0]}, ${coresTipo2[1]})`;

  return { headerGradient, btnGradient, tipos };
};

// Função genérica para criar cartas a partir de dados da PokéAPI
const criarCartasComDetalhes = async (lista) => {
  const detalhes = await Promise.all(
    lista.map((p) => fetchPokemonDetails(p.url))
  );
  return detalhes.map((p) => {
    const gradientes = aplicarGradiente(
      p.types.map((t) => t.type.name).join(", "),
      p.name
    );
    return {
      nome: p.name,
      imagem: p.sprites.front_default,
      tipo: p.types.map((t) => t.type.name).join(", "),
      hp: p.stats[0].base_stat,
      attack: p.stats[1].base_stat,
      defense: p.stats[2].base_stat,
      specialAttack: p.stats[3].base_stat,
      specialDefense: p.stats[4].base_stat,
      speed: p.stats[5].base_stat,
      total: p.stats.reduce((acc, s) => acc + s.base_stat, 0),
      gradientes,
    };
  });
};

// Função para gerar cartas aleatórias comuns
const gerarCartasAleatorias = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const lista = await response.json();
  const selecionados = lista.results
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  return criarCartasComDetalhes(selecionados);
};

// Função para gerar cartas lendárias
const gerarCartasLendarias = async () => {
  const lendarios = [
    { nome: "Mew", url: "https://pokeapi.co/api/v2/pokemon/151/" },
    { nome: "Mewtwo", url: "https://pokeapi.co/api/v2/pokemon/150/" },
    { nome: "Moltres", url: "https://pokeapi.co/api/v2/pokemon/146/" },
    { nome: "Zapdos", url: "https://pokeapi.co/api/v2/pokemon/145/" },
    { nome: "Articuno", url: "https://pokeapi.co/api/v2/pokemon/144/" },
    { nome: "Ho-oh", url: "https://pokeapi.co/api/v2/pokemon/250/" },
    { nome: "Lugia", url: "https://pokeapi.co/api/v2/pokemon/249/" },
    { nome: "Raikou", url: "https://pokeapi.co/api/v2/pokemon/243/" },
    { nome: "Suicune", url: "https://pokeapi.co/api/v2/pokemon/245/" },
    { nome: "Celebi", url: "https://pokeapi.co/api/v2/pokemon/251/" },
    { nome: "Entei", url: "https://pokeapi.co/api/v2/pokemon/244/" },
  ];
  const selecionados = lendarios.sort(() => 0.5 - Math.random()).slice(0, 4);
  return criarCartasComDetalhes(selecionados);
};

// Sons utilitários
const playAudio = (elementId, volume = 0.25) => {
  const audio = document.getElementById(elementId);
  if (audio) {
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => console.warn(`Erro ao tocar som: ${elementId}`));
  }
};

const pauseAudio = (elementId) => {
  const audio = document.getElementById(elementId);
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// Estilos utilitários dinâmicos
const criarEstilo = (identificador, cssContent) => {
  if (!document.querySelector(`style[data-${identificador}]`)) {
    const style = document.createElement("style");
    style.setAttribute(`data-${identificador}`, "true");
    style.textContent = cssContent;
    document.head.appendChild(style);
  }
};

const removerEstilo = (identificador) => {
  const estilo = document.querySelector(`style[data-${identificador}]`);
  if (estilo) estilo.remove();
};

// Partículas visuais
const criarParticulas = (quantidade = 15) => {
  for (let i = 0; i < quantidade; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.animationDelay = `${Math.random() * 4}s`;
    const size = `${Math.random() * 8 + 4}px`;
    p.style.width = size;
    p.style.height = size;
    document.body.appendChild(p);
  }
};

const removerParticulas = () => {
  const particles = document.querySelectorAll(".particle");
  particles.forEach((p) => p.remove());
};

// Mensagens dinâmicas
const showMessage = (message, className, setIsShowingMessage) => {
  if (setIsShowingMessage()) return;
  setIsShowingMessage(true);

  criarEstilo(
    "message-styles",
    `
    .pikachu-message, .legendary-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: var(--font-pokemon);
      font-size: 1.5rem;
      color: yellow;
      background: rgba(0, 0, 0, 0.85);
      padding: 1rem 2rem;
      border: 2px solid yellow;
      border-radius: 10px;
      z-index: 10000;
      animation: blink 0.5s infinite alternate, fadeInOut 3s ease-in-out forwards;
      text-align: center;
      max-width: 90%;
    }
    @keyframes blink {
      0% { opacity: 1; }
      100% { opacity: 0.5; }
    }
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    @media (max-width: 600px) {
      .pikachu-message, .legendary-message {
        font-size: 1rem;
        padding: 0.5rem 1rem;
      }
    }
  `
  );

  const div = document.createElement("div");
  div.className = className;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => {
    div?.remove();
    setIsShowingMessage(false);
  }, 3000);
};

// Modo Pikachu
const ativarModoPikachu = (
  setModoPikachu,
  setCartasJogador,
  setCartasMaquina,
  setIsShowingMessage
) => {
  console.log("Ativando modo Pikachu");
  setModoPikachu(true);
  document.body.classList.add("modo-pikachu");
  playAudio("pikachu-sound", 0.25);
  showMessage(
    "⚡ WOW! Você ativou o modo Pikachu! ⚡",
    "pikachu-message",
    setIsShowingMessage
  );

  criarEstilo(
    "pikachu",
    `
    body.modo-pikachu {
      background: linear-gradient(45deg, #ffeb3b, #fff176);
      animation: relampago 0.5s infinite alternate;
    }
    @keyframes relampago {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.3); }
    }
    .card-wrap {
      box-shadow: 0 0 20px yellow !important;
    }
  `
  );

  const pikachuCard = {
    nome: "Pikachu",
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90,
    total: 320,
    tipo: "electric",
    imagem:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    gradientes: aplicarGradiente("electric", "Pikachu"),
  };

  setCartasJogador([pikachuCard, pikachuCard]);
  setCartasMaquina([pikachuCard, pikachuCard]);
};

const desativarModoPikachu = (setModoPikachu) => {
  console.log("Desativando modo Pikachu");
  setModoPikachu(false);
  document.body.classList.remove("modo-pikachu");
  removerEstilo("pikachu");
};

// Modo Lendário
const ativarModoLendario = async (
  setModoLendario,
  setCartasJogador,
  setCartasMaquina,
  setIsAtivandoLendario,
  setIsShowingMessage
) => {
  console.log("Ativando modo Lendário");
  setIsAtivandoLendario(true);
  setModoLendario(true);
  document.body.classList.add("modo-lendario");
  showMessage(
    "ESSA NÃO! VOCÊ LIBERTOU OS LENDÁRIOS!⚡🔥🌊",
    "legendary-message",
    setIsShowingMessage
  );
  playAudio("legendary-sound", 0.25);

  criarEstilo(
    "lendario",
    `
    body.modo-lendario {
      background: radial-gradient(circle at center, #1b1b1b, #0f0f0f);
      animation: brilhoLendario 0.8s infinite alternate;
    }
    @keyframes brilhoLendario {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.3); }
    }
    .card-wrap {
      box-shadow: 0 0 40px gold !important;
      animation: shake 0.2s infinite alternate;
    }
    @keyframes shake {
      0% { transform: rotate(0.1deg); }
      100% { transform: rotate(-0.1deg); }
    }
    .particle {
      position: fixed;
      pointer-events: none;
      z-index: 999;
      width: 10px;
      height: 10px;
      background: linear-gradient(45deg, yellow, orange, red);
      border-radius: 50%;
      animation: floatParticle 4s linear infinite;
    }
    @keyframes floatParticle {
      0% {
        transform: translateY(100vh) scale(0.8) rotate(0deg);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-10vh) scale(1.2) rotate(360deg);
        opacity: 0;
      }
    }
  `
  );

  criarParticulas();
  const cartas = await gerarCartasLendarias();
  setCartasJogador(cartas.slice(0, 2));
  setCartasMaquina(cartas.slice(2));
  setIsAtivandoLendario(false);
};

const desativarModoLendario = async (
  setModoLendario,
  setIsDesativandoLendario
) => {
  console.log("Desativando modo Lendário");
  setIsDesativandoLendario(true);
  setModoLendario(false);
  document.body.classList.remove("modo-lendario");
  pauseAudio("legendary-sound");
  removerParticulas();
  removerEstilo("lendario");
  setIsDesativandoLendario(false);
};

export function useGameLogic() {
  const [cartasJogador, setCartasJogador] = useState([]);
  const [cartasMaquina, setCartasMaquina] = useState([]);
  const [placar, setPlacar] = useState({ jogador: 0, maquina: 0 });
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(true);
  const [modoPikachu, setModoPikachu] = useState(false);
  const [modoLendario, setModoLendario] = useState(false);
  const [isAtivandoLendario, setIsAtivandoLendario] = useState(false);
  const [isDesativandoLendario, setIsDesativandoLendario] = useState(false);
  const [pikachuPop, setPikachuPop] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.05);
  const [animating, setAnimating] = useState(false);
  const [isShowingMessage, setIsShowingMessage] = useState(false);

  const gerarCartas = useCallback(async () => {
    setLoading(true);
    try {
      const cartas = await gerarCartasAleatorias();
      const somaPower = cartas.reduce((acc, c) => acc + c.total, 0);
      console.log(
        `Soma do Power (total) das cartas: ${somaPower} (${cartas[0].nome}: ${cartas[0].total}, ${cartas[1].nome}: ${cartas[1].total}, ${cartas[2].nome}: ${cartas[2].total}, ${cartas[3].nome}: ${cartas[3].total})`
      );
      if (modoLendario && somaPower < 2200) {
        console.log(
          "Soma do Power < 2200, desativando modo Lendário automaticamente"
        );
        await desativarModoLendario(setModoLendario, setIsDesativandoLendario);
      }
      setCartasJogador(cartas.slice(0, 2));
      setCartasMaquina(cartas.slice(2));
      setResultado("");
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
      setTimeout(gerarCartas, 2000);
    } finally {
      setLoading(false);
    }
  }, [modoLendario]);

  const compararAtributo = useCallback(
    async (atributo) => {
      if (animating) return;
      setAnimating(true);
      try {
        console.log(`Comparando atributo: ${atributo}`);
        document
          .querySelectorAll(".card-wrap")
          .forEach((card) => card.classList.remove("loose"));

        const somaJogador = cartasJogador.reduce(
          (acc, c) => acc + c[atributo],
          0
        );
        const somaMaquina = cartasMaquina.reduce(
          (acc, c) => acc + c[atributo],
          0
        );

        // Log detalhado da comparação
        console.log(
          `${atributo.toUpperCase()} escolhido -> Soma do ${atributo} do Jogador (${
            cartasJogador[0].nome
          }: ${cartasJogador[0][atributo]}, ${cartasJogador[1].nome}: ${
            cartasJogador[1][atributo]
          }) = ${somaJogador}`
        );
        console.log(
          `Soma do ${atributo} da Máquina (${cartasMaquina[0].nome}: ${cartasMaquina[0][atributo]}, ${cartasMaquina[1].nome}: ${cartasMaquina[1][atributo]}) = ${somaMaquina}`
        );

        if (somaJogador > somaMaquina) {
          console.log("Jogador venceu!");
          setResultado("Jogador venceu!");
          setPlacar((prev) => ({ ...prev, jogador: prev.jogador + 1 }));
        } else if (somaJogador < somaMaquina) {
          console.log("Máquina venceu!");
          setResultado("Máquina venceu!");
          setPlacar((prev) => ({ ...prev, maquina: prev.maquina + 1 }));
        } else {
          console.log("Empate!");
          setResultado("Empate!");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        document
          .querySelectorAll(".card-wrap")
          .forEach((card) => card.classList.remove("loose"));
        if (modoPikachu) desativarModoPikachu(setModoPikachu);
        await gerarCartas();
      } catch (error) {
        console.error("Erro ao comparar atributo:", error);
      } finally {
        setAnimating(false);
      }
    },
    [cartasJogador, cartasMaquina, animating, modoPikachu]
  );

  const reiniciarJogo = () => {
    console.log("Reiniciando o jogo");
    try {
      setPlacar({ jogador: 0, maquina: 0 });
      setResultado("");
      desativarModoPikachu(setModoPikachu);
      setPikachuPop(false);
      document
        .querySelectorAll(".card-wrap")
        .forEach((card) => card.classList.remove("loose"));
      gerarCartas();
    } catch (error) {
      console.error("Erro ao reiniciar jogo:", error);
    }
  };

  const ativarPikachuEspecial = () => {
    if (pikachuPop) return;
    console.log("Ativando Pikachu Especial (P + K)");
    setPikachuPop(true);
    showMessage(
      "⚡ Você achou o Pikachu Secreto! ⚡",
      "pikachu-message",
      setIsShowingMessage
    );
    playAudio("pikachu-especial-sound", 0.25);
    setTimeout(() => setPikachuPop(false), 5000);
  };

  const cycleVolume = () => {
    try {
      const levels = [0, 0.05, 0.15, 0.25];
      const currentIndex = levels.indexOf(musicVolume);
      const nextVolume = levels[(currentIndex + 1) % levels.length];
      setMusicVolume(nextVolume);
      setMusicEnabled(nextVolume > 0);
      const music = document.getElementById("bg-music");
      if (music) {
        music.volume = nextVolume;
        if (nextVolume > 0) music.play().catch(() => setMusicEnabled(false));
        else music.pause();
      }
    } catch (error) {
      console.error("Erro ao ajustar volume:", error);
    }
  };

  useEffect(() => {
    gerarCartas();
    try {
      const music = document.getElementById("bg-music");
      music.volume = musicVolume;
      if (musicEnabled) music.play().catch(() => setMusicEnabled(false));
    } catch (error) {
      console.error("Erro ao iniciar música de fundo:", error);
    }

    const keysPressed = [];
    const handleKeyDown = (e) => {
      if (pikachuPop) return;
      keysPressed.push(e.key.toLowerCase());
      if (keysPressed.length > 2) keysPressed.shift();
      if (keysPressed.join("") === "pk") {
        ativarPikachuEspecial();
        keysPressed.length = 0;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pikachuPop]);

  return {
    cartasJogador,
    cartasMaquina,
    placar,
    resultado,
    loading,
    compararAtributo,
    reiniciarJogo,
    ativarModoPikachu: () =>
      ativarModoPikachu(
        setModoPikachu,
        setCartasJogador,
        setCartasMaquina,
        setIsShowingMessage
      ),
    ativarModoLendario: () =>
      ativarModoLendario(
        setModoLendario,
        setCartasJogador,
        setCartasMaquina,
        setIsAtivandoLendario,
        setIsShowingMessage
      ),
    modoPikachu,
    modoLendario,
    pikachuPop,
    musicEnabled,
    musicVolume,
    cycleVolume,
    getColorForStat,
    gerarCartas,
    desativarModoLendario: () =>
      desativarModoLendario(setModoLendario, setIsDesativandoLendario),
  };
}
