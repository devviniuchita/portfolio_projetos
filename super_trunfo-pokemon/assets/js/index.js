// Cache de elementos do DOM para consultas
const elementosDOM = {
  player1: {
    animal: document.getElementById("player1_animal"),
    attribute1: document.getElementById("player1_attribute1"),
    attribute2: document.getElementById("player1_attribute2"),
    attribute3: document.getElementById("player1_attribute3"),
    attribute4: document.getElementById("player1_attribute4"),
    attribute5: document.getElementById("player1_attribute5"),
    attribute6: document.getElementById("player1_attribute6"),
    attribute7: document.getElementById("player1_attribute7"),
    attribute8: document.getElementById("player1_attribute8"),
    image: document.getElementById("first-player_image"),
  },
  player2: {
    animal: document.getElementById("player2_animal"),
    attribute1: document.getElementById("player2_attribute1"),
    attribute2: document.getElementById("player2_attribute2"),
    attribute3: document.getElementById("player2_attribute3"),
    attribute4: document.getElementById("player2_attribute4"),
    attribute5: document.getElementById("player2_attribute5"),
    attribute6: document.getElementById("player2_attribute6"),
    attribute7: document.getElementById("player2_attribute7"),
    attribute8: document.getElementById("player2_attribute8"),
    image: document.getElementById("second-player_image"),
  },
  machine1: {
    animal: document.getElementById("machine1_animal"),
    attribute1: document.getElementById("machine1_attribute1"),
    attribute2: document.getElementById("machine1_attribute2"),
    attribute3: document.getElementById("machine1_attribute3"),
    attribute4: document.getElementById("machine1_attribute4"),
    attribute5: document.getElementById("machine1_attribute5"),
    attribute6: document.getElementById("machine1_attribute6"),
    attribute7: document.getElementById("machine1_attribute7"),
    attribute8: document.getElementById("machine1_attribute8"),
    image: document.getElementById("first-machine_image"),
  },
  machine2: {
    animal: document.getElementById("machine2_animal"),
    attribute1: document.getElementById("machine2_attribute1"),
    attribute2: document.getElementById("machine2_attribute2"),
    attribute3: document.getElementById("machine2_attribute3"),
    attribute4: document.getElementById("machine2_attribute4"),
    attribute5: document.getElementById("machine2_attribute5"),
    attribute6: document.getElementById("machine2_attribute6"),
    attribute7: document.getElementById("machine2_attribute7"),
    attribute8: document.getElementById("machine2_attribute8"),
    image: document.getElementById("second-machine_image"),
  },
  result: document.getElementById("result"),
  scoreJogador: document.getElementById("scoreJogador"),
  scoreMaquina: document.getElementById("scoreMaquina"),
};

let cartasJogador = [];
let cartasMaquina = [];
let scoreJogador = 0;
let scoreMaquina = 0;

// Função para remover classe .loose
function removerClasseLoose() {
  document
    .querySelectorAll(".cards__player .card-wrap, .cards__machine .card-wrap")
    .forEach((card) => card.classList.remove("loose"));
}

// Função para atualizar placar e resultado
function atualizarPlacar(resultado, cartasDerrotadas) {
  if (resultado === "jogador") {
    scoreJogador++;
    cartasDerrotadas.forEach((card) => card.classList.add("loose"));
    elementosDOM.result.textContent = "Jogador venceu!";
  } else if (resultado === "maquina") {
    scoreMaquina++;
    cartasDerrotadas.forEach((card) => card.classList.add("loose"));
    elementosDOM.result.textContent = "Máquina venceu!";
  } else {
    elementosDOM.result.textContent = "Empate!";
  }

  elementosDOM.scoreJogador.textContent = scoreJogador;
  elementosDOM.scoreMaquina.textContent = scoreMaquina;
}

// Função para comparar atributos
function compararAtributo(atributo) {
  removerClasseLoose();

  const cartasJogadorWrap = document.querySelectorAll(
    ".cards__player .card-wrap"
  );
  const cartasMaquinaWrap = document.querySelectorAll(
    ".cards__machine .card-wrap"
  );

  const somaJogador = cartasJogador.reduce(
    (sum, carta) => sum + carta[atributo],
    0
  );
  const somaMaquina = cartasMaquina.reduce(
    (sum, carta) => sum + carta[atributo],
    0
  );

  if (somaJogador > somaMaquina) {
    atualizarPlacar("jogador", cartasMaquinaWrap);
  } else if (somaJogador < somaMaquina) {
    atualizarPlacar("maquina", cartasJogadorWrap);
  } else {
    atualizarPlacar("empate", []);
  }

  setTimeout(() => {
    removerClasseLoose();
    desativarModoPikachu();
    desativarModoLendario();
    inicializarJogo();
  }, 2000);
}

// Mapeamento completo de tipos para gradientes
const tipoGradienteMap = {
  default: ["#473e3e", "#2a2a2a"], // Fallback para tipos desconhecidos
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
  normal: ["#c8be82", "#696969", "#4a235a"],
  flying: ["#11d3f3", "#96b9cd"],
  ice: ["#0083B0", "#00B4DB"],
  psychic: ["#5c03bc", "#e536ab"],
  dragon: ["#43cea2", "#C31432"],
  fairy: ["#f756aa", "#f75672"],
  steel: ["#696969", "#a9a9a9"],
  dark: ["#4b6cb7", "#182848"],
};

// Mapeamento de Pokémon especiais com gradientes personalizados
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

// Função para aplicar gradiente baseado no tipo do Pokémon
function aplicarGradientePokemon(cardElement, tipoPokemon, nomePokemon) {
  // Verifica se é um Pokémon especial
  const nomeLower = nomePokemon.toLowerCase();
  const coresEspeciais = pokemonEspecialMap[nomeLower];
  // Separa todos os tipos (remove espaços e coloca em minúsculas)
  const tipos = tipoPokemon.split(",").map((t) => t.trim().toLowerCase());

  // Obtém as cores para cada tipo (com fallback)
  let coresTipo1, coresTipo2;

  if (coresEspeciais) {
    // Usa cores personalizadas para Pokémon especiais
    coresTipo1 = coresEspeciais;
    coresTipo2 = coresEspeciais;
  } else {
    // Usa cores padrão baseadas no tipo
    coresTipo1 = tipoGradienteMap[tipos[0]] || tipoGradienteMap.default;
    coresTipo2 = tipos[1]
      ? tipoGradienteMap[tipos[1]] || tipoGradienteMap.default
      : coresTipo1;
  }

  // Define os gradientes baseado no número de tipos
  const cardGradient =
    tipos.length > 1 && !coresEspeciais
      ? `linear-gradient(135deg, ${coresTipo1[0]}, ${coresTipo2[1]})` // Mistura os dois tipos
      : `linear-gradient(135deg, ${coresTipo1[0]}, ${coresTipo1[1]})`; // Gradiente normal

  const headerGradient =
    tipos.length > 1 && !coresEspeciais
      ? `linear-gradient(to bottom left, ${coresTipo1[0]}, ${coresTipo2[1]})`
      : `linear-gradient(to bottom left, ${coresTipo1[0]}, ${coresTipo1[1]})`;

  const btnGradient =
    tipos.length > 1 && !coresEspeciais
      ? `linear-gradient(to left, ${coresTipo1[0]}, ${coresTipo2[1]})`
      : `linear-gradient(to left, ${coresTipo1[0]}, ${coresTipo1[1]})`;

  // Aplica os gradientes nos elementos do card
  if (cardElement) {
    // Cabeçalho do card
    const cardHeader = cardElement.querySelector(".card-header");
    if (cardHeader) {
      cardHeader.style.background = headerGradient;
    }

    // Botão do card
    const cardBtn = cardElement.querySelector(".card-btn");
    if (cardBtn) {
      cardBtn.style.background = btnGradient;
    }

    // Badge de tipo (mostra ambos os tipos se existirem)
    const typeBadge = cardElement.querySelector(".pokemon-type");
    if (typeBadge) {
      typeBadge.textContent = tipos.join(" / "); // Ex: "grass / poison"
      typeBadge.style.background = btnGradient;
      typeBadge.style.color = "#fff";

      // Ajusta o padding se tiver dois tipos
      if (tipos.length > 1) {
        typeBadge.style.padding = "4px 8px";
        typeBadge.style.fontSize = "12px";
      }
    }

    // Nome do Pokémon (opcional - mantém o gradiente do tipo primário)
    const pokemonName = cardElement.querySelector(".pokemon-name");
    if (pokemonName) {
      pokemonName.style.background = `linear-gradient(to right, ${coresTipo1[0]}, ${coresTipo1[1]})`;
      pokemonName.style.padding = "5px 10px";
      pokemonName.style.borderRadius = "15px";
      pokemonName.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    }
  }
}

// Função para obter a cor correspondente ao atributo
function getColorForStat(stat) {
  const colors = {
    HP: "#F9B32F",
    Attack: "#FF7C6C",
    Defense: "#22A7F0",
    SpecialAttack: "#3EDC81",
    SpecialDefense: "#AB69C6",
    Speed: "#9CAAB9",
  };
  return colors[stat] || "#ccc";
}

function criarBarraAtributo(valor, statName) {
  const barContainer = document.createElement("div");
  barContainer.classList.add("stat-bar");

  const barFill = document.createElement("div");
  barFill.classList.add("stat-fill");
  barFill.style.width = `${Math.min(valor / 1.3, 100)}%`; //ajuste de proporção de barra de status;
  barFill.style.backgroundColor = getColorForStat(statName);

  barContainer.appendChild(barFill);
  return barContainer;
}

// Função para atualizar os cards na tela
function atualizarCartas(pokemonCards) {
  requestAnimationFrame(() => {
    const atualizarCarta = async (carta, elementos) => {
      elementos.animal.textContent = carta.nome;
      elementos.attribute1.textContent = `${carta.tipo}`;
      elementos.attribute2.textContent = `HP: ${carta.hp}`;
      elementos.attribute3.textContent = `Attack: ${carta.attack}`;
      elementos.attribute4.textContent = `Defense: ${carta.defense}`;
      elementos.attribute5.textContent = `Spc.Attack: ${carta.specialAttack}`;
      elementos.attribute6.textContent = `Spc.Defense: ${carta.specialDefense}`;
      elementos.attribute7.textContent = `Speed: ${carta.speed}`;
      elementos.attribute8.textContent = `Power ${carta.total}`;

      // Adiciona as barras coloridas
      adicionarBarrasAosAtributos(elementos, carta);

      if (elementos.image.src !== carta.imagem) {
        elementos.image.src = carta.imagem;
        try {
          await elementos.image.decode();
        } catch (error) {
          console.error("Erro ao decodificar a imagem:", error);
        }
      }

      // Aplica o gradiente
      const cardWrap = elementos.image.closest(".card-wrap");
      aplicarGradientePokemon(cardWrap, carta.tipo, carta.nome);
    };

    atualizarCarta(pokemonCards[0], elementosDOM.player1);
    atualizarCarta(pokemonCards[1], elementosDOM.player2);
    atualizarCarta(pokemonCards[2], elementosDOM.machine1);
    atualizarCarta(pokemonCards[3], elementosDOM.machine2);
  });

  // Aplica gradiente no fundo do card
  const tipoPrincipal = carta.tipo.split(",")[0].trim().toLowerCase();
  const cores = tipoGradienteMap[tipoPrincipal];

  if (cores) {
    const cardWrap = elementos.image.closest(".card-wrap");
    cardWrap.style.background = `linear-gradient(135deg, ${cores[0]}, ${cores[1]})`;
    cardWrap.style.color = "#fff";
  }
}

// Adicione esta nova função para adicionar as barras
function adicionarBarrasAosAtributos(elementos, carta) {
  const statsMap = {
    attribute2: { value: carta.hp, name: "HP" },
    attribute3: { value: carta.attack, name: "Attack" },
    attribute4: { value: carta.defense, name: "Defense" },
    attribute5: { value: carta.specialAttack, name: "SpecialAttack" },
    attribute6: { value: carta.specialDefense, name: "SpecialDefense" },
    attribute7: { value: carta.speed, name: "Speed" },
  };

  Object.entries(statsMap).forEach(([attr, stat]) => {
    // Remove a barra de status anterior se existir
    const existingBar = elementos[attr].nextElementSibling;
    if (existingBar && existingBar.classList.contains("stat-bar")) {
      existingBar.remove();
    }

    // Adiciona a nova barra de status
    const barra = criarBarraAtributo(stat.value, stat.name);
    elementos[attr].parentNode.insertBefore(barra, elementos[attr].nextSibling);
  });
}
// Função para gerar cartas de Pokémon
async function generatePokemonCards() {
  const pokemonList = await fetchPokemonData();
  const selectedPokemon = pokemonList
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
  const pokemonDetails = await Promise.all(
    selectedPokemon.map((p) => fetchPokemonDetails(p.url))
  );

  return pokemonDetails.map((pokemon) => ({
    nome: pokemon.name,
    hp: pokemon.stats[0].base_stat,
    attack: pokemon.stats[1].base_stat,
    defense: pokemon.stats[2].base_stat,
    specialAttack: pokemon.stats[3].base_stat,
    specialDefense: pokemon.stats[4].base_stat,
    speed: pokemon.stats[5].base_stat,
    total: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
    tipo: pokemon.types.map((t) => t.type.name.toLowerCase()).join(", "),
    imagem: pokemon.sprites.front_default,
  }));
}

// Fetch da lista de Pokémon
async function fetchPokemonData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  return data.results;
}

// Fetch de detalhes do Pokémon
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Função para iniciar o jogo
async function inicializarJogo() {
  const pokemonCards = await generatePokemonCards();
  cartasJogador = pokemonCards.slice(0, 2);
  cartasMaquina = pokemonCards.slice(2, 4);
  atualizarCartas(pokemonCards);
}

// Mapeia os botões aos atributos corretos
const atributosMap = {
  HP: "hp",
  Attack: "attack",
  Defense: "defense",
  SpecialAttack: "specialAttack",
  SpecialDefense: "specialDefense",
  Speed: "speed",
};

Object.entries(atributosMap).forEach(([botao, atributo]) => {
  document
    .getElementById(`btn${botao}`)
    .addEventListener("click", () => compararAtributo(atributo));
});

// Eventos / Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", inicializarJogo);

// Easter Egg: Modo Pikachu
let clickCount = 0;
const trigger = document.querySelector(".easter-egg-trigger");

trigger.addEventListener("click", () => {
  clickCount++;
  if (clickCount >= 5) {
    ativarModoPikachu();
    clickCount = 0;
  }
});

function ativarModoPikachu() {
  alert("Ah, não! Você ativou o  ⚡ Modo Pikachu! ⚡");

  document.body.classList.add("modo-pikachu");
  const pikachuSound = document.getElementById("pikachu-sound");
  pikachuSound.currentTime = 0;
  pikachuSound.play().catch(() => {
    console.warn("Não foi possível reproduzir o som do Pikachu.");
  });

  // Exemplo de estilo dinâmico: troca o fundo, adiciona efeito etc
  const style = document.createElement("style");
  style.setAttribute("data-pikachu", "true");
  style.textContent = `
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
`;

  document.head.appendChild(style);

  // Substitui todas as cartas por Pikachu
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
  };

  cartasJogador = [pikachuCard, pikachuCard];
  cartasMaquina = [pikachuCard, pikachuCard];
  atualizarCartas([pikachuCard, pikachuCard, pikachuCard, pikachuCard]);
}

// ==========================
// 🛡️ Easter Egg: Modo Lendário
// ==========================
let clickCountLegendary = 0;
const legendaryTrigger = document.querySelector(".easter-egg-legendary");

legendaryTrigger.addEventListener("click", () => {
  clickCountLegendary++;
  if (clickCountLegendary >= 5) {
    ativarModoLendario();
    clickCountLegendary = 0;
  }
});

async function ativarModoLendario() {
  alert("ESSA NÃO! VOCÊ LIBEROU OS LENDÁRIOS!⚡🔥🌊");
  document.body.classList.add("modo-lendario");

  // Cria o título “Modo Lendário” piscando no topo
  if (!document.querySelector(".legendary-label")) {
    const label = document.createElement("div");
    label.className = "legendary-label";
    label.textContent = "⚡🔥 MODO LENDÁRIO 🔥⚡";
    document.body.appendChild(label);
  }

  // 🎨 Estilo visual lendário
  if (!document.querySelector("style[data-lendario]")) {
    const style = document.createElement("style");
    style.setAttribute("data-lendario", "true");
    style.textContent = `
  body.modo-lendario {
    background: radial-gradient(circle at center, #1b1b1b, #0f0f0f);
  animation: brilhoLendario 0.8s infinite alternate;
  }
  @keyframes brilhoLendario {
    0% { filter: brightness(1); }
    100% { filter: brightness(1.3); }
  }
  .legendary-label {
    position: fixed;
    top: 2%;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-pokemon, 'Arial Black');
    font-size: 2rem;
    color: gold;
    background: rgba(0,0,0,0.75);
    padding: 0.5rem 1rem;
    border: 3px solid gold;
    border-radius: 15px;
    z-index: 9999;
    animation: piscar 1s infinite;
    box-shadow: 0 0 15px gold;
  }
  @keyframes piscar {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
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
    @media (max-width: 600px) {
  .legendary-label {
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    border-width: 2px;
  }
}
`;

    document.head.appendChild(style);
  }

  // Gera partículas flamejantes e raios
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.animationDelay = Math.random() * 4 + "s";
    p.style.width = Math.random() * 8 + 4 + "px";
    p.style.height = p.style.width;
    document.body.appendChild(p);
  }

  // 🎶 Música lendária
  const legendaryAudio = document.getElementById("legendary-sound");
  if (legendaryAudio) {
    legendaryAudio.currentTime = 0;
    legendaryAudio.volume = 0.25;
    legendaryAudio.play().catch(() => {
      console.warn("Não foi possível tocar a música lendária.");
    });
  }

  // Lista de Pokémon lendários com nome e url da API
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

  // Sorteia 4 Pokémon
  const selecionados = lendarios.sort(() => 0.5 - Math.random()).slice(0, 4);

  // Busca os dados reais da API
  const detalhes = await Promise.all(
    selecionados.map((p) => fetchPokemonDetails(p.url))
  );

  const cartas = detalhes.map((pokemon) => ({
    nome: pokemon.name,
    imagem: pokemon.sprites.front_default,
    tipo: pokemon.types.map((t) => t.type.name).join(", "),
    hp: pokemon.stats[0].base_stat,
    attack: pokemon.stats[1].base_stat,
    defense: pokemon.stats[2].base_stat,
    specialAttack: pokemon.stats[3].base_stat,
    specialDefense: pokemon.stats[4].base_stat,
    speed: pokemon.stats[5].base_stat,
    total: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
  }));

  cartasJogador = [cartas[0], cartas[1]];
  cartasMaquina = [cartas[2], cartas[3]];
  atualizarCartas(cartas);
}

function desativarModoLendario() {
  document.body.classList.remove("modo-lendario");

  const estilo = document.querySelector("style[data-lendario]");
  if (estilo) estilo.remove();

  // Remove o label da tela
  const label = document.querySelector(".legendary-label");
  if (label) label.remove();

  // Remove partículas lendárias
  document.querySelectorAll(".particle").forEach((p) => p.remove());

  const legendaryAudio = document.getElementById("legendary-sound");
  if (legendaryAudio) {
    legendaryAudio.pause();
    legendaryAudio.currentTime = 0;
  }
}

// Easter Egg: Teclas P + K = Pikachu especial
let keysPressed = [];

document.addEventListener("keydown", (e) => {
  keysPressed.push(e.key.toLowerCase());

  // Mantém apenas os últimos 2 caracteres digitados
  if (keysPressed.length > 2) keysPressed.shift();

  if (keysPressed.join("") === "pk") {
    // Cria imagem do Pikachu
    const pika = document.createElement("img");
    pika.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
    pika.style.position = "fixed";
    pika.style.right = "40%";
    pika.style.top = "50%";
    pika.style.zIndex = "9999";
    pika.style.width = "200px";
    pika.style.height = "200px";
    pika.style.transition = "transform 0.3s ease-in-out";
    pika.classList.add("pika-pop");

    document.body.appendChild(pika);

    // Toca o áudio especial salvo localmente
    const pikaSound = document.getElementById("pikachu-especial-sound");
    if (pikaSound) {
      pikaSound.currentTime = 0;
      pikaSound.play().catch(() => {
        console.warn("Não foi possível tocar o som especial do Pikachu.");
      });
    }

    // Remove o Pikachu após 5 segundos
    setTimeout(() => pika.remove(), 5000);
  }
});

document.getElementById("restartButton").addEventListener("click", resetarJogo);

// Função para desativar o modo Pikachu
function desativarModoPikachu() {
  document.body.classList.remove("modo-pikachu");

  // Remove estilo injetado
  const estiloExtra = document.querySelector("style[data-pikachu]");
  if (estiloExtra) estiloExtra.remove();
}

// Função para reiniciar o jogo
function resetarJogo() {
  scoreJogador = 0;
  scoreMaquina = 0;
  elementosDOM.scoreJogador.textContent = scoreJogador;
  elementosDOM.scoreMaquina.textContent = scoreMaquina;
  elementosDOM.result.textContent = "";
  desativarModoPikachu();
  desativarModoLendario();
  inicializarJogo();
}

// Service Worker para suporte offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker registrado com sucesso.");
      })
      .catch((error) => {
        console.error("Erro ao registrar o Service Worker:", error);
      });
  });
}

// Controle de Música
const music = document.getElementById("bg-music");
const toggleMusicBtn = document.getElementById("toggleMusic");

const volumeLevels = [0, 0.05, 0.15, 0.25];
let currentVolumeIndex = 1; // Começa no 5%
let musicEnabled = true;
music.volume = volumeLevels[currentVolumeIndex];

// Atualiza o ícone e tooltip
function updateMusicUI() {
  const volumeIcons = ["🔇", "🔈", "🔉", "🔊"];
  const volumeTitles = [
    "Música Muda",
    "Volume Baixo (5%)",
    "Volume Médio (15%)",
    "Volume Alto (25%)",
  ];
  toggleMusicBtn.innerHTML = volumeIcons[currentVolumeIndex];
  toggleMusicBtn.title = volumeTitles[currentVolumeIndex];
}

// Atualiza a label de volume
function updateVolumeLabel(vol) {
  const label = document.querySelector(".volume-label");
  if (label) label.textContent = `${Math.round(vol * 100)}%`;
}

// Cria o controle de volume com label
function createVolumeControl() {
  const volumeContainer = document.createElement("div");
  volumeContainer.className = "volume-container";
  volumeContainer.innerHTML = `
    <span class="volume-label">${Math.round(music.volume * 100)}%</span>
    <input type="range" id="volumeControl" min="0" max="1" step="0.01" value="${
      music.volume
    }">
  `;

  toggleMusicBtn.insertAdjacentElement("afterend", volumeContainer);

  const volumeControl = document.getElementById("volumeControl");
  volumeControl.addEventListener("input", (e) => {
    const newVolume = parseFloat(e.target.value);
    music.volume = newVolume;
    musicEnabled = newVolume > 0;
    localStorage.setItem("musicVolume", newVolume);
    localStorage.setItem("musicEnabled", musicEnabled);
    updateVolumeLabel(newVolume);

    // Ajusta o índice mais próximo para manter ícone sincronizado
    const closestIndex = volumeLevels.findIndex(
      (lvl) => Math.abs(lvl - newVolume) < 0.01
    );
    if (closestIndex !== -1) {
      currentVolumeIndex = closestIndex;
    }

    updateMusicUI();
    if (musicEnabled) music.play().catch(() => {});
    else music.pause();
  });
}

// Alterna entre os volumes predefinidos (0 → 5 → 15 → 25 → 0...)
function cycleVolumeLevel() {
  currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
  const newVolume = volumeLevels[currentVolumeIndex];

  music.volume = newVolume;
  musicEnabled = newVolume > 0;

  updateMusicUI();

  const volumeControl = document.getElementById("volumeControl");
  if (volumeControl) volumeControl.value = newVolume;

  localStorage.setItem("musicVolume", newVolume);
  localStorage.setItem("musicEnabled", musicEnabled);
  updateVolumeLabel(newVolume);

  if (musicEnabled) {
    music.play().catch(() => (musicEnabled = false));
  } else {
    music.pause();
  }
}

// Inicialização da música
function initMusic() {
  const savedState = localStorage.getItem("musicEnabled");
  const savedVolume = localStorage.getItem("musicVolume");

  if (savedState !== null) {
    musicEnabled = savedState === "true";
  }

  if (savedVolume !== null) {
    music.volume = parseFloat(savedVolume);

    const index = volumeLevels.findIndex(
      (level) => parseFloat(savedVolume).toFixed(2) === level.toFixed(2)
    );
    if (index !== -1) currentVolumeIndex = index;
  }

  toggleMusicBtn.addEventListener("click", cycleVolumeLevel);

  if (musicEnabled) {
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        musicEnabled = false;
        updateMusicUI();
      });
    }
  }

  updateMusicUI();
  createVolumeControl();
}

// Inicia quando a página carrega
document.addEventListener("DOMContentLoaded", initMusic);
