using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using KengiIdiomas.Api.Services.Interfaces;
using KengiIdiomas.Api.Models.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Text.Json;
using System.Net;
using KengiIdiomas.Api.Models.Requests;

namespace KengiIdiomas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<AuthController> _logger;
        private readonly IUsuarioService _usuarioService;

        public AuthController(IAuthService authService, IHttpClientFactory httpClientFactory, ILogger<AuthController> logger, IUsuarioService usuarioService)
        {
            _authService = authService;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Registrar novo usuário
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsuarioRegistroDto usuarioDto)
        {
            try
            {
                var resultado = await _authService.RegistrarUsuarioAsync(usuarioDto);
                
                if (resultado.Sucesso)
                {
                    return Ok(new { 
                        success = true, 
                        message = "Usuário registrado com sucesso!",
                        user = resultado.Usuario,
                        token = resultado.Token
                    });
                }
                
                return BadRequest(new { 
                    success = false, 
                    message = resultado.Mensagem 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao registrar usuário");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Erro interno do servidor" 
                });
            }
        }

        /// <summary>
        /// Login do usuário
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(UsuarioDTO), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                var resultado = await _usuarioService.Autenticar(request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { mensagem = ex.Message });
            }
        }

        /// <summary>
        /// Login com Google OAuth2 (futuro)
        /// </summary>
        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthDto googleAuthDto)
        {
            try
            {
                _logger.LogInformation("Iniciando autenticação Google para email: {Email}", googleAuthDto.Email);

                // Verificar se o token Google é válido
                var isValidToken = await VerifyGoogleTokenAsync(googleAuthDto.GoogleId, googleAuthDto.Email);
                
                if (!isValidToken)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Token Google inválido" 
                    });
                }

                // Processar autenticação Google
                var resultado = await _authService.LoginGoogleAsync(googleAuthDto);
                
                if (resultado.Sucesso)
                {
                    return Ok(new { 
                        success = true, 
                        message = "Autenticação Google realizada com sucesso!",
                        user = resultado.Usuario,
                        token = resultado.Token,
                        isNewUser = resultado.NovoUsuario
                    });
                }
                
                return BadRequest(new { 
                    success = false, 
                    message = resultado.Mensagem 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro na autenticação Google");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Erro interno do servidor" 
                });
            }
        }

        [HttpPost("google/callback")]
        public async Task<IActionResult> GoogleCallback([FromBody] GoogleCallbackDto callbackDto)
        {
            try
            {
                _logger.LogInformation("Processando callback Google com código: {Code}", callbackDto.Code?.Substring(0, 10) + "...");

                // Trocar código por token de acesso
                var tokenResponse = await ExchangeCodeForTokenAsync(callbackDto.Code);
                
                if (tokenResponse == null)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Erro ao trocar código por token" 
                    });
                }

                // Obter informações do usuário do Google
                var userInfo = await GetGoogleUserInfoAsync(tokenResponse.AccessToken);
                
                if (userInfo == null)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Erro ao obter informações do usuário" 
                    });
                }

                // Criar DTO para autenticação
                var googleAuthDto = new GoogleAuthDto
                {
                    GoogleId = userInfo.Id,
                    Email = userInfo.Email,
                    Nome = userInfo.Name,
                    Foto = userInfo.Picture,
                    EmailVerificado = userInfo.EmailVerified,
                    Provider = "google"
                };

                // Processar autenticação
                var resultado = await _authService.LoginGoogleAsync(googleAuthDto);
                
                if (resultado.Sucesso)
                {
                    return Ok(new { 
                        success = true, 
                        message = "Autenticação Google realizada com sucesso!",
                        user = resultado.Usuario,
                        token = resultado.Token,
                        isNewUser = resultado.NovoUsuario
                    });
                }
                
                return BadRequest(new { 
                    success = false, 
                    message = resultado.Mensagem 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no callback Google");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Erro interno do servidor" 
                });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { 
                        success = false, 
                        message = "Token inválido" 
                    });
                }

                var usuario = await _authService.ObterUsuarioPorIdAsync(int.Parse(userId));
                
                if (usuario == null)
                {
                    return NotFound(new { 
                        success = false, 
                        message = "Usuário não encontrado" 
                    });
                }

                return Ok(new { 
                    success = true, 
                    user = usuario 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter usuário atual");
                return StatusCode(500, new { 
                    success = false, 
                    message = "Erro interno do servidor" 
                });
            }
        }

        /// <summary>
        /// Realiza o registro de um novo usuário
        /// </summary>
        /// <param name="request">Dados do novo usuário</param>
        /// <returns>Dados do usuário registrado com token JWT</returns>
        [HttpPost("registrar")]
        [ProducesResponseType(typeof(UsuarioDTO), (int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> Registrar(RegistroRequest request)
        {
            try
            {
                var resultado = await _usuarioService.Registrar(request);
                return Created($"/api/usuarios/{resultado.Id}", resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        /// <summary>
        /// Solicita o reset de senha de um usuário
        /// </summary>
        /// <param name="email">Email do usuário</param>
        /// <returns>Confirmação de solicitação</returns>
        [HttpPost("solicitar-reset-senha")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> SolicitarResetSenha([FromBody] string email)
        {
            await _usuarioService.SolicitarResetSenha(email);
            return Ok(new { mensagem = "Se o email existir, você receberá instruções para resetar sua senha." });
        }

        /// <summary>
        /// Realiza o reset de senha de um usuário
        /// </summary>
        /// <param name="request">Dados do reset de senha</param>
        /// <returns>Confirmação de reset</returns>
        [HttpPost("resetar-senha")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ResetarSenha(ResetSenhaRequest request)
        {
            try
            {
                var resultado = await _usuarioService.ResetarSenha(request);
                return Ok(new { mensagem = "Senha alterada com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        /// <summary>
        /// Altera a senha de um usuário
        /// </summary>
        /// <param name="request">Dados da alteração de senha</param>
        /// <returns>Confirmação de alteração</returns>
        [Authorize]
        [HttpPost("alterar-senha")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        public async Task<IActionResult> AlterarSenha(AlterarSenhaRequest request)
        {
            try
            {
                // Obtém o ID do usuário a partir do token
                var usuarioIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UsuarioId");
                if (usuarioIdClaim == null || !int.TryParse(usuarioIdClaim.Value, out int usuarioId))
                {
                    return Unauthorized(new { mensagem = "Token inválido" });
                }

                var resultado = await _usuarioService.AlterarSenha(usuarioId, request);
                return Ok(new { mensagem = "Senha alterada com sucesso" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
        }

        // ===== MÉTODOS PRIVADOS PARA GOOGLE OAUTH =====

        private async Task<bool> VerifyGoogleTokenAsync(string googleId, string email)
        {
            try
            {
                // Em produção, verificar o token com a API do Google
                // Por enquanto, simular verificação básica
                return !string.IsNullOrEmpty(googleId) && !string.IsNullOrEmpty(email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao verificar token Google");
                return false;
            }
        }

        private async Task<GoogleTokenResponse> ExchangeCodeForTokenAsync(string code)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                
                var tokenRequest = new Dictionary<string, string>
                {
                    {"code", code},
                    {"client_id", "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"},
                    {"client_secret", "YOUR_GOOGLE_CLIENT_SECRET"},
                    {"redirect_uri", "http://localhost:3000/pagamento.html"},
                    {"grant_type", "authorization_code"}
                };

                var content = new FormUrlEncodedContent(tokenRequest);
                var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<GoogleTokenResponse>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
                    });
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao trocar código por token");
                return null;
            }
        }

        private async Task<GoogleUserInfo> GetGoogleUserInfoAsync(string accessToken)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                
                var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<GoogleUserInfo>(jsonResponse, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
                    });
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter informações do usuário Google");
                return null;
            }
        }
    }

    // ===== DTOs PARA GOOGLE OAUTH =====

    public class GoogleAuthDto
    {
        [Required]
        public string GoogleId { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Nome { get; set; } = string.Empty;
        
        public string? Foto { get; set; }
        
        public bool EmailVerificado { get; set; }
        
        public string Provider { get; set; } = "google";
    }

    public class GoogleCallbackDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;
    }

    public class GoogleTokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public string TokenType { get; set; } = string.Empty;
    }

    public class GoogleUserInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public bool EmailVerified { get; set; }
    }
}
