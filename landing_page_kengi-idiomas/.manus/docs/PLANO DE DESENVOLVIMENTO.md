# 📋 Plano de Ação - Projeto Kengi Idiomas

## 🎯 Objetivos do Projeto

1. **Captar Leads Qualificados**  
   Atrair visitantes interessados em japonês através de formulários e materiais gratuitos.

2. **Converter Visitantes em Alunos**  
   Apresentar os cursos com provas sociais, estrutura confiável e gatilhos mentais.

3. **Ampliar Alcance e Escalabilidade**  
   SEO otimizado + compatibilidade com campanhas pagas + compartilhamento fácil.

4. **Sistema de Pagamento Eficaz com Rastreabilidade, Vínculo e Logs**  
   Seguro + intuitivo + funcional tanto para Kengi receber quanto para clientes comprar e terem suas aulas reservadas garantidas.
   
---

## 🧠 Visão Técnica Geral

- **Frontend:** HTML, CSS (modular), Tailwind, JavaScript (modular)
- **Backend:** C# com .NET 8
- **Obs.:** O sistema também já conta com Node instalado, atualizado e configurado para se caso for necessário
- **Banco de Dados:** MySQL + Entity Framework Core
- **Autenticação:** JWT + Google OAuth2
- **Pagamentos:** Integração com MercadoPago / Stripe / PagSeguro
- **Infraestrutura:** API RESTful + Arquitetura em camadas (Clean Architecture)
- **Hospedagem:** Vercel utilizado atualmente por enquanto (frontend), AWS (backend) -> Ainda precisa ser implementado e configurado
- **Hospedagem Final:** Quando projeto estiver cncluído será hospedado no HostGator

---

## 🛠️ Módulos e Funcionalidades

### 1. 🔐 Autenticação de Usuário

- Cadastro com e-mail/senha
- Login com JWT
- Login com Google
- Middleware de proteção de rotas
- Hash de senha com Bcrypt

---

### 2. 📅 Sistema de Agenda de Horários

- Estrutura hierárquica: Tipo > Plano > Dia > Horários
- API REST para:
  - Listar horários disponíveis
  - Reservar horário (marcar como ocupado)
  - Liberar horário (em caso de desistência)
  - Criar fila de espera

---

### 3. 📦 Gerenciamento de Planos

- Planos:
  - Grupo: Mensal, Semestral, Anual
  - Particular: Mensal, Semestral, Anual
- Informações:
  - Preço, Duração, Aulas inclusas, Benefícios
- Seleção dinâmica no front-end (`pagamento.html`)
- API `/planos` para consulta

---

### 4. 💳 Integração com Pagamentos

- API de checkout
- Métodos: Cartão, Pix, Boleto
- Geração de QR Code / Boleto / Parcelamento
- Webhook de confirmação
- Redirecionamento para “Área do Aluno”

---

### 5. 👨‍🎓 Área do Aluno

- Resumo do plano adquirido
- Horário reservado
- Opções:
  - Reagendar
  - Cancelar
  - Trocar de plano
- Histórico de pagamentos
- Acesso à comunidade (link privado)

---

### 6. 📤 Formulário de Contato

- Endpoint POST para envio de email
- E-mail do destinatário: kengiteruya@gmail.com
- SMTP via Gmail ou SendGrid
- Validação básica no formulário

---

### 7. 📈 SEO & Métricas

- Google Analytics (GA4)
- Google Tag Manager
- Tags `<meta>` completas
- Sitemap.xml e robots.txt
- Eventos de conversão (botão Comprar, Enviar Formulário)

---

## 🗃️ Estrutura Inicial do Banco de Dados (MySQL)

```sql
TABELAS:

USUARIOS
- id
- nome
- email
- senha_hash
- google_id (nullable)

PLANOS
- id
- nome
- tipo (grupo | particular)
- duracao
- preco
- desconto
- aulas_inclusas

AGENDAS
- id
- dia_semana
- horario
- plano_id
- tipo_aula
- disponivel
- aluno_id (nullable)

PEDIDOS
- id
- usuario_id
- plano_id
- agenda_id
- metodo_pagamento
- status_pagamento
- data_compra
```

---

## 📆 Etapas de Desenvolvimento

**Etapa 1:** 🏗️ Infraestrutura

 Setup do projeto .NET 8

 Configuração do MySQL + EF Core

 Setup de autenticação JWT + OAuth2
 
 ---

**Etapa 2:** 👤 Módulo de Usuário
 Endpoints /register, /login, /me

 Proteção de rotas

 Login com Google (OAuth2)
 
 ---

**Etapa 3:** 🗓 Agenda de Horários
 CRUD de horários disponíveis

 API de disponibilidade por plano/tipo

 Integração com pagamento.html (passo 3)
 
 ---

**Etapa 4:** 🛍 Produtos e Planos
 Criar estrutura de planos

 Atualizar seleção no front-end

 Sincronização com pagamento.js
 
 ---

**Etapa 5:** 💳 Pagamentos
 API de checkout (cartão, pix, boleto)

 Webhook de confirmação

 Redirecionamento após pagamento
 
 ---

**Etapa 6:** 📬 Formulário de Contato
 Endpoint /contato

 Envio de e-mail para kengiteruya@gmail.com
 
 ---

**Etapa 7:** 🧪 Testes e Ajustes
 Testar login, compra, agendamento e pagamento

 Testar cenários de erro e UX

 Otimizar SEO e responsividade mobile
 
 ---

##✅ Checklist Final

Item	Status

Backend (.NET 8 + API)	🔲

Sistema de Agenda	🔲

Autenticação (Google + Email)	🔲

Integração de Pagamentos	🔲

Área do Aluno	🔲

E-mail de Contato	🔲

Métricas SEO + GA4	🔲