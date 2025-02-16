const animais = [
  {
    nome: "Leão",
    ataque: 320,
    defesa: 150,
    velocidade: 230,
    imagem: "images/lion.jpg",
  },
  {
    nome: "Camaleão",
    ataque: 70,
    defesa: 300,
    velocidade: 140,
    imagem: "images/chameleon.jpg",
  },

  {
    nome: "Crocodilo",
    ataque: 270,
    defesa: 380,
    velocidade: 80,
    imagem: "images/aligator.jpg",
  },
  {
    nome: "Rinoceronte",
    ataque: 270,
    defesa: 390,
    velocidade: 160,
    imagem: "images/rino.jpg",
  },
  {
    nome: "Hipopótamo",
    ataque: 280,
    defesa: 380,
    velocidade: 130,
    imagem: "images/hipo.jpg",
  },
  {
    nome: "Tartaruga",
    ataque: 30,
    defesa: 440,
    velocidade: 10,
    imagem: "images/turtle.jpg",
  },
  {
    nome: "Lobo",
    ataque: 210,
    defesa: 200,
    velocidade: 200,
    imagem: "images/wolf.jpg",
  },
  {
    nome: "Hiena",
    ataque: 250,
    defesa: 200,
    velocidade: 170,
    imagem: "images/hyena.jpg",
  },
  {
    nome: "Elefante",
    ataque: 350,
    defesa: 430,
    velocidade: 50,
    imagem: "images/elephant.jpg",
  },
  {
    nome: "Urso Polar",
    ataque: 330,
    defesa: 270,
    velocidade: 180,
    imagem: "images/polar_bear.jpg",
  },
  {
    nome: "Urso Pardo",
    ataque: 270,
    defesa: 310,
    velocidade: 190,
    imagem: "images/bear.jpg",
  },
  {
    nome: "Cobra",
    ataque: 260,
    defesa: 50,
    velocidade: 310,
    imagem: "images/snake.jpg",
  },
  {
    nome: "Orca",
    ataque: 290,
    defesa: 230,
    velocidade: 280,
    imagem: "images/orca.jpg",
  },
  {
    nome: "Guepardo",
    ataque: 60,
    defesa: 40,
    velocidade: 420,
    imagem: "images/cheetah.jpg",
  },
  {
    nome: "Lebre",
    ataque: 10,
    defesa: 10,
    velocidade: 400,
    imagem: "images/hare.jpg",
  },
  {
    nome: "Águia",
    ataque: 180,
    defesa: 90,
    velocidade: 390,
    imagem: "images/eagle.jpg",
  },
  {
    nome: "Leopardo",
    ataque: 200,
    defesa: 200,
    velocidade: 210,
    imagem: "images/leopard.jpg",
  },
  {
    nome: "Gorila",
    ataque: 300,
    defesa: 280,
    velocidade: 120,
    imagem: "images/gorilla.jpg",
  },
  {
    nome: "Tigre",
    ataque: 290,
    defesa: 180,
    velocidade: 250,
    imagem: "images/tiger.jpg",
  },
  {
    nome: "Pinguim",
    ataque: 50,
    defesa: 110,
    velocidade: 200,
    imagem: "images/penguin.jpg",
  },
  {
    nome: "Raposa",
    ataque: 100,
    defesa: 150,
    velocidade: 300,
    imagem: "images/fox.jpg",
  },
  {
    nome: "Tubarão",
    ataque: 410,
    defesa: 190,
    velocidade: 190,
    imagem: "images/shark.jpg",
  },
  {
    nome: "Cavalo",
    ataque: 120,
    defesa: 190,
    velocidade: 350,
    imagem: "images/horse.jpg",
  },
  {
    nome: "Panda",
    ataque: 190,
    defesa: 240,
    velocidade: 100,
    imagem: "images/panda.jpg",
  },
  {
    nome: "Falcão",
    ataque: 190,
    defesa: 80,
    velocidade: 380,
    imagem: "images/falcon.jpg",
  },
  {
    nome: "Leão Especial",
    ataque: 380,
    defesa: 230,
    velocidade: 240,
    imagem: "images/special_lion.jpg",
    especial: true,
  },
  {
    nome: "Tigre Especial",
    ataque: 390,
    defesa: 220,
    velocidade: 230,
    imagem: "images/special_tiger.jpg",
    especial: true,
  },
];

let cartasJogador = [];
let cartasMaquina = [];
let scoreJogador = 0;
let scoreMaquina = 0;

// Cache de elementos do DOM para consultas
const elementosDOM = {
  player1: {
    animal: document.getElementById("player1_animal"),
    attribute1: document.getElementById("player1_attribute1"),
    attribute2: document.getElementById("player1_attribute2"),
    attribute3: document.getElementById("player1_attribute3"),
    image: document.getElementById("first-player_image"),
    power: document.getElementById("power1"),
  },
  player2: {
    animal: document.getElementById("player2_animal"),
    attribute1: document.getElementById("player2_attribute1"),
    attribute2: document.getElementById("player2_attribute2"),
    attribute3: document.getElementById("player2_attribute3"),
    image: document.getElementById("second-player_image"),
    power: document.getElementById("power2"),
  },
  machine1: {
    animal: document.getElementById("machine1_animal"),
    attribute1: document.getElementById("machine1_attribute1"),
    attribute2: document.getElementById("machine1_attribute2"),
    attribute3: document.getElementById("machine1_attribute3"),
    image: document.getElementById("first-machine_image"),
    power: document.getElementById("power3"),
  },
  machine2: {
    animal: document.getElementById("machine2_animal"),
    attribute1: document.getElementById("machine2_attribute1"),
    attribute2: document.getElementById("machine2_attribute2"),
    attribute3: document.getElementById("machine2_attribute3"),
    image: document.getElementById("second-machine_image"),
    power: document.getElementById("power4"),
  },
  result: document.getElementById("result"),
  scoreJogador: document.getElementById("scoreJogador"),
  scoreMaquina: document.getElementById("scoreMaquina"),
};

// Função para embaralhar o array de animais
function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para sortear 4 cartas aleatórias (2 para o jogador e 2 para a máquina)
function sortearCartas() {
  embaralharArray(animais);
  cartasJogador = animais.slice(0, 2);
  cartasMaquina = animais.slice(2, 4);
}

// Função para calcular o poder total da carta
const calcularPoderTotal = (carta) =>
  carta.ataque + carta.defesa + carta.velocidade;

// Pré-carregar as imagens
function preloadImages() {
  animais.forEach((animal) => {
    const img = new Image();
    img.src = animal.imagem;
  });
}

// Função para atualizar as cartas na tela
function atualizarCartas() {
  requestAnimationFrame(() => {
    const atualizarCarta = (carta, elementos) => {
      elementos.image.classList.add("hidden");
      setTimeout(() => {
        elementos.animal.textContent = carta.nome;
        elementos.attribute1.textContent = `Ataque: ${carta.ataque}`;
        elementos.attribute2.textContent = `Defesa: ${carta.defesa}`;
        elementos.attribute3.textContent = `Velocidade: ${carta.velocidade}`;
        elementos.image.src = carta.imagem;
        elementos.power.textContent = `Power: ${calcularPoderTotal(carta)}`;
        elementos.image.classList.remove("hidden");
      }, 300); // Tempo da transição de imagem
    };

    atualizarCarta(cartasJogador[0], elementosDOM.player1);
    atualizarCarta(cartasJogador[1], elementosDOM.player2);
    atualizarCarta(cartasMaquina[0], elementosDOM.machine1);
    atualizarCarta(cartasMaquina[1], elementosDOM.machine2);
  });
}

// Função para remover a classe .loose (efeito de escurecer as cartas derrotadas) de todas as cartas antes de comparar
function removerClasseLoose() {
  const cartasJogadorWrap = document.querySelectorAll(
    ".cards__player .card-wrap"
  );
  const cartasMaquinaWrap = document.querySelectorAll(
    ".cards__machine .card-wrap"
  );

  cartasJogadorWrap.forEach((card) => card.classList.remove("loose"));
  cartasMaquinaWrap.forEach((card) => card.classList.remove("loose"));
}

// Função para comparar os atributos
function compararAtributo(atributo) {
  const cartasJogadorWrap = document.querySelectorAll(
    ".cards__player .card-wrap"
  );
  const cartasMaquinaWrap = document.querySelectorAll(
    ".cards__machine .card-wrap"
  );

  // Remove a classe .loose (efeito de escurecer as cartas derrotadas) de todas as cartas após a comparação
  removerClasseLoose();

  // Soma dos atributos do Jogador (Player1 e Player2)
  const somaJogador = cartasJogador[0][atributo] + cartasJogador[1][atributo];

  // Soma dos atributos da Máquina (Machine1 e Machine2)
  const somaMaquina = cartasMaquina[0][atributo] + cartasMaquina[1][atributo];

  // Lógica de comparação
  let result = "";
  if (somaJogador > somaMaquina) {
    result = "Jogador venceu!";
    scoreJogador++;
    cartasMaquinaWrap.forEach((card) => card.classList.add("loose"));
  } else if (somaJogador < somaMaquina) {
    result = "Máquina venceu!";
    scoreMaquina++;
    cartasJogadorWrap.forEach((card) => card.classList.add("loose"));
  } else {
    result = "Empate!";
  }

  // Atualiza o resultado e o placar
  elementosDOM.result.textContent = result;
  elementosDOM.scoreJogador.textContent = scoreJogador;
  elementosDOM.scoreMaquina.textContent = scoreMaquina;

  // Sorteia novas cartas para a próxima rodada após um pequeno intervalo
  setTimeout(() => {
    removerClasseLoose(); // Remove a classe .loose antes de atualizar as cartas
    sortearCartas();
    atualizarCartas();
  }, 2000);
}

// Eventos dos botões
["Ataque", "Defesa", "Velocidade"].forEach((attr) =>
  document
    .getElementById(`btn${attr}`)
    .addEventListener("click", () => compararAtributo(attr.toLowerCase()))
);

// Inicia o jogo com a primeira rodada
preloadImages();
sortearCartas();
atualizarCartas();
