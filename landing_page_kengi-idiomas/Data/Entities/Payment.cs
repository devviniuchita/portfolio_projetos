namespace KengiIdiomas.Api.Data.Entities;

public class Payment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded
    public string PaymentMethod { get; set; } = string.Empty; // Credit Card, PIX, Boleto
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }

    // Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Course Course { get; set; } = null!;
} 