using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class Schedule
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string CourseType { get; set; } = string.Empty; // "Particular" ou "Grupo"
    
    [Required]
    [MaxLength(50)]
    public string PlanType { get; set; } = string.Empty; // "Mensal", "Semestral", "Anual"
    
    [Required]
    public int DayOfWeek { get; set; } // 1-7 (Segunda a Domingo)
    
    [Required]
    public TimeSpan StartTime { get; set; }
    
    [Required]
    public TimeSpan EndTime { get; set; }
    
    public bool IsAvailable { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Propriedades calculadas
    public string DayName => DayOfWeek switch
    {
        1 => "Segunda-feira",
        2 => "Terça-feira", 
        3 => "Quarta-feira",
        4 => "Quinta-feira",
        5 => "Sexta-feira",
        6 => "Sábado",
        7 => "Domingo",
        _ => "Inválido"
    };
    
    public string TimeRange => $"{StartTime:hh\\:mm}-{EndTime:hh\\:mm}";
    
    public TimeSpan Duration => EndTime - StartTime;
} 