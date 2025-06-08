# 🏗️ Arquitetura - Kengi Idiomas API

## 📐 Visão Geral da Arquitetura

### Clean Architecture
O projeto segue os princípios da Clean Architecture, organizando o código em camadas bem definidas:

```
KengiIdiomas.Api/
├── Controllers/          # Camada de Apresentação
├── Services/            # Camada de Aplicação
│   ├── Interfaces/
│   └── Implementations/
├── Data/               # Camada de Infraestrutura
│   ├── Context/
│   ├── Entities/
│   └── Repositories/
├── Models/             # Camada de Domínio
│   ├── DTOs/
│   ├── Requests/
│   └── Responses/
├── Configuration/      # Configurações
└── Documentation/      # Documentação
```

## 🔧 Tecnologias Utilizadas

### Backend
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - API REST
- **Entity Framework Core** - ORM
- **MySQL** - Banco de dados
- **JWT Bearer** - Autenticação
- **Swagger/OpenAPI** - Documentação da API

### Bibliotecas
- `Microsoft.EntityFrameworkCore.Design`
- `Pomelo.EntityFrameworkCore.MySql`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.OpenApi`

## 🗄️ Modelo de Dados

### Entidades Principais

#### User
```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public string Role { get; set; } // Student, Teacher, Admin
    
    // Navigation Properties
    public virtual ICollection<Enrollment> Enrollments { get; set; }
    public virtual ICollection<Payment> Payments { get; set; }
}
```

#### Course
```csharp
public class Course
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Language { get; set; }
    public string Level { get; set; }
    public int DurationHours { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public string? ImageUrl { get; set; }
    
    // Navigation Properties
    public virtual ICollection<Enrollment> Enrollments { get; set; }
    public virtual ICollection<Lesson> Lessons { get; set; }
    public virtual ICollection<Payment> Payments { get; set; }
}
```

#### Enrollment
```csharp
public class Enrollment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; }
    public decimal Progress { get; set; }
    
    // Navigation Properties
    public virtual User User { get; set; }
    public virtual Course Course { get; set; }
}
```

## 🔐 Segurança

### Autenticação JWT
- **Algoritmo**: HMAC SHA256
- **Expiração**: 1 hora
- **Claims**: UserId, Name, Email, Role

### Configuração JWT
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
```

### Hash de Senhas
- **Algoritmo**: SHA256 + Salt
- **Salt**: "kengi-idiomas-salt-2024"

## 🌐 CORS
Configurado para permitir requisições do frontend:
- `http://localhost:3000`
- `http://127.0.0.1:5500`
- `http://localhost:5500`

## 📊 Padrões Implementados

### Repository Pattern
- Separação entre lógica de negócio e acesso a dados
- Facilita testes unitários
- Permite troca de implementação de persistência

### DTO Pattern
- Transferência de dados entre camadas
- Controle de exposição de dados
- Validações específicas por contexto

### Dependency Injection
- Inversão de controle
- Facilita testes
- Baixo acoplamento

## 🔄 Fluxo de Requisição

```
Cliente → Controller → Service → Repository → Database
                ↓
Cliente ← DTO ← Response ← Business Logic ← Entity
```

## 📈 Escalabilidade

### Preparado para:
- **Microserviços**: Estrutura modular
- **Cache**: Redis/MemoryCache
- **Load Balancer**: Stateless design
- **Database Sharding**: Entity Framework suporte

### Próximas Implementações:
- Repository Pattern completo
- Unit of Work
- CQRS (Command Query Responsibility Segregation)
- Event Sourcing

---
*Documentação técnica - Última atualização: 27/05/2024* 