using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Payment
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int? BookingId { get; set; }
    public Booking? Booking { get; set; }
    
    [Required]
    public decimal Amount { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty; // "Credit", "Debit", "Pix", "Boleto"
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // "Pending", "Completed", "Failed", "Refunded"
    
    [MaxLength(100)]
    public string? TransactionId { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Informações específicas do método de pagamento
    public string? PaymentDetails { get; set; } // JSON com detalhes específicos
    public DateTime? DueDate { get; set; } // Para boletos
    public string? PixKey { get; set; } // Para PIX
    
    // Propriedades calculadas
    public bool IsCompleted => Status == "Completed";
    public bool IsPending => Status == "Pending";
    public bool CanBeRefunded => IsCompleted && PaymentDate > DateTime.UtcNow.AddDays(-30);
}
