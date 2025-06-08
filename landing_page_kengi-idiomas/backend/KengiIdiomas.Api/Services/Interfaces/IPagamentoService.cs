using KengiIdiomas.Api.Models.DTOs;

namespace KengiIdiomas.Api.Services.Interfaces;

public interface IPagamentoService
{
    Task<PagamentoResponseDto> ProcessarPagamentoAsync(PagamentoCreateDto pagamentoDto);
    Task<PagamentoResponseDto> ProcessarPagamentoCartaoAsync(PagamentoCreateDto pagamentoDto, PagamentoCartaoDto cartaoDto);
    Task<PagamentoResponseDto> ProcessarPagamentoPixAsync(PagamentoCreateDto pagamentoDto, PagamentoPixDto pixDto);
    Task<PagamentoResponseDto> ProcessarPagamentoBoletoAsync(PagamentoCreateDto pagamentoDto, PagamentoBoletoDto boletoDto);
    Task<bool> ProcessarWebhookAsync(WebhookPagamentoDto webhookDto);
    Task<PedidoDto?> GetPedidoByIdAsync(int pedidoId);
    Task<List<PedidoDto>> GetPedidosByUsuarioAsync(int usuarioId);
    Task<bool> CancelarPedidoAsync(int pedidoId);
    Task<bool> ConfirmarPagamentoAsync(string transactionId);
} 