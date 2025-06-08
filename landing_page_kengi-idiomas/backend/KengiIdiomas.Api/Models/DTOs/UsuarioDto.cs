namespace KengiIdiomas.Api.Models.DTOs;

public class UsuarioDTO
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string? Telefone { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public string Perfil { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? UltimoLogin { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
}

public class UsuarioCreateDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public DateTime? DataNascimento { get; set; }
}

public class UsuarioLoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
}

public class UsuarioLoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UsuarioDTO Usuario { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
} 