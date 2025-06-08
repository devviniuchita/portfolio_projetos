# 📡 Documentação da API - Kengi Idiomas

## 🌐 Base URL
```
http://localhost:5000
```

## 🔐 Autenticação
A API utiliza JWT Bearer Token para autenticação.

### Header de Autorização
```
Authorization: Bearer {token}
```

## 📋 Endpoints

### 🏥 Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "Status": "Healthy",
  "Timestamp": "2024-05-27T10:30:00Z"
}
```

### 🧪 Teste do AuthController
```http
GET /api/auth/test
```

**Resposta:**
```json
{
  "Message": "AuthController funcionando!",
  "Timestamp": "2024-05-27T10:30:00Z",
  "UsersCount": 0,
  "Users": []
}
```

### 👤 Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "123456",
  "phone": "11999999999"
}
```

**Resposta de Sucesso (200):**
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

**Resposta de Erro (400):**
```json
{
  "message": "Email já está em uso"
}
```

### 🔑 Login de Usuário
```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

**Resposta de Sucesso (200):**
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

**Resposta de Erro (401):**
```json
{
  "message": "Email ou senha inválidos"
}
```

## 📝 Modelos de Dados

### UserDto
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "phone": "string|null",
  "role": "string",
  "isActive": "boolean",
  "createdAt": "datetime"
}
```

### RegisterRequest
```json
{
  "name": "string (required, max: 100)",
  "email": "string (required, email format, max: 255)",
  "password": "string (required, min: 6, max: 100)",
  "phone": "string (optional, phone format)"
}
```

### LoginRequest
```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

### AuthResponse
```json
{
  "token": "string",
  "user": "UserDto",
  "expiresAt": "datetime"
}
```

## 🔧 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 500 | Erro interno do servidor |

## 🧪 Exemplos de Teste com cURL

### Registro
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

### Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "123456"
  }'
```

### Teste
```bash
curl -X GET "http://localhost:5000/api/auth/test"
```

---
*Documentação gerada automaticamente - Última atualização: 27/05/2024* 