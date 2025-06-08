# 📋 PRÓXIMOS PASSOS - PROJETO KENGI IDIOMAS
**Data:** 27 de Janeiro de 2025

Este documento apresenta os próximos passos detalhados para a continuidade do projeto Kengi Idiomas, com base na [análise atualizada](./.manus/ANALISE_ATUALIZADA.md) e no [plano de integração](./.manus/PLANO_INTEGRACAO_FRONTEND.md).

---

## 1. 🧹 Limpeza e Organização do Código (PRIORIDADE: ALTA)

### 1.1 Unificação de Entidades Duplicadas
- [x] Criar script de backup e remoção
- [ ] Executar script `npm run unificar`
- [ ] Atualizar `KengiIdiomasContext.cs` para remover referências às entidades excluídas
- [ ] Testar compilação após remoção

### 1.2 Padronização de Nomenclatura
- [ ] Revisar nomenclatura das entidades restantes
- [ ] Corrigir possíveis conflitos de nomes
- [ ] Padronizar em português

### 1.3 Refatoração de Código
- [ ] Remover código comentado ou não utilizado
- [ ] Melhorar reutilização de código
- [ ] Seguir padrões de código C#

---

## 2. 🗄️ Banco de Dados (PRIORIDADE: ALTA)

### 2.1 Migrations
- [x] Criar scripts de migração
- [ ] Executar script `npm run migrations`
- [ ] Verificar se a estrutura do banco foi criada corretamente
- [ ] Aplicar ajustes necessários

### 2.2 Configuração Ambiente de Desenvolvimento
- [ ] Configurar MySQL Shell para monitoramento
- [ ] Testar conexão com o banco de dados
- [ ] Verificar performance das consultas

### 2.3 Dados Iniciais
- [ ] Criar script para seed inicial de planos
- [ ] Criar script para seed inicial de horários
- [ ] Criar usuário de teste administrativo

---

## 3. 🔌 Integração Frontend-Backend (PRIORIDADE: CRÍTICA)

### 3.1 Preparação do Ambiente
- [x] Criar serviços base para API (api.js)
- [x] Criar serviço de autenticação (auth.js)
- [x] Criar serviço de agenda (agenda.js)
- [x] Criar serviço de pagamento (pagamento.js)

### 3.2 Implementação da Autenticação
- [ ] Modificar `pagamento.html` para integrar com AuthController
- [ ] Configurar Google OAuth (botão "Continuar com Google")
- [ ] Implementar persistência do token JWT
- [ ] Testar fluxo de login/cadastro

### 3.3 Implementação da Agenda
- [ ] Modificar seção de agenda em `pagamento.html`
- [ ] Implementar carregamento de horários via API
- [ ] Implementar seleção de horários
- [ ] Implementar fila de espera
- [ ] Testar fluxo de agendamento

### 3.4 Implementação do Pagamento
- [ ] Modificar seção de pagamento em `pagamento.html`
- [ ] Implementar formulários de pagamento (cartão, PIX, boleto)
- [ ] Implementar processamento de pagamento
- [ ] Implementar feedback de confirmação
- [ ] Testar fluxo de pagamento

---

## 4. 🧪 Testes (PRIORIDADE: MÉDIA)

### 4.1 Testes Unitários
- [ ] Implementar testes unitários para controllers
- [ ] Implementar testes unitários para services
- [ ] Implementar testes unitários para validadores

### 4.2 Testes de Integração
- [ ] Testar fluxo completo backend-frontend
- [ ] Testar cenários de erro e exceção
- [ ] Testar fluxo de pagamento

### 4.3 Testes E2E
- [ ] Criar scripts para testes end-to-end
- [ ] Testar fluxo completo do usuário
- [ ] Testar em diferentes dispositivos

---

## 5. 🚀 Deploy (PRIORIDADE: MÉDIA)

### 5.1 Ambiente de Desenvolvimento
- [ ] Configurar ambiente para desenvolvimento local
- [ ] Criar scripts de inicialização rápida
- [ ] Documentar processo de setup

### 5.2 Ambiente de Produção
- [ ] Finalizar templates CloudFormation
- [ ] Configurar CI/CD
- [ ] Configurar monitoramento e logs

---

## 6. 📱 Área do Aluno (PRIORIDADE: BAIXA)

### 6.1 Interface do Aluno
- [ ] Criar dashboard do aluno
- [ ] Implementar visualização de aulas
- [ ] Implementar histórico de pagamentos

### 6.2 Funcionalidades Adicionais
- [ ] Sistema de avisos e notificações
- [ ] Reagendamento de aulas
- [ ] Cancelamento de aulas

---

## ⏱️ CRONOGRAMA PREVISTO

| Etapa | Descrição | Prazo Estimado |
|-------|-----------|----------------|
| 1 | Limpeza e Organização | 2 dias |
| 2 | Banco de Dados | 1 dia |
| 3 | Integração Frontend-Backend | 10 dias |
| 4 | Testes | 5 dias |
| 5 | Deploy | 3 dias |
| 6 | Área do Aluno | 5 dias |

**Tempo Total Estimado:** 26 dias úteis

---

## 📌 CRITÉRIOS DE ACEITAÇÃO

1. ✅ **Sistema de Autenticação**
   - Login/cadastro funcional
   - Integração com Google OAuth
   - Persistência do token JWT

2. ✅ **Sistema de Agenda**
   - Visualização de horários disponíveis
   - Seleção e reserva de horários
   - Sistema de fila de espera

3. ✅ **Sistema de Pagamento**
   - Processamento de pagamentos com cartão
   - Geração de QR Code para PIX
   - Geração de boleto
   - Confirmação de pagamento

4. ✅ **Interface Responsiva**
   - Funcional em desktop
   - Funcional em tablets
   - Funcional em smartphones

---

## 🎯 PRINCIPAIS MILESTONES

1. **MVP 1**: Autenticação e agenda funcionais
2. **MVP 2**: Sistema de pagamento integrado
3. **MVP 3**: Área do aluno básica
4. **VERSÃO FINAL**: Sistema completo com todas as funcionalidades

## Sprint Atual (Integração Frontend-Backend)

### Dia 1-2: Configuração e Testes de Base
1. [✅] ~~Configurar ambientes de desenvolvimento~~
2. [✅] ~~Verificar endpoints existentes~~
3. [✅] **CRÍTICO**: Implementar AgendaController e PaymentController
4. [✅] Criar DTOs e Models necessários para backend

### Dia 3-5: Integração de Autenticação
1. [⚠️] Adaptar auth.js para consumir AuthController
2. [⚠️] Implementar armazenamento e gestão de token JWT
3. [⚠️] Testar fluxo completo de autenticação (login, registro, Google)
4. [⚠️] Implementar proteção de rotas no frontend

### Dia 6-8: Integração do Sistema de Agenda
1. [⚠️] Adaptar selection.js para consumir AgendaController
2. [⚠️] Implementar exibição dinâmica de horários disponíveis
3. [⚠️] Desenvolver funcionalidade de reserva de horários
4. [⚠️] Adicionar suporte à fila de espera
5. [⚠️] Testar cenários de disponibilidade/indisponibilidade

### Dia 9-11: Integração do Sistema de Pagamentos
1. [⚠️] Adaptar pagamento.js para consumir PaymentController
2. [⚠️] Implementar formulários para diferentes métodos de pagamento
3. [⚠️] Desenvolver fluxo completo de pagamento até confirmação
4. [⚠️] Testar diferentes métodos de pagamento (cartão, PIX, boleto)
5. [⚠️] Implementar consulta de status de pagamento

### Dia 12-14: Testes, Refinamentos e Documentação
1. [⚠️] Realizar testes end-to-end do fluxo completo
2. [⚠️] Corrigir bugs e otimizar performance
3. [⚠️] Melhorar tratamento de erros e feedback ao usuário
4. [⚠️] Atualizar documentação (API, código-fonte, fluxos)
5. [⚠️] Preparar para deploy em ambiente de testes

## Backlog Técnico (Próximas Sprints)

### Backend
- [ ] Implementar persistência real com Entity Framework
- [ ] Adicionar migrations e seed de dados
- [ ] Desenvolver testes unitários para Controllers
- [ ] Implementar validações avançadas de segurança
- [ ] Adicionar rate limiting e proteção contra ataques
- [ ] Implementar sistema de logs e auditoria

### Frontend
- [ ] Implementar validações de formulário avançadas
- [ ] Adicionar feedback visual durante operações assíncronas
- [ ] Melhorar responsividade em dispositivos móveis
- [ ] Implementar cache local para melhorar performance
- [ ] Adicionar animações e transições suaves
- [ ] Implementar modo offline para algumas funcionalidades

### DevOps
- [ ] Configurar pipeline CI/CD completo
- [ ] Implementar ambiente de staging
- [ ] Configurar monitoramento e alertas
- [ ] Implementar backup automatizado de dados
- [ ] Configurar auto-scaling na infraestrutura AWS
- [ ] Implementar testes de carga e performance

### UX/UI
- [ ] Realizar testes de usabilidade com usuários reais
- [ ] Aprimorar acessibilidade (WCAG)
- [ ] Otimizar fluxos baseados em feedback de usuários
- [ ] Implementar melhorias visuais na interface
- [ ] Adicionar tour guiado para novos usuários

## Métricas de Sucesso

Para considerarmos a integração bem-sucedida, devemos atingir:

1. **Funcionalidade**: 100% dos endpoints disponíveis e funcionais
2. **Performance**: Tempo de resposta < 300ms para operações críticas
3. **Confiabilidade**: Taxa de erro < 1% em produção
4. **Usabilidade**: Fluxo completo sem fricções ou pontos de confusão
5. **Segurança**: Proteção adequada de dados e operações sensíveis

## Observações Importantes

1. Priorizar a segurança nas operações de autenticação e pagamento
2. Garantir validação de dados tanto no frontend quanto no backend
3. Implementar feedback claro ao usuário em cada etapa do processo
4. Monitorar atentamente o desempenho durante a integração
5. Documentar de forma clara todas as decisões técnicas tomadas

---

Documento atualizado em: 10/06/2023 