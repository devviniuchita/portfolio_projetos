using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Services.Interfaces;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagamentoController : ControllerBase
{
    private readonly IPagamentoService _pagamentoService;

    public PagamentoController(IPagamentoService pagamentoService)
    {
        _pagamentoService = pagamentoService;
    }

    /// <summary>
    /// Processar pagamento (cartão, PIX ou boleto)
    /// </summary>
    [HttpPost("processar")]
    [Authorize]
    public async Task<ActionResult<PagamentoResponseDto>> ProcessarPagamento([FromBody] PagamentoCreateDto pagamentoDto)
    {
        try
        {
            var resultado = await _pagamentoService.ProcessarPagamentoAsync(pagamentoDto);
            return Ok(new { success = true, data = resultado });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Processar pagamento com cartão de crédito
    /// </summary>
    [HttpPost("cartao")]
    [Authorize]
    public async Task<ActionResult<PagamentoResponseDto>> ProcessarPagamentoCartao([FromBody] PagamentoCreateDto pagamentoDto)
    {
        try
        {
            if (pagamentoDto.DadosPagamento == null)
                return BadRequest(new { success = false, message = "Dados do cartão são obrigatórios" });

            var cartaoDto = System.Text.Json.JsonSerializer.Deserialize<PagamentoCartaoDto>(pagamentoDto.DadosPagamento.ToString()!);
            var resultado = await _pagamentoService.ProcessarPagamentoCartaoAsync(pagamentoDto, cartaoDto!);
            
            return Ok(new { success = true, data = resultado });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Processar pagamento PIX
    /// </summary>
    [HttpPost("pix")]
    [Authorize]
    public async Task<ActionResult<PagamentoResponseDto>> ProcessarPagamentoPix([FromBody] PagamentoCreateDto pagamentoDto)
    {
        try
        {
            var pixDto = pagamentoDto.DadosPagamento != null 
                ? System.Text.Json.JsonSerializer.Deserialize<PagamentoPixDto>(pagamentoDto.DadosPagamento.ToString()!)
                : new PagamentoPixDto();

            var resultado = await _pagamentoService.ProcessarPagamentoPixAsync(pagamentoDto, pixDto!);
            return Ok(new { success = true, data = resultado });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Processar pagamento boleto
    /// </summary>
    [HttpPost("boleto")]
    [Authorize]
    public async Task<ActionResult<PagamentoResponseDto>> ProcessarPagamentoBoleto([FromBody] PagamentoCreateDto pagamentoDto)
    {
        try
        {
            if (pagamentoDto.DadosPagamento == null)
                return BadRequest(new { success = false, message = "Dados do boleto são obrigatórios" });

            var boletoDto = System.Text.Json.JsonSerializer.Deserialize<PagamentoBoletoDto>(pagamentoDto.DadosPagamento.ToString()!);
            var resultado = await _pagamentoService.ProcessarPagamentoBoletoAsync(pagamentoDto, boletoDto!);
            
            return Ok(new { success = true, data = resultado });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Webhook para receber notificações de pagamento
    /// </summary>
    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessarWebhook([FromBody] WebhookPagamentoDto webhookDto)
    {
        try
        {
            var sucesso = await _pagamentoService.ProcessarWebhookAsync(webhookDto);
            if (sucesso)
            {
                return Ok(new { success = true, message = "Webhook processado com sucesso" });
            }
            return BadRequest(new { success = false, message = "Erro ao processar webhook" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Buscar pedido por ID
    /// </summary>
    [HttpGet("pedido/{pedidoId}")]
    [Authorize]
    public async Task<ActionResult<PedidoDto>> GetPedido(int pedidoId)
    {
        try
        {
            var pedido = await _pagamentoService.GetPedidoByIdAsync(pedidoId);
            if (pedido == null)
                return NotFound(new { success = false, message = "Pedido não encontrado" });

            return Ok(new { success = true, data = pedido });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Buscar pedidos do usuário logado
    /// </summary>
    [HttpGet("meus-pedidos")]
    [Authorize]
    public async Task<ActionResult<List<PedidoDto>>> GetMeusPedidos()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int usuarioId))
            {
                return Unauthorized(new { success = false, message = "Token inválido" });
            }

            var pedidos = await _pagamentoService.GetPedidosByUsuarioAsync(usuarioId);
            return Ok(new { success = true, data = pedidos });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Cancelar pedido
    /// </summary>
    [HttpPost("cancelar/{pedidoId}")]
    [Authorize]
    public async Task<IActionResult> CancelarPedido(int pedidoId)
    {
        try
        {
            var sucesso = await _pagamentoService.CancelarPedidoAsync(pedidoId);
            if (sucesso)
            {
                return Ok(new { success = true, message = "Pedido cancelado com sucesso" });
            }
            return BadRequest(new { success = false, message = "Não foi possível cancelar o pedido" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Confirmar pagamento manualmente (admin/teste)
    /// </summary>
    [HttpPost("confirmar/{transactionId}")]
    [Authorize] // TODO: Adicionar role de admin
    public async Task<IActionResult> ConfirmarPagamento(string transactionId)
    {
        try
        {
            var sucesso = await _pagamentoService.ConfirmarPagamentoAsync(transactionId);
            if (sucesso)
            {
                return Ok(new { success = true, message = "Pagamento confirmado com sucesso" });
            }
            return NotFound(new { success = false, message = "Transaction não encontrada" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Endpoint de teste para simular pagamento
    /// </summary>
    [HttpPost("teste/simular")]
    [Authorize]
    public async Task<ActionResult<PagamentoResponseDto>> SimularPagamento([FromBody] PagamentoCreateDto pagamentoDto)
    {
        try
        {
            // Forçar aprovação para teste
            pagamentoDto.MetodoPagamento = "cartao";
            pagamentoDto.DadosPagamento = new PagamentoCartaoDto
            {
                NumeroCartao = "4111111111111112", // Número par = aprovado
                NomePortador = "TESTE USUARIO",
                ValidadeCartao = "12/28",
                CVV = "123",
                Parcelas = 1
            };

            var resultado = await _pagamentoService.ProcessarPagamentoAsync(pagamentoDto);
            return Ok(new { success = true, data = resultado, message = "Pagamento de teste processado" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }
} 