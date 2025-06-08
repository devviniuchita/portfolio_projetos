# 🔄 PLANO DE INTEGRAÇÃO FRONTEND-BACKEND
## Kengi Idiomas - Sprint 4

**Data:** 27 de Janeiro de 2025  
**Status:** ⚠️ **PRIORIDADE MÁXIMA**  
**Objetivo:** Conectar o frontend existente com as APIs backend implementadas

---

## 📋 VISÃO GERAL

Este plano detalha as etapas necessárias para integrar o frontend HTML/CSS/JS existente com as APIs RESTful implementadas no backend .NET 8. O objetivo é permitir que os usuários possam utilizar todas as funcionalidades do sistema, especialmente o fluxo crítico de autenticação, agendamento e pagamentos.

---

## 🛠️ ETAPAS DA INTEGRAÇÃO

### 1. **Preparação do Ambiente (1 dia)**

#### 1.1. **Configurar Proxy de Desenvolvimento**
```javascript
// package.json
{
  "scripts": {
    "dev": "concurrently \"http-server ./ -p 3000\" \"dotnet run --project backend/KengiIdiomas.Api\"",
    "proxy": "http-server ./ -p 3000 --proxy http://localhost:5000"
  }
}
```

#### 1.2. **Setup de Bibliotecas Frontend**
```bash
npm install axios jwt-decode sweetalert2
```

#### 1.3. **Criar Serviços Base**
```javascript
// assets/js/services/api.js
const API_URL = '/api';

const ApiService = {
  async get(url, token = null) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    
    try {
      const response = await fetch(`${API_URL}/${url}`, { headers });
      return await response.json();
    } catch (error) {
      console.error(`Erro ao fazer GET para ${url}:`, error);
      throw error;
    }
  },
  
  async post(url, data, token = null) {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    try {
      const response = await fetch(`${API_URL}/${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Erro ao fazer POST para ${url}:`, error);
      throw error;
    }
  }
};
```

---

### 2. **Integração da Autenticação (2 dias)**

#### 2.1. **Implementar Login/Cadastro**
```javascript
// assets/js/services/auth.js
const AuthService = {
  async login(email, senha) {
    return await ApiService.post('auth/login', { email, senha });
  },
  
  async registro(nome, email, senha) {
    return await ApiService.post('auth/register', { nome, email, senha });
  },
  
  async loginGoogle(googleData) {
    return await ApiService.post('auth/google', googleData);
  },
  
  saveToken(token) {
    localStorage.setItem('kengi_token', token);
  },
  
  getToken() {
    return localStorage.getItem('kengi_token');
  },
  
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar validade do token
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  logout() {
    localStorage.removeItem('kengi_token');
  }
};
```

#### 2.2. **Modificar HTML do Login**
```html
<!-- pagamento.html - Seção de Login -->
<div id="login-section">
  <form id="login-form" class="mb-4">
    <div class="mb-3">
      <input type="email" id="email" class="form-control" placeholder="Email" required>
    </div>
    <div class="mb-3">
      <input type="password" id="senha" class="form-control" placeholder="Senha" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">Entrar</button>
  </form>
  
  <button id="login-google" class="btn btn-outline-secondary w-100 mb-3">
    <img src="assets/images/google-icon.png" alt="Google" width="20"> Continuar com Google
  </button>
  
  <p class="text-center">Não tem conta? <a href="#" id="show-register">Cadastre-se</a></p>
  
  <div id="register-form" class="mt-4 d-none">
    <!-- Formulário de cadastro -->
  </div>
</div>
```

#### 2.3. **Implementar JavaScript para Autenticação**
```javascript
// assets/js/pages/pagamento/auth.js
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
      const response = await AuthService.login(email, senha);
      
      if (response.success) {
        AuthService.saveToken(response.token);
        showLoggedInState();
        loadUserData();
        // Avançar para próxima etapa (seleção de plano)
        showStep(2);
      } else {
        showError(response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      showError('Falha na conexão com o servidor');
    }
  });
  
  // Google login
  const googleLoginBtn = document.getElementById('login-google');
  googleLoginBtn.addEventListener('click', initGoogleLogin);
  
  // Verificar se já está logado
  if (AuthService.isLoggedIn()) {
    showLoggedInState();
    loadUserData();
  }
});
```

---

### 3. **Integração Sistema de Agenda (3 dias)**

#### 3.1. **Serviço para Horários**
```javascript
// assets/js/services/agenda.js
const AgendaService = {
  async getHorarios(tipo) {
    return await ApiService.get(`agenda/horarios/${tipo}`, AuthService.getToken());
  },
  
  async getHorariosByPlano(planoId) {
    return await ApiService.get(`agenda/plano/${planoId}/horarios`, AuthService.getToken());
  },
  
  async reservarHorario(horarioId, planoId) {
    return await ApiService.post('agenda/reservar', {
      horarioId,
      planoId
    }, AuthService.getToken());
  },
  
  async adicionarFilaEspera(horarioId) {
    return await ApiService.post('agenda/fila-espera', horarioId, AuthService.getToken());
  }
};
```

#### 3.2. **Modificar HTML da Agenda**
```html
<!-- pagamento.html - Seção de Agenda (Passo 3) -->
<div id="agenda-section" class="step-content">
  <h3>Escolha o dia e horário</h3>
  
  <div class="dias-semana mb-4">
    <div class="row">
      <div class="col" data-day="1">
        <button class="btn-day">Segunda</button>
      </div>
      <!-- Outros dias -->
    </div>
  </div>
  
  <div id="horarios-container" class="mb-4 hidden">
    <h4>Horários disponíveis</h4>
    <div id="horarios-list" class="row"></div>
  </div>
  
  <div id="no-horarios" class="text-center py-4 hidden">
    <h5>Nenhum horário disponível</h5>
    <p>Que tal entrar na lista de espera?</p>
    <button id="join-waitlist" class="btn btn-outline-primary">Entrar na Lista de Espera</button>
  </div>
  
  <div id="selection-summary" class="mt-4 p-3 bg-light rounded hidden">
    <h5>Sua seleção</h5>
    <div class="d-flex justify-content-between">
      <span>Dia:</span>
      <strong id="summary-day"></strong>
    </div>
    <div class="d-flex justify-content-between">
      <span>Horário:</span>
      <strong id="summary-time"></strong>
    </div>
    <div class="d-flex justify-content-between">
      <span>Plano:</span>
      <strong id="summary-plan"></strong>
    </div>
  </div>
</div>
```

#### 3.3. **Implementar JavaScript para Agenda**
```javascript
// assets/js/pages/pagamento/agenda.js
class AgendaManager {
  constructor() {
    this.selectedDay = null;
    this.selectedHorarioId = null;
    this.selectedTime = null;
    this.selectedPlan = null;
  }
  
  init() {
    // Obter plano selecionado da etapa anterior
    this.selectedPlan = PageManager.getSelectedPlan();
    
    // Configurar botões de dia
    const dayButtons = document.querySelectorAll('.btn-day');
    dayButtons.forEach(button => {
      button.addEventListener('click', () => this.selectDay(button));
    });
    
    // Configurar botão de lista de espera
    document.getElementById('join-waitlist').addEventListener('click', () => this.joinWaitlist());
  }
  
  async selectDay(button) {
    // Resetar seleção anterior
    document.querySelectorAll('.btn-day').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    this.selectedDay = button.parentElement.dataset.day;
    document.getElementById('horarios-container').classList.remove('hidden');
    document.getElementById('selection-summary').classList.add('hidden');
    
    await this.loadHorarios();
  }
  
  async loadHorarios() {
    try {
      const response = await AgendaService.getHorarios(this.selectedPlan.tipo);
      
      if (response.success && response.data.length > 0) {
        // Filtrar horários pelo dia selecionado
        const horariosDoDia = response.data.filter(h => h.diaSemana == this.selectedDay);
        
        if (horariosDoDia.length > 0) {
          this.renderHorarios(horariosDoDia);
        } else {
          this.showNoHorarios();
        }
      } else {
        this.showNoHorarios();
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      this.showNoHorarios();
    }
  }
  
  renderHorarios(horarios) {
    const container = document.getElementById('horarios-list');
    container.innerHTML = '';
    
    horarios.forEach(horario => {
      const horarioEl = document.createElement('div');
      horarioEl.className = 'col-md-4 mb-3';
      horarioEl.dataset.horarioId = horario.id;
      horarioEl.dataset.time = `${horario.horaInicio} - ${horario.horaFim}`;
      
      horarioEl.innerHTML = `
        <div class="card horario-card">
          <div class="card-body">
            <h5 class="card-title">${horario.horaInicio} - ${horario.horaFim}</h5>
            <p class="card-text">${horario.disponivel ? 'Disponível' : 'Ocupado'}</p>
          </div>
        </div>
      `;
      
      if (horario.disponivel) {
        horarioEl.addEventListener('click', () => this.selectHorario(horarioEl));
      } else {
        horarioEl.querySelector('.horario-card').classList.add('disabled');
      }
      
      container.appendChild(horarioEl);
    });
    
    document.getElementById('no-horarios').classList.add('hidden');
    document.getElementById('horarios-container').classList.remove('hidden');
  }
  
  selectHorario(horarioEl) {
    document.querySelectorAll('.horario-card').forEach(card => card.classList.remove('selected'));
    horarioEl.querySelector('.horario-card').classList.add('selected');
    
    this.selectedHorarioId = horarioEl.dataset.horarioId;
    this.selectedTime = horarioEl.dataset.time;
    
    this.updateSelectionSummary();
  }
  
  updateSelectionSummary() {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    document.getElementById('summary-day').textContent = dayNames[this.selectedDay];
    document.getElementById('summary-time').textContent = this.selectedTime;
    document.getElementById('summary-plan').textContent = this.selectedPlan.nome;
    
    document.getElementById('selection-summary').classList.remove('hidden');
    
    // Permitir avançar para próxima etapa
    PageManager.enableNextStep();
  }
  
  showNoHorarios() {
    document.getElementById('horarios-container').classList.add('hidden');
    document.getElementById('no-horarios').classList.remove('hidden');
  }
  
  async joinWaitlist() {
    try {
      const response = await AgendaService.adicionarFilaEspera(this.selectedDay);
      if (response.success) {
        window.location.href = 'espera.html';
      } else {
        showError(response.message || 'Erro ao entrar na lista de espera');
      }
    } catch (error) {
      showError('Falha na conexão com o servidor');
    }
  }
  
  getSelectionData() {
    return {
      horarioId: this.selectedHorarioId,
      dia: this.selectedDay,
      horario: this.selectedTime
    };
  }
}
```

---

### 4. **Integração Sistema de Pagamentos (2 dias)**

#### 4.1. **Serviço para Pagamentos**
```javascript
// assets/js/services/pagamento.js
const PagamentoService = {
  async processar(pagamentoData) {
    return await ApiService.post('pagamento/processar', pagamentoData, AuthService.getToken());
  },
  
  async processarCartao(pagamentoData) {
    return await ApiService.post('pagamento/cartao', pagamentoData, AuthService.getToken());
  },
  
  async processarPix(pagamentoData) {
    return await ApiService.post('pagamento/pix', pagamentoData, AuthService.getToken());
  },
  
  async processarBoleto(pagamentoData) {
    return await ApiService.post('pagamento/boleto', pagamentoData, AuthService.getToken());
  },
  
  async getPedidos() {
    return await ApiService.get('pagamento/meus-pedidos', AuthService.getToken());
  }
};
```

#### 4.2. **Modificar HTML do Pagamento**
```html
<!-- pagamento.html - Seção de Pagamento (Passo 4) -->
<div id="payment-section" class="step-content">
  <h3>Pagamento</h3>
  
  <div class="payment-summary mb-4 p-3 bg-light rounded">
    <h5>Resumo da compra</h5>
    <div id="purchase-summary"></div>
    <div class="total mt-3">
      <strong>Total: R$ <span id="total-price">0,00</span></strong>
    </div>
  </div>
  
  <div class="payment-methods mb-4">
    <h5>Forma de pagamento</h5>
    <div class="row">
      <div class="col-md-4">
        <button class="btn btn-outline-primary payment-method-btn" data-method="cartao">
          <i class="fa fa-credit-card"></i> Cartão
        </button>
      </div>
      <div class="col-md-4">
        <button class="btn btn-outline-primary payment-method-btn" data-method="pix">
          <i class="fa fa-qrcode"></i> PIX
        </button>
      </div>
      <div class="col-md-4">
        <button class="btn btn-outline-primary payment-method-btn" data-method="boleto">
          <i class="fa fa-barcode"></i> Boleto
        </button>
      </div>
    </div>
  </div>
  
  <!-- Formulários de pagamento -->
  <div id="cartao-form" class="payment-form mb-4 d-none">
    <!-- Campos cartão de crédito -->
  </div>
  
  <div id="pix-form" class="payment-form mb-4 d-none">
    <!-- QR Code PIX -->
  </div>
  
  <div id="boleto-form" class="payment-form mb-4 d-none">
    <!-- Dados boleto -->
  </div>
  
  <button id="finalizar-compra" class="btn btn-success btn-lg w-100" disabled>
    Finalizar Compra
  </button>
</div>
```

#### 4.3. **Implementar JavaScript para Pagamentos**
```javascript
// assets/js/pages/pagamento/payment.js
class PaymentManager {
  constructor() {
    this.selectedPaymentMethod = null;
    this.purchaseData = {};
  }
  
  init() {
    // Obter dados das etapas anteriores
    this.purchaseData = {
      plano: PageManager.getSelectedPlan(),
      agenda: PageManager.getAgendaSelection()
    };
    
    // Renderizar resumo da compra
    this.renderPurchaseSummary();
    
    // Configurar métodos de pagamento
    const paymentButtons = document.querySelectorAll('.payment-method-btn');
    paymentButtons.forEach(button => {
      button.addEventListener('click', () => this.selectPaymentMethod(button));
    });
    
    // Configurar botão finalizar
    document.getElementById('finalizar-compra').addEventListener('click', () => this.processPayment());
  }
  
  renderPurchaseSummary() {
    const { plano, agenda } = this.purchaseData;
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    const summary = document.getElementById('purchase-summary');
    summary.innerHTML = `
      <div class="mb-2 d-flex justify-content-between">
        <span>Plano:</span>
        <span>${plano.nome}</span>
      </div>
      <div class="mb-2 d-flex justify-content-between">
        <span>Dia:</span>
        <span>${dayNames[agenda.dia]}</span>
      </div>
      <div class="mb-2 d-flex justify-content-between">
        <span>Horário:</span>
        <span>${agenda.horario}</span>
      </div>
    `;
    
    document.getElementById('total-price').textContent = plano.preco.toFixed(2).replace('.', ',');
  }
  
  selectPaymentMethod(button) {
    // Resetar seleção anterior
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Esconder todos os formulários
    document.querySelectorAll('.payment-form').forEach(form => form.classList.add('d-none'));
    
    // Mostrar formulário correspondente
    this.selectedPaymentMethod = button.dataset.method;
    document.getElementById(`${this.selectedPaymentMethod}-form`).classList.remove('d-none');
    
    // Habilitar botão finalizar
    document.getElementById('finalizar-compra').disabled = false;
  }
  
  async processPayment() {
    // Desabilitar botão durante processamento
    const button = document.getElementById('finalizar-compra');
    button.disabled = true;
    button.textContent = 'Processando...';
    
    try {
      // Preparar dados do pagamento
      const paymentData = {
        planoId: this.purchaseData.plano.id,
        horarioId: this.purchaseData.agenda.horarioId,
        metodoPagamento: this.selectedPaymentMethod,
        dadosPagamento: this.getPaymentFormData()
      };
      
      // Chamar serviço correspondente
      let response;
      switch (this.selectedPaymentMethod) {
        case 'cartao':
          response = await PagamentoService.processarCartao(paymentData);
          break;
        case 'pix':
          response = await PagamentoService.processarPix(paymentData);
          break;
        case 'boleto':
          response = await PagamentoService.processarBoleto(paymentData);
          break;
        default:
          response = await PagamentoService.processar(paymentData);
      }
      
      if (response.success) {
        this.handlePaymentSuccess(response.data);
      } else {
        showError(response.message || 'Erro ao processar pagamento');
        button.disabled = false;
        button.textContent = 'Finalizar Compra';
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      showError('Falha na conexão com o servidor');
      button.disabled = false;
      button.textContent = 'Finalizar Compra';
    }
  }
  
  getPaymentFormData() {
    // Coletar dados do formulário específico
    switch (this.selectedPaymentMethod) {
      case 'cartao':
        return {
          numero: document.getElementById('card-number').value,
          nome: document.getElementById('card-name').value,
          validade: document.getElementById('card-expiry').value,
          cvv: document.getElementById('card-cvv').value,
          parcelas: document.getElementById('card-installments').value
        };
      case 'pix':
        return {};
      case 'boleto':
        return {
          cpf: document.getElementById('boleto-cpf').value
        };
      default:
        return {};
    }
  }
  
  handlePaymentSuccess(data) {
    // Armazenar ID do pedido
    localStorage.setItem('ultimo_pedido_id', data.pedidoId);
    
    // Redirecionar para página de confirmação
    PageManager.goToConfirmation(data);
  }
}
```

---

### 5. **Testes e Debugging (2 dias)**

#### 5.1. **Testes de Fluxo Completo**
- Login → Seleção de Plano → Agenda → Pagamento → Confirmação
- Validar token JWT e autenticação
- Verificar carregamento de horários e reservas
- Testar processamento de pagamentos

#### 5.2. **Debugging e Ajustes**
- Corrigir possíveis problemas CORS
- Verificar manipulação de erros
- Ajustar mensagens de feedback

#### 5.3. **Testes de Responsividade**
- Desktop
- Tablets
- Smartphones

---

## 📅 CRONOGRAMA

| Etapa | Tarefa | Tempo Estimado | Responsável |
|-------|--------|----------------|-------------|
| 1 | Preparação do Ambiente | 1 dia | BLACKBOX |
| 2 | Integração Autenticação | 2 dias | BLACKBOX |
| 3 | Integração Sistema de Agenda | 3 dias | BLACKBOX |
| 4 | Integração Pagamentos | 2 dias | BLACKBOX |
| 5 | Testes e Debugging | 2 dias | LINGMA |
| **Total** | | **10 dias úteis** | |

---

## 🚨 DEPENDÊNCIAS CRÍTICAS

1. **Backend acessível** - APIs devem estar disponíveis em ambiente de desenvolvimento
2. **CORS configurado** - Backend deve permitir requisições do frontend
3. **Autenticação funcional** - Geração e validação de JWT funcionando

---

## 🚀 RESULTADO ESPERADO

Ao concluir a integração, o usuário poderá:

1. Fazer login ou se registrar
2. Escolher um plano (particular ou grupo)
3. Selecionar dia e horário disponíveis
4. Realizar pagamento (cartão, PIX ou boleto)
5. Receber confirmação da compra

Todo o fluxo estará conectado às APIs backend, permitindo gestão completa de usuários, horários e pagamentos no sistema. 