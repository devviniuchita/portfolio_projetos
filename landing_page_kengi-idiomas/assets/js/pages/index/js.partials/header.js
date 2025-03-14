// header.js
export function setupHeader() {
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      navList.classList.toggle("active");
    });
  }
}
