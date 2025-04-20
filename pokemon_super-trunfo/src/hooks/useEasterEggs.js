import { useEffect, useState } from "react";

export function useEasterEggs({
  setCartasJogador,
  setCartasMaquina,
  atualizarCartas,
}) {
  const [clicksPikachu, setClicksPikachu] = useState(0);
  const [clicksLendario, setClicksLendario] = useState(0);

  useEffect(() => {
    const handleTriggerClick = () => {
      setClicksPikachu((prev) => {
        if (prev + 1 >= 5) {
          ativarModoPikachu();
          return 0;
        }
        return prev + 1;
      });
    };

    const trigger = document.querySelector(".easter-egg-trigger");
    trigger?.addEventListener("click", handleTriggerClick);

    return () => {
      trigger?.removeEventListener("click", handleTriggerClick);
    };
  }, []);

  useEffect(() => {
    const handleLegendaryClick = () => {
      setClicksLendario((prev) => {
        if (prev + 1 >= 5) {
          ativarModoLendario();
          return 0;
        }
        return prev + 1;
      });
    };

    const trigger = document.querySelector(".easter-egg-legendary");
    trigger?.addEventListener("click", handleLegendaryClick);

    return () => {
      trigger?.removeEventListener("click", handleLegendaryClick);
    };
  }, []);

  // Easter Egg por tecla "PK"
  useEffect(() => {
    let keys = [];

    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      if (keys.length > 2) keys.shift();

      if (keys.join("") === "pk") {
        const pika = document.createElement("img");
        pika.src =
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
        pika.className = "pika-pop";
        pika.style.position = "fixed";
        pika.style.width = "200px";
        pika.style.top = "50%";
        pika.style.right = "40%";
        pika.style.zIndex = "9999";
        document.body.appendChild(pika);

        const sound = document.getElementById("pikachu-especial-sound");
        sound?.play();

        setTimeout(() => pika.remove(), 5000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function ativarModoPikachu() {
    alert("⚡ MODO PIKACHU ATIVADO! ⚡");
    document.body.classList.add("modo-pikachu");

    const sound = document.getElementById("pikachu-sound");
    sound?.play();

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

    setCartasJogador([pikachuCard, pikachuCard]);
    setCartasMaquina([pikachuCard, pikachuCard]);
    atualizarCartas?.([pikachuCard, pikachuCard, pikachuCard, pikachuCard]);
  }

  async function ativarModoLendario() {
    alert("🔥 MODO LENDÁRIO ATIVADO! ⚡");

    document.body.classList.add("modo-lendario");

    const legendarios = [144, 145, 146, 150]; // Articuno, Zapdos, Moltres, Mewtwo
    const cartas = await Promise.all(
      legendarios.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()
        )
      )
    );

    const formatados = cartas.map((p) => ({
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
    }));

    setCartasJogador([formatados[0], formatados[1]]);
    setCartasMaquina([formatados[2], formatados[3]]);
    atualizarCartas?.(formatados);

    const sound = document.getElementById("legendary-sound");
    sound?.play();
  }

  return null; // sem retorno visual, apenas efeito colateral
}
