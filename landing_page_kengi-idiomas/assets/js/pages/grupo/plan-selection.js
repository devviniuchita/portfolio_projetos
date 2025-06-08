/**
 * Seleção de Planos - Página de Grupo
 * Gerencia a seleção de planos de aula em grupo
 */

import { selectionService } from '../../services/selection.js';

class PlanSelectionManager {
  constructor() {
    this.selectedPlan = null;
    this.init();
  }

  init() {
    console.log('🔄 Inicializando PlanSelectionManager...');
    this.setupEventListeners();
    this.loadPlans();
  }

  setupEventListeners() {
    // Botões de seleção de plano (ajustado para corresponder à classe real)
    document.querySelectorAll('.plan-card__button').forEach(button => {
      button.addEventListener('click', (e) => {
        const planCard = button.closest('.plan-card');
        this.selectPlan(planCard);
      });
    });
  }

  loadPlans() {
    // Nada a fazer aqui no momento, já que os planos são carregados estaticamente no HTML
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
    const paymentUrl = this.createPaymentPageUrl('group', period, price);
    window.location.href = paymentUrl;
  }
  
  createPaymentPageUrl(type, period, price) {
    // Criar URL com parâmetros
    return `pagamento.html?type=${type}&period=${period}&price=${price}`;
  }
}

// Inicializar o gerenciador de seleção quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PlanSelectionManager();
}); 

export default PlanSelectionManager; 