using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Services.Interfaces;
using KengiIdiomas.Api.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Entity Framework
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=kengi_idiomas;User=root;Password=;";

builder.Services.AddDbContext<KengiIdiomasContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "kengi-idiomas-super-secret-key-2025-muito-segura";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "KengiIdiomas";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "KengiIdiomasUsers";

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

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IPlanoService, PlanoService>();
builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IPagamentoService, PagamentoService>();
builder.Services.AddScoped<IFilaEsperaService, FilaEsperaService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Kengi Idiomas API", 
        Version = "v1",
        Description = "API para o sistema da Kengi Idiomas",
        Contact = new OpenApiContact
        {
            Name = "Suporte Kengi Idiomas",
            Email = "suporte@kengi-idiomas.com.br"
        }
    });

    // JWT Bearer configuration for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// HttpClient para chamadas externas (Google API)
builder.Services.AddHttpClient();

// Health Checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kengi Idiomas API v1");
        c.RoutePrefix = string.Empty; // Swagger na raiz
    });
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Endpoint de health check
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

// Criar banco de dados se não existir
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<KengiIdiomasContext>();
    try
    {
        context.Database.Migrate();
        Console.WriteLine("✅ Banco de dados migrado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Erro ao migrar banco de dados: {ex.Message}");
    }
}

Console.WriteLine("🚀 Kengi Idiomas API iniciada!");
Console.WriteLine("📖 Swagger disponível em: http://localhost:5000/swagger");
Console.WriteLine("🔗 Health check: http://localhost:5000/health");
Console.WriteLine("💳 Sistema de Pagamentos: ATIVO");

app.Run();
