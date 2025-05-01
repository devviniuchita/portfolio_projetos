/*export function setupAbout() {
  document.addEventListener("DOMContentLoaded", function () {
    function updateDescriptionText() {
      const description = document.querySelector(".about__description");

      if (!description) {
        console.warn("Elemento .about__description não encontrado.");
        return;
      }

      description.style.display = "block";

      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth;
      if (screenWidth <= 480) {
        description.textContent =
          "Kengi Terruya, formado em Letras Japonesas, é professor há 5 anos e já ajudou mais de 350 alunos. Com uma didática dinâmica e interativa, ele torna o aprendizado divertido e eficaz. Após um intercâmbio de 1 ano no Japão, traz a cultura japonesa de forma autêntica para as aulas. Apaixonado por animes, usa exemplos do universo otaku para engajar os alunos, criando aulas únicas e envolventes.";
      } else if (screenWidth <= 768) {
        description.textContent =
          "Kengi Terruya, formado em Letras Japonesas, é professor há 5 anos e já ajudou mais de 350 alunos. Com uma didática dinâmica e interativa, ele torna o aprendizado divertido e eficaz. Após um intercâmbio de 1 ano no Japão, traz a cultura japonesa de forma autêntica para as aulas. Apaixonado por animes, usa exemplos do universo otaku para engajar os alunos, criando aulas únicas e envolventes.";
      } else if (screenWidth <= 1147) {
        description.textContent =
          "Kengi Terruya, formado em Letras Japonesas, atua como professor de japonês há 5 anos. Sua didática é interativa e dinâmica, focada em tornar o aprendizado divertido e eficiente. Após um intercâmbio de 1 ano no Japão, Kengi enriquece suas aulas com experiências culturais autênticas. Apaixonado por animes, ele conecta o conteúdo com o interesse dos alunos, tornando cada aula única e envolvente.";
      } else {
        description.textContent =
          "Kengi Terruya é formado em Letras Japonesas e atua como professor de japonês há 5 anos, já tendo ajudado mais de 350 alunos a alcançarem seus objetivos no idioma. Sua didática é interativa e dinâmica, focada em tornar o aprendizado divertido e eficiente. Durante um intercâmbio de 1 ano no Japão, Kengi adquiriu experiências que enriquecem suas aulas, trazendo a cultura japonesa de forma autêntica. Apaixonado por animes, ele usa exemplos do universo otaku para conectar o conteúdo com o interesse dos alunos, tornando cada aula única e envolvente.";
      }
    }
    updateDescriptionText();
    window.addEventListener("resize", updateDescriptionText);
    window.addEventListener("orientationchange", updateDescriptionText);
  });
}*/
