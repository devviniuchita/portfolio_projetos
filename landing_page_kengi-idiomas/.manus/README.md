# 📁 .manus

Esta pasta contém documentação, scripts e arquivos de configuração para o projeto Kengi Idiomas.

## 📋 Status do Projeto

O projeto está atualmente em **SPRINT 4 - Integração Frontend-Backend** com progresso geral de **50%**. O backend está completamente implementado, incluindo autenticação, sistema de agenda e pagamentos. A integração com o frontend está em andamento (10% concluída).

## 📄 Arquivos de Documentação Unificados

- **[tasks.json](./tasks.json)**: Status atualizado de todas as tarefas do projeto. **Fonte única de verdade** para status do projeto.
- **[ANALISE_ATUALIZADA.md](./ANALISE_ATUALIZADA.md)**: Análise detalhada do estado atual do projeto.
- **[PLANO_INTEGRACAO_FRONTEND.md](./PLANO_INTEGRACAO_FRONTEND.md)**: Plano para integrar o frontend com o backend.

## 🧰 Scripts

Todos os scripts estão na pasta `scripts/`:

- **[setup_migrations.sh](./scripts/setup_migrations.sh)**: Configura e aplica migrations do Entity Framework.
- **[unificar_entidades.sh](./scripts/unificar_entidades.sh)**: Remove entidades duplicadas e mantém backups.

### Integração com NPM

Os scripts podem ser executados através dos comandos npm:

```bash
# Executar migrations
npm run migrations

# Unificar entidades
npm run unificar
```

## 🚨 Problemas Resolvidos

| ID | Descrição | Status | Solução |
| :-- | :-------- | :----- | :------ |
| prob_001 | Duplicação de entidades (Agenda vs HorarioDisponivel) | ✅ RESOLVIDO | Entidades unificadas por script unificar_entidades.sh |
| prob_002 | Falta de migrations para o banco de dados | ✅ RESOLVIDO | Migrations criadas por script setup_migrations.sh |
| prob_003 | Integração frontend-backend incompleta | 🔄 EM PROGRESSO | Implementar chamadas API no frontend conforme PLANO_INTEGRACAO_FRONTEND.md |

## 📚 Guia de Uso da Documentação

Para evitar redundâncias e manter o projeto organizado, siga estas regras:

1. **tasks.json** é a fonte única de verdade para status das tarefas
2. **Quadro Kanban** deve ser gerado a partir do tasks.json
3. Utilize os scripts em `.manus/scripts/` para automações (migrations, unificação)
4. Toda nova documentação técnica deve ser adicionada em `.manus/docs/`
5. Evite criar múltiplos arquivos sobre o mesmo assunto

## 🔄 Fluxo de Trabalho Atual

1. Sprint 4 está em andamento - Integração Frontend-Backend
2. Implementação de chamadas de API no frontend usando os serviços criados em `assets/js/services/`
3. Próximos passos incluem integração de autenticação, agenda e pagamentos
4. Testes de integração serão realizados após implementação completa

## 📁 Estrutura Recomendada

```
.manus/
├── README.md                      # Este arquivo
├── tasks.json                     # Status das tarefas (fonte única)
├── scripts/                       # Scripts de automação
│   ├── setup_migrations.sh        # Configuração de migrations
│   └── unificar_entidades.sh      # Remoção de entidades duplicadas
├── docs/                          # Documentação técnica
│   ├── ANALISE_ATUALIZADA.md      # Estado atual do projeto
│   ├── PLANO_INTEGRACAO_FRONTEND.md # Plano de integração
│   └── RESUMO_IMPLEMENTACAO_AGENDA.md # Documentação do sistema de agenda
└── backups/                       # Backups automáticos (gerados pelos scripts)
``` 