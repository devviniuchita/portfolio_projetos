# 📑 DOCUMENTAÇÃO UNIFICADA - PROJETO KENGI IDIOMAS

**Data:** 27 de Janeiro de 2025  
**Versão:** 1.0  
**Status:** Sprint 4 - Integração Frontend-Backend (em andamento)

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Status Atual e Progresso](#status-atual-e-progresso)
3. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
4. [Módulos Implementados](#módulos-implementados)
5. [Próximos Passos](#próximos-passos)
6. [Guia de Contribuição](#guia-de-contribuição)
7. [Problemas e Soluções](#problemas-e-soluções)
8. [Documentos Relacionados](#documentos-relacionados)

---

## 📈 Visão Geral do Projeto

O projeto Kengi Idiomas consiste em uma landing page com sistema integrado de agendamento e pagamento para aulas de japonês. 

**Principais Objetivos:**
- Captar leads qualificados interessados em aulas de japonês
- Converter visitantes em alunos através de provas sociais e estrutura confiável
- Ampliar alcance e escalabilidade com SEO otimizado
- Oferecer sistema eficaz de pagamento com rastreabilidade e logs

**Funcionalidades Críticas:**
- Sistema de autenticação seguro
- Gestão de horários disponíveis e agenda
- Fila de espera para horários lotados
- Processamento de pagamentos com múltiplos métodos
- Dashboard administrativo (planejado)

---

## 📊 Status Atual e Progresso

**Progresso Global:** 50%

| Sprint | Status | Progresso |
|--------|--------|-----------|
| 1: Fundação e Autenticação | ✅ CONCLUÍDO | 100% |
| 2: Sistema de Agenda | ✅ CONCLUÍDO | 100% |
| 3: Sistema de Pagamentos | ✅ CONCLUÍDO | 100% |
| 4: Integração Frontend-Backend | 🔄 EM ANDAMENTO | 10% |
| 5: Dashboard Admin | ⏳ AGUARDANDO | 0% |
| 6: Testes e Qualidade | ⏳ AGUARDANDO | 0% |
| 7: Deploy e Infraestrutura | 🔄 EM ANDAMENTO | 50% |

**Funcionalidades Críticas:**
- ✅ Autenticação: 100%
- ✅ Sistema de Agenda: 100%
- ✅ Sistema de Pagamentos: 100%
- ⚠️ Frontend Integration: 10%

---

## 🏗️ Arquitetura e Tecnologias

### Backend
- **Linguagem:** C# / ASP.NET Core 8
- **ORM:** Entity Framework Core
- **Banco de Dados:** MySQL
- **Autenticação:** JWT + BCrypt
- **Documentação:** Swagger

### Frontend
- **HTML/CSS:** Estrutura modular com Tailwind CSS
- **JavaScript:** Organizado em módulos e serviços
- **Integrações:** API REST / Fetch API

### Infraestrutura
- **Desenvolvimento:** Local + Vercel (frontend temporário)
- **Produção:** AWS (backend) + HostGator (hospedagem final)

### Estrutura de Pastas
```
landing_page_kengi-idiomas/
├── .manus/               # Documentação e scripts
├── assets/               # Recursos frontend (CSS, JS, imagens)
├── backend/              # Backend C#/.NET
│   └── KengiIdiomas.Api/ # API RESTful
└── .github/              # Fluxos de trabalho CI/CD
```

---

## 🔌 Módulos Implementados

### 1. Autenticação
- Login com email/senha
- Registro de novos usuários
- Tokens JWT para autorização
- Hash de senhas com BCrypt
- Google OAuth (configurado)

### 2. Sistema de Agenda
- Modelo hierárquico (Tipo → Plano → Dia → Horário)
- API para disponibilidade de horários
- Reserva de horários
- Sistema de fila de espera
- Validação de conflitos

### 3. Sistema de Pagamentos
- Gateway de pagamentos
- Múltiplos métodos (PIX, Cartão, Boleto)
- Processamento de transações
- Webhooks de confirmação

---

## 🚀 Próximos Passos

### Sprint 4 (Atual): Integração Frontend-Backend
1. Implementar API Calls no frontend
2. Integrar autenticação na interface
3. Conectar sistema de agenda ao frontend
4. Integrar processamento de pagamentos

### Sprint 5: Dashboard Admin
1. Desenvolver painel administrativo
2. Implementar gestão de usuários
3. Criar relatórios e analytics

### Sprint 6: Testes e Qualidade
1. Implementar testes unitários
2. Realizar testes end-to-end
3. Executar testes de performance
4. Conduzir auditoria de segurança

### Sprint 7: Deploy e Infraestrutura
1. Completar setup AWS
2. Configurar domínio e SSL/TLS
3. Implementar pipeline CI/CD
4. Configurar monitoramento

---

## 📝 Guia de Contribuição

### Organização da Documentação
- `.manus/docs/` contém toda a documentação técnica
- `tasks.json` é a fonte única da verdade para status do projeto
- Atualizações devem ser refletidas no Quadro Kanban

### Scripts de Automação
- `.manus/scripts/setup_migrations.sh` - Configurar e aplicar migrations
- `.manus/scripts/unificar_entidades.sh` - Remover entidades duplicadas

### Convenções do Projeto
- Nomenclatura de entidades e controllers em português
- Serviços e módulos JavaScript organizados em pastas dedicadas
- Documentação centralizada e unificada

---

## 🛠️ Problemas e Soluções

### Resolvidos

| ID | Problema | Solução |
|----|----------|---------|
| prob_001 | Duplicação de entidades (Agenda vs HorarioDisponivel) | Unificação via script unificar_entidades.sh |
| prob_002 | Falta de migrations para o banco de dados | Script setup_migrations.sh para criar e aplicar |

### Em Progresso

| ID | Problema | Status | Solução |
|----|----------|--------|---------|
| prob_003 | Integração frontend-backend incompleta | 🔄 EM PROGRESSO | Implementar conforme PLANO_INTEGRACAO_FRONTEND.md |

---

## 📚 Documentos Relacionados

- [STATUS_PROJETO.md](./STATUS_PROJETO.md) - Resumo do status atual
- [PLANO_INTEGRACAO_FRONTEND.md](./PLANO_INTEGRACAO_FRONTEND.md) - Detalhes da integração frontend-backend
- [RESUMO_IMPLEMENTACAO_AGENDA.md](./RESUMO_IMPLEMENTACAO_AGENDA.md) - Sistema de agenda implementado
- [PLANO DE DESENVOLVIMENTO.md](./PLANO\ DE\ DESENVOLVIMENTO.md) - Plano original de desenvolvimento

**Raiz do Projeto:**
- [Quadro Kanban - Projeto Kengi Idiomas.md](../../Quadro\ Kanban\ -\ Projeto\ Kengi\ Idiomas.md) - Visualização Kanban
- [tasks.json](../../tasks.json) - Detalhes completos de todas as tarefas 