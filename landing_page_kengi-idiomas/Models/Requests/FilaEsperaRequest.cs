using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class FilaEsperaRequest
{
    [Required(ErrorMessage = "O ID do usuário é obrigatório")]
    public int UsuarioId { get; set; }
    
    [Required(ErrorMessage = "O dia da semana é obrigatório")]
    public string DiaSemana { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O tipo de aula é obrigatório")]
    public string TipoAula { get; set; } = string.Empty;
    
    // Informações adicionais opcionais
    public string? HorarioPreferido { get; set; }
    
    public string? Observacoes { get; set; }
} 