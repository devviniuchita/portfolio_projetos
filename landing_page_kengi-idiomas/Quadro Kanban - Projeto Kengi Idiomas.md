# Quadro Kanban - Projeto Kengi Idiomas

**Status Atual:** SPRINT 4 - Integração Frontend-Backend - 20% concluído  
**Progresso Geral:** 55%

**Instruções:** Este quadro reflete o status das tarefas do projeto. Deve ser atualizado automaticamente pelos agentes (CURSOR, BLACKBOX, LINGMA, CONTINUE) conforme o progresso em `tasks.json`. As tarefas devem mover-se entre as colunas refletindo seu estado atual.

---

## ✅ Sprint 1: Fundação e Autenticação - CONCLUÍDO

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| | | | | ✅ Setup Projeto .NET 8 (task_id_001) |
| | | | | ✅ Config MySQL + EF Core (task_id_002) |
| | | | | ✅ Setup Auth JWT (task_id_003) |
| | | | | ✅ Entidades do Banco (task_id_004) |
| | | | | ✅ Controllers Auth (task_id_005) |
| | | | | ✅ Services Auth (task_id_006) |
| | | | | ✅ DTOs e Models (task_id_007) |
| | | | | ✅ Swagger + CORS (task_id_008) |

---

## ✅ Sprint 2: Sistema de Agenda - CONCLUÍDO

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| | | | | ✅ Modelo Agenda (task_id_009) |
| | | | | ✅ DTO Agenda (task_id_010) |
| | | | | ✅ Service Agenda (task_id_011) |
| | | | | ✅ Controller Agenda (task_id_012) |
| | | | | ✅ Validação Agenda (task_id_013) |
| | | | | ✅ Fila de Espera (task_id_014) |

---

## ✅ Sprint 3: Sistema de Pagamentos - CONCLUÍDO

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| | | | | ✅ Modelo Pagamento (task_id_015) |
| | | | | ✅ DTO Pagamento (task_id_016) |
| | | | | ✅ Service Pagamento (task_id_017) |
| | | | | ✅ Controller Pagamento (task_id_018) |
| | | | | ✅ Gateway Pagamento (task_id_019) |
| | | | | ✅ Webhook Pagamento (task_id_020) |

---

## 🔄 Sprint 4: Integração Frontend-Backend - EM ANDAMENTO

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| | | | | ✅ API Calls Frontend (task_id_021) |
| | | | | ✅ Serviço Agenda Frontend (task_id_022) |
| | | | | ✅ Serviço Pagamento Frontend (task_id_023) |
| | | | | ✅ Serviço Planos Frontend (task_id_024) |
| | | 🔄 Integração Autenticação (task_id_025) | | |
| | Integração Agenda (task_id_026) | | | |
| | Integração Pagamento (task_id_027) | | | |
| | Integração Planos (task_id_028) | | | |

---

## ⏳ Sprint 5: Dashboard Admin - PENDENTE

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| Backend Admin (task_id_029) | | | | |
| Frontend Admin (task_id_030) | | | | |
| Relatórios (task_id_031) | | | | |

---

## ⏳ Sprint 6: Testes e Qualidade - PENDENTE

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| Testes Unitários (task_id_032) | | | | |
| Testes End-to-End (task_id_033) | | | | |
| Testes Performance (task_id_034) | | | | |

---

## 🔄 Sprint 7: Deploy e Infraestrutura - EM ANDAMENTO

| Backlog | To Do | In Progress | Review | Done |
| :------ | :---- | :---------- | :----- | :--- |
| | | | | ✅ Setup AWS (task_id_035) |
| | | 🔄 Pipeline CI/CD (task_id_036) | | |
| | Domínio e SSL (task_id_037) | | | |

---

## 🚨 Problemas Identificados

| ID | Descrição | Status | Solução |
| :-- | :-------- | :----- | :------ |
| prob_001 | Duplicação de entidades (Agenda vs HorarioDisponivel) | ✅ RESOLVIDO | Entidades unificadas por script unificar_entidades.sh |
| prob_002 | Falta de migrations para o banco de dados | ✅ RESOLVIDO | Migrations criadas por script setup_migrations.sh |
| prob_003 | Integração frontend-backend incompleta | 🔄 EM PROGRESSO | Implementar chamadas API no frontend conforme PLANO_INTEGRACAO_FRONTEND.md |

---

## 📊 Status de Funcionalidades Críticas

| Funcionalidade | Status | Progresso |
| :------------- | :----- | :-------- |
| Autenticação | ✅ CONCLUÍDO | 100% |
| Sistema de Agenda | ✅ CONCLUÍDO | 100% |
| Sistema de Pagamentos | ✅ CONCLUÍDO | 100% |
| Integração Frontend | ⚠️ PENDENTE | 10% |

