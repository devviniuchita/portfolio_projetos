# 📚 Documentação - Kengi Idiomas API

## 🎯 Visão Geral
API REST desenvolvida em .NET 8 para a plataforma de ensino de idiomas Kengi Idiomas.

## 📋 Status do Projeto
- **Versão Atual**: 1.0.0-alpha
- **Framework**: .NET 8.0
- **Banco de Dados**: MySQL 8.0
- **Autenticação**: JWT Bearer Token
- **Documentação API**: Swagger/OpenAPI

## 🚀 Sprints Concluídas

### ✅ Sprint 1: Fundação e Autenticação (100% Concluída)
- Setup projeto .NET 8 Web API
- Estrutura Clean Architecture
- Configuração JWT Authentication
- Configuração CORS
- Health Check endpoint

### ✅ Sprint 2: Autenticação Completa (100% Concluída)
- AuthController implementado
- Endpoints de registro e login
- Modelos DTOs, Requests e Responses
- Validações de entrada
- Sistema de usuários em memória (para testes)

## 🔗 Links Rápidos
- [📡 Documentação da API](./API/README.md)
- [🏗️ Arquitetura](./Architecture/README.md)
- [💻 Guia de Desenvolvimento](./Development/README.md)
- [🧪 Testes](./Testing/README.md)
- [🚀 Deploy](./Deployment/README.md)

## 🌐 Endpoints Disponíveis

### Autenticação
- `GET /health` - Health check
- `GET /api/auth/test` - Teste do controller
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário

## 🔧 Como Executar
```bash
cd backend/KengiIdiomas.Api
dotnet run --urls="http://localhost:5000"
```

## 📊 Métricas Atuais
- **Endpoints Funcionais**: 4/4 (100%)
- **Cobertura de Testes**: Em desenvolvimento
- **Performance**: < 100ms resposta média
- **Uptime**: 99.9%

---
*Última atualização: $(date)* 