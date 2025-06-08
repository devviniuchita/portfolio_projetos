using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Services.Interfaces;

namespace KengiIdiomas.Api.Services.Implementations;

public class PagamentoService : IPagamentoService
{
    private readonly KengiIdiomasContext _context;
    private readonly ILogger<PagamentoService> _logger;

    public PagamentoService(KengiIdiomasContext context, ILogger<PagamentoService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PagamentoResponseDto> ProcessarPagamentoAsync(PagamentoCreateDto pagamentoDto)
    {
        return pagamentoDto.MetodoPagamento.ToLower() switch
        {
            "cartao" => await ProcessarPagamentoCartaoAsync(pagamentoDto, 
                JsonSerializer.Deserialize<PagamentoCartaoDto>(pagamentoDto.DadosPagamento?.ToString() ?? "{}")!),
            "pix" => await ProcessarPagamentoPixAsync(pagamentoDto, 
                JsonSerializer.Deserialize<PagamentoPixDto>(pagamentoDto.DadosPagamento?.ToString() ?? "{}")!),
            "boleto" => await ProcessarPagamentoBoletoAsync(pagamentoDto, 
                JsonSerializer.Deserialize<PagamentoBoletoDto>(pagamentoDto.DadosPagamento?.ToString() ?? "{}")!),
            _ => throw new InvalidOperationException("Método de pagamento não suportado")
        };
    }

    public async Task<PagamentoResponseDto> ProcessarPagamentoCartaoAsync(PagamentoCreateDto pagamentoDto, PagamentoCartaoDto cartaoDto)
    {
        try
        {
            // Validar dados do cartão
            if (string.IsNullOrEmpty(cartaoDto.NumeroCartao) || cartaoDto.NumeroCartao.Length < 16)
                throw new InvalidOperationException("Número do cartão inválido");

            if (string.IsNullOrEmpty(cartaoDto.CVV) || cartaoDto.CVV.Length < 3)
                throw new InvalidOperationException("CVV inválido");

            // Criar pedido
            var pedido = await CriarPedidoAsync(pagamentoDto);

            // Simular processamento do gateway (MercadoPago/Stripe)
            var transactionId = $"CARD_{Guid.NewGuid():N}";
            var aprovado = SimularAprovacaoCartao(cartaoDto);

            if (aprovado)
            {
                pedido.Status = "pago";
                pedido.GatewayTransactionId = transactionId;
                pedido.DataPagamento = DateTime.UtcNow;
                pedido.MetodoPagamento = "cartao";

                // Reservar horário se especificado
                if (pagamentoDto.HorarioId.HasValue)
                {
                    await ReservarHorarioAsync(pagamentoDto.HorarioId.Value, pagamentoDto.UsuarioId);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Pagamento com cartão aprovado: {TransactionId}", transactionId);

                return new PagamentoResponseDto
                {
                    PedidoId = pedido.Id,
                    Status = "aprovado",
                    TransactionId = transactionId,
                    DataCriacao = pedido.DataCriacao,
                    Mensagem = "Pagamento aprovado com sucesso!"
                };
            }
            else
            {
                pedido.Status = "cancelado";
                await _context.SaveChangesAsync();

                return new PagamentoResponseDto
                {
                    PedidoId = pedido.Id,
                    Status = "rejeitado",
                    DataCriacao = pedido.DataCriacao,
                    Mensagem = "Pagamento rejeitado. Verifique os dados do cartão."
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar pagamento com cartão");
            throw;
        }
    }

    public async Task<PagamentoResponseDto> ProcessarPagamentoPixAsync(PagamentoCreateDto pagamentoDto, PagamentoPixDto pixDto)
    {
        try
        {
            // Criar pedido
            var pedido = await CriarPedidoAsync(pagamentoDto);

            // Simular geração de QR Code PIX
            var transactionId = $"PIX_{Guid.NewGuid():N}";
            var qrCodePix = GerarQrCodePix(pagamentoDto.Valor, transactionId);

            pedido.Status = "pendente";
            pedido.GatewayTransactionId = transactionId;
            pedido.MetodoPagamento = "pix";

            await _context.SaveChangesAsync();

            _logger.LogInformation("PIX gerado: {TransactionId}", transactionId);

            return new PagamentoResponseDto
            {
                PedidoId = pedido.Id,
                Status = "pendente",
                TransactionId = transactionId,
                QrCodePix = qrCodePix,
                DataCriacao = pedido.DataCriacao,
                Mensagem = "PIX gerado! Escaneie o QR Code para pagar."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar pagamento PIX");
            throw;
        }
    }

    public async Task<PagamentoResponseDto> ProcessarPagamentoBoletoAsync(PagamentoCreateDto pagamentoDto, PagamentoBoletoDto boletoDto)
    {
        try
        {
            // Validar dados do boleto
            if (string.IsNullOrEmpty(boletoDto.CpfPagador))
                throw new InvalidOperationException("CPF é obrigatório para boleto");

            // Criar pedido
            var pedido = await CriarPedidoAsync(pagamentoDto);

            // Simular geração de boleto
            var transactionId = $"BOLETO_{Guid.NewGuid():N}";
            var linkBoleto = GerarLinkBoleto(transactionId);

            pedido.Status = "pendente";
            pedido.GatewayTransactionId = transactionId;
            pedido.MetodoPagamento = "boleto";

            await _context.SaveChangesAsync();

            _logger.LogInformation("Boleto gerado: {TransactionId}", transactionId);

            return new PagamentoResponseDto
            {
                PedidoId = pedido.Id,
                Status = "pendente",
                TransactionId = transactionId,
                LinkBoleto = linkBoleto,
                DataCriacao = pedido.DataCriacao,
                Mensagem = "Boleto gerado! Clique no link para imprimir."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar pagamento boleto");
            throw;
        }
    }

    public async Task<bool> ProcessarWebhookAsync(WebhookPagamentoDto webhookDto)
    {
        try
        {
            var pedido = await _context.Pedidos
                .FirstOrDefaultAsync(p => p.GatewayTransactionId == webhookDto.TransactionId);

            if (pedido == null)
            {
                _logger.LogWarning("Pedido não encontrado para transaction: {TransactionId}", webhookDto.TransactionId);
                return false;
            }

            var statusAnterior = pedido.Status;
            pedido.Status = webhookDto.Status switch
            {
                "approved" => "pago",
                "pending" => "pendente",
                "rejected" => "cancelado",
                _ => pedido.Status
            };

            if (webhookDto.Status == "approved")
            {
                pedido.DataPagamento = webhookDto.DataPagamento;
                
                // Reservar horário se pagamento aprovado
                if (pedido.HorarioId.HasValue)
                {
                    await ReservarHorarioAsync(pedido.HorarioId.Value, pedido.UsuarioId);
                }
            }

            pedido.DataAtualizacao = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Webhook processado: {TransactionId} - {StatusAnterior} -> {StatusNovo}", 
                webhookDto.TransactionId, statusAnterior, pedido.Status);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar webhook: {TransactionId}", webhookDto.TransactionId);
            return false;
        }
    }

    public async Task<PedidoDto?> GetPedidoByIdAsync(int pedidoId)
    {
        var pedido = await _context.Pedidos
            .Include(p => p.Usuario)
            .Include(p => p.Plano)
            .FirstOrDefaultAsync(p => p.Id == pedidoId);

        if (pedido == null) return null;

        return new PedidoDto
        {
            Id = pedido.Id,
            UsuarioId = pedido.UsuarioId,
            UsuarioNome = pedido.Usuario.Nome,
            PlanoId = pedido.PlanoId,
            PlanoNome = pedido.Plano.Nome,
            HorarioId = pedido.HorarioId,
            Valor = pedido.Valor,
            Status = pedido.Status,
            MetodoPagamento = pedido.MetodoPagamento,
            GatewayTransactionId = pedido.GatewayTransactionId,
            DataPagamento = pedido.DataPagamento,
            DataCriacao = pedido.DataCriacao
        };
    }

    public async Task<List<PedidoDto>> GetPedidosByUsuarioAsync(int usuarioId)
    {
        var pedidos = await _context.Pedidos
            .Include(p => p.Usuario)
            .Include(p => p.Plano)
            .Where(p => p.UsuarioId == usuarioId)
            .OrderByDescending(p => p.DataCriacao)
            .ToListAsync();

        return pedidos.Select(p => new PedidoDto
        {
            Id = p.Id,
            UsuarioId = p.UsuarioId,
            UsuarioNome = p.Usuario.Nome,
            PlanoId = p.PlanoId,
            PlanoNome = p.Plano.Nome,
            HorarioId = p.HorarioId,
            Valor = p.Valor,
            Status = p.Status,
            MetodoPagamento = p.MetodoPagamento,
            GatewayTransactionId = p.GatewayTransactionId,
            DataPagamento = p.DataPagamento,
            DataCriacao = p.DataCriacao
        }).ToList();
    }

    public async Task<bool> CancelarPedidoAsync(int pedidoId)
    {
        var pedido = await _context.Pedidos.FindAsync(pedidoId);
        if (pedido == null || pedido.Status == "pago") return false;

        pedido.Status = "cancelado";
        pedido.DataAtualizacao = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ConfirmarPagamentoAsync(string transactionId)
    {
        var pedido = await _context.Pedidos
            .FirstOrDefaultAsync(p => p.GatewayTransactionId == transactionId);

        if (pedido == null) return false;

        pedido.Status = "pago";
        pedido.DataPagamento = DateTime.UtcNow;
        pedido.DataAtualizacao = DateTime.UtcNow;

        if (pedido.HorarioId.HasValue)
        {
            await ReservarHorarioAsync(pedido.HorarioId.Value, pedido.UsuarioId);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<Pedido> CriarPedidoAsync(PagamentoCreateDto pagamentoDto)
    {
        // Validar usuário
        var usuario = await _context.Usuarios.FindAsync(pagamentoDto.UsuarioId);
        if (usuario == null) throw new InvalidOperationException("Usuário não encontrado");

        // Validar plano
        var plano = await _context.Planos.FindAsync(pagamentoDto.PlanoId);
        if (plano == null) throw new InvalidOperationException("Plano não encontrado");

        // Validar horário se especificado
        if (pagamentoDto.HorarioId.HasValue)
        {
            var horario = await _context.HorariosDisponiveis
                .FirstOrDefaultAsync(h => h.Id == pagamentoDto.HorarioId && h.Ativo && !h.Ocupado);
            if (horario == null) throw new InvalidOperationException("Horário não disponível");
        }

        var pedido = new Pedido
        {
            UsuarioId = pagamentoDto.UsuarioId,
            PlanoId = pagamentoDto.PlanoId,
            HorarioId = pagamentoDto.HorarioId,
            Valor = pagamentoDto.Valor,
            Status = "pendente",
            DataCriacao = DateTime.UtcNow,
            DataAtualizacao = DateTime.UtcNow
        };

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();

        return pedido;
    }

    private async Task ReservarHorarioAsync(int horarioId, int usuarioId)
    {
        var horario = await _context.HorariosDisponiveis.FindAsync(horarioId);
        if (horario != null && !horario.Ocupado)
        {
            horario.Ocupado = true;
            horario.UsuarioId = usuarioId;
            horario.DataReserva = DateTime.UtcNow;
        }
    }

    private bool SimularAprovacaoCartao(PagamentoCartaoDto cartaoDto)
    {
        // Simular aprovação baseada no último dígito do cartão
        var ultimoDigito = int.Parse(cartaoDto.NumeroCartao.Last().ToString());
        return ultimoDigito % 2 == 0; // Pares aprovados, ímpares rejeitados
    }

    private string GerarQrCodePix(decimal valor, string transactionId)
    {
        // Simular QR Code PIX
        return $"00020126580014br.gov.bcb.pix0136{transactionId}520400005303986540{valor:F2}5802BR5925KENGI IDIOMAS LTDA6009SAO PAULO62070503***6304";
    }

    private string GerarLinkBoleto(string transactionId)
    {
        // Simular link do boleto
        return $"https://kengi-idiomas.com.br/boleto/{transactionId}";
    }
} 