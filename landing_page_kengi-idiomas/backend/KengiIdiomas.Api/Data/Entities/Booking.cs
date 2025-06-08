using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Booking
{
    public int Id { get; set; }
    
    [Required]
    public int ScheduleSlotId { get; set; }
    public ScheduleSlot ScheduleSlot { get; set; } = null!;
    
    public int? UserId { get; set; }
    public User? User { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string StudentName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string StudentEmail { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? StudentPhone { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // "Pending", "Confirmed", "Cancelled", "Completed"
    
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Informações adicionais
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAt { get; set; }
    
    // Propriedades calculadas
    public bool IsActive => Status == "Pending" || Status == "Confirmed";
    public bool CanBeCancelled => IsActive && BookingDate > DateTime.UtcNow.AddHours(24);
} 