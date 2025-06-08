/**
 * Agenda Service - Kengi Idiomas
 * Serviço para gerenciamento de horários e agendamentos
 */

import { apiService } from './api.js';

/**
 * Serviço para gerenciar horários, disponibilidade e reservas
 */
class AgendaService {
  /**
   * Obtém todos os horários disponíveis
   * @returns {Promise} - Lista de horários
   */
  async getHorarios() {
    try {
      return await apiService.get('/agenda/horarios', true);
    } catch (error) {
      console.error('Erro ao obter horários:', error);
      throw error;
    }
  }

  /**
   * Obtém horários disponíveis por tipo de aula
   * @param {string} tipo - Tipo de aula (grupo|particular)
   * @returns {Promise} - Lista de horários filtrada por tipo
   */
  async getHorariosByTipo(tipo) {
    try {
      return await apiService.get(`/agenda/horarios/${tipo}`, true);
    } catch (error) {
      console.warn('⚠️ Backend indisponível, usando horários simulados (getHorariosByTipo)');
      // Mock para desenvolvimento
      return [
        { id: 1, diaSemana: 'segunda', horaInicio: '09:00', horaFim: '10:30', disponivel: true },
        { id: 2, diaSemana: 'segunda', horaInicio: '14:00', horaFim: '15:30', disponivel: true },
        { id: 3, diaSemana: 'segunda', horaInicio: '18:00', horaFim: '19:30', disponivel: false },
        { id: 4, diaSemana: 'terca', horaInicio: '09:00', horaFim: '10:30', disponivel: true },
        { id: 5, diaSemana: 'quarta', horaInicio: '16:00', horaFim: '17:30', disponivel: true }
      ];
    }
  }

  /**
   * Obtém horários por dia da semana
   * @param {string} diaSemana - Dia da semana (segunda|terca|quarta|quinta|sexta|sabado|domingo)
   * @returns {Promise} - Lista de horários do dia especificado
   */
  async getHorariosByDia(diaSemana) {
    try {
      return await apiService.get(`/agenda/dia/${diaSemana}`, true);
    } catch (error) {
      console.warn('⚠️ Backend indisponível, usando horários simulados (getHorariosByDia)');
      // Mock para desenvolvimento
      return [
        { id: 10, diaSemana: diaSemana, horaInicio: '10:00', horaFim: '11:30', disponivel: true },
        { id: 11, diaSemana: diaSemana, horaInicio: '16:00', horaFim: '17:30', disponivel: true },
        { id: 12, diaSemana: diaSemana, horaInicio: '19:00', horaFim: '20:30', disponivel: false }
      ];
    }
  }

  /**
   * Obtém detalhe de um horário específico
   * @param {number} horarioId - ID do horário
   * @returns {Promise} - Detalhes do horário
   */
  async getHorarioById(horarioId) {
    try {
      return await apiService.get(`/agenda/horario/${horarioId}`, true);
    } catch (error) {
      console.error(`Erro ao obter horário ${horarioId}:`, error);
      throw error;
    }
  }

  /**
   * Reserva um horário para o usuário logado
   * @param {number} horarioId - ID do horário
   * @param {number} planoId - ID do plano
   * @returns {Promise} - Confirmação da reserva
   */
  async reservarHorario(horarioId, planoId) {
    try {
      return await apiService.post('/agenda/reservar', { 
        horarioId, 
        planoId 
      }, true);
    } catch (error) {
      console.error('Erro ao reservar horário:', error);
      throw error;
    }
  }

  /**
   * Adiciona usuário à lista de espera
   * @param {number} horarioId - ID do horário
   * @returns {Promise} - Confirmação da adição à fila
   */
  async adicionarFilaEspera(horarioId) {
    try {
      return await apiService.post('/agenda/fila-espera', { 
        horarioId 
      }, true);
    } catch (error) {
      console.error('Erro ao adicionar à fila de espera:', error);
      throw error;
    }
  }

  /**
   * Verifica posição do usuário na fila de espera
   * @param {number} horarioId - ID do horário
   * @returns {Promise} - Posição na fila e estimativa de tempo
   */
  async verificarPosicaoFila(horarioId) {
    try {
      return await apiService.get(`/agenda/fila-espera/posicao/${horarioId}`, true);
    } catch (error) {
      console.error('Erro ao verificar posição na fila:', error);
      throw error;
    }
  }

  /**
   * Cancela uma reserva existente
   * @param {number} reservaId - ID da reserva
   * @returns {Promise} - Confirmação do cancelamento
   */
  async cancelarReserva(reservaId) {
    try {
      return await apiService.delete(`/agenda/reserva/${reservaId}`, true);
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      throw error;
    }
  }

  /**
   * Obtém todas as reservas do usuário logado
   * @returns {Promise} - Lista de reservas do usuário
   */
  async getMinhasReservas() {
    try {
      return await apiService.get('/agenda/minhas-reservas', true);
    } catch (error) {
      console.error('Erro ao obter reservas:', error);
      throw error;
    }
  }
}

// Exporta a instância
export const agendaService = new AgendaService(); 