using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using KengiIdiomas.Api.Models.Requests;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { 
            Message = "PaymentController funcionando!", 
            Timestamp = DateTime.UtcNow
        });
    }

    [HttpPost("processar")]
    [Authorize] // Requer autenticação
    public IActionResult ProcessarPagamento(PagamentoRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Em produção, processaria pagamento com gateway real
            // Aqui apenas simulamos o sucesso
            
            var paymentId = $"pay_{DateTime.UtcNow.Ticks}";
            
            return Ok(new { 
                success = true, 
                message = "Pagamento processado com sucesso",
                paymentId = paymentId,
                amount = request.Valor,
                paymentMethod = request.MetodoPagamento,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    [HttpPost("cartao")]
    [Authorize]
    public IActionResult ProcessarPagamentoCartao(PagamentoCartaoRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Em produção, processaria pagamento com gateway real
            // Aqui apenas simulamos o sucesso
            
            var paymentId = $"card_{DateTime.UtcNow.Ticks}";
            
            return Ok(new { 
                success = true, 
                message = "Pagamento com cartão processado com sucesso",
                paymentId = paymentId,
                amount = request.Valor,
                installments = request.Parcelas,
                cardLastDigits = request.NumeroCartao.Substring(request.NumeroCartao.Length - 4),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    [HttpPost("pix")]
    [Authorize]
    public IActionResult ProcessarPagamentoPix(PagamentoPixRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Em produção, geraria QR code real com gateway
            // Aqui apenas simulamos
            
            var paymentId = $"pix_{DateTime.UtcNow.Ticks}";
            var pixKey = "kengi@exemplo.com";
            var qrCode = "00020101021226880014BR.GOV.BCB.PIX0136kengi@exemplo.com5204000053039865802BR5913Kengi Idiomas6008Sao Paulo62090505123456304E2CA";
            
            return Ok(new { 
                success = true, 
                message = "Pagamento PIX gerado com sucesso",
                paymentId = paymentId,
                amount = request.Valor,
                pixKey = pixKey,
                qrCode = qrCode,
                expiresAt = DateTime.UtcNow.AddHours(1),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    [HttpPost("boleto")]
    [Authorize]
    public IActionResult ProcessarPagamentoBoleto(PagamentoBoletoRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Em produção, geraria boleto real com gateway
            // Aqui apenas simulamos
            
            var paymentId = $"boleto_{DateTime.UtcNow.Ticks}";
            var boletoCode = "34191.79001 01043.510047 91020.150008 9 89020000029999";
            var boletoUrl = $"https://api.kengi-idiomas.com/boletos/{paymentId}";
            
            return Ok(new { 
                success = true, 
                message = "Boleto gerado com sucesso",
                paymentId = paymentId,
                amount = request.Valor,
                boletoCode = boletoCode,
                boletoUrl = boletoUrl,
                dueDate = DateTime.UtcNow.AddDays(3).Date.ToString("yyyy-MM-dd"),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    [HttpGet("status/{paymentId}")]
    [Authorize]
    public IActionResult ConsultarStatusPagamento(string paymentId)
    {
        try
        {
            // Em produção, consultaria status real no gateway
            // Aqui simulamos com base no ID
            
            string status = "pending";
            if (paymentId.StartsWith("pix_"))
            {
                status = "paid"; // Simulamos PIX como pago
            }
            else if (paymentId.StartsWith("card_"))
            {
                status = "paid"; // Cartão geralmente aprovado na hora
            }
            else if (paymentId.StartsWith("boleto_"))
            {
                // Boleto depende do tempo desde a geração
                var paymentTime = new DateTime(long.Parse(paymentId.Split('_')[1]));
                status = (DateTime.UtcNow - paymentTime).TotalMinutes > 5 ? "paid" : "pending";
            }
            
            return Ok(new { 
                success = true, 
                paymentId = paymentId,
                status = status,
                updatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
} 