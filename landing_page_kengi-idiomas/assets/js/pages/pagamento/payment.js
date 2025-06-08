// ===== GOOGLE OAUTH INTEGRATION =====
// Sistema com Google Identity Services SDK

// Configuração do Google OAuth (REAL)
const GOOGLE_CONFIG = {
    client_id: "SEU_CLIENT_ID_GOOGLE", // Substituir pelo client ID real
    redirect_uri: window.location.origin + "/pagamento.html",
    scope: "openid email profile"
};

// Inicializar Google OAuth quando a página carregar
function initializeGoogleAuth() {
    console.log('🔄 Inicializando Google Identity Services...');
    
    // Verificar se o SDK do Google está carregado
    if (typeof google !== 'undefined' && google.accounts) {
        console.log('✅ Google Identity Services SDK carregado');
        setupGoogleButton();
    } else {
        console.log('⚠️ Modo demonstração - SDK do Google não disponível');
        setupCustomGoogleButton();
    }
}

// Configurar botão com SDK real do Google
function setupGoogleButton() {
    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CONFIG.client_id,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        // Configurar botão customizado
        const customButton = document.getElementById('google-login-custom');
        if (customButton) {
            customButton.addEventListener('click', handleGoogleSignInClick);
            console.log('✅ Botão Google configurado com SDK real');
        }
    } catch (error) {
        console.error('❌ Erro ao configurar Google SDK:', error);
        // Fallback para modo demo
        setupCustomGoogleButton();
    }
}

// Função para iniciar processo de login Google
function handleGoogleSignInClick() {
    console.log('🖱️ Clique no botão Google OAuth detectado');
    
    if (typeof google !== 'undefined' && google.accounts) {
        try {
            google.accounts.id.prompt(); // Mostra o pop-up de login
            console.log('✅ Pop-up do Google iniciado');
        } catch (error) {
            console.error('❌ Erro ao mostrar pop-up Google:', error);
            // Fallback para demo
            handleGoogleSignInDemo();
        }
    } else {
        console.log('⚠️ SDK não disponível - usando modo demo');
        handleGoogleSignInDemo();
    }
}

// Callback para resposta do Google (SDK real)
function handleCredentialResponse(response) {
    try {
        console.log('🔐 Resposta do Google recebida');
        const jwt = response.credential;
        
        // Decodificar JWT para obter dados do usuário
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        
        const userData = {
            googleId: payload.sub,
            email: payload.email,
            nome: payload.name,
            foto: payload.picture,
            emailVerificado: payload.email_verified,
            provider: 'google'
        };
        
        console.log('✅ Dados do usuário Google:', userData);
        
        // Salvar dados de autenticação
        localStorage.setItem('kengi_auth_token', 'google_token_' + Date.now());
        localStorage.setItem('kengi_user_data', JSON.stringify(userData));
        localStorage.setItem('kengi_user', JSON.stringify(userData));
        localStorage.setItem('jwt', jwt);
        
        // Mostrar sucesso
        showAuthSuccess('Login com Google realizado com sucesso!');
        
        // Prosseguir para seleção de plano
        setTimeout(() => {
            console.log('🚀 Avançando para seleção de planos...');
            proceedToPlanSelection();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erro ao processar resposta Google:', error);
        showAuthError('Erro ao processar login do Google');
    }
}

// Função demo para fallback
async function handleGoogleSignInDemo() {
    try {
        console.log('🔐 Simulando autenticação Google...');
        
        // Simular dados do usuário Google
        const demoUserData = {
            googleId: 'demo_' + Date.now(),
            email: 'usuario@gmail.com',
            nome: 'Usuário Demonstração',
            foto: 'https://via.placeholder.com/150',
            emailVerificado: true,
            provider: 'google'
        };

        // Simular resposta do backend
        const authResponse = {
            success: true,
            token: 'demo_token_' + Date.now(),
            user: demoUserData,
            message: 'Login Google simulado com sucesso!'
        };
        
        if (authResponse.success) {
            // Salvar token e dados do usuário
            localStorage.setItem('kengi_auth_token', authResponse.token);
            localStorage.setItem('kengi_user_data', JSON.stringify(authResponse.user));
            localStorage.setItem('kengi_user', JSON.stringify(authResponse.user));
            
            // Mostrar sucesso
            showAuthSuccess('Login com Google realizado com sucesso!');
            console.log('✅ Login Google simulado com sucesso');
            
            // Prosseguir para seleção de plano
            setTimeout(() => {
                console.log('🚀 Avançando para seleção de planos...');
                proceedToPlanSelection();
            }, 1500);
        }

    } catch (error) {
        console.error('❌ Erro na autenticação Google:', error);
        showAuthError('Erro ao fazer login com Google: ' + error.message);
    }
}

// Configurar botão customizado (fallback)
function setupCustomGoogleButton() {
    const customButton = document.getElementById('google-login-custom');
    if (customButton) {
        customButton.style.display = 'flex';
        console.log('✅ Botão Google customizado configurado (modo demo)');
        
        // Adicionar event listener diretamente aqui também como backup
        customButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🖱️ Clique direto no botão Google detectado');
            handleGoogleSignInDemo();
        });
    } else {
        console.error('❌ Botão Google customizado não encontrado');
    }
}

// Funções de feedback visual
function showAuthSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    const authSection = document.getElementById('auth-section');
    authSection.insertBefore(successDiv, authSection.firstChild);
    
    setTimeout(() => successDiv.remove(), 3000);
}

function showAuthError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    const authSection = document.getElementById('auth-section');
    authSection.insertBefore(errorDiv, authSection.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
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

// ===== FUNCIONALIDADE BÁSICA RESTAURADA =====

// Toggle between login and register forms
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Google OAuth em modo demo
    setTimeout(initializeGoogleAuth, 500);
    
    // Event listeners para troca entre login/register
    const switchToRegister = document.getElementById("switch-to-register");
    if (switchToRegister) {
        switchToRegister.addEventListener("click", function () {
            document.getElementById("login-form").classList.add("hidden");
            document.getElementById("register-form").classList.remove("hidden");
        });
    }

    const switchToLogin = document.getElementById("switch-to-login");
    if (switchToLogin) {
        switchToLogin.addEventListener("click", function () {
            document.getElementById("register-form").classList.add("hidden");
            document.getElementById("login-form").classList.remove("hidden");
        });
    }

    // Simulate login/register
    const emailLogin = document.getElementById("email-login");
    if (emailLogin) {
        emailLogin.addEventListener("submit", function (e) {
            e.preventDefault();
            proceedToPlanSelection();
        });
    }

    const emailRegister = document.getElementById("email-register");
    if (emailRegister) {
        emailRegister.addEventListener("submit", function (e) {
            e.preventDefault();
            proceedToPlanSelection();
        });
    }

    // Google login button
    const googleLogin = document.getElementById("google-login-custom");
    if (googleLogin) {
        googleLogin.addEventListener("click", function () {
            proceedToPlanSelection();
        });
    }

    // Toggle between group and private plans
    const groupTab = document.getElementById("group-tab");
    if (groupTab) {
        groupTab.addEventListener("click", function () {
            this.classList.remove("bg-white", "text-[#003057]");
            this.classList.add("bg-[#003057]", "text-white");
            const privateTab = document.getElementById("private-tab");
            if (privateTab) {
                privateTab.classList.remove("bg-[#003057]", "text-white");
                privateTab.classList.add("bg-white", "text-[#003057]");
            }
            const groupPlans = document.getElementById("group-plans");
            const privatePlans = document.getElementById("private-plans");
            if (groupPlans) groupPlans.classList.remove("hidden");
            if (privatePlans) privatePlans.classList.add("hidden");
        });
    }

    const privateTab = document.getElementById("private-tab");
    if (privateTab) {
        privateTab.addEventListener("click", function () {
            this.classList.remove("bg-white", "text-[#003057]");
            this.classList.add("bg-[#003057]", "text-white");
            const groupTab = document.getElementById("group-tab");
            if (groupTab) {
                groupTab.classList.remove("bg-[#003057]", "text-white");
                groupTab.classList.add("bg-white", "text-[#003057]");
            }
            const groupPlans = document.getElementById("group-plans");
            const privatePlans = document.getElementById("private-plans");
            if (groupPlans) groupPlans.classList.add("hidden");
            if (privatePlans) privatePlans.classList.remove("hidden");
        });
    }

    // Select plan and proceed to agenda
    document.querySelectorAll(".select-plan").forEach((button) => {
        button.addEventListener("click", function () {
            const planType = this.getAttribute("data-type");
            const planPeriod = this.getAttribute("data-period");
            const planPrice = this.getAttribute("data-price");

            // Update order summary
            updateOrderSummary(planType, planPeriod, planPrice);

            // Update progress to step 3 (Agenda)
            updateProgressStep(3);

            // Show agenda section and hide plan section
            document.getElementById("plan-section").classList.add("hidden");
            document.getElementById("agenda-section").classList.remove("hidden");
        });
    });

    // Adicionar listener para botão "Prosseguir para Pagamento"
    const proceedButton = document.getElementById('proceed-to-payment');
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            updateProgressStep(4);
            document.getElementById('agenda-section').classList.add('hidden');
            document.getElementById('payment-section').classList.remove('hidden');
        });
    }

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
    const cardInput = document.querySelector(".card-input");
    if (cardInput) {
        cardInput.addEventListener("input", function (e) {
            let value = e.target.value.replace(/\s+/g, "");
            if (value.length > 0) {
                value = value.match(new RegExp(".{1,4}", "g")).join(" ");
            }
            e.target.value = value;
        });
    }

    // Finalize payment
    const finalizeButton = document.getElementById("finalize-payment");
    if (finalizeButton) {
        finalizeButton.addEventListener("click", function () {
            // Update progress to step 5 (Confirmação)
            updateProgressStep(5);

            // Set confirmation details
            const planType = document.getElementById("plan-type");
            const total = document.getElementById("total");
            if (planType) {
                document.getElementById("confirmation-plan").textContent = planType.textContent;
            }
            if (total) {
                document.getElementById("confirmation-price").textContent = total.textContent;
            }

            // Determine payment method
            let paymentMethod = "Cartão de Crédito";
            if (!document.getElementById("credit-card-form").classList.contains("hidden")) {
                paymentMethod = "Cartão de Crédito (6x)";
            } else if (!document.getElementById("pix-payment").classList.contains("hidden")) {
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
                    window.location.href = "index.html";
                }
            }, 1000);
        });
    }

    // Go to dashboard immediately
    const dashboardButton = document.getElementById("go-to-dashboard");
    if (dashboardButton) {
        dashboardButton.addEventListener("click", function () {
            window.location.href = "dashboard_demo.html";
        });
    }

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

    // Expor funções globalmente
    window.handleGoogleSignIn = handleGoogleSignIn;
    window.handleGoogleSignInClick = handleGoogleSignInClick;
    window.updateProgressStep = updateProgressStep;
});

function proceedToPlanSelection() {
    updateProgressStep(2);
    // Show plan selection and hide auth section
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("plan-section").classList.remove("hidden");
}

function updateOrderSummary(planType, planPeriod, planPrice) {
    // Update order summary
    let typeText, periodText, subtotal, discount, total;

    if (planType === "group") {
        typeText = "Aulas em Grupo";
        if (planPeriod === "monthly") {
            periodText = "4 aulas por mês";
            subtotal = "R$ 199,00";
            discount = "R$ 0,00";
            total = "R$ 199,00";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 1x de R$ 199,00";
            }
        } else if (planPeriod === "semester") {
            periodText = "24 aulas em 6 meses";
            subtotal = "R$ 1.074,00";
            discount = "-R$ 120,00";
            total = "R$ 954,00";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 6x de R$ 179,00 sem juros";
            }
        } else {
            periodText = "48 aulas em 12 meses";
            subtotal = "R$ 1.908,00";
            discount = "-R$ 286,20";
            total = "R$ 1.621,80";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 12x de R$ 159,00 sem juros";
            }
        }
    } else {
        typeText = "Aulas Particulares";
        if (planPeriod === "monthly") {
            periodText = "4 aulas por mês";
            subtotal = "R$ 399,00";
            discount = "R$ 0,00";
            total = "R$ 399,00";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 1x de R$ 399,00";
            }
        } else if (planPeriod === "semester") {
            periodText = "24 aulas em 6 meses";
            subtotal = "R$ 2.154,00";
            discount = "-R$ 215,40";
            total = "R$ 1.938,60";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 6x de R$ 359,00 sem juros";
            }
        } else {
            periodText = "48 aulas em 12 meses";
            subtotal = "R$ 3.828,00";
            discount = "-R$ 574,20";
            total = "R$ 3.253,80";
            const installmentInfo = document.getElementById("installment-info");
            if (installmentInfo) {
                installmentInfo.textContent = "ou 12x de R$ 319,00 sem juros";
            }
        }
    }

    // Update elements safely
    const planTypeEl = document.getElementById("plan-type");
    const planPeriodEl = document.getElementById("plan-period");
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const totalEl = document.getElementById("total");

    if (planTypeEl) {
        planTypeEl.textContent = `${typeText} - ${
            planPeriod === "monthly"
                ? "Mensal"
                : planPeriod === "semester"
                ? "Semestral"
                : "Anual"
        }`;
    }
    if (planPeriodEl) planPeriodEl.textContent = periodText;
    if (subtotalEl) subtotalEl.textContent = subtotal;
    if (discountEl) discountEl.textContent = discount;
    if (totalEl) totalEl.textContent = total;
}

// ===== LOG DE INICIALIZAÇÃO =====
console.log('🎯 Sistema de Pagamentos Kengi Idiomas carregado!');
console.log('✅ Sistema de passos com cores corretas implementado');
console.log('🔐 Google OAuth em modo demonstração');
console.log('🎨 Funcionalidade básica restaurada');
