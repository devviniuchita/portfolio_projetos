using System.Net;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Models.Requests;
using KengiIdiomas.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Obtém o perfil do usuário logado
    /// </summary>
    /// <returns>Dados do usuário</returns>
    [HttpGet("perfil")]
    [ProducesResponseType(typeof(UsuarioDTO), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> ObterPerfil()
    {
        // Obtém o ID do usuário a partir do token
        var usuarioIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UsuarioId");
        if (usuarioIdClaim == null || !int.TryParse(usuarioIdClaim.Value, out int usuarioId))
        {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        try
        {
            var usuario = await _usuarioService.ObterPorId(usuarioId);
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza dados do perfil do usuário logado
    /// </summary>
    /// <param name="request">Dados a atualizar</param>
    /// <returns>Dados atualizados do usuário</returns>
    [HttpPut("perfil")]
    [ProducesResponseType(typeof(UsuarioDTO), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> AtualizarPerfil(AtualizarUsuarioRequest request)
    {
        // Obtém o ID do usuário a partir do token
        var usuarioIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UsuarioId");
        if (usuarioIdClaim == null || !int.TryParse(usuarioIdClaim.Value, out int usuarioId))
        {
            return Unauthorized(new { mensagem = "Token inválido" });
        }

        try
        {
            var usuario = await _usuarioService.Atualizar(usuarioId, request);
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Lista todos os usuários (Requer perfil de administrador)
    /// </summary>
    /// <returns>Lista de usuários</returns>
    [HttpGet]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(List<UsuarioDTO>), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.Forbidden)]
    public async Task<IActionResult> ListarTodos()
    {
        try
        {
            var usuarios = await _usuarioService.ListarTodos();
            return Ok(usuarios);
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Obtém um usuário pelo ID (Requer perfil de administrador)
    /// </summary>
    /// <param name="id">ID do usuário</param>
    /// <returns>Dados do usuário</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(UsuarioDTO), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    [ProducesResponseType((int)HttpStatusCode.Forbidden)]
    public async Task<IActionResult> ObterPorId(int id)
    {
        try
        {
            var usuario = await _usuarioService.ObterPorId(id);
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }
} 