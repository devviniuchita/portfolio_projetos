export function setupEspecial() {
  const carousel = document.getElementById("plans-carousel");
  if (!carousel) return; // Sai se não encontrar o carrossel

  const cards = document.querySelectorAll(".plan-card");
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  // Só continua se todos os elementos existirem
  if (!cards.length || !prevButton || !nextButton) return;

  let currentIndex = 0;
  const cardWidth = cards[0].offsetWidth + 32; // Largura do card + gap

  function updateCarousel() {
    carousel.scrollTo({
      left: currentIndex * cardWidth,
      behavior: "smooth",
    });

    // Esconder/mostrar botões conforme a posição
    prevButton.style.display = currentIndex === 0 ? "none" : "flex";
    nextButton.style.display =
      currentIndex === cards.length - 1 ? "none" : "flex";
  }

  nextButton.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // Inicialização
  updateCarousel();

  // Esconder botões em telas grandes
  function handleResize() {
    if (window.innerWidth > 768) {
      prevButton.style.display = "none";
      nextButton.style.display = "none";
    } else {
      updateCarousel();
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".students-swiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        // Quando a tela for menor que 768px, mostre apenas 1 slide
        768: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
      },
    });
  });
}
