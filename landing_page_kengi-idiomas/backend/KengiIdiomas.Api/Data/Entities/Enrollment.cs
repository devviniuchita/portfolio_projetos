using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Enrollment
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Required]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active"; // "Active", "Completed", "Cancelled", "Suspended"
    
    public DateTime? CompletionDate { get; set; }
    
    public decimal? FinalGrade { get; set; }
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Propriedades calculadas
    public bool IsActive => Status == "Active";
    public bool IsCompleted => Status == "Completed";
    public TimeSpan Duration => (CompletionDate ?? DateTime.UtcNow) - EnrollmentDate;
}
