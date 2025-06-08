using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class RegisterRequest
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
    [StringLength(255, ErrorMessage = "Email deve ter no máximo 255 caracteres")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Telefone deve ter um formato válido")]
    public string? Phone { get; set; }
} 