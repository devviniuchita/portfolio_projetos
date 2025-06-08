// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
let authToken = localStorage.getItem('kengi_auth_token');

// API Helper Functions
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add auth token if available
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
const AuthAPI = {
    async register(userData) {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return response;
    },

    async login(credentials) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.success && response.data.token) {
            authToken = response.data.token;
            localStorage.setItem('kengi_auth_token', authToken);
            localStorage.setItem('kengi_user', JSON.stringify(response.data.usuario));
        }
        
        return response;
    },

    logout() {
        authToken = null;
        localStorage.removeItem('kengi_auth_token');
        localStorage.removeItem('kengi_user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('kengi_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!authToken;
    }
};

// Agenda API
const AgendaAPI = {
    async getHorariosDisponiveis() {
        return await apiRequest('/agenda/horarios');
    },

    async getHorariosByTipo(tipo) {
        return await apiRequest(`/agenda/horarios/${tipo}`);
    },

    async getHorariosByPlano(planoId) {
        return await apiRequest(`/agenda/plano/${planoId}/horarios`);
    },

    async reservarHorario(reservaData) {
        return await apiRequest('/agenda/reservar', {
            method: 'POST',
            body: JSON.stringify(reservaData)
        });
    },

    async adicionarFilaEspera(horarioId) {
        return await apiRequest('/agenda/fila-espera', {
            method: 'POST',
            body: JSON.stringify(horarioId)
        });
    },

    async getFilaEspera(horarioId) {
        return await apiRequest(`/agenda/horario/${horarioId}/fila-espera`);
    }
};

// Payment API
const PaymentAPI = {
    async processarPagamento(pagamentoData) {
        return await apiRequest('/pagamento/processar', {
            method: 'POST',
            body: JSON.stringify(pagamentoData)
        });
    },

    async processarPagamentoCartao(pagamentoData) {
        return await apiRequest('/pagamento/cartao', {
            method: 'POST',
            body: JSON.stringify(pagamentoData)
        });
    },

    async processarPagamentoPix(pagamentoData) {
        return await apiRequest('/pagamento/pix', {
            method: 'POST',
            body: JSON.stringify(pagamentoData)
        });
    },

    async processarPagamentoBoleto(pagamentoData) {
        return await apiRequest('/pagamento/boleto', {
            method: 'POST',
            body: JSON.stringify(pagamentoData)
        });
    },

    async getMeusPedidos() {
        return await apiRequest('/pagamento/meus-pedidos');
    },

    async getPedido(pedidoId) {
        return await apiRequest(`/pagamento/pedido/${pedidoId}`);
    },

    async cancelarPedido(pedidoId) {
        return await apiRequest(`/pagamento/cancelar/${pedidoId}`, {
            method: 'POST'
        });
    },

    async simularPagamento(pagamentoData) {
        return await apiRequest('/pagamento/teste/simular', {
            method: 'POST',
            body: JSON.stringify(pagamentoData)
        });
    }
};

// UI Helper Functions
const UIHelpers = {
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading">Carregando...</div>';
        }
    },

    hideLoading() {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => el.remove());
    },

    showError(message, container = document.body) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="alert alert-error">
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        container.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    },

    showSuccess(message, container = document.body) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="alert alert-success">
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        container.appendChild(successDiv);
        
        setTimeout(() => successDiv.remove(), 3000);
    },

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    },

    formatDateTime(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
};

// Form Validation
const FormValidation = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password) {
        return password.length >= 6;
    },

    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        return cpf.length === 11;
    },

    validateCardNumber(cardNumber) {
        cardNumber = cardNumber.replace(/\s/g, '');
        return cardNumber.length >= 16;
    },

    validateCVV(cvv) {
        return cvv.length >= 3;
    },

    validateRequired(value) {
        return value && value.trim().length > 0;
    }
};

// Export for use in other files
window.KengiAPI = {
    AuthAPI,
    AgendaAPI,
    PaymentAPI,
    UIHelpers,
    FormValidation
}; 