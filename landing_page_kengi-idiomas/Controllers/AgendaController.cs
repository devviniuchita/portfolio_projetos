using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Models.Requests;
using KengiIdiomas.Api.Models.Responses;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendaController : ControllerBase
{
    // Lista em memória para simular banco de dados (temporário)
    private static readonly List<HorarioDto> _horarios = GerarHorariosIniciais();

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { 
            Message = "AgendaController funcionando!", 
            Timestamp = DateTime.UtcNow,
            HorariosCount = _horarios.Count
        });
    }

    [HttpGet("horarios/{tipo}")]
    public IActionResult GetHorarios(string tipo)
    {
        if (string.IsNullOrEmpty(tipo))
        {
            return BadRequest(new { success = false, message = "Tipo de aula não especificado" });
        }

        // Filtrar horários pelo tipo (group ou private)
        var horariosFiltrados = _horarios.Where(h => h.TipoAula.ToLower() == tipo.ToLower()).ToList();
        
        return Ok(new { success = true, data = horariosFiltrados });
    }
    
    [HttpGet("horarios/{tipo}/{dia}")]
    public IActionResult GetHorariosPorDia(string tipo, string dia)
    {
        if (string.IsNullOrEmpty(tipo) || string.IsNullOrEmpty(dia))
        {
            return BadRequest(new { success = false, message = "Tipo de aula ou dia não especificado" });
        }

        // Filtrar horários pelo tipo e dia
        var horariosFiltrados = _horarios
            .Where(h => h.TipoAula.ToLower() == tipo.ToLower() && 
                        h.DiaSemana.ToLower() == dia.ToLower())
            .ToList();
        
        return Ok(new { success = true, data = horariosFiltrados });
    }

    [HttpGet("disponibilidade")]
    public IActionResult GetDisponibilidade()
    {
        // Agrupar horários disponíveis por dia e tipo
        var disponibilidade = _horarios
            .Where(h => h.Disponivel)
            .GroupBy(h => new { h.DiaSemana, h.TipoAula })
            .Select(g => new
            {
                DiaSemana = g.Key.DiaSemana,
                TipoAula = g.Key.TipoAula,
                QuantidadeHorarios = g.Count()
            })
            .ToList();

        return Ok(new { success = true, data = disponibilidade });
    }
    
    [HttpPost("reservar")]
    [Authorize] // Requer autenticação
    public IActionResult ReservarHorario(ReservaHorarioRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Buscar horário pelo ID
            var horario = _horarios.FirstOrDefault(h => h.Id == request.HorarioId);

            if (horario == null)
            {
                return NotFound(new { success = false, message = "Horário não encontrado" });
            }

            if (!horario.Disponivel)
            {
                return BadRequest(new { success = false, message = "Horário não está disponível" });
            }

            // Reservar o horário (em produção, salvaria no banco)
            horario.Disponivel = false;
            horario.UsuarioId = request.UsuarioId;

            // Em produção, salvaria no banco também a reserva/pagamento

            return Ok(new { 
                success = true, 
                message = "Horário reservado com sucesso",
                horario = horario
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    [HttpPost("fila-espera")]
    [Authorize] // Requer autenticação
    public IActionResult AdicionarFilaEspera(FilaEsperaRequest request)
    {
        try
        {
            // Validar modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Em produção, salvaria no banco de dados
            // Simula adição na fila de espera
            var filaEspera = new FilaEsperaDto
            {
                Id = 1, // Em produção seria auto-incremento
                UsuarioId = request.UsuarioId,
                DiaSemana = request.DiaSemana,
                TipoAula = request.TipoAula,
                DataSolicitacao = DateTime.UtcNow
            };

            return Ok(new { 
                success = true, 
                message = "Adicionado à fila de espera com sucesso",
                filaEspera = filaEspera
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
    
    // Método auxiliar para gerar horários iniciais (simulação)
    private static List<HorarioDto> GerarHorariosIniciais()
    {
        var horarios = new List<HorarioDto>();
        int id = 1;
        
        // Dias da semana
        var diasSemana = new[] { "segunda", "terca", "quarta", "quinta", "sexta", "sabado" };
        
        // Horários para aulas em grupo
        var horariosGrupo = new[] { "09:00-10:00", "14:00-15:00", "18:00-19:00" };
        
        // Horários para aulas particulares
        var horariosParticular = new[] { "10:30-11:30", "15:30-16:30", "19:30-20:30" };

        foreach (var dia in diasSemana)
        {
            // Adicionar horários de grupo
            foreach (var horario in horariosGrupo)
            {
                var partes = horario.Split('-');
                horarios.Add(new HorarioDto
                {
                    Id = id++,
                    DiaSemana = dia,
                    HoraInicio = partes[0],
                    HoraFim = partes[1],
                    TipoAula = "group",
                    Disponivel = true,
                    UsuarioId = null
                });
            }
            
            // Adicionar horários particulares
            foreach (var horario in horariosParticular)
            {
                var partes = horario.Split('-');
                horarios.Add(new HorarioDto
                {
                    Id = id++,
                    DiaSemana = dia,
                    HoraInicio = partes[0],
                    HoraFim = partes[1],
                    TipoAula = "private",
                    Disponivel = true,
                    UsuarioId = null
                });
            }
        }

        // Marcar alguns horários como indisponíveis para simular ocupação
        horarios.Where(h => h.DiaSemana == "segunda" && h.HoraInicio == "09:00").FirstOrDefault().Disponivel = false;
        horarios.Where(h => h.DiaSemana == "terca" && h.HoraInicio == "14:00").FirstOrDefault().Disponivel = false;
        horarios.Where(h => h.DiaSemana == "quarta" && h.HoraInicio == "19:30").FirstOrDefault().Disponivel = false;
        
        return horarios;
    }
} 