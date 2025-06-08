using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Services.Interfaces;
using KengiIdiomas.Api.Controllers;

namespace KengiIdiomas.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly KengiIdiomasContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(KengiIdiomasContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<UsuarioLoginResponseDto> RegisterAsync(UsuarioCreateDto createDto)
    {
        // Verificar se usuário já existe
        var existingUser = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == createDto.Email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Email já está em uso");
        }

        // Criar novo usuário
        var usuario = new Usuario
        {
            Nome = createDto.Nome,
            Email = createDto.Email,
            SenhaHash = HashPassword(createDto.Senha),
            Telefone = createDto.Telefone,
            DataCriacao = DateTime.UtcNow,
            Ativo = true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        // Gerar token
        var token = GenerateJwtToken(usuario);

        return new UsuarioLoginResponseDto
        {
            Usuario = new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone
            },
            Token = token
        };
    }

    public async Task<UsuarioLoginResponseDto> LoginAsync(UsuarioLoginDto loginDto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.Ativo);

        if (usuario == null || !VerifyPassword(loginDto.Senha, usuario.SenhaHash))
        {
            throw new UnauthorizedAccessException("Email ou senha inválidos");
        }

        var token = GenerateJwtToken(usuario);

        return new UsuarioLoginResponseDto
        {
            Usuario = new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone
            },
            Token = token
        };
    }

    public async Task<UsuarioLoginResponseDto> LoginWithGoogleAsync(string googleToken)
    {
        // Implementação placeholder - será substituída pelos novos métodos
        throw new NotImplementedException("Use LoginGoogleAsync em vez deste método");
    }

    // ===== NOVOS MÉTODOS PARA GOOGLE OAUTH =====

    public async Task<AuthResultDto> RegistrarUsuarioAsync(UsuarioRegistroDto usuarioDto)
    {
        try
        {
            // Verificar se usuário já existe
            var existingUser = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == usuarioDto.Email);

            if (existingUser != null)
            {
                return new AuthResultDto
                {
                    Sucesso = false,
                    Mensagem = "Email já está em uso"
                };
            }

            // Criar novo usuário
            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Email = usuarioDto.Email,
                SenhaHash = HashPassword(usuarioDto.Senha),
                Telefone = usuarioDto.Telefone,
                DataCriacao = DateTime.UtcNow,
                Ativo = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Gerar token
            var token = GenerateJwtToken(usuario);

            return new AuthResultDto
            {
                Sucesso = true,
                Mensagem = "Usuário registrado com sucesso",
                Usuario = new UsuarioDto
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email,
                    Telefone = usuario.Telefone
                },
                Token = token,
                NovoUsuario = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao registrar usuário");
            return new AuthResultDto
            {
                Sucesso = false,
                Mensagem = "Erro interno do servidor"
            };
        }
    }

    public async Task<AuthResultDto> LoginGoogleAsync(GoogleAuthDto googleAuthDto)
    {
        try
        {
            // Verificar se usuário já existe pelo email
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == googleAuthDto.Email && u.Ativo);

            bool novoUsuario = false;

            if (usuario == null)
            {
                // Criar novo usuário a partir dos dados do Google
                var novoUsuarioDto = await CriarUsuarioGoogleAsync(googleAuthDto);
                usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Email == googleAuthDto.Email);
                novoUsuario = true;
            }
            else
            {
                // Atualizar dados do Google se necessário
                if (string.IsNullOrEmpty(usuario.GoogleId))
                {
                    usuario.GoogleId = googleAuthDto.GoogleId;
                    usuario.FotoPerfil = googleAuthDto.Foto;
                    await _context.SaveChangesAsync();
                }
            }

            if (usuario == null)
            {
                return new AuthResultDto
                {
                    Sucesso = false,
                    Mensagem = "Erro ao criar/encontrar usuário"
                };
            }

            // Gerar token
            var token = GenerateJwtToken(usuario);

            return new AuthResultDto
            {
                Sucesso = true,
                Mensagem = novoUsuario ? "Conta criada com Google" : "Login com Google realizado",
                Usuario = new UsuarioDto
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email,
                    Telefone = usuario.Telefone
                },
                Token = token,
                NovoUsuario = novoUsuario
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro na autenticação Google");
            return new AuthResultDto
            {
                Sucesso = false,
                Mensagem = "Erro na autenticação Google"
            };
        }
    }

    public async Task<UsuarioDto> CriarUsuarioGoogleAsync(GoogleAuthDto googleAuthDto)
    {
        try
        {
            var usuario = new Usuario
            {
                Nome = googleAuthDto.Nome,
                Email = googleAuthDto.Email,
                GoogleId = googleAuthDto.GoogleId,
                FotoPerfil = googleAuthDto.Foto,
                EmailVerificado = googleAuthDto.EmailVerificado,
                SenhaHash = string.Empty, // Usuários Google não precisam de senha local
                DataCriacao = DateTime.UtcNow,
                Ativo = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar usuário Google");
            throw;
        }
    }

    public async Task<UsuarioDto> ObterUsuarioPorIdAsync(int id)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id && u.Ativo);

        if (usuario == null)
            return null;

        return new UsuarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone
        };
    }

    public async Task<UsuarioDto> ObterUsuarioPorEmailAsync(string email)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email && u.Ativo);

        if (usuario == null)
            return null;

        return new UsuarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone
        };
    }

    // ===== MÉTODOS AUXILIARES =====

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrEmpty(hash))
            return false;
        
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    private string GenerateJwtToken(Usuario usuario)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"] ?? "kengi-idiomas-secret-key-2024");

        var claims = new[]
        {
            new Claim("id", usuario.Id.ToString()),
            new Claim("email", usuario.Email),
            new Claim("name", usuario.Nome),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
} 