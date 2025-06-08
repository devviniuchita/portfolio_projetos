using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Services.Interfaces;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendaController : ControllerBase
{
    private readonly IAgendaService _agendaService;

    public AgendaController(IAgendaService agendaService)
    {
        _agendaService = agendaService;
    }

    /// <summary>
    /// Buscar todos os horários disponíveis (particular e grupo)
    /// </summary>
    [HttpGet("horarios")]
    public async Task<ActionResult<List<AgendaDisponivelDto>>> GetHorariosDisponiveis()
    {
        try
        {
            var horarios = await _agendaService.GetHorariosDisponiveisAsync();
            return Ok(new { success = true, data = horarios });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Buscar horários disponíveis por tipo (particular ou grupo)
    /// </summary>
    [HttpGet("horarios/{tipo}")]
    public async Task<ActionResult<AgendaDisponivelDto>> GetHorariosByTipo(string tipo)
    {
        try
        {
            if (tipo != "particular" && tipo != "grupo")
            {
                return BadRequest(new { success = false, message = "Tipo deve ser 'particular' ou 'grupo'" });
            }

            var horarios = await _agendaService.GetHorariosDisponiveisByTipoAsync(tipo);
            return Ok(new { success = true, data = horarios });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Buscar horários de um plano específico
    /// </summary>
    [HttpGet("plano/{planoId}/horarios")]
    public async Task<ActionResult<List<HorarioDisponivelDto>>> GetHorariosByPlano(int planoId)
    {
        try
        {
            var horarios = await _agendaService.GetHorariosByPlanoAsync(planoId);
            return Ok(new { success = true, data = horarios });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Reservar um horário (requer autenticação)
    /// </summary>
    [HttpPost("reservar")]
    [Authorize]
    public async Task<ActionResult<HorarioDisponivelDto>> ReservarHorario([FromBody] ReservarHorarioDto reservaDto)
    {
        try
        {
            var horario = await _agendaService.ReservarHorarioAsync(reservaDto);
            return Ok(new { success = true, data = horario, message = "Horário reservado com sucesso" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Adicionar usuário à fila de espera
    /// </summary>
    [HttpPost("fila-espera")]
    [Authorize]
    public async Task<ActionResult<FilaEsperaDto>> AdicionarFilaEspera([FromBody] int horarioId)
    {
        try
        {
            // Pegar ID do usuário do token JWT
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int usuarioId))
            {
                return Unauthorized(new { success = false, message = "Token inválido" });
            }

            var filaEspera = await _agendaService.AdicionarFilaEsperaAsync(horarioId, usuarioId);
            return Ok(new { success = true, data = filaEspera, message = "Adicionado à fila de espera" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Buscar fila de espera de um horário
    /// </summary>
    [HttpGet("horario/{horarioId}/fila-espera")]
    public async Task<ActionResult<List<FilaEsperaDto>>> GetFilaEspera(int horarioId)
    {
        try
        {
            var fila = await _agendaService.GetFilaEsperaByHorarioAsync(horarioId);
            return Ok(new { success = true, data = fila });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Liberar horário (admin)
    /// </summary>
    [HttpPost("liberar/{horarioId}")]
    [Authorize] // TODO: Adicionar role de admin
    public async Task<ActionResult> LiberarHorario(int horarioId)
    {
        try
        {
            var sucesso = await _agendaService.LiberarHorarioAsync(horarioId);
            if (sucesso)
            {
                return Ok(new { success = true, message = "Horário liberado com sucesso" });
            }
            return NotFound(new { success = false, message = "Horário não encontrado" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Criar novos horários (admin)
    /// </summary>
    [HttpPost("horarios")]
    [Authorize] // TODO: Adicionar role de admin
    public async Task<ActionResult<List<HorarioDisponivelDto>>> CreateHorarios([FromBody] List<HorarioDisponivelCreateDto> horariosDto)
    {
        try
        {
            var horarios = await _agendaService.CreateHorariosAsync(horariosDto);
            return Ok(new { success = true, data = horarios, message = "Horários criados com sucesso" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
        }
    }
} 