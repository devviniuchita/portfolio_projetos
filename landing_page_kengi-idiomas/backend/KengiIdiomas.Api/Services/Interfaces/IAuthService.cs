using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Controllers;

namespace KengiIdiomas.Api.Services.Interfaces;

public interface IAuthService
{
    Task<UsuarioLoginResponseDto> LoginAsync(UsuarioLoginDto loginDto);
    Task<UsuarioDto> RegisterAsync(UsuarioCreateDto createDto);
    Task<UsuarioLoginResponseDto> LoginWithGoogleAsync(string googleToken);
    string GenerateJwtToken(int userId, string email);
    bool VerifyPassword(string password, string hash);
    string HashPassword(string password);

    // Novos métodos para Google OAuth
    Task<AuthResultDto> RegistrarUsuarioAsync(UsuarioRegistroDto usuarioDto);
    Task<AuthResultDto> LoginGoogleAsync(GoogleAuthDto googleAuthDto);
    Task<UsuarioDto> ObterUsuarioPorIdAsync(int id);
    Task<UsuarioDto> ObterUsuarioPorEmailAsync(string email);
    Task<UsuarioDto> CriarUsuarioGoogleAsync(GoogleAuthDto googleAuthDto);
}

// DTO para resultado de autenticação
public class AuthResultDto
{
    public bool Sucesso { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public UsuarioDto? Usuario { get; set; }
    public string? Token { get; set; }
    public bool NovoUsuario { get; set; }
}

// DTO para registro de usuário
public class UsuarioRegistroDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string? Telefone { get; set; }
} 