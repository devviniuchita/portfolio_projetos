#!/bin/bash

# Script Bash para unificar entidades duplicadas
echo "===== Unificando Entidades Duplicadas - Kengi Idiomas ====="

# Diretório da API
API_DIR="../../backend/KengiIdiomas.Api"

# Verificar se o diretório existe
if [ ! -d "$API_DIR" ]; then
    echo -e "\e[31m❌ Diretório da API não encontrado em $API_DIR\e[0m"
    exit 1
fi

# Arquivos a remover
declare -a arquivos_duplicados=(
    "Data/Entities/User.cs"
    "Data/Entities/Schedule.cs"
    "Data/Entities/Booking.cs"
    "Data/Entities/Lesson.cs"
    "Data/Entities/Enrollment.cs"
    "Data/Entities/Course.cs"
    "Data/Entities/Payment.cs"
    "Data/Entities/ScheduleSlot.cs"
    "Controllers/BookingController.cs"
    "Controllers/ScheduleController.cs"
)

# Função para remover arquivo e criar backup
remover_arquivo() {
    local caminho_relativo=$1
    local caminho_completo="$API_DIR/$caminho_relativo"
    
    if [ -f "$caminho_completo" ]; then
        # Criar backup
        local backup_dir="$API_DIR/.manus/backups/$(date +%Y%m%d-%H%M%S)"
        
        if [ ! -d "$backup_dir" ]; then
            mkdir -p "$backup_dir"
        fi
        
        local nome_arquivo=$(basename "$caminho_completo")
        local backup_path="$backup_dir/$nome_arquivo"
        
        cp "$caminho_completo" "$backup_path"
        echo -e "\e[32m📦 Backup criado: $backup_path\e[0m"
        
        # Remover arquivo
        rm -f "$caminho_completo"
        echo -e "\e[33m🗑️ Removido: $caminho_relativo\e[0m"
    else
        echo -e "\e[36m⚠️ Arquivo não encontrado: $caminho_relativo\e[0m"
    fi
}

# Criar diretório de backup principal
backup_principal="$API_DIR/.manus/backups"
if [ ! -d "$backup_principal" ]; then
    mkdir -p "$backup_principal"
fi

# Remover arquivos duplicados
for arquivo in "${arquivos_duplicados[@]}"; do
    remover_arquivo "$arquivo"
done

echo -e "\n\e[32m✅ Unificação de entidades concluída!\e[0m"
echo "📋 Resumo:"
echo "  • Principais entidades mantidas: Usuario.cs, Agenda.cs, Plano.cs, Pedido.cs"
echo "  • Principais controllers mantidos: AgendaController.cs, AuthController.cs, PagamentoController.cs"
echo -e "\n⚠️ IMPORTANTE: É necessário atualizar o KengiIdiomasContext.cs para remover referências às entidades excluídas!" 