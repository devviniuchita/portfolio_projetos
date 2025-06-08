using KengiIdiomas.Api.Data.Entities;

namespace KengiIdiomas.Api.Services.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(Usuario usuario);
    int? ValidateJwtToken(string token);
    string GenerateRefreshToken();
} 