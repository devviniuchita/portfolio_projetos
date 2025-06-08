using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class ReservaHorarioRequest
{
    [Required(ErrorMessage = "O ID do horário é obrigatório")]
    public int HorarioId { get; set; }
    
    [Required(ErrorMessage = "O ID do usuário é obrigatório")]
    public int UsuarioId { get; set; }
    
    [Required(ErrorMessage = "O ID do plano é obrigatório")]
    public int PlanoId { get; set; }
    
    // Dados adicionais opcionais
    public string? Observacoes { get; set; }
} 