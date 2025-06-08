# Documentação de Endpoints Implementados - Kengi Idiomas

Este documento lista todos os endpoints implementados na API do Kengi Idiomas, organizados por controlador.

## Autenticação

### `POST /api/auth/register`
Registra um novo usuário no sistema.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": 0,
    "username": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

### `POST /api/auth/login`
Autentica um usuário existente.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": 0,
    "username": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

### `GET /api/auth/user`
Retorna os detalhes do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 0,
    "username": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

## Agenda

### `GET /api/agenda/test`
Testa se o controlador de agenda está funcionando.

**Response:**
```json
{
  "message": "AgendaController funcionando!",
  "timestamp": "2023-06-10T10:00:00Z",
  "horariosCount": 36
}
```

### `GET /api/agenda/horarios/{tipo}`
Retorna os horários disponíveis por tipo (group/private).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "diaSemana": "segunda",
      "horaInicio": "09:00",
      "horaFim": "10:00",
      "tipoAula": "group",
      "disponivel": true,
      "usuarioId": null
    },
    // ...
  ]
}
```

### `GET /api/agenda/horarios/{tipo}/{dia}`
Retorna os horários disponíveis por tipo e dia da semana.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "diaSemana": "segunda",
      "horaInicio": "09:00",
      "horaFim": "10:00",
      "tipoAula": "group",
      "disponivel": true,
      "usuarioId": null
    },
    // ...
  ]
}
```

### `GET /api/agenda/disponibilidade`
Retorna a disponibilidade de horários agrupados por dia e tipo.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "diaSemana": "segunda",
      "tipoAula": "group",
      "quantidadeHorarios": 2
    },
    // ...
  ]
}
```

### `POST /api/agenda/reservar`
Reserva um horário específico (requer autenticação).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "horarioId": 1,
  "usuarioId": 123,
  "planoId": 2,
  "observacoes": "Preferência por professor nativo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Horário reservado com sucesso",
  "horario": {
    "id": 1,
    "diaSemana": "segunda",
    "horaInicio": "09:00",
    "horaFim": "10:00",
    "tipoAula": "group",
    "disponivel": false,
    "usuarioId": 123
  }
}
```

### `POST /api/agenda/fila-espera`
Adiciona um usuário à fila de espera para horários não disponíveis.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "usuarioId": 123,
  "diaSemana": "segunda",
  "tipoAula": "group",
  "horarioPreferido": "09:00-10:00",
  "observacoes": "Qualquer horário pela manhã"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Adicionado à fila de espera com sucesso",
  "filaEspera": {
    "id": 1,
    "usuarioId": 123,
    "diaSemana": "segunda",
    "tipoAula": "group",
    "dataSolicitacao": "2023-06-10T10:00:00Z"
  }
}
```

## Pagamento

### `GET /api/payment/test`
Testa se o controlador de pagamento está funcionando.

**Response:**
```json
{
  "message": "PaymentController funcionando!",
  "timestamp": "2023-06-10T10:00:00Z"
}
```

### `POST /api/payment/processar`
Processa um pagamento genérico.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "planoId": 2,
  "horarioId": 1,
  "metodoPagamento": "cartao",
  "valor": 199.90,
  "observacoes": "Pagamento mensal"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pagamento processado com sucesso",
  "paymentId": "pay_123456789",
  "amount": 199.90,
  "paymentMethod": "cartao",
  "timestamp": "2023-06-10T10:00:00Z"
}
```

### `POST /api/payment/cartao`
Processa um pagamento com cartão de crédito.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "planoId": 2,
  "horarioId": 1,
  "valor": 199.90,
  "numeroCartao": "4111111111111111",
  "nomeTitular": "NOME DO TITULAR",
  "validade": "12/25",
  "codigoSeguranca": "123",
  "parcelas": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pagamento com cartão processado com sucesso",
  "paymentId": "card_123456789",
  "amount": 199.90,
  "installments": 3,
  "cardLastDigits": "1111",
  "timestamp": "2023-06-10T10:00:00Z"
}
```

### `POST /api/payment/pix`
Gera um pagamento via PIX.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "planoId": 2,
  "horarioId": 1,
  "valor": 199.90,
  "email": "cliente@exemplo.com",
  "documento": "123.456.789-00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pagamento PIX gerado com sucesso",
  "paymentId": "pix_123456789",
  "amount": 199.90,
  "pixKey": "kengi@exemplo.com",
  "qrCode": "00020101021226880014BR.GOV.BCB...",
  "expiresAt": "2023-06-10T11:00:00Z",
  "timestamp": "2023-06-10T10:00:00Z"
}
```

### `POST /api/payment/boleto`
Gera um pagamento via boleto bancário.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "planoId": 2,
  "horarioId": 1,
  "valor": 199.90,
  "nomePagador": "Nome do Cliente",
  "documento": "123.456.789-00",
  "email": "cliente@exemplo.com",
  "endereco": "Rua Exemplo, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Boleto gerado com sucesso",
  "paymentId": "boleto_123456789",
  "amount": 199.90,
  "boletoCode": "34191.79001 01043.510047...",
  "boletoUrl": "https://api.kengi-idiomas.com/boletos/boleto_123456789",
  "dueDate": "2023-06-13",
  "timestamp": "2023-06-10T10:00:00Z"
}
```

### `GET /api/payment/status/{paymentId}`
Consulta o status de um pagamento.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "pix_123456789",
  "status": "paid",
  "updatedAt": "2023-06-10T10:05:00Z"
}
```

## Próximos Passos

Os seguintes endpoints estão planejados para implementação futura:

1. APIs de Planos (listar, detalhes)
2. APIs de Usuário (atualizar perfil, trocar senha)
3. APIs de Administração (relatórios, gerenciamento)
4. APIs de Notificação (envio de emails, SMS) 