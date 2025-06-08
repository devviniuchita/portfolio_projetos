namespace KengiIdiomas.Api.Data.Entities;

public class Lesson
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Order { get; set; }
    public int DurationMinutes { get; set; }
    public string? VideoUrl { get; set; }
    public string? AudioUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    public virtual Course Course { get; set; } = null!;
} 