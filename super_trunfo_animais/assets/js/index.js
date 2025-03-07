const animais = [
  {
    nome: "Leão",
    ataque: 320,
    defesa: 150,
    velocidade: 230,
    imagem: "./assets/images/animals/lion.jpg",
  },
  {
    nome: "Camaleão",
    ataque: 70,
    defesa: 300,
    velocidade: 140,
    imagem: "./assets/images/animals/chameleon.jpg",
  },

  {
    nome: "Crocodilo",
    ataque: 270,
    defesa: 380,
    velocidade: 80,
    imagem: "./assets/images/animals/aligator.jpg",
  },
  {
    nome: "Rinoceronte",
    ataque: 270,
    defesa: 390,
    velocidade: 160,
    imagem: "./assets/images/animals/rino.jpg",
  },
  {
    nome: "Hipopótamo",
    ataque: 280,
    defesa: 380,
    velocidade: 130,
    imagem: "./assets/images/animals/hipo.jpg",
  },
  {
    nome: "Tartaruga",
    ataque: 30,
    defesa: 440,
    velocidade: 10,
    imagem: "./assets/images/animals/turtle.jpg",
  },
  {
    nome: "Lobo",
    ataque: 210,
    defesa: 200,
    velocidade: 200,
    imagem: "./assets/images/animals/wolf.jpg",
  },
  {
    nome: "Hiena",
    ataque: 250,
    defesa: 200,
    velocidade: 170,
    imagem: "./assets/images/animals/hyena.jpg",
  },
  {
    nome: "Elefante",
    ataque: 350,
    defesa: 430,
    velocidade: 50,
    imagem: "./assets/images/animals/elephant.jpg",
  },
  {
    nome: "Urso Polar",
    ataque: 330,
    defesa: 270,
    velocidade: 180,
    imagem: "./assets/images/animals/polar_bear.jpg",
  },
  {
    nome: "Urso Pardo",
    ataque: 270,
    defesa: 310,
    velocidade: 190,
    imagem: "./assets/images/animals/bear.jpg",
  },
  {
    nome: "Cobra",
    ataque: 260,
    defesa: 50,
    velocidade: 310,
    imagem: "./assets/images/animals/snake.jpg",
  },
  {
    nome: "Orca",
    ataque: 290,
    defesa: 230,
    velocidade: 280,
    imagem: "./assets/images/animals/orca.jpg",
  },
  {
    nome: "Guepardo",
    ataque: 60,
    defesa: 40,
    velocidade: 420,
    imagem: "./assets/images/animals/cheetah.jpg",
  },
  {
    nome: "Lebre",
    ataque: 10,
    defesa: 10,
    velocidade: 400,
    imagem: "./assets/images/animals/hare.jpg",
  },
  {
    nome: "Águia",
    ataque: 180,
    defesa: 90,
    velocidade: 390,
    imagem: "./assets/images/animals/eagle.jpg",
  },
  {
    nome: "Leopardo",
    ataque: 200,
    defesa: 200,
    velocidade: 210,
    imagem: "./assets/images/animals/leopard.jpg",
  },
  {
    nome: "Gorila",
    ataque: 300,
    defesa: 280,
    velocidade: 120,
    imagem: "./assets/images/animals/gorilla.jpg",
  },
  {
    nome: "Tigre",
    ataque: 290,
    defesa: 180,
    velocidade: 250,
    imagem: "./assets/images/animals/tiger.jpg",
  },
  {
    nome: "Pinguim",
    ataque: 50,
    defesa: 110,
    velocidade: 200,
    imagem: "./assets/images/animals/penguin.jpg",
  },
  {
    nome: "Raposa",
    ataque: 100,
    defesa: 150,
    velocidade: 300,
    imagem: "./assets/images/animals/fox.jpg",
  },
  {
    nome: "Tubarão",
    ataque: 410,
    defesa: 190,
    velocidade: 190,
    imagem: "./assets/images/animals/shark.jpg",
  },
  {
    nome: "Cavalo",
    ataque: 120,
    defesa: 190,
    velocidade: 350,
    imagem: "./assets/images/animals/horse.jpg",
  },
  {
    nome: "Panda",
    ataque: 190,
    defesa: 240,
    velocidade: 100,
    imagem: "./assets/images/animals/panda.jpg",
  },
  {
    nome: "Falcão",
    ataque: 190,
    defesa: 80,
    velocidade: 380,
    imagem: "./assets/images/animals/falcon.jpg",
  },
  {
    nome: "Leão Especial",
    ataque: 380,
    defesa: 230,
    velocidade: 240,
    imagem: "./assets/images/animals/special_lion.jpg",
    especial: true,
  },
  {
    nome: "Tigre Especial",
    ataque: 390,
    defesa: 220,
    velocidade: 230,
    imagem: "./assets/images/animals/special_tiger.jpg",
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
// Executar o pré-carregamento assim que a página carregar
window.addEventListener("load", preloadImages);

// Função para atualizar as cartas na tela
function atualizarCartas() {
  requestAnimationFrame(() => {
    // Função assíncrona para atualizar cada carta
    const atualizarCarta = async (carta, elementos) => {
      elementos.image.classList.add("hidden");
      setTimeout(async () => {
        elementos.animal.textContent = carta.nome;
        elementos.attribute1.textContent = `Ataque: ${carta.ataque}`;
        elementos.attribute2.textContent = `Defesa: ${carta.defesa}`;
        elementos.attribute3.textContent = `Velocidade: ${carta.velocidade}`;
        elementos.power.textContent = `Power: ${calcularPoderTotal(carta)}`;

        // Verifica se a imagem já foi carregada
        if (elementos.image.src !== carta.imagem) {
          elementos.image.src = carta.imagem;
          try {
            await elementos.image.decode(); // Decodifica a imagem em segundo plano
          } catch (error) {
            console.error("Erro ao decodificar a imagem:", error);
          }
        }
        elementos.image.classList.remove("hidden");
      }, 300); // Tempo da transição de imagem
    };

    // Atualiza todas as cartas
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
