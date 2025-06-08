/**
 * Controller da Página de Pagamento - Kengi Idiomas
 * Gerencia o fluxo de pagamento em etapas
 */

// Importações de serviços
import { authService } from '../../services/auth.js';
import { selectionService } from '../../services/selection.js';
import { pagamentoService } from '../../services/pagamento.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar controller
  PaymentPageController.init();
});

const PaymentPageController = {
  // Estado atual
  currentStep: 1,
  selectedPlan: null,
  selectedSchedule: null,
  paymentMethod: null,
  paymentData: null,
  
  // Inicialização
  init() {
    this.setupEventListeners();
    this.checkAuthentication();
    this.setupGoogleAuth(); // Inicializar Google Auth
    console.log('✅ PaymentPageController inicializado');
  },
  
  // Configurar listeners de eventos
  setupEventListeners() {
    // Autenticação
    this.setupAuthListeners();
    
    // Seleção de plano
    document.querySelectorAll('.select-plan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const planCard = e.target.closest('.plan-card');
        this.selectPlan(planCard);
      });
    });
    
    // Navegação entre etapas
    document.querySelectorAll('.prev-step-btn').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
    
    document.querySelectorAll('.next-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.id === 'payment-next-btn') {
          this.processPayment();
        } else {
          this.nextStep();
        }
      });
    });
    
    // Métodos de pagamento
    document.querySelectorAll('.payment-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchPaymentMethod(e.target.dataset.method);
      });
    });
    
    // Boleto
    document.getElementById('generate-boleto-btn')?.addEventListener('click', () => {
      this.generateBoleto();
    });
    
    document.getElementById('send-boleto-email-btn')?.addEventListener('click', () => {
      this.sendBoletoByEmail();
    });
    
    // Copiar código PIX
    document.getElementById('copy-pix-btn')?.addEventListener('click', () => {
      this.copyPixCode();
    });
    
    // Fila de espera
    document.getElementById('waitlist-btn')?.addEventListener('click', () => {
      this.showWaitlistModal();
    });
    
    // Filtro de dias
    document.getElementById('day-filter')?.addEventListener('change', (e) => {
      this.loadScheduleSlots(e.target.value);
    });
  },
  
  // Configurar Google Auth
  setupGoogleAuth() {
    // Simular carregamento da API do Google
    console.log('✅ Inicializando Google OAuth');
    
    // Em um ambiente real, isso seria:
    /*
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: 'SEU_CLIENT_ID_GOOGLE.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      }).then((auth2) => {
        this.googleAuth = auth2;
        console.log('Google OAuth inicializado');
        
        // Configurar botão
        const googleBtn = document.getElementById('google-login');
        if (googleBtn) {
          this.googleAuth.attachClickHandler(googleBtn, {}, 
            (googleUser) => {
              const profile = googleUser.getBasicProfile();
              const id_token = googleUser.getAuthResponse().id_token;
              this.handleGoogleLoginSuccess(id_token, profile);
            }, 
            (error) => {
              console.error('Erro no login Google:', error);
              this.showMessage('login-message', 'Falha ao autenticar com Google', 'error');
            }
          );
        }
      });
    });
    */
  },
  
  // Configurar listeners para autenticação
  setupAuthListeners() {
    // Alternar entre login e cadastro
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        document.querySelectorAll('.auth-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${e.target.dataset.tab}-content`).classList.add('active');
      });
    });
    
    // Form de login
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
    
    // Form de cadastro
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister();
    });
    
    // Login com Google
    document.getElementById('google-login')?.addEventListener('click', () => {
      this.handleGoogleLogin();
    });
  },
  
  // Verificar se o usuário já está autenticado
  async checkAuthentication() {
    try {
      // Em ambiente de desenvolvimento, simulamos a autenticação
      const isAuthenticated = localStorage.getItem('kengi_auth_token') !== null;
      if (isAuthenticated) {
        // Se já estiver autenticado, avançar para a próxima etapa
        this.nextStep();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  },
  
  // Processar login
  async handleLogin() {
    try {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        this.showMessage('login-message', 'Preencha todos os campos', 'error');
        return;
      }
      
      this.showMessage('login-message', 'Autenticando...', 'info');
      
      // Em ambiente de desenvolvimento/teste, simular autenticação bem-sucedida
      const userData = {
        id: 1,
        email: email,
        fullName: email.split('@')[0]
      };
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzdWFyaW90ZXN0ZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Salvar dados na sessão
      localStorage.setItem('kengi_auth_token', token);
      localStorage.setItem('kengi_user', JSON.stringify(userData));
      
      this.showMessage('login-message', 'Login realizado com sucesso!', 'success');
      setTimeout(() => this.nextStep(), 1000);
    } catch (error) {
      console.error('Erro no login:', error);
      this.showMessage('login-message', error.message || 'Falha na autenticação. Verifique suas credenciais.', 'error');
    }
  },
  
  // Processar cadastro
  async handleRegister() {
    try {
      const fullName = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      if (!fullName || !email || !password || !confirmPassword) {
        this.showMessage('register-message', 'Preencha todos os campos', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        this.showMessage('register-message', 'As senhas não coincidem', 'error');
        return;
      }
      
      this.showMessage('register-message', 'Criando conta...', 'info');
      
      // Em ambiente de desenvolvimento/teste, simular registro bem-sucedido
      const userData = {
        id: Date.now(), // Simular ID único
        email: email,
        fullName: fullName
      };
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzdWFyaW90ZXN0ZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Salvar dados na sessão
      localStorage.setItem('kengi_auth_token', token);
      localStorage.setItem('kengi_user', JSON.stringify(userData));
      
      this.showMessage('register-message', 'Conta criada com sucesso!', 'success');
      setTimeout(() => this.nextStep(), 1000);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      this.showMessage('register-message', error.message || 'Falha no cadastro. Tente novamente.', 'error');
    }
  },
  
  // Processar login com Google
  async handleGoogleLogin() {
    try {
      // Em ambiente de desenvolvimento, simular login com Google
      this.showMessage('login-message', 'Autenticando com Google...', 'info');
      
      // Simular usuário autenticado com Google
      const userData = {
        id: 'google-' + Date.now(),
        email: 'usuario-google@gmail.com',
        fullName: 'Usuário Google',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      };
      
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb29nbGUtdXNlciIsIm5hbWUiOiJVc3XDoXJpbyBHb29nbGUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Salvar dados na sessão
      localStorage.setItem('kengi_auth_token', token);
      localStorage.setItem('kengi_user', JSON.stringify(userData));
      
      this.showMessage('login-message', 'Login com Google realizado com sucesso!', 'success');
      setTimeout(() => this.nextStep(), 1000);
    } catch (error) {
      console.error('Erro no login com Google:', error);
      this.showMessage('login-message', error.message || 'Falha na autenticação com Google. Tente novamente.', 'error');
    }
  },
  
  // Handler para sucesso de login Google (num ambiente real)
  handleGoogleLoginSuccess(idToken, profile) {
    // Chamar serviço de autenticação com o token do Google
    const userData = {
      id: profile.getId(),
      email: profile.getEmail(),
      fullName: profile.getName(),
      picture: profile.getImageUrl()
    };
    
    // Salvar dados na sessão (temporário para testes)
    localStorage.setItem('kengi_auth_token', idToken);
    localStorage.setItem('kengi_user', JSON.stringify(userData));
    
    this.showMessage('login-message', 'Login com Google realizado com sucesso!', 'success');
    setTimeout(() => this.nextStep(), 1000);
  },
  
  // Selecionar um plano
  selectPlan(planCard) {
    // Remover seleção anterior
    document.querySelectorAll('.plan-card').forEach(card => {
      card.classList.remove('selected');
    });
    planCard.classList.add('selected');
    // Armazenar dados do plano selecionado
    const planData = {
      id: parseInt(planCard.dataset.planId),
      name: planCard.querySelector('h3').textContent,
      price: planCard.querySelector('.plan-price').textContent,
      type: planCard.dataset.type,
      period: planCard.dataset.period
    };
    this.selectedPlan = planData;
    selectionService.setSelectedPlan(planData);
    // Atualizar info do plano na agenda
    const info = `${planData.name} - ${planData.period ? planData.period.charAt(0).toUpperCase() + planData.period.slice(1) : ''}`;
    document.getElementById('selected-plan-info').textContent = info;
    // Atualizar resumo parcial
    document.getElementById('summary-type').textContent = planData.type === 'group' ? 'Aulas em Grupo' : 'Aulas Particulares';
    document.getElementById('summary-plan').textContent = planData.name;
    document.getElementById('summary-price').textContent = planData.price;
    setTimeout(() => this.nextStep(), 500);
  },
  
  // Carregar slots de horário (corrigido para usar API real)
  async loadScheduleSlots(day) {
    try {
      const slotsContainer = document.getElementById('schedule-slots');
      slotsContainer.innerHTML = '<div class="loading-indicator">Carregando horários disponíveis...</div>';
      // Obter tipo de aula do plano selecionado
      let plan = this.selectedPlan || selectionService.getSelectedPlan();
      if (!plan) {
        plan = selectionService.getSelectedPlan();
        this.selectedPlan = plan;
      }
      const type = plan?.type || 'group';
      // Buscar horários reais do backend
      const horarios = await selectionService.getHorariosPorDia(type, day);
      slotsContainer.innerHTML = '';
      if (!horarios || horarios.length === 0) {
        slotsContainer.innerHTML = '<div class="no-slots">Não há horários disponíveis para este dia.</div>';
        return;
      }
      horarios.forEach(horario => {
        const slotElement = document.createElement('div');
        slotElement.className = `schedule-slot ${horario.disponivel ? 'available' : 'unavailable'}`;
        slotElement.dataset.horarioId = horario.id;
        slotElement.innerHTML = `
          <div class="slot-time">${horario.horaInicio} - ${horario.horaFim}</div>
          <div class="slot-status">${horario.disponivel ? 'Disponível' : 'Ocupado'}</div>
        `;
        if (horario.disponivel) {
          slotElement.addEventListener('click', () => this.selectScheduleSlot(horario, day));
        }
        slotsContainer.appendChild(slotElement);
      });
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      document.getElementById('schedule-slots').innerHTML = '<div class="error-message">Erro ao carregar horários. Por favor, tente novamente.</div>';
    }
  },
  
  // Selecionar um horário (corrigido para atualizar resumo)
  selectScheduleSlot(horario, diaSemana) {
    document.querySelectorAll('.schedule-slot').forEach(slot => {
      slot.classList.remove('selected');
    });
    document.querySelector(`.schedule-slot[data-horario-id="${horario.id}"]`).classList.add('selected');
    this.selectedSchedule = horario;
    selectionService.setSelectedSchedule(horario);
    // Atualizar resumo
    const plan = this.selectedPlan || selectionService.getSelectedPlan();
    document.getElementById('summary-type').textContent = plan?.type === 'group' ? 'Aulas em Grupo' : 'Aulas Particulares';
    document.getElementById('summary-plan').textContent = plan?.name || '';
    document.getElementById('summary-price').textContent = plan?.price || '';
    document.getElementById('summary-day').textContent = horario.diaSemana || diaSemana || '';
    document.getElementById('summary-time').textContent = `${horario.horaInicio} - ${horario.horaFim}`;
    document.getElementById('selection-summary').classList.remove('hidden');
    document.getElementById('schedule-next-btn').disabled = false;
  },
  
  // Mostrar modal de fila de espera
  showWaitlistModal() {
    // Em uma implementação real, isso abriria um modal
    alert('Funcionalidade de fila de espera em desenvolvimento.');
    
    // Aqui implementaríamos a lógica para adicionar à fila de espera
    // selectionService.adicionarFilaEspera(filaData);
  },
  
  // Alternar método de pagamento
  switchPaymentMethod(method) {
    // Atualizar tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`.payment-tab[data-method="${method}"]`).classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.payment-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${method}-content`).classList.add('active');
    
    // Armazenar método selecionado
    this.paymentMethod = method;
    localStorage.setItem('selected_payment_method', method);
    
    // Se for PIX, gerar QR Code
    if (method === 'pix') {
      this.generatePixQRCode();
    }
  },
  
  // Gerar QR Code PIX
  async generatePixQRCode() {
    try {
      const pixContainer = document.getElementById('pix-qrcode');
      pixContainer.innerHTML = '<div class="loading-indicator">Gerando QR Code...</div>';
      
      if (!this.selectedPlan || !this.selectedSchedule) {
        throw new Error('Dados incompletos para gerar pagamento');
      }
      
      // Simulação de geração de QR Code
      setTimeout(() => {
        pixContainer.innerHTML = `
          <img src="assets/images/payment_images/qr-code-example.png" alt="QR Code PIX">
        `;
        
        // Exibir código PIX
        document.getElementById('pix-code').value = "00020101021226880014BR.GOV.BCB.PIX0136kengi@exemplo.com5204000053039865802BR5913Kengi Idiomas6008Sao Paulo62090505123456304E2CA";
        
        // Armazenar dados do pagamento
        this.paymentData = {
          paymentId: 'pix_' + Date.now(),
          amount: this.selectedPlan.price,
          method: 'pix'
        };
        
        // Simular monitoramento do pagamento
        this.monitorPixPayment(this.paymentData.paymentId);
      }, 1000);
    } catch (error) {
      console.error('Erro ao gerar QR Code PIX:', error);
      document.getElementById('pix-qrcode').innerHTML = 
        '<div class="error-message">Erro ao gerar QR Code. Por favor, tente novamente.</div>';
      this.showMessage('pix-message', error.message || 'Falha ao gerar pagamento PIX', 'error');
    }
  },
  
  // Monitorar pagamento PIX
  monitorPixPayment(paymentId) {
    // Simulação de monitoramento (em prod seria via API)
    // Simular pagamento confirmado após 8 segundos
    setTimeout(() => {
      this.showMessage('pix-message', 'Pagamento confirmado! Redirecionando...', 'success');
      setTimeout(() => this.nextStep(), 2000);
    }, 8000);
  },
  
  // Copiar código PIX
  copyPixCode() {
    const pixCode = document.getElementById('pix-code');
    pixCode.select();
    document.execCommand('copy');
    
    // Feedback visual
    const copyBtn = document.getElementById('copy-pix-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  },
  
  // Gerar boleto
  async generateBoleto() {
    try {
      const boletoContainer = document.getElementById('boleto-details');
      boletoContainer.innerHTML = '<div class="loading-indicator">Gerando boleto...</div>';
      
      if (!this.selectedPlan || !this.selectedSchedule) {
        throw new Error('Dados incompletos para gerar pagamento');
      }
      
      // Simulação de geração de boleto
      setTimeout(() => {
        // Exibir detalhes do boleto
        boletoContainer.innerHTML = `
          <div class="boleto-code">
            <p>Código do Boleto:</p>
            <div class="copy-code">
              <input type="text" value="34191.79001 01043.510047 91020.150008 9 87560000029999" readonly>
              <button class="btn copy-btn">Copiar</button>
            </div>
          </div>
          <div class="boleto-links">
            <a href="#" target="_blank" class="btn secondary-btn">Visualizar Boleto</a>
            <a href="#" download="boleto-kengi-idiomas.pdf" class="btn secondary-btn">Download PDF</a>
          </div>
        `;
        
        // Armazenar dados do pagamento
        this.paymentData = {
          paymentId: 'boleto_' + Date.now(),
          amount: this.selectedPlan.price,
          method: 'boleto',
          boletoCode: '34191.79001 01043.510047 91020.150008 9 87560000029999'
        };
        
        this.showMessage('boleto-message', 'Boleto gerado com sucesso!', 'success');
      }, 1500);
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      document.getElementById('boleto-details').innerHTML = 
        '<div class="error-message">Erro ao gerar boleto. Por favor, tente novamente.</div>';
      this.showMessage('boleto-message', error.message || 'Falha ao gerar boleto', 'error');
    }
  },
  
  // Enviar boleto por email
  async sendBoletoByEmail() {
    try {
      this.showMessage('boleto-message', 'Enviando boleto para seu email...', 'info');
      
      if (!this.paymentData || !this.paymentData.paymentId) {
        throw new Error('Gere o boleto primeiro');
      }
      
      // Simulação de envio por email
      setTimeout(() => {
        this.showMessage('boleto-message', 'Boleto enviado para seu email com sucesso!', 'success');
      }, 1500);
    } catch (error) {
      console.error('Erro ao enviar boleto por email:', error);
      this.showMessage('boleto-message', error.message || 'Falha ao enviar boleto por email', 'error');
    }
  },
  
  // Processar pagamento
  async processPayment() {
    try {
      if (!this.paymentMethod) {
        throw new Error('Selecione um método de pagamento');
      }
      
      if (this.paymentMethod === 'credit-card') {
        await this.processCardPayment();
      } else if (this.paymentMethod === 'pix' || this.paymentMethod === 'boleto') {
        // Para PIX e boleto, já geramos anteriormente, então apenas avançamos
        this.nextStep();
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      this.showMessage(`${this.paymentMethod}-message`, error.message || 'Falha ao processar pagamento', 'error');
    }
  },
  
  // Processar pagamento com cartão
  async processCardPayment() {
    try {
      const cardNumber = document.getElementById('card-number').value;
      const cardExpiry = document.getElementById('card-expiry').value;
      const cardCvv = document.getElementById('card-cvv').value;
      const cardName = document.getElementById('card-name').value;
      const installments = document.getElementById('card-installments').value;
      
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        throw new Error('Preencha todos os dados do cartão');
      }
      
      this.showMessage('credit-card-message', 'Processando pagamento...', 'info');
      
      // Simulação de processamento de pagamento
      setTimeout(() => {
        // Armazenar dados do pagamento
        this.paymentData = {
          paymentId: 'card_' + Date.now(),
          amount: this.selectedPlan.price,
          method: 'credit-card',
          last4: cardNumber.slice(-4),
          installments: parseInt(installments)
        };
        
        this.showMessage('credit-card-message', 'Pagamento aprovado!', 'success');
        setTimeout(() => this.nextStep(), 1500);
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      this.showMessage('credit-card-message', error.message || 'Falha ao processar pagamento com cartão', 'error');
    }
  },
  
  // Avançar para a próxima etapa
  nextStep() {
    if (this.currentStep >= 5) return;
    
    const nextStep = this.currentStep + 1;
    
    // Validar se pode avançar
    if (nextStep === 2 && !localStorage.getItem('kengi_auth_token')) {
      this.showMessage('login-message', 'Faça login para continuar', 'error');
      return;
    }
    
    if (nextStep === 3 && !this.selectedPlan) {
      alert('Selecione um plano para continuar');
      return;
    }
    
    if (nextStep === 4 && !this.selectedSchedule) {
      alert('Selecione um horário para continuar');
      return;
    }
    
    // Atualizar a barra de progresso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNum = index + 1;
      const stepCircle = step.querySelector(`#step-${stepNum}`);
      const stepText = step.querySelector(`#step-${stepNum}-text`);
      
      if (stepNum < nextStep) {
        // Etapas anteriores
        stepCircle.classList.remove('bg-[#ccd6e6]');
        stepCircle.classList.add('bg-[#003057]');
        stepCircle.classList.remove('text-[#003057]');
        stepCircle.classList.add('text-white');
        stepText.classList.remove('text-gray-500');
        stepText.classList.add('text-[#003057]');
      } else if (stepNum === nextStep) {
        // Etapa atual
        stepCircle.classList.remove('bg-[#ccd6e6]');
        stepCircle.classList.add('bg-[#003057]');
        stepCircle.classList.remove('text-[#003057]');
        stepCircle.classList.add('text-white');
        stepText.classList.remove('text-gray-500');
        stepText.classList.add('text-[#003057]');
      } else {
        // Etapas futuras
        stepCircle.classList.add('bg-[#ccd6e6]');
        stepCircle.classList.remove('bg-[#003057]');
        stepCircle.classList.add('text-[#003057]');
        stepCircle.classList.remove('text-white');
        stepText.classList.add('text-gray-500');
        stepText.classList.remove('text-[#003057]');
      }
    });
    
    // Esconder/Mostrar as seções correspondentes
    if (nextStep === 2) {
      document.getElementById('auth-section').classList.add('hidden');
      document.getElementById('plan-section').classList.remove('hidden');
    } else if (nextStep === 3) {
      document.getElementById('plan-section').classList.add('hidden');
      document.getElementById('agenda-section').classList.remove('hidden');
      const dayFilter = document.getElementById('day-filter');
      if (dayFilter) {
        this.loadScheduleSlots(dayFilter.value);
      }
    } else if (nextStep === 4) {
      document.getElementById('agenda-section').classList.add('hidden');
      document.getElementById('payment-section').classList.remove('hidden');
      this.updatePaymentSummary();
    } else if (nextStep === 5) {
      document.getElementById('payment-section').classList.add('hidden');
      document.getElementById('confirmation-section').classList.remove('hidden');
      this.updateConfirmationDetails();
    }
    
    // Atualizar estado
    this.currentStep = nextStep;
    
    // Rolar para o topo
    window.scrollTo(0, 0);
    
    console.log(`✅ Avançado para etapa ${nextStep}`);
  },
  
  // Voltar para a etapa anterior
  prevStep() {
    if (this.currentStep <= 1) return;
    
    const prevStep = this.currentStep - 1;
    
    // Atualizar UI
    document.querySelectorAll('.payment-step-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`step-${prevStep}-content`).classList.add('active');
    
    document.querySelectorAll('.step').forEach(step => {
      step.classList.remove('active');
    });
    document.getElementById(`step-${prevStep}`).classList.add('active');
    
    // Atualizar estado
    this.currentStep = prevStep;
    
    // Rolar para o topo
    window.scrollTo(0, 0);
  },
  
  // Atualizar resumo de pagamento
  updatePaymentSummary() {
    if (this.selectedPlan) {
      document.getElementById('summary-plan').textContent = this.selectedPlan.name;
      document.getElementById('summary-total').textContent = this.selectedPlan.price;
    }
    
    if (this.selectedSchedule) {
      document.getElementById('summary-schedule').textContent = 
        `${this.selectedSchedule.diaSemana}, ${this.selectedSchedule.horaInicio} - ${this.selectedSchedule.horaFim}`;
    }
  },
  
  // Atualizar detalhes de confirmação
  updateConfirmationDetails() {
    if (this.selectedPlan) {
      document.getElementById('confirmation-plan').textContent = this.selectedPlan.name;
    }
    
    if (this.selectedSchedule) {
      document.getElementById('confirmation-schedule').textContent = 
        `${this.selectedSchedule.diaSemana}, ${this.selectedSchedule.horaInicio} - ${this.selectedSchedule.horaFim}`;
    }
    
    if (this.paymentMethod) {
      let paymentMethodText = '';
      switch (this.paymentMethod) {
        case 'credit-card':
          paymentMethodText = 'Cartão de Crédito';
          break;
        case 'pix':
          paymentMethodText = 'PIX';
          break;
        case 'boleto':
          paymentMethodText = 'Boleto Bancário';
          break;
      }
      document.getElementById('confirmation-payment').textContent = paymentMethodText;
    }
  },
  
  // Exibir mensagem
  showMessage(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
  }
};
