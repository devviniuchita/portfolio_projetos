// header.js - modifique para:
export function setupHeader() {
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      console.log("Menu clicked"); // Verifique no console
      navList.classList.toggle("active");
      this.classList.toggle("fa-bars");
      this.classList.toggle("fa-times"); // Alterna entre ícones
    });
  } else {
    console.error("Elementos do header não encontrados!");
  }
}
