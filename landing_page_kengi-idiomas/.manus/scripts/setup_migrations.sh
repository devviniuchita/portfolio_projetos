#!/bin/bash

# Script Bash para configurar migrações e aplicar no banco de dados
echo "===== Configurando Migrações EF Core - Kengi Idiomas ====="

# Diretório da API
API_DIR="../../backend/KengiIdiomas.Api"

# Verificar se o diretório existe
if [ ! -d "$API_DIR" ]; then
    echo -e "\e[31m❌ Diretório da API não encontrado em $API_DIR\e[0m"
    exit 1
fi

# Navegar para o diretório da API
cd "$API_DIR" || exit 1
echo -e "\e[36m📂 Navegando para $API_DIR\e[0m"

# Verificar se o dotnet CLI está instalado
if ! command -v dotnet &> /dev/null; then
    echo -e "\e[31m❌ dotnet CLI não está instalado. Por favor, instale o .NET SDK.\e[0m"
    exit 1
fi

dotnet_version=$(dotnet --version)
echo -e "\e[32m✅ dotnet CLI encontrado: $dotnet_version\e[0m"

echo -e "\e[36m🔍 Verificando ferramenta dotnet-ef...\e[0m"
# Instalar a ferramenta dotnet-ef se não estiver instalada
if ! dotnet tool list -g | grep -q "dotnet-ef"; then
    echo -e "\e[33m🔧 Instalando dotnet-ef globalmente...\e[0m"
    dotnet tool install --global dotnet-ef --version 8.0.0
else
    echo -e "\e[32m✅ dotnet-ef já está instalado\e[0m"
fi

echo -e "\e[36m🗑️ Removendo migrações existentes...\e[0m"
if [ -d "Migrations" ]; then
    rm -rf "Migrations"
fi

echo -e "\e[36m🚀 Criando migração inicial...\e[0m"
dotnet ef migrations add InitialCreate -o Migrations -c KengiIdiomasContext

if [ $? -ne 0 ]; then
    echo -e "\e[31m❌ Falha ao criar migração inicial.\e[0m"
    exit 1
fi

echo -e "\e[32m✅ Migração criada com sucesso!\e[0m"

echo -e "\e[36m📦 Aplicando migração ao banco de dados...\e[0m"
dotnet ef database update -c KengiIdiomasContext

if [ $? -ne 0 ]; then
    echo -e "\e[31m❌ Falha ao aplicar migração ao banco de dados.\e[0m"
    exit 1
fi

echo -e "\e[32m✅ Migrações aplicadas com sucesso!\e[0m"
echo -e "\e[32m🎉 Banco de dados pronto para uso!\e[0m" 