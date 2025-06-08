namespace KengiIdiomas.Api.Data.Entities;

public class Enrollment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed, Cancelled
    public decimal Progress { get; set; } = 0; // 0-100%

    // Navigation Properties
    public virtual User User { get; set; } = null!;
    public virtual Course Course { get; set; } = null!;
} 