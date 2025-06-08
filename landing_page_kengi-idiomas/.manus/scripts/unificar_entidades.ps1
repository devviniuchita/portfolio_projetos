# Script PowerShell para unificar entidades duplicadas
Write-Host "===== Unificando Entidades Duplicadas - Kengi Idiomas ====="

# Diretório da API
$API_DIR = "..\..\backend\KengiIdiomas.Api"

# Verificar se o diretório existe
if (-not (Test-Path $API_DIR)) {
    Write-Host "❌ Diretório da API não encontrado em $API_DIR" -ForegroundColor Red
    exit 1
}

# Arquivos a remover
$arquivosDuplicados = @(
    "Data\Entities\User.cs", 
    "Data\Entities\Schedule.cs",
    "Data\Entities\Booking.cs",
    "Data\Entities\Lesson.cs",
    "Data\Entities\Enrollment.cs",
    "Data\Entities\Course.cs",
    "Data\Entities\Payment.cs",
    "Data\Entities\ScheduleSlot.cs",
    "Controllers\BookingController.cs",
    "Controllers\ScheduleController.cs"
)

# Função para remover arquivo e criar backup
function RemoverArquivo($caminhoRelativo) {
    $caminhoCompleto = Join-Path -Path $API_DIR -ChildPath $caminhoRelativo
    
    if (Test-Path $caminhoCompleto) {
        # Criar backup
        $backupDir = Join-Path -Path $API_DIR -ChildPath ".manus\backups\$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        
        if (-not (Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }
        
        $nomeArquivo = Split-Path -Leaf $caminhoCompleto
        $backupPath = Join-Path -Path $backupDir -ChildPath $nomeArquivo
        
        Copy-Item -Path $caminhoCompleto -Destination $backupPath
        Write-Host "📦 Backup criado: $backupPath" -ForegroundColor Green
        
        # Remover arquivo
        Remove-Item -Path $caminhoCompleto -Force
        Write-Host "🗑️ Removido: $caminhoRelativo" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ Arquivo não encontrado: $caminhoRelativo" -ForegroundColor Cyan
    }
}

# Criar diretório de backup principal
$backupPrincipal = Join-Path -Path $API_DIR -ChildPath ".manus\backups"
if (-not (Test-Path $backupPrincipal)) {
    New-Item -ItemType Directory -Path $backupPrincipal -Force | Out-Null
}

# Remover arquivos duplicados
foreach ($arquivo in $arquivosDuplicados) {
    RemoverArquivo $arquivo
}

Write-Host "`n✅ Unificação de entidades concluída!" -ForegroundColor Green
Write-Host "📋 Resumo:"
Write-Host "  • Principais entidades mantidas: Usuario.cs, Agenda.cs, Plano.cs, Pedido.cs"
Write-Host "  • Principais controllers mantidos: AgendaController.cs, AuthController.cs, PagamentoController.cs"
Write-Host "`n⚠️ IMPORTANTE: É necessário atualizar o KengiIdiomasContext.cs para remover referências às entidades excluídas!" 