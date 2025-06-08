/**
 * Serviço de Seleção de Horários - Kengi Idiomas
 * Responsável pela seleção e reserva de horários para aulas
 */

class SelectionService {
  constructor() {
    this._initialized = false;
    this._selectedType = null; // 'group' ou 'private'
    this._selectedHorario = null;
    this._selectedPlan = null;
    this._selectedSchedule = null;
    this._init();
  }

  _init() {
    if (this._initialized) return;
    this._initialized = true;
    
    // Carregar preferências salvas, se existirem
    this._loadSavedSelection();
    
    console.log('✅ SelectionService inicializado');
  }

  /**
   * Define o tipo de aula selecionado
   * @param {string} type - Tipo de aula ('group' ou 'private')
   */
  setSelectedType(type) {
    if (type !== 'group' && type !== 'private') {
      throw new Error('Tipo de aula inválido. Use "group" ou "private".');
    }
    
    this._selectedType = type;
    this._saveSelection();
  }
  
  /**
   * Obtém o tipo de aula selecionado
   * @returns {string|null} Tipo de aula ou null se não selecionado
   */
  getSelectedType() {
    return this._selectedType;
  }
  
  /**
   * Define o horário selecionado
   * @param {Object} horario - Objeto com dados do horário
   */
  setSelectedHorario(horario) {
    this._selectedHorario = horario;
    this._saveSelection();
  }
  
  /**
   * Obtém o horário selecionado
   * @returns {Object|null} Horário selecionado ou null se não selecionado
   */
  getSelectedHorario() {
    return this._selectedHorario;
  }
  
  /**
   * Limpa todas as seleções
   */
  clearSelections() {
    this._selectedType = null;
    this._selectedHorario = null;
    this._selectedPlan = null;
    this._selectedSchedule = null;
    
    // Remover do armazenamento local
    sessionStorage.removeItem('kengi_selection');
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('selectedSchedule');
  }
  
  /**
   * Obtém horários disponíveis por tipo
   * @param {string} tipo - Tipo de aula ('group' ou 'private')
   * @returns {Promise<Array>} Lista de horários disponíveis
   */
  async getHorarios(tipo) {
    try {
      // Usar API real em vez de simulação
      const response = await apiService.get(`agenda/horarios/${tipo}`);
      
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response?.message || 'Falha ao obter horários');
      }
    } catch (error) {
      console.error('Erro ao obter horários:', error);
      throw error;
    }
  }
  
  /**
   * Obtém horários disponíveis por tipo e dia
   * @param {string} tipo - Tipo de aula ('group' ou 'private')
   * @param {string} dia - Dia da semana ('segunda', 'terca', etc.)
   * @returns {Promise<Array>} Lista de horários disponíveis
   */
  async getHorariosPorDia(tipo, dia) {
    try {
      // Usar API real em vez de simulação
      const response = await apiService.get(`agenda/horarios/${tipo}/${dia}`);
      
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response?.message || 'Falha ao obter horários');
      }
    } catch (error) {
      console.error('Erro ao obter horários por dia:', error);
      throw error;
    }
  }
  
  /**
   * Obtém a disponibilidade geral de horários
   * @returns {Promise<Object>} Disponibilidade por dia e tipo
   */
  async getDisponibilidade() {
    try {
      // Usar API real em vez de simulação
      const response = await apiService.get('agenda/disponibilidade');
      
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response?.message || 'Falha ao obter disponibilidade');
      }
    } catch (error) {
      console.error('Erro ao obter disponibilidade:', error);
      throw error;
    }
  }
  
  /**
   * Reserva um horário específico
   * @param {Object} reservaData - Dados da reserva
   * @returns {Promise<Object>} Dados da reserva confirmada
   */
  async reservarHorario(reservaData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Garantir que o userId esteja na requisição
      const user = authService.getCurrentUser();
      if (user && !reservaData.usuarioId) {
        reservaData.usuarioId = user.id;
      }
      
      // Usar API real em vez de simulação
      const response = await apiService.post('agenda/reservar', reservaData, token);
      
      if (response && response.success) {
        // Salvar o horário reservado
        this.setSelectedHorario(response.horario);
        return response.horario;
      } else {
        throw new Error(response?.message || 'Falha ao reservar horário');
      }
    } catch (error) {
      console.error('Erro ao reservar horário:', error);
      throw error;
    }
  }
  
  /**
   * Adiciona usuário à fila de espera
   * @param {Object} filaData - Dados para a fila de espera
   * @returns {Promise<Object>} Confirmação da adição à fila
   */
  async adicionarFilaEspera(filaData) {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }
      
      const token = authService.getToken();
      
      // Garantir que o userId esteja na requisição
      const user = authService.getCurrentUser();
      if (user && !filaData.usuarioId) {
        filaData.usuarioId = user.id;
      }
      
      // Usar API real em vez de simulação
      const response = await apiService.post('agenda/fila-espera', filaData, token);
      
      if (response && response.success) {
        return response.filaEspera;
      } else {
        throw new Error(response?.message || 'Falha ao adicionar à fila de espera');
      }
    } catch (error) {
      console.error('Erro ao adicionar à fila de espera:', error);
      throw error;
    }
  }
  
  /**
   * Salva a seleção atual no armazenamento local
   * @private
   */
  _saveSelection() {
    const selection = {
      selectedType: this._selectedType,
      selectedHorario: this._selectedHorario,
      selectedPlan: this._selectedPlan,
      selectedSchedule: this._selectedSchedule,
    };
    
    sessionStorage.setItem('kengi_selection', JSON.stringify(selection));
  }
  
  /**
   * Carrega a seleção salva do armazenamento local
   * @private
   */
  _loadSavedSelection() {
    try {
      const selectionStr = sessionStorage.getItem('kengi_selection');
      if (selectionStr) {
        const selection = JSON.parse(selectionStr);
        this._selectedType = selection.selectedType || null;
        this._selectedHorario = selection.selectedHorario || null;
        this._selectedPlan = selection.selectedPlan || null;
        this._selectedSchedule = selection.selectedSchedule || null;
      }
    } catch (error) {
      console.error('Erro ao carregar seleção:', error);
      // Em caso de erro, limpar armazenamento para evitar problemas futuros
      sessionStorage.removeItem('kengi_selection');
    }
  }

  setSelectedPlan(planData) {
    this._selectedPlan = planData;
    this.saveToStorage();
    return this;
  }

  getSelectedPlan() {
    return this._selectedPlan;
  }

  setSelectedSchedule(scheduleData) {
    this._selectedSchedule = scheduleData;
    this.saveToStorage();
    return this;
  }

  getSelectedSchedule() {
    return this._selectedSchedule;
  }

  saveToStorage() {
    if (this._selectedPlan) {
      localStorage.setItem('selectedPlan', JSON.stringify(this._selectedPlan));
    }
    
    if (this._selectedSchedule) {
      localStorage.setItem('selectedSchedule', JSON.stringify(this._selectedSchedule));
    }
  }

  loadFromStorage() {
    try {
      const planData = localStorage.getItem('selectedPlan');
      if (planData) {
        this._selectedPlan = JSON.parse(planData);
      }

      const scheduleData = localStorage.getItem('selectedSchedule');
      if (scheduleData) {
        this._selectedSchedule = JSON.parse(scheduleData);
      }
    } catch (error) {
      console.error('Erro ao carregar seleções do localStorage:', error);
    }
  }

  // Função para criar URL para página de pagamento com parâmetros
  createPaymentPageUrl(planData) {
    // Salva o plano selecionado
    this.setSelectedPlan(planData);
    
    // Cria a URL com parâmetros necessários
    const params = new URLSearchParams();
    params.append('plano', planData.id);
    params.append('tipo', planData.tipo);
    params.append('valor', planData.valor);
    
    return `/pagamento.html?${params.toString()}`;
  }
}

// Criar instância única do serviço
export const selectionService = new SelectionService();

// Exportar para uso global (compatibilidade com código não-modular)
if (typeof window !== 'undefined') {
  window.selectionService = selectionService;
}
