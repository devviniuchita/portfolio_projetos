using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Models.Requests;
using KengiIdiomas.Api.Models.Responses;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    
    // Lista em memória para simular banco de dados
    private static readonly List<UserDto> _users = new();

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar se o email já existe
            if (_users.Any(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email já está em uso" });
            }

            // Criar novo usuário
            var user = new UserDto
            {
                Id = _users.Count + 1,
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _users.Add(user);

            // Gerar token JWT
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(1);

            return Ok(new AuthResponse
            {
                Token = token,
                User = user,
                ExpiresAt = expiresAt
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Buscar usuário por email (simulação)
            var user = _users.FirstOrDefault(u => u.Email == request.Email && u.IsActive);

            if (user == null)
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            // Para teste, aceitar qualquer senha
            // Em produção, verificar hash da senha

            // Gerar token JWT
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(1);

            return Ok(new AuthResponse
            {
                Token = token,
                User = user,
                ExpiresAt = expiresAt
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { 
            Message = "AuthController funcionando!", 
            Timestamp = DateTime.UtcNow,
            UsersCount = _users.Count,
            Users = _users
        });
    }

    private string GenerateJwtToken(UserDto user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "kengi-idiomas-super-secret-key-2024-very-secure";
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "KengiIdiomas";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "KengiIdiomasUsers";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "kengi-salt"));
        return Convert.ToBase64String(hashedBytes);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        var passwordHash = HashPassword(password);
        return passwordHash == hash;
    }
} 