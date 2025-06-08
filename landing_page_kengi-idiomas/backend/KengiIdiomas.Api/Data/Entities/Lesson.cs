using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Lesson
{
    public int Id { get; set; }
    
    [Required]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
    
    public int? BookingId { get; set; }
    public Booking? Booking { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public DateTime ScheduledDate { get; set; }
    
    public TimeSpan Duration { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Scheduled"; // "Scheduled", "InProgress", "Completed", "Cancelled"
    
    [MaxLength(1000)]
    public string? LessonNotes { get; set; }
    
    [MaxLength(1000)]
    public string? StudentNotes { get; set; }
    
    public decimal? StudentGrade { get; set; }
    
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Propriedades calculadas
    public bool IsCompleted => Status == "Completed";
    public bool IsInProgress => Status == "InProgress";
    public bool CanStart => Status == "Scheduled" && ScheduledDate <= DateTime.UtcNow.AddMinutes(15);
    public TimeSpan? ActualDuration => CompletedAt.HasValue && StartedAt.HasValue 
        ? CompletedAt.Value - StartedAt.Value 
        : null;
}
