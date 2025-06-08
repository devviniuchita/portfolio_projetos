/**
 * Seleção de Planos - Página Particular
 * Gerencia a seleção de planos de aula particular
 */

import { selectionService } from '../../services/selection.js';

class PlanSelectionManager {
  constructor() {
    this.selectedPlan = null;
    this.init();
  }

  init() {
    console.log('🔄 Inicializando PlanSelectionManager (Particular)...');
    this.setupEventListeners();
    this.loadPlans();
  }

  setupEventListeners() {
    // Botões de seleção de plano (ajustado para corresponder à classe real)
    document.querySelectorAll('.plan-card__button.select-plan-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const planCard = button.closest('.plan-card');
        this.selectPlan(planCard);
      });
    });
  }

  loadPlans() {
    // Em uma implementação real, carregaríamos os planos da API
    console.log('✅ Planos carregados');
  }

  selectPlan(planCard) {
    // Capturar informações do plano
    const planTitle = planCard.querySelector('.plan-card__title').textContent.trim().toLowerCase();
    const planPriceElement = planCard.querySelector('.plan-card__current-price-main');
    
    // Determinar tipo de plano (mensal, semestral, anual)
    let period = 'monthly';
    if (planTitle.includes('semestral')) {
      period = 'semester';
    } else if (planTitle.includes('anual')) {
      period = 'annual';
    } else if (planTitle.includes('mensal')) {
      period = 'monthly';
    }
    
    // Obter o preço (remover R$ e formatação)
    let price = '0';
    if (planPriceElement) {
      price = planPriceElement.textContent.replace('R$', '').replace('.', '').replace(',', '.').trim();
    }
    
    console.log(`✅ Plano selecionado: ${planTitle} - R$ ${price}`);
    
    // Redirecionar para a página de pagamento com os parâmetros do plano
    const paymentUrl = this.createPaymentPageUrl('private', period, price);
    window.location.href = paymentUrl;
  }
  
  createPaymentPageUrl(type, period, price) {
    // Criar URL com parâmetros
    return `pagamento.html?type=${type}&period=${period}&price=${price}`;
  }
}

// Inicializar o gerenciador de seleção quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.planSelectionManager = new PlanSelectionManager();
}); 

// Exportar para uso externo se necessário
export default PlanSelectionManager; 