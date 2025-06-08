using KengiIdiomas.Api.Models.DTOs;

namespace KengiIdiomas.Api.Models.Responses;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new UserDto();
    public DateTime ExpiresAt { get; set; }
} 