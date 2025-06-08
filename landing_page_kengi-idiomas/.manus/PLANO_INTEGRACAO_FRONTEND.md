# PLANO DE INTEGRAÇÃO FRONTEND-BACKEND

## Visão Geral

Este documento descreve o plano de integração entre o frontend (HTML/CSS/JS) e o backend (C# .NET 8) do projeto Kengi Idiomas. O objetivo é substituir os dados simulados por chamadas reais à API.

## Status Atual

- **Backend**: Controllers implementados (Auth, Agenda, Payment)
- **Frontend**: Estrutura completa com serviços modulares
- **Integração**: Em andamento (20% concluída)

## Mapeamento de Endpoints e Serviços JS

### 1. Autenticação

#### Endpoints Backend:
```
POST /api/auth/register - Registrar novo usuário
POST /api/auth/login - Autenticar usuário existente
GET /api/auth/user - Obter dados do usuário autenticado
```

#### Serviço JS (auth.js):
```javascript
// Atual (simulado):
async login(email, password) { /* código simulado */ }
async register(userData) { /* código simulado */ }
async loginWithGoogle() { /* código simulado */ }

// A implementar:
async login(email, password) {
  const response = await apiService.post('auth/login', { email, password });
      if (response.success) {
    this._saveAuthData(response.token, response.user);
    return response.user;
  }
  throw new Error(response.message || 'Falha na autenticação');
}

async register(userData) {
  const response = await apiService.post('auth/register', userData);
  if (response.success) {
    this._saveAuthData(response.token, response.user);
    return response.user;
  }
  throw new Error(response.message || 'Falha no registro');
}

async loginWithGoogle(googleToken) {
  // Implementar integração com Google OAuth
}
```

### 2. Sistema de Agenda

#### Endpoints Backend:
```
GET /api/agenda/horarios/{tipo} - Listar horários por tipo (group/private)
GET /api/agenda/horarios/{tipo}/{dia} - Listar horários por tipo e dia
GET /api/agenda/disponibilidade - Ver disponibilidade geral de horários
POST /api/agenda/reservar - Reservar um horário específico
POST /api/agenda/fila-espera - Adicionar à fila de espera
```

#### Serviço JS (selection.js):
```javascript
// Atual (simulado):
async getHorarios(tipo) { /* código simulado */ }
async getDisponibilidade() { /* código simulado */ }
async reservarHorario(horarioId) { /* código simulado */ }

// A implementar:
async getHorarios(tipo) {
  const response = await apiService.get(`agenda/horarios/${tipo}`);
  if (response.success) {
    return response.data;
  }
  throw new Error('Falha ao obter horários');
}

async getHorariosPorDia(tipo, dia) {
  const response = await apiService.get(`agenda/horarios/${tipo}/${dia}`);
  if (response.success) {
    return response.data;
  }
  throw new Error('Falha ao obter horários');
}

async getDisponibilidade() {
  const response = await apiService.get('agenda/disponibilidade');
  if (response.success) {
    return response.data;
  }
  throw new Error('Falha ao obter disponibilidade');
}

async reservarHorario(horarioData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('agenda/reservar', horarioData, token);
  if (response.success) {
    return response.horario;
  }
  throw new Error(response.message || 'Falha ao reservar horário');
}

async adicionarFilaEspera(filaData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('agenda/fila-espera', filaData, token);
      if (response.success) {
    return response.filaEspera;
  }
  throw new Error(response.message || 'Falha ao adicionar à fila de espera');
}
```

### 3. Sistema de Pagamentos

#### Endpoints Backend:
```
POST /api/payment/processar - Processar pagamento genérico
POST /api/payment/cartao - Processar pagamento com cartão
POST /api/payment/pix - Gerar pagamento PIX
POST /api/payment/boleto - Gerar boleto bancário
GET /api/payment/status/{paymentId} - Verificar status do pagamento
```

#### Serviço JS (pagamento.js):
```javascript
// Atual (simulado):
async processarPagamento(formData) { /* código simulado */ }
async consultarStatus(paymentId) { /* código simulado */ }

// A implementar:
async processarPagamento(formData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('payment/processar', formData, token);
  if (response.success) {
    return response;
  }
  throw new Error(response.message || 'Falha ao processar pagamento');
}

async processarCartao(formData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('payment/cartao', formData, token);
  if (response.success) {
    return response;
  }
  throw new Error(response.message || 'Falha ao processar pagamento com cartão');
}

async processarPix(formData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('payment/pix', formData, token);
  if (response.success) {
    return response;
  }
  throw new Error(response.message || 'Falha ao gerar pagamento PIX');
}

async processarBoleto(formData) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.post('payment/boleto', formData, token);
      if (response.success) {
    return response;
  }
  throw new Error(response.message || 'Falha ao gerar boleto');
}

async consultarStatus(paymentId) {
  const token = localStorage.getItem('kengi_auth_token');
  const response = await apiService.get(`payment/status/${paymentId}`, token);
  if (response.success) {
    return response;
  }
  throw new Error(response.message || 'Falha ao consultar status do pagamento');
}
```

## Plano de Implementação

### Fase 1: Preparação (Concluída)
- ✅ Configurar ambiente de desenvolvimento
- ✅ Implementar todos os controllers necessários
- ✅ Criar serviço API no frontend
- ✅ Verificar compatibilidade de modelos entre frontend e backend

### Fase 2: Autenticação
1. Adaptar auth.js para usar API real
2. Implementar armazenamento seguro de token JWT
3. Criar interceptores para adicionar token em requisições autenticadas
4. Implementar tratamento de expiração/renovação de tokens
5. Testar fluxos de login, registro e autenticação social

### Fase 3: Agenda
1. Adaptar selection.js para consumir AgendaController
2. Implementar exibição dinâmica e filtragem de horários
3. Desenvolver funcionalidade de reserva com token
4. Adicionar gestão de fila de espera
5. Testar diferentes cenários de disponibilidade

### Fase 4: Pagamentos
1. Adaptar pagamento.js para consumir PaymentController
2. Implementar formulários específicos para cada método de pagamento
3. Criar fluxo de processamento e confirmação
4. Implementar consulta periódica de status (PIX/boleto)
5. Testar o fluxo completo de pagamento

### Fase 5: Validação e Otimização
1. Realizar testes end-to-end completos
2. Implementar tratamento robusto de erros
3. Otimizar performance (cache, lazy loading)
4. Melhorar feedback visual ao usuário
5. Ajustar detalhes finais da integração

## Gestão de Estado

Para uma integração eficiente, implementaremos:

1. **Armazenamento de Token**: 
   - Salvo em localStorage e gerenciado por auth.js
   - Expiração controlada via timestamp
   - Renovação automática quando necessário

2. **Gestão de Sessão**:
   - Dados do usuário armazenados em memória (UserService)
   - Verificação de autenticação ao iniciar cada página
   - Redirecionamento para login quando necessário

3. **Dados Temporários**:
   - Seleções e preferências do usuário em sessionStorage
   - Carrinho/planos selecionados no localStorage
   - Limpeza ao finalizar fluxo completo

## Tratamento de Erros

Implementaremos um sistema uniforme de tratamento de erros:

1. **Erros de Rede**:
   - Retry automático para falhas temporárias (máx. 3 tentativas)
   - Feedback visual sobre problemas de conectividade
   - Cache offline para operações não críticas

2. **Erros de API**:
   - Parser padronizado para respostas de erro da API
   - Mensagens amigáveis exibidas ao usuário
   - Log detalhado no console para debugging

3. **Erros de Validação**:
   - Validação em tempo real nos formulários
   - Feedback instantâneo sobre campos inválidos
   - Prevenção de envio com dados incompletos

## Testes de Integração

Para cada fase, executaremos os seguintes testes:

1. **Testes Unitários**:
   - Verificar funcionamento isolado de cada serviço
   - Simular respostas da API para cenários diversos
   - Validar tratamento de erros

2. **Testes de Integração**:
   - Verificar comunicação entre frontend e backend
   - Validar fluxo completo end-to-end
   - Testar cenários de erro e recuperação

3. **Testes Manuais**:
   - Simular comportamento real do usuário
   - Verificar responsividade e usabilidade
   - Validar feedback visual durante operações

## Próximos Passos

1. Iniciar adaptação do serviço auth.js
2. Implementar interceptores de requisição no apiService
3. Testar autenticação e proteção de rotas
4. Prosseguir para integração do sistema de agenda 