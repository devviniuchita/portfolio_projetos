using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Course
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public decimal Price { get; set; }
    
    [MaxLength(50)]
    public string CourseType { get; set; } = string.Empty; // "Particular", "Grupo"
    
    [MaxLength(50)]
    public string Level { get; set; } = string.Empty; // "Básico", "Intermediário", "Avançado"
    
    public int DurationInHours { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
