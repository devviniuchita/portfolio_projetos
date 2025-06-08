/**
 * Planos Service - Kengi Idiomas
 * Gerencia operações relacionadas aos planos e cursos
 */

/**
 * Serviço para gerenciar planos e cursos
 */
class PlanoService {
  /**
   * URL base da API
   * @private
   */
  _apiBaseUrl = '/api';

  /**
   * Obtém todos os planos disponíveis
   * @returns {Promise<Array>} Lista de planos
   */
  async getPlanos() {
    try {
      const response = await fetch(`${this._apiBaseUrl}/planos`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter planos: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      
      // Retorna dados mockados para desenvolvimento
      return this._getMockPlanos();
    }
  }

  /**
   * Obtém planos por tipo (grupo ou particular)
   * @param {string} tipo - Tipo do plano (grupo|particular)
   * @returns {Promise<Array>} Lista de planos do tipo especificado
   */
  async getPlanosPorTipo(tipo) {
    try {
      const response = await fetch(`${this._apiBaseUrl}/planos?tipo=${tipo}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter planos do tipo ${tipo}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar planos do tipo ${tipo}:`, error);
      
      // Retorna dados mockados para desenvolvimento
      return this._getMockPlanosPorTipo(tipo);
    }
  }

  /**
   * Obtém detalhes de um plano específico
   * @param {number} id - ID do plano
   * @returns {Promise<Object>} Detalhes do plano
   */
  async getPlanoById(id) {
    try {
      const response = await fetch(`${this._apiBaseUrl}/planos/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter plano ${id}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar plano ${id}:`, error);
      
      // Retorna dados mockados para desenvolvimento
      return this._getMockPlanoById(id);
    }
  }

  /**
   * Obtém recursos associados a um plano
   * @param {number} planoId - ID do plano
   * @returns {Promise<Array>} Lista de recursos do plano
   */
  async getRecursosDePlano(planoId) {
    try {
      const response = await fetch(`${this._apiBaseUrl}/planos/${planoId}/recursos`);
      
      if (!response.ok) {
        throw new Error(`Erro ao obter recursos do plano ${planoId}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar recursos do plano ${planoId}:`, error);
      
      // Retorna dados mockados para desenvolvimento
      return this._getMockRecursosDePlano(planoId);
    }
  }

  /**
   * Dados mockados para desenvolvimento - todos os planos
   * @private
   * @returns {Array} Lista de planos mockados
   */
  _getMockPlanos() {
    return [
      // Planos em grupo
      {
        id: 1,
        tipo: 'grupo',
        periodo: 'mensal',
        nome: 'Aulas em Grupo - Mensal',
        preco: 199,
        descricao: 'Aulas em grupo com até 6 alunos',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado']
      },
      {
        id: 2,
        tipo: 'grupo',
        periodo: 'semestral',
        nome: 'Aulas em Grupo - Semestral',
        preco: 179 * 6,
        descricao: 'Aulas em grupo com até 6 alunos',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado', 'Desconto de 10%']
      },
      {
        id: 3,
        tipo: 'grupo',
        periodo: 'anual',
        nome: 'Aulas em Grupo - Anual',
        preco: 159 * 12,
        descricao: 'Aulas em grupo com até 6 alunos',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado', 'Desconto de 20%']
      },
      // Planos particulares
      {
        id: 4,
        tipo: 'particular',
        periodo: 'mensal',
        nome: 'Aulas Particulares - Mensal',
        preco: 399,
        descricao: 'Aulas particulares personalizadas',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado', 'Horários flexíveis']
      },
      {
        id: 5,
        tipo: 'particular',
        periodo: 'semestral',
        nome: 'Aulas Particulares - Semestral',
        preco: 359 * 6,
        descricao: 'Aulas particulares personalizadas',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado', 'Horários flexíveis', 'Desconto de 10%']
      },
      {
        id: 6,
        tipo: 'particular',
        periodo: 'anual',
        nome: 'Aulas Particulares - Anual',
        preco: 319 * 12,
        descricao: 'Aulas particulares personalizadas',
        recursos: ['Material didático', 'Aulas ao vivo', 'Certificado', 'Horários flexíveis', 'Desconto de 20%']
      }
    ];
  }

  /**
   * Dados mockados para desenvolvimento - planos por tipo
   * @private
   * @param {string} tipo - Tipo do plano (grupo|particular)
   * @returns {Array} Lista de planos mockados do tipo especificado
   */
  _getMockPlanosPorTipo(tipo) {
    return this._getMockPlanos().filter(plano => plano.tipo === tipo);
  }

  /**
   * Dados mockados para desenvolvimento - plano por ID
   * @private
   * @param {number} id - ID do plano
   * @returns {Object|null} Plano mockado ou null se não encontrado
   */
  _getMockPlanoById(id) {
    const plano = this._getMockPlanos().find(p => p.id === parseInt(id));
    return plano || null;
  }

  /**
   * Dados mockados para desenvolvimento - recursos de um plano
   * @private
   * @param {number} planoId - ID do plano
   * @returns {Array} Lista de recursos mockados
   */
  _getMockRecursosDePlano(planoId) {
    const plano = this._getMockPlanoById(planoId);
    return plano ? plano.recursos : [];
  }
}

// Exporta a instância
export const planoService = new PlanoService();
