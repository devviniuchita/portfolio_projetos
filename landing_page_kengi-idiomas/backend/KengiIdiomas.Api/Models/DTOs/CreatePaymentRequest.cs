using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.DTOs;

public class CreatePaymentRequest
{
    [Required(ErrorMessage = "ID do usuário é obrigatório")]
    public int UserId { get; set; }

    [Required(ErrorMessage = "ID da reserva é obrigatório")]
    public int BookingId { get; set; }

    [Required(ErrorMessage = "Método de pagamento é obrigatório")]
    [StringLength(20, ErrorMessage = "Método de pagamento deve ter no máximo 20 caracteres")]
    public string PaymentMethod { get; set; } = string.Empty;

    public object? PaymentDetails { get; set; }
}

public class PaymentWebhookRequest
{
    [Required]
    public string TransactionId { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;

    public string? Message { get; set; }
    
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
} 