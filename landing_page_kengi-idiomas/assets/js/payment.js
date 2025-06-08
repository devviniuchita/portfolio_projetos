// ===== LOG DE INICIALIZAÇÃO =====
console.log('🎯 PaymentPageManager carregado!');
console.log('✅ Sistema de passos com cores corretas implementado');
console.log('🔐 Google OAuth em modo demonstração');
console.log('🎨 Estilos de botões padronizados');
console.log('🔧 Event listeners corrigidos para seleção de planos');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Google OAuth em modo demo
    setTimeout(initializeGoogleAuth, 500);
    
    // Inicializar PaymentPageManager
    window.paymentManager = new PaymentPageManager();
    
    // Adicionar listener para botão "Prosseguir para Pagamento"
    const proceedButton = document.getElementById('proceed-to-payment');
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            updateProgressStep(4);
            document.getElementById('agenda-section').classList.add('hidden');
            document.getElementById('payment-section').classList.remove('hidden');
        });
    }
    
    // ===== CORREÇÃO PROBLEMA 4: Event listeners para seleção de plano =====
    // Garantir que os botões de seleção de plano funcionem corretamente
    document.querySelectorAll('.select-plan').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const planType = this.getAttribute('data-type');
            const planPeriod = this.getAttribute('data-period');
            const planPrice = this.getAttribute('data-price');
            
            console.log('🎯 Plano selecionado:', { planType, planPeriod, planPrice });
            
            // Usar PaymentPageManager se disponível, senão usar função direta
            if (window.paymentManager && window.paymentManager.selectPlan) {
                window.paymentManager.selectedPlan = {
                    type: planType,
                    period: planPeriod,
                    price: planPrice
                };
                window.paymentManager.showStep(3); // Ir para agenda
            } else {
                // Fallback direto
                selectPlanDirect(planType, planPeriod, planPrice);
            }
        });
    });
    
    // Expor funções globalmente
    window.handleGoogleSignIn = handleGoogleSignIn;
    window.handleGoogleSignInClick = handleGoogleSignInClick;
    window.updateProgressStep = updateProgressStep;
    window.selectPlanDirect = selectPlanDirect;

    // Toggle between login and register forms
    document
      .getElementById("switch-to-register")
      ?.addEventListener("click", function () {
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("register-form").classList.remove("hidden");
      });

    document
      .getElementById("switch-to-login")
      ?.addEventListener("click", function () {
        document.getElementById("register-form").classList.add("hidden");
        document.getElementById("login-form").classList.remove("hidden");
      });

    function proceedToPlanSelection() {
      updateProgressStep(2);
      document.getElementById("auth-section").classList.add("hidden");
      document.getElementById("plan-section").classList.remove("hidden");
    }

    // Toggle between group and private plans
    document.getElementById("group-tab")?.addEventListener("click", function () {
      this.classList.remove("bg-white", "text-[#003057]");
      this.classList.add("bg-[#003057]", "text-white");
      document
        .getElementById("private-tab")
        ?.classList.remove("bg-[#003057]", "text-white");
      document
        .getElementById("private-tab")
        ?.classList.add("bg-white", "text-[#003057]");
      document.getElementById("group-plans")?.classList.remove("hidden");
      document.getElementById("private-plans")?.classList.add("hidden");
    });

    document.getElementById("private-tab")?.addEventListener("click", function () {
      this.classList.remove("bg-white", "text-[#003057]");
      this.classList.add("bg-[#003057]", "text-white");
      document
        .getElementById("group-tab")
        ?.classList.remove("bg-[#003057]", "text-white");
      document
        .getElementById("group-tab")
        ?.classList.add("bg-white", "text-[#003057]");
      document.getElementById("group-plans")?.classList.add("hidden");
      document.getElementById("private-plans")?.classList.remove("hidden");
    });

    // FAQ toggle (mantido)
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

    // Adicione estes listeners para os formulários de login/registro
    document.getElementById('email-login')?.addEventListener('submit', function(e) {
      e.preventDefault();
      // Simular login bem-sucedido
      const demoUser = {
        id: 'demo_' + Date.now(),
        nome: 'Usuário Demo',
        email: document.getElementById('login-email').value,
        token: 'demo_token_' + Date.now()
      };
      localStorage.setItem('kengi_auth_token', demoUser.token);
      localStorage.setItem('kengi_user', JSON.stringify({
        id: demoUser.id,
        nome: demoUser.nome,
        email: demoUser.email
      }));
      if (window.KengiAPI && KengiAPI.UIHelpers && KengiAPI.UIHelpers.showSuccess) {
        KengiAPI.UIHelpers.showSuccess('Login realizado com sucesso!');
      } else {
        alert('Login realizado com sucesso!');
      }
      proceedToPlanSelection();
    });

    document.getElementById('email-register')?.addEventListener('submit', function(e) {
      e.preventDefault();
      // Simular registro bem-sucedido
      const demoUser = {
        id: 'demo_' + Date.now(),
        nome: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        token: 'demo_token_' + Date.now()
      };
      localStorage.setItem('kengi_auth_token', demoUser.token);
      localStorage.setItem('kengi_user', JSON.stringify({
        id: demoUser.id,
        nome: demoUser.nome,
        email: demoUser.email
      }));
      if (window.KengiAPI && KengiAPI.UIHelpers && KengiAPI.UIHelpers.showSuccess) {
        KengiAPI.UIHelpers.showSuccess('Cadastro realizado com sucesso!');
      } else {
        alert('Cadastro realizado com sucesso!');
      }
      proceedToPlanSelection();
    });
});

// Função direta para seleção de plano (fallback)
function selectPlanDirect(planType, planPeriod, planPrice) {
    console.log('📋 Processando seleção direta do plano...');
    
    // Atualizar informações do plano na agenda
    const planInfo = document.getElementById('selected-plan-info');
    if (planInfo) {
        const planText = `Aulas ${planType === 'group' ? 'em Grupo' : 'Particulares'} - ${planPeriod === 'monthly' ? 'Mensal' : planPeriod === 'semester' ? 'Semestral' : 'Anual'}`;
        planInfo.textContent = planText;
    }
    
    // Atualizar resumo do pedido no pagamento
    updateOrderSummary(planType, planPeriod, planPrice);
    
    // Avançar para o passo 3 (Agenda)
    updateProgressStep(3);
    document.getElementById('plan-section').classList.add('hidden');
    document.getElementById('agenda-section').classList.remove('hidden');
    
    console.log('✅ Avançou para agenda com sucesso!');
}

// Função para atualizar resumo do pedido
function updateOrderSummary(planType, planPeriod, planPrice) {
    // Mapear dados do plano
    let typeText, periodText, subtotal, discount, total, installmentInfo;

    if (planType === "group") {
        typeText = "Aulas em Grupo";
        if (planPeriod === "monthly") {
            periodText = "4 aulas por mês";
            subtotal = "R$ 199,00";
            discount = "R$ 0,00";
            total = "R$ 199,00";
            installmentInfo = "ou 1x de R$ 199,00";
        } else if (planPeriod === "semester") {
            periodText = "24 aulas em 6 meses";
            subtotal = "R$ 1.074,00";
            discount = "-R$ 120,00";
            total = "R$ 954,00";
            installmentInfo = "ou 6x de R$ 179,00 sem juros";
        } else { // annual
            periodText = "48 aulas em 12 meses";
            subtotal = "R$ 1.908,00";
            discount = "-R$ 286,20";
            total = "R$ 1.621,80";
            installmentInfo = "ou 12x de R$ 159,00 sem juros";
        }
    } else { // private
        typeText = "Aulas Particulares";
        if (planPeriod === "monthly") {
            periodText = "4 aulas por mês";
            subtotal = "R$ 399,00";
            discount = "R$ 0,00";
            total = "R$ 399,00";
            installmentInfo = "ou 1x de R$ 399,00";
        } else if (planPeriod === "semester") {
            periodText = "24 aulas em 6 meses";
            subtotal = "R$ 2.154,00";
            discount = "-R$ 215,40";
            total = "R$ 1.938,60";
            installmentInfo = "ou 6x de R$ 359,00 sem juros";
        } else { // annual
            periodText = "48 aulas em 12 meses";
            subtotal = "R$ 3.828,00";
            discount = "-R$ 574,20";
            total = "R$ 3.253,80";
            installmentInfo = "ou 12x de R$ 319,00 sem juros";
        }
    }

    // Atualizar elementos da página
    const planTypeEl = document.getElementById("plan-type");
    const planPeriodEl = document.getElementById("plan-period");
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");
    const installmentEl = document.getElementById("installment-info");

    if (planTypeEl) planTypeEl.textContent = `${typeText} - ${planPeriod === "monthly" ? "Mensal" : planPeriod === "semester" ? "Semestral" : "Anual"}`;
    if (planPeriodEl) planPeriodEl.textContent = periodText;
    if (subtotalEl) subtotalEl.textContent = subtotal;
    if (discountEl) discountEl.textContent = discount;
    if (totalEl) totalEl.textContent = total;
    if (installmentEl) installmentEl.textContent = installmentInfo;
}

// ===== GERENCIAMENTO DE PASSOS COM CORES CORRETAS =====
function updateProgressStep(activeStep) {
  // Resetar todos os passos para o estado inativo (azul claro)
  for (let i = 1; i <= 5; i++) {
    const stepCircle = document.getElementById(`step-${i}`);
    const stepText = document.getElementById(`step-${i}-text`);
    
    if (stepCircle && stepText) {
      // Estado inativo: azul claro com número azul escuro
      stepCircle.classList.remove('bg-[#003057]', 'text-white');
      stepCircle.classList.add('bg-[#ccd6e6]', 'text-[#003057]');
      stepText.classList.remove('text-[#003057]', 'font-medium');
      stepText.classList.add('text-gray-500');
    }
  }
  
  // Ativar o passo atual (azul escuro com número branco)
  const activeCircle = document.getElementById(`step-${activeStep}`);
  const activeText = document.getElementById(`step-${activeStep}-text`);
  
  if (activeCircle && activeText) {
    activeCircle.classList.remove('bg-[#ccd6e6]', 'text-[#003057]');
    activeCircle.classList.add('bg-[#003057]', 'text-white');
    activeText.classList.remove('text-gray-500');
    activeText.classList.add('text-[#003057]', 'font-medium');
  }
} 