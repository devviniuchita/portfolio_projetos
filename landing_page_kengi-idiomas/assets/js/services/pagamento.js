/**
 * Serviço de Pagamento - Kengi Idiomas
 * Responsável pelo processamento de pagamentos
 */

class PagamentoService {
  constructor() {
    this._initialized = false;
    this._selectedPaymentMethod = null; // 'cartao', 'pix', 'boleto'
    this._paymentData = null;
    this._paymentStatus = null;
    this._init();
  }
  
  _init() {
    if (this._initialized) return;
    this._initialized = true;
    
    // Carregar dados temporários, se existirem
    this._loadPaymentData();
    
    console.log('✅ PagamentoService inicializado');
  }
  
  /**
   * Define o método de pagamento selecionado
   * @param {string} method - Método de pagamento ('cartao', 'pix', 'boleto')
   */
  setPaymentMethod(method) {
    if (!['cartao', 'pix', 'boleto'].includes(method)) {
      throw new Error('Método de pagamento inválido. Use "cartao", "pix" ou "boleto".');
    }
    
    this._selectedPaymentMethod = method;
    this._savePaymentData();
  }
  
  /**
   * Obtém o método de pagamento selecionado
   * @returns {string|null} Método de pagamento ou null se não selecionado
   */
  getPaymentMethod() {
    return this._selectedPaymentMethod;
  }
  
  /**
   * Processa um pagamento genérico
   * @param {Object} pagamentoData - Dados do pagamento
   * @returns {Promise<Object>} Resultado do processamento
   */
  async processarPagamento(pagamentoData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Usar API real em vez de simulação
      const response = await apiService.post('payment/processar', pagamentoData, token);
      
      if (response && response.success) {
        // Salvar dados do pagamento
        this._paymentData = response;
        this._paymentStatus = 'pending';
        this._savePaymentData();
        return response;
      } else {
        throw new Error(response?.message || 'Falha ao processar pagamento');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }
  
  /**
   * Processa um pagamento com cartão de crédito
   * @param {Object} cartaoData - Dados do cartão e pagamento
   * @returns {Promise<Object>} Resultado do processamento
   */
  async processarCartao(cartaoData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Usar API real em vez de simulação
      const response = await apiService.post('payment/cartao', cartaoData, token);
      
      if (response && response.success) {
        // Salvar dados do pagamento
        this._paymentData = response;
        this._paymentStatus = 'paid'; // Pagamento com cartão geralmente é aprovado na hora
        this._savePaymentData();
        return response;
      } else {
        throw new Error(response?.message || 'Falha ao processar pagamento com cartão');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      throw error;
    }
  }
  
  /**
   * Processa um pagamento com PIX
   * @param {Object} pixData - Dados do pagamento PIX
   * @returns {Promise<Object>} Resultado do processamento, incluindo QR Code
   */
  async processarPix(pixData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Usar API real em vez de simulação
      const response = await apiService.post('payment/pix', pixData, token);
      
      if (response && response.success) {
        // Salvar dados do pagamento
        this._paymentData = response;
        this._paymentStatus = 'pending';
        this._savePaymentData();
        return response;
      } else {
        throw new Error(response?.message || 'Falha ao gerar pagamento PIX');
      }
    } catch (error) {
      console.error('Erro ao gerar pagamento PIX:', error);
      throw error;
    }
  }
  
  /**
   * Processa um pagamento com boleto bancário
   * @param {Object} boletoData - Dados para geração do boleto
   * @returns {Promise<Object>} Resultado do processamento, incluindo código e URL do boleto
   */
  async processarBoleto(boletoData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Usar API real em vez de simulação
      const response = await apiService.post('payment/boleto', boletoData, token);
      
      if (response && response.success) {
        // Salvar dados do pagamento
        this._paymentData = response;
        this._paymentStatus = 'pending';
        this._savePaymentData();
        return response;
      } else {
        throw new Error(response?.message || 'Falha ao gerar boleto');
      }
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      throw error;
    }
  }
  
  /**
   * Consulta o status de um pagamento
   * @param {string} paymentId - ID do pagamento
   * @returns {Promise<Object>} Status atual do pagamento
   */
  async consultarStatus(paymentId) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Usar API real em vez de simulação
      const response = await apiService.get(`payment/status/${paymentId}`, token);
      
      if (response && response.success) {
        // Atualizar status do pagamento
        if (this._paymentData && this._paymentData.paymentId === paymentId) {
          this._paymentStatus = response.status;
          this._savePaymentData();
        }
        return response;
      } else {
        throw new Error(response?.message || 'Falha ao consultar status do pagamento');
      }
    } catch (error) {
      console.error('Erro ao consultar status do pagamento:', error);
      throw error;
    }
  }
  
  /**
   * Verifica periodicamente o status de um pagamento
   * @param {string} paymentId - ID do pagamento
   * @param {Function} callback - Função chamada a cada verificação (com status como parâmetro)
   * @param {number} [intervalSeconds=10] - Intervalo entre verificações (segundos)
   * @param {number} [maxChecks=30] - Número máximo de verificações
   * @returns {number} ID do intervalo (para cancelar com clearInterval se necessário)
   */
  monitorarPagamento(paymentId, callback, intervalSeconds = 10, maxChecks = 30) {
    let checkCount = 0;
    
    const intervalId = setInterval(async () => {
      try {
        const response = await this.consultarStatus(paymentId);
        
        // Chamar callback com o status
        if (callback && typeof callback === 'function') {
          callback(response);
        }
        
        // Se pagamento foi confirmado ou número máximo de verificações atingido
        if (response.status === 'paid' || checkCount >= maxChecks) {
          clearInterval(intervalId);
        }
        
        checkCount++;
      } catch (error) {
        console.error('Erro ao monitorar pagamento:', error);
        // Em caso de erro, continuar monitorando
      }
    }, intervalSeconds * 1000);
    
    return intervalId;
  }
  
  /**
   * Limpa todos os dados de pagamento
   */
  clearPaymentData() {
    this._selectedPaymentMethod = null;
    this._paymentData = null;
    this._paymentStatus = null;
    
    // Remover do armazenamento local
    localStorage.removeItem('kengi_payment');
  }
  
  /**
   * Obtém os dados do último pagamento
   * @returns {Object|null} Dados do pagamento ou null se não houver
   */
  getPaymentData() {
    return this._paymentData;
  }
  
  /**
   * Obtém o status do último pagamento
   * @returns {string|null} Status do pagamento ('pending', 'paid', 'failed') ou null
   */
  getPaymentStatus() {
    return this._paymentStatus;
  }
  
  /**
   * Salva os dados de pagamento no armazenamento local
   * @private
   */
  _savePaymentData() {
    const paymentData = {
      selectedPaymentMethod: this._selectedPaymentMethod,
      paymentData: this._paymentData,
      paymentStatus: this._paymentStatus,
    };
    
    localStorage.setItem('kengi_payment', JSON.stringify(paymentData));
  }
  
  /**
   * Carrega os dados de pagamento do armazenamento local
   * @private
   */
  _loadPaymentData() {
    try {
      const paymentStr = localStorage.getItem('kengi_payment');
      if (paymentStr) {
        const paymentData = JSON.parse(paymentStr);
        this._selectedPaymentMethod = paymentData.selectedPaymentMethod || null;
        this._paymentData = paymentData.paymentData || null;
        this._paymentStatus = paymentData.paymentStatus || null;
      }
    } catch (error) {
      console.error('Erro ao carregar dados de pagamento:', error);
      // Em caso de erro, limpar armazenamento para evitar problemas futuros
      localStorage.removeItem('kengi_payment');
    }
  }
}

// Criar instância única do serviço
export const pagamentoService = new PagamentoService();

// Exportar para uso global (compatibilidade com código não-modular)
if (typeof window !== 'undefined') {
  window.pagamentoService = pagamentoService;
}
