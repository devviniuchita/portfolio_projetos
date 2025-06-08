using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.DTOs;

public class CreateBookingRequest
{
    [Required]
    public int ScheduleSlotId { get; set; }
    
    public int? UserId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string StudentName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string StudentEmail { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? StudentPhone { get; set; }
    
    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateBookingRequest
{
    [MaxLength(100)]
    public string? StudentName { get; set; }
    
    [EmailAddress]
    [MaxLength(255)]
    public string? StudentEmail { get; set; }
    
    [MaxLength(20)]
    public string? StudentPhone { get; set; }
    
    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class CancelBookingRequest
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
} 