using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class RegistroRequest
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
    public string Nome { get; set; }
    
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(255, ErrorMessage = "Email deve ter no máximo 255 caracteres")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
    public string Senha { get; set; }
    
    [Phone(ErrorMessage = "Telefone inválido")]
    [StringLength(15, ErrorMessage = "Telefone deve ter no máximo 15 caracteres")]
    public string? Telefone { get; set; }
    
    [StringLength(50, ErrorMessage = "Cidade deve ter no máximo 50 caracteres")]
    public string? Cidade { get; set; }
    
    [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
    public string? Estado { get; set; }
} 