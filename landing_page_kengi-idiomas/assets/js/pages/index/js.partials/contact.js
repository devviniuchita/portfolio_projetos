// contact.js
export function setupContact() {
  const button = document.getElementById("mybutton");

  if (button) {
    // Verifica se o botão existe
    console.log("Botão encontrado:", button);
    button.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Botão clicado, classes atuais:", this.classList);
      this.classList.toggle("bg-primary");
      this.classList.toggle("bg-secondary");
      if (this.classList.contains("bg-secondary")) {
        this.classList.add("hover:bg-blue-dark");
        this.classList.remove("hover:bg-red-hover");
      } else {
        this.classList.add("hover:bg-red-hover");
        this.classList.remove("hover:bg-blue-dark");
      }
    });
  } else {
    console.warn("Botão 'mybutton' não encontrado!");
  }
}
