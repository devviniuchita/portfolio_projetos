using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class AlterarSenhaRequest
{
    [Required(ErrorMessage = "Senha atual é obrigatória")]
    public string SenhaAtual { get; set; }
    
    [Required(ErrorMessage = "Nova senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
    public string NovaSenha { get; set; }
    
    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare("NovaSenha", ErrorMessage = "Senhas não conferem")]
    public string ConfirmacaoSenha { get; set; }
}

public class ResetSenhaRequest
{
    [Required(ErrorMessage = "Token é obrigatório")]
    public string Token { get; set; }
    
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "Nova senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
    public string NovaSenha { get; set; }
    
    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare("NovaSenha", ErrorMessage = "Senhas não conferem")]
    public string ConfirmacaoSenha { get; set; }
}

public class AtualizarUsuarioRequest
{
    [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
    public string? Nome { get; set; }
    
    [Phone(ErrorMessage = "Telefone inválido")]
    [StringLength(15, ErrorMessage = "Telefone deve ter no máximo 15 caracteres")]
    public string? Telefone { get; set; }
    
    [StringLength(50, ErrorMessage = "Cidade deve ter no máximo 50 caracteres")]
    public string? Cidade { get; set; }
    
    [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
    public string? Estado { get; set; }
} 