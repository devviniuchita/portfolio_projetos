// Toggle between login and register forms
document
  .getElementById("switch-to-register")
  .addEventListener("click", function () {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
  });

document
  .getElementById("switch-to-login")
  .addEventListener("click", function () {
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
  });

// Simulate login/register
document.getElementById("email-login").addEventListener("submit", function (e) {
  e.preventDefault();
  proceedToPlanSelection();
});

document
  .getElementById("email-register")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    proceedToPlanSelection();
  });

document.getElementById("google-login").addEventListener("click", function () {
  proceedToPlanSelection();
});

function proceedToPlanSelection() {
  // Update progress steps
  document
    .querySelectorAll(".progress-step div")[0]
    .classList.remove("bg-[#d22630]");
  document
    .querySelectorAll(".progress-step div")[0]
    .classList.add("bg-[#ccd6e6]", "text-[#003057]");
  document
    .querySelectorAll(".progress-step div")[1]
    .classList.remove("bg-[#ccd6e6]", "text-[#003057]");
  document
    .querySelectorAll(".progress-step div")[1]
    .classList.add("bg-[#d22630]", "text-white");
  document
    .querySelectorAll(".progress-step p")[0]
    .classList.remove("text-[#003057]");
  document
    .querySelectorAll(".progress-step p")[0]
    .classList.add("text-gray-500");
  document
    .querySelectorAll(".progress-step p")[1]
    .classList.remove("text-gray-500");
  document
    .querySelectorAll(".progress-step p")[1]
    .classList.add("text-[#003057]");

  // Show plan selection and hide auth section
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("plan-section").classList.remove("hidden");
}

// Toggle between group and private plans
document.getElementById("group-tab").addEventListener("click", function () {
  this.classList.remove("bg-white", "text-[#003057]");
  this.classList.add("bg-[#003057]", "text-white");
  document
    .getElementById("private-tab")
    .classList.remove("bg-[#003057]", "text-white");
  document
    .getElementById("private-tab")
    .classList.add("bg-white", "text-[#003057]");
  document.getElementById("group-plans").classList.remove("hidden");
  document.getElementById("private-plans").classList.add("hidden");
});

document.getElementById("private-tab").addEventListener("click", function () {
  this.classList.remove("bg-white", "text-[#003057]");
  this.classList.add("bg-[#003057]", "text-white");
  document
    .getElementById("group-tab")
    .classList.remove("bg-[#003057]", "text-white");
  document
    .getElementById("group-tab")
    .classList.add("bg-white", "text-[#003057]");
  document.getElementById("group-plans").classList.add("hidden");
  document.getElementById("private-plans").classList.remove("hidden");
});

// Select plan and proceed to payment
document.querySelectorAll(".select-plan").forEach((button) => {
  button.addEventListener("click", function () {
    const planType = this.getAttribute("data-type");
    const planPeriod = this.getAttribute("data-period");
    const planPrice = this.getAttribute("data-price");

    // Update order summary
    let typeText, periodText, subtotal, discount, total;

    if (planType === "group") {
      typeText = "Aulas em Grupo";
      if (planPeriod === "monthly") {
        periodText = "4 aulas por mês";
        subtotal = "R$ 199,00";
        discount = "R$ 0,00";
        total = "R$ 199,00";
        document.getElementById("installment-info").textContent =
          "ou 1x de R$ 199,00";
      } else if (planPeriod === "semester") {
        periodText = "24 aulas em 6 meses";
        subtotal = "R$ 1.074,00";
        discount = "-R$ 120,00";
        total = "R$ 954,00";
        document.getElementById("installment-info").textContent =
          "ou 6x de R$ 179,00 sem juros";
      } else {
        periodText = "48 aulas em 12 meses";
        subtotal = "R$ 1.908,00";
        discount = "-R$ 286,20";
        total = "R$ 1.621,80";
        document.getElementById("installment-info").textContent =
          "ou 12x de R$ 159,00 sem juros";
      }
    } else {
      typeText = "Aulas Particulares";
      if (planPeriod === "monthly") {
        periodText = "4 aulas por mês";
        subtotal = "R$ 399,00";
        discount = "R$ 0,00";
        total = "R$ 399,00";
        document.getElementById("installment-info").textContent =
          "ou 1x de R$ 399,00";
      } else if (planPeriod === "semester") {
        periodText = "24 aulas em 6 meses";
        subtotal = "R$ 2.154,00";
        discount = "-R$ 215,40";
        total = "R$ 1.938,60";
        document.getElementById("installment-info").textContent =
          "ou 6x de R$ 359,00 sem juros";
      } else {
        periodText = "48 aulas em 12 meses";
        subtotal = "R$ 3.828,00";
        discount = "-R$ 574,20";
        total = "R$ 3.253,80";
        document.getElementById("installment-info").textContent =
          "ou 12x de R$ 319,00 sem juros";
      }
    }

    document.getElementById("plan-type").textContent = `${typeText} - ${
      planPeriod === "monthly"
        ? "Mensal"
        : planPeriod === "semester"
        ? "Semestral"
        : "Anual"
    }`;
    document.getElementById("plan-period").textContent = periodText;
    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("discount").textContent = discount;
    document.getElementById("total").textContent = total;

    // Update progress steps
    document
      .querySelectorAll(".progress-step div")[1]
      .classList.remove("bg-[#d22630]");
    document
      .querySelectorAll(".progress-step div")[1]
      .classList.add("bg-[#ccd6e6]", "text-[#003057]");
    document
      .querySelectorAll(".progress-step div")[2]
      .classList.remove("bg-[#ccd6e6]", "text-[#003057]");
    document
      .querySelectorAll(".progress-step div")[2]
      .classList.add("bg-[#d22630]", "text-white");
    document
      .querySelectorAll(".progress-step p")[1]
      .classList.remove("text-[#003057]");
    document
      .querySelectorAll(".progress-step p")[1]
      .classList.add("text-gray-500");
    document
      .querySelectorAll(".progress-step p")[2]
      .classList.remove("text-gray-500");
    document
      .querySelectorAll(".progress-step p")[2]
      .classList.add("text-[#003057]");

    // Show payment section and hide plan section
    document.getElementById("plan-section").classList.add("hidden");
    document.getElementById("payment-section").classList.remove("hidden");
  });
});

// Toggle payment methods
document.querySelectorAll(".payment-method").forEach((button) => {
  button.addEventListener("click", function () {
    const method = this.getAttribute("data-method");

    // Hide all payment forms
    document.getElementById("credit-card-form").classList.add("hidden");
    document.getElementById("pix-payment").classList.add("hidden");
    document.getElementById("boleto-payment").classList.add("hidden");

    // Show selected payment form
    if (method === "credit") {
      document.getElementById("credit-card-form").classList.remove("hidden");
    } else if (method === "pix") {
      document.getElementById("pix-payment").classList.remove("hidden");
    } else {
      document.getElementById("boleto-payment").classList.remove("hidden");
    }

    // Update active state
    document.querySelectorAll(".payment-method").forEach((btn) => {
      btn.classList.remove("border-[#003057]");
      btn.classList.add("border-transparent");
    });
    this.classList.remove("border-transparent");
    this.classList.add("border-[#003057]");
  });
});

// Format card number input
document.querySelector(".card-input").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\s+/g, "");
  if (value.length > 0) {
    value = value.match(new RegExp(".{1,4}", "g")).join(" ");
  }
  e.target.value = value;
});

// Finalize payment
document
  .getElementById("finalize-payment")
  .addEventListener("click", function () {
    // Update progress steps
    document
      .querySelectorAll(".progress-step div")[2]
      .classList.remove("bg-[#d22630]");
    document
      .querySelectorAll(".progress-step div")[2]
      .classList.add("bg-[#ccd6e6]", "text-[#003057]");
    document
      .querySelectorAll(".progress-step div")[3]
      .classList.remove("bg-[#ccd6e6]", "text-[#003057]");
    document
      .querySelectorAll(".progress-step div")[3]
      .classList.add("bg-[#d22630]", "text-white");
    document
      .querySelectorAll(".progress-step p")[2]
      .classList.remove("text-[#003057]");
    document
      .querySelectorAll(".progress-step p")[2]
      .classList.add("text-gray-500");
    document
      .querySelectorAll(".progress-step p")[3]
      .classList.remove("text-gray-500");
    document
      .querySelectorAll(".progress-step p")[3]
      .classList.add("text-[#003057]");

    // Set confirmation details
    document.getElementById("confirmation-plan").textContent =
      document.getElementById("plan-type").textContent;
    document.getElementById("confirmation-price").textContent =
      document.getElementById("total").textContent;

    // Determine payment method
    let paymentMethod = "Cartão de Crédito";
    if (
      !document.getElementById("credit-card-form").classList.contains("hidden")
    ) {
      paymentMethod = "Cartão de Crédito (6x)";
    } else if (
      !document.getElementById("pix-payment").classList.contains("hidden")
    ) {
      paymentMethod = "PIX";
    } else {
      paymentMethod = "Boleto Bancário";
    }
    document.getElementById("confirmation-method").textContent = paymentMethod;

    // Show confirmation modal
    document.getElementById("confirmation-modal").classList.remove("hidden");

    // Countdown for redirect
    let seconds = 5;
    const countdownElement = document.getElementById("countdown");
    const countdownInterval = setInterval(() => {
      seconds--;
      countdownElement.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(countdownInterval);
        window.location.href = "area-do-aluno.html";
      }
    }, 1000);
  });

// Go to dashboard immediately
document
  .getElementById("go-to-dashboard")
  .addEventListener("click", function () {
    window.location.href = "area-do-aluno.html";
  });

// FAQ toggle
document.querySelectorAll(".faq-toggle").forEach((button) => {
  button.addEventListener("click", function () {
    const content = this.nextElementSibling;
    const icon = this.querySelector("i");

    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    } else {
      content.classList.add("hidden");
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    }
  });
});
