# Script PowerShell para configurar migrações e aplicar no banco de dados
Write-Host "===== Configurando Migrações EF Core - Kengi Idiomas ====="

# Diretório da API
$API_DIR = "..\..\backend\KengiIdiomas.Api"

# Verificar se o diretório existe
if (-not (Test-Path $API_DIR)) {
    Write-Host "❌ Diretório da API não encontrado em $API_DIR" -ForegroundColor Red
    exit 1
}

# Navegar para o diretório da API
Set-Location -Path $API_DIR
Write-Host "📂 Navegando para $API_DIR" -ForegroundColor Cyan

# Verificar se o dotnet CLI está instalado
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ dotnet CLI encontrado: $dotnetVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ dotnet CLI não está instalado. Por favor, instale o .NET SDK." -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Verificando ferramenta dotnet-ef..." -ForegroundColor Cyan
# Instalar a ferramenta dotnet-ef se não estiver instalada
$efInstalled = dotnet tool list -g | Select-String "dotnet-ef"
if (-not $efInstalled) {
    Write-Host "🔧 Instalando dotnet-ef globalmente..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef --version 8.0.0
}
else {
    Write-Host "✅ dotnet-ef já está instalado" -ForegroundColor Green
}

Write-Host "🗑️ Removendo migrações existentes..." -ForegroundColor Cyan
if (Test-Path "Migrations") {
    Remove-Item -Recurse -Force "Migrations"
}

Write-Host "🚀 Criando migração inicial..." -ForegroundColor Cyan
dotnet ef migrations add InitialCreate -o Migrations -c KengiIdiomasContext

if (-not $?) {
    Write-Host "❌ Falha ao criar migração inicial." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migração criada com sucesso!" -ForegroundColor Green

Write-Host "📦 Aplicando migração ao banco de dados..." -ForegroundColor Cyan
dotnet ef database update -c KengiIdiomasContext

if (-not $?) {
    Write-Host "❌ Falha ao aplicar migração ao banco de dados." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migrações aplicadas com sucesso!" -ForegroundColor Green
Write-Host "🎉 Banco de dados pronto para uso!" -ForegroundColor Green 