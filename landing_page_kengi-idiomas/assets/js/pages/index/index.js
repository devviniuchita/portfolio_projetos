// index.js
import { setupHeader } from "./js.partials/header.js";
import { setupFooter } from "./js.partials/footer.js";
import { setupContact } from "./js.partials/contact.js";
import { setupEspecial } from "../particular/especial.js";
import { setupStudents } from "../particular/studants.js";

// Configurações globais
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded disparado");
  setupHeader(); // Configura o header
  setupFooter(); // Configura o footer
  setupContact(); // Configura o botão de contato
  setupEspecial(); // Configura o carrossel de planos
  setupStudents(); // Configura o carrossel de alunos
});
