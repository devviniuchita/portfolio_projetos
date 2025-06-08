# 🌐 Referência de Endpoints - Kengi Idiomas API

## 📋 Índice de Endpoints

### 🔐 Autenticação
- [Health Check](#health-check)
- [Teste AuthController](#teste-authcontroller)
- [Registro de Usuário](#registro-de-usuário)
- [Login de Usuário](#login-de-usuário)

### 📚 Cursos (Planejado)
- [Listar Cursos](#listar-cursos)
- [Detalhes do Curso](#detalhes-do-curso)
- [Criar Curso](#criar-curso)

### 📅 Agendamento (Planejado)
- [Disponibilidade](#disponibilidade)
- [Agendar Aula](#agendar-aula)
- [Cancelar Agendamento](#cancelar-agendamento)

### 💳 Pagamentos (Planejado)
- [Checkout](#checkout)
- [Webhook Pagamento](#webhook-pagamento)
- [Histórico Pagamentos](#histórico-pagamentos)

---

## 🔐 Endpoints de Autenticação

### Health Check
```http
GET /health
```

**Descrição**: Verifica se a API está funcionando

**Resposta**:
```json
{
  "Status": "Healthy",
  "Timestamp": "2024-05-27T10:30:00Z"
}
```

**Código de Teste**:
```bash
curl -X GET "http://localhost:5000/health"
```

---

### Teste AuthController
```http
GET /api/auth/test
```

**Descrição**: Endpoint de teste para verificar funcionamento do AuthController

**Resposta**:
```json
{
  "Message": "AuthController funcionando!",
  "Timestamp": "2024-05-27T10:30:00Z",
  "UsersCount": 2,
  "Users": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@teste.com",
      "phone": "11999999999",
      "role": "Student",
      "isActive": true,
      "createdAt": "2024-05-27T10:00:00Z"
    }
  ]
}
```

**Código de Teste**:
```bash
curl -X GET "http://localhost:5000/api/auth/test"
```

---

### Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json
```

**Descrição**: Registra um novo usuário no sistema

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "123456",
  "phone": "11999999999"
}
```

**Validações**:
- `name`: Obrigatório, máximo 100 caracteres
- `email`: Obrigatório, formato de email válido, máximo 255 caracteres
- `password`: Obrigatório, mínimo 6 caracteres, máximo 100 caracteres
- `phone`: Opcional, formato de telefone válido

**Resposta de Sucesso (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "11999999999",
    "role": "Student",
    "isActive": true,
    "createdAt": "2024-05-27T10:30:00Z"
  },
  "expiresAt": "2024-05-27T11:30:00Z"
}
```

**Resposta de Erro (400)**:
```json
{
  "message": "Email já está em uso"
}
```

**Código de Teste**:
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@teste.com",
    "password": "123456",
    "phone": "11999999999"
  }'
```

---

### Login de Usuário
```http
POST /api/auth/login
Content-Type: application/json
```

**Descrição**: Autentica um usuário e retorna token JWT

**Body**:
```json
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

**Validações**:
- `email`: Obrigatório, formato de email válido
- `password`: Obrigatório

**Resposta de Sucesso (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "11999999999",
    "role": "Student",
    "isActive": true,
    "createdAt": "2024-05-27T10:30:00Z"
  },
  "expiresAt": "2024-05-27T11:30:00Z"
}
```

**Resposta de Erro (401)**:
```json
{
  "message": "Email ou senha inválidos"
}
```

**Código de Teste**:
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "123456"
  }'
```

---

## 📚 Endpoints de Cursos (Planejado - Sprint 4)

### Listar Cursos
```http
GET /api/courses
Authorization: Bearer {token}
```

**Descrição**: Lista todos os cursos disponíveis

**Query Parameters**:
- `language`: Filtrar por idioma (opcional)
- `level`: Filtrar por nível (opcional)
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

**Resposta**:
```json
{
  "courses": [
    {
      "id": 1,
      "name": "Inglês Básico",
      "description": "Curso de inglês para iniciantes",
      "price": 299.90,
      "language": "English",
      "level": "Beginner",
      "durationHours": 40,
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### Detalhes do Curso
```http
GET /api/courses/{id}
Authorization: Bearer {token}
```

**Descrição**: Obtém detalhes de um curso específico

**Resposta**:
```json
{
  "id": 1,
  "name": "Inglês Básico",
  "description": "Curso completo de inglês para iniciantes...",
  "price": 299.90,
  "language": "English",
  "level": "Beginner",
  "durationHours": 40,
  "imageUrl": "https://example.com/image.jpg",
  "lessons": [
    {
      "id": 1,
      "title": "Introdução ao Inglês",
      "order": 1,
      "durationMinutes": 60
    }
  ],
  "isActive": true,
  "createdAt": "2024-05-27T10:00:00Z"
}
```

---

## 📅 Endpoints de Agendamento (Planejado - Sprint 4)

### Disponibilidade
```http
GET /api/schedule/availability
Authorization: Bearer {token}
```

**Descrição**: Consulta horários disponíveis para agendamento

**Query Parameters**:
- `courseId`: ID do curso (obrigatório)
- `date`: Data desejada (formato: YYYY-MM-DD)
- `teacherId`: ID do professor (opcional)

**Resposta**:
```json
{
  "date": "2024-05-28",
  "availableSlots": [
    {
      "time": "09:00",
      "teacherId": 1,
      "teacherName": "Prof. Maria",
      "duration": 60
    },
    {
      "time": "14:00",
      "teacherId": 1,
      "teacherName": "Prof. Maria",
      "duration": 60
    }
  ]
}
```

---

### Agendar Aula
```http
POST /api/schedule/book
Authorization: Bearer {token}
Content-Type: application/json
```

**Descrição**: Agenda uma aula

**Body**:
```json
{
  "courseId": 1,
  "teacherId": 1,
  "date": "2024-05-28",
  "time": "09:00",
  "notes": "Primeira aula"
}
```

**Resposta**:
```json
{
  "id": 1,
  "courseId": 1,
  "teacherId": 1,
  "userId": 1,
  "date": "2024-05-28",
  "time": "09:00",
  "status": "Confirmed",
  "notes": "Primeira aula",
  "createdAt": "2024-05-27T10:30:00Z"
}
```

---

## 💳 Endpoints de Pagamentos (Planejado - Sprint 5)

### Checkout
```http
POST /api/payments/checkout
Authorization: Bearer {token}
Content-Type: application/json
```

**Descrição**: Inicia processo de pagamento

**Body**:
```json
{
  "courseId": 1,
  "paymentMethod": "credit_card",
  "cardData": {
    "number": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123",
    "holderName": "João Silva"
  }
}
```

**Resposta**:
```json
{
  "paymentId": "pay_123456",
  "status": "pending",
  "amount": 299.90,
  "paymentUrl": "https://checkout.example.com/pay_123456",
  "expiresAt": "2024-05-27T11:30:00Z"
}
```

---

## 🔧 Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Sucesso geral |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou malformados |
| 401 | Unauthorized | Token inválido ou expirado |
| 403 | Forbidden | Sem permissão para acessar recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já existe) |
| 422 | Unprocessable Entity | Validação falhou |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🧪 Scripts de Teste Automatizado

### Teste Completo de Autenticação
```bash
#!/bin/bash

# Variáveis
BASE_URL="http://localhost:5000"
EMAIL="teste$(date +%s)@exemplo.com"
PASSWORD="123456"

echo "🧪 Testando API Kengi Idiomas..."

# 1. Health Check
echo "1. Health Check..."
curl -s -X GET "$BASE_URL/health" | jq .

# 2. Registro
echo "2. Registrando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuário Teste\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"phone\": \"11999999999\"
  }")

echo $REGISTER_RESPONSE | jq .

# Extrair token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r .token)

# 3. Login
echo "3. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo $LOGIN_RESPONSE | jq .

# 4. Teste com token
echo "4. Testando endpoint protegido..."
curl -s -X GET "$BASE_URL/api/auth/test" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo "✅ Testes concluídos!"
```

---

## 📝 Notas de Implementação

### Padrões de Response
- Sempre retornar JSON
- Incluir timestamp quando relevante
- Usar camelCase para propriedades
- Incluir mensagens de erro descritivas

### Segurança
- Todos os endpoints protegidos requerem JWT
- Validar entrada em todos os endpoints
- Sanitizar dados antes de processar
- Rate limiting implementado

### Performance
- Paginação em endpoints de listagem
- Cache para dados frequentemente acessados
- Compressão gzip habilitada
- Logs estruturados para monitoramento

---

*📚 Referência mantida atualizada automaticamente*
*🔄 Última atualização: 27/05/2024 10:30* 