namespace KengiIdiomas.Api.Data.Entities;

public class Course
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Language { get; set; } = string.Empty; // English, Spanish, French, etc.
    public string Level { get; set; } = string.Empty; // Beginner, Intermediate, Advanced
    public int DurationHours { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? ImageUrl { get; set; }

    // Navigation Properties
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
} 