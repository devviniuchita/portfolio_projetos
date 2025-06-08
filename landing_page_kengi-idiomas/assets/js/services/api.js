/**
 * Serviço API - Kengi Idiomas
 * Gerencia chamadas à API RESTful do backend
 */

class ApiService {
  constructor() {
    this._initialized = false;
    this._init();
  }
  
  _init() {
    if (this._initialized) return;
    this._initialized = true;
    
    // Em produção, usar URL real da API
    this._apiBaseUrl = 'http://localhost:5000/api';
    
    console.log('✅ ApiService inicializado');
  }
  
  /**
   * Executa uma requisição GET 
   * @param {string} url - Endpoint relativo da API
   * @param {string|null} token - Token JWT opcional para autenticação
   * @returns {Promise<Object>} Resposta da API
   */
  async get(url, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this._apiBaseUrl}/${url}`, {
        method: 'GET',
        headers: headers
      });
      
      return await this._handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição GET para ${url}:`, error);
      throw error;
    }
  }

  /**
   * Executa uma requisição POST
   * @param {string} url - Endpoint relativo da API
   * @param {Object} data - Dados a serem enviados
   * @param {string|null} token - Token JWT opcional para autenticação
   * @returns {Promise<Object>} Resposta da API
   */
  async post(url, data, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this._apiBaseUrl}/${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição POST para ${url}:`, error);
      throw error;
    }
  }

  /**
   * Executa uma requisição PUT
   * @param {string} url - Endpoint relativo da API
   * @param {Object} data - Dados a serem enviados
   * @param {string|null} token - Token JWT opcional para autenticação
   * @returns {Promise<Object>} Resposta da API
   */
  async put(url, data, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this._apiBaseUrl}/${url}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição PUT para ${url}:`, error);
      throw error;
    }
  }

  /**
   * Executa uma requisição DELETE
   * @param {string} url - Endpoint relativo da API
   * @param {string|null} token - Token JWT opcional para autenticação
   * @returns {Promise<Object>} Resposta da API
   */
  async delete(url, token = null) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this._apiBaseUrl}/${url}`, {
        method: 'DELETE',
        headers: headers
      });
      
      return await this._handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição DELETE para ${url}:`, error);
      throw error;
    }
  }

  /**
   * Processa a resposta da API
   * @param {Response} response - Objeto de resposta do fetch
   * @returns {Promise<Object>} Dados processados da resposta
   * @private
   */
  async _handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    
    // Se a resposta não for bem-sucedida, lançar erro
    if (!response.ok) {
      const error = new Error(data.message || 'Erro na requisição à API');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }
  
  /**
   * Configura a URL base da API
   * @param {string} url - URL base da API
   */
  setBaseUrl(url) {
    this._apiBaseUrl = url;
  }
  
  /**
   * Testa a conectividade com a API
   * @returns {Promise<boolean>} Status da conexão
   */
  async testConnection() {
    try {
      // Tentar fazer uma requisição simples para o endpoint de teste
      const response = await this.get('test');
      return response && response.message === "API Kengi Idiomas funcionando!";
    } catch (error) {
      console.error('API indisponível:', error);
      return false;
    }
  }
  
  /**
   * Namespace para APIs de Agenda
   */
  get AgendaAPI() {
    return {
      /**
       * Obtém horários disponíveis por tipo
       * @param {string} tipo - Tipo da aula (group/private)
       * @returns {Promise<Object>} Lista de horários
       */
      getHorariosByTipo: async (tipo) => {
        return await this.get(`agenda/horarios/${tipo}`);
      },
      
      /**
       * Obtém horários disponíveis por tipo e dia
       * @param {string} tipo - Tipo da aula (group/private)
       * @param {string} dia - Dia da semana (segunda, terca, etc.)
       * @returns {Promise<Object>} Lista de horários
       */
      getHorariosPorDia: async (tipo, dia) => {
        return await this.get(`agenda/horarios/${tipo}/${dia}`);
      },
      
      /**
       * Reserva um horário
       * @param {Object} reservaData - Dados da reserva
       * @returns {Promise<Object>} Resultado da reserva
       */
      reservarHorario: async (reservaData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('agenda/reservar', reservaData, token);
      },
      
      /**
       * Adiciona usuário à fila de espera
       * @param {Object} filaData - Dados para fila de espera
       * @returns {Promise<Object>} Resultado da operação
       */
      adicionarFilaEspera: async (filaData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('agenda/fila-espera', filaData, token);
      }
    };
  }
  
  /**
   * Namespace para APIs de Pagamento
   */
  get PaymentAPI() {
    return {
      /**
       * Processa um pagamento genérico
       * @param {Object} pagamentoData - Dados do pagamento
       * @returns {Promise<Object>} Resultado do processamento
       */
      processarPagamento: async (pagamentoData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('payment/processar', pagamentoData, token);
      },
      
      /**
       * Processa um pagamento com cartão
       * @param {Object} pagamentoData - Dados do pagamento com cartão
       * @returns {Promise<Object>} Resultado do processamento
       */
      processarCartao: async (pagamentoData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('payment/cartao', pagamentoData, token);
      },
      
      /**
       * Processa um pagamento com PIX
       * @param {Object} pagamentoData - Dados do pagamento PIX
       * @returns {Promise<Object>} Resultado do processamento
       */
      processarPix: async (pagamentoData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('payment/pix', pagamentoData, token);
      },
      
      /**
       * Processa um pagamento com boleto
       * @param {Object} pagamentoData - Dados do pagamento com boleto
       * @returns {Promise<Object>} Resultado do processamento
       */
      processarBoleto: async (pagamentoData) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.post('payment/boleto', pagamentoData, token);
      },
      
      /**
       * Consulta status de um pagamento
       * @param {string} paymentId - ID do pagamento
       * @returns {Promise<Object>} Status do pagamento
       */
      consultarStatus: async (paymentId) => {
        const token = localStorage.getItem('kengi_auth_token');
        return await this.get(`payment/status/${paymentId}`, token);
      }
    };
  }
}

// Criar instância única do serviço
export const apiService = new ApiService(); 

// Exportar para uso global (compatibilidade com código não-modular)
if (typeof window !== 'undefined') {
  window.apiService = apiService;
} 