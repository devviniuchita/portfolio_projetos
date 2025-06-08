# ===== KENGI IDIOMAS API - DOCKERFILE PRODUÇÃO =====
# Multi-stage build para otimização

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos de projeto
COPY ["KengiIdiomas.Api.csproj", "./"]
RUN dotnet restore "KengiIdiomas.Api.csproj"

# Copiar código fonte
COPY . .
RUN dotnet build "KengiIdiomas.Api.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "KengiIdiomas.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 kengigroup
RUN adduser --system --uid 1001 --gid 1001 kengiuser

# Copiar aplicação
COPY --from=publish /app/publish .

# Configurar permissões
RUN chown -R kengiuser:kengigroup /app
USER kengiuser

# Configurar variáveis de ambiente
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_HTTP_PORTS=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expor porta
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["dotnet", "KengiIdiomas.Api.dll"] 