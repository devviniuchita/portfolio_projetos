using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Data.Entities;

public class ScheduleSlot
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
    [MaxLength(20)]
    public string TimeSlot { get; set; } = string.Empty; // "11:00-12:00"
    
    public bool IsAvailable { get; set; } = true;
    
    [Required]
    public decimal Price { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Propriedade calculada para exibição
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
    
    // Propriedade calculada para identificação única
    public string UniqueIdentifier => $"{CourseType}-{PlanType}-{DayOfWeek}-{TimeSlot}";
} 