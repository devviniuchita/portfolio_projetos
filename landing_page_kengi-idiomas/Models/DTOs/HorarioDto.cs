namespace KengiIdiomas.Api.Models.DTOs;

public class HorarioDto
{
    public int Id { get; set; }
    public string DiaSemana { get; set; } = string.Empty; // segunda, terca, etc.
    public string HoraInicio { get; set; } = string.Empty; // "09:00"
    public string HoraFim { get; set; } = string.Empty;    // "10:00" 
    public string TipoAula { get; set; } = string.Empty;   // "group" ou "private"
    public bool Disponivel { get; set; }   // true/false
    public int? UsuarioId { get; set; }    // null = disponível
} 