using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using Microsoft.AspNetCore.Authorization;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly KengiIdiomasDbContext _context;

    public ScheduleController(KengiIdiomasDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Busca horários disponíveis por tipo de curso e plano
    /// </summary>
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<ScheduleSlot>>> GetAvailableSlots(
        [FromQuery] string? courseType = null,
        [FromQuery] string? planType = null,
        [FromQuery] int? dayOfWeek = null)
    {
        try
        {
            var query = _context.ScheduleSlots.Where(s => s.IsAvailable);

            if (!string.IsNullOrEmpty(courseType))
                query = query.Where(s => s.CourseType == courseType);

            if (!string.IsNullOrEmpty(planType))
                query = query.Where(s => s.PlanType == planType);

            if (dayOfWeek.HasValue)
                query = query.Where(s => s.DayOfWeek == dayOfWeek.Value);

            var slots = await query
                .OrderBy(s => s.DayOfWeek)
                .ThenBy(s => s.TimeSlot)
                .ToListAsync();

            return Ok(slots);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca horários por tipo específico (Particular ou Grupo)
    /// </summary>
    [HttpGet("by-type/{courseType}")]
    public async Task<ActionResult<IEnumerable<ScheduleSlot>>> GetSlotsByCourseType(string courseType)
    {
        try
        {
            if (courseType != "Particular" && courseType != "Grupo")
            {
                return BadRequest(new { message = "Tipo de curso deve ser 'Particular' ou 'Grupo'" });
            }

            var slots = await _context.ScheduleSlots
                .Where(s => s.CourseType == courseType && s.IsAvailable)
                .OrderBy(s => s.DayOfWeek)
                .ThenBy(s => s.TimeSlot)
                .ToListAsync();

            return Ok(slots);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca horários agrupados por dia da semana
    /// </summary>
    [HttpGet("grouped-by-day")]
    public async Task<ActionResult> GetSlotsGroupedByDay(
        [FromQuery] string? courseType = null,
        [FromQuery] string? planType = null)
    {
        try
        {
            var query = _context.ScheduleSlots.Where(s => s.IsAvailable);

            if (!string.IsNullOrEmpty(courseType))
                query = query.Where(s => s.CourseType == courseType);

            if (!string.IsNullOrEmpty(planType))
                query = query.Where(s => s.PlanType == planType);

            var slots = await query.ToListAsync();

            var groupedSlots = slots
                .GroupBy(s => s.DayOfWeek)
                .Select(g => new
                {
                    DayOfWeek = g.Key,
                    DayName = g.First().DayName,
                    Slots = g.OrderBy(s => s.TimeSlot).Select(s => new
                    {
                        s.Id,
                        s.TimeSlot,
                        s.Price,
                        s.CourseType,
                        s.PlanType
                    })
                })
                .OrderBy(g => g.DayOfWeek)
                .ToList();

            return Ok(groupedSlots);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca um horário específico por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduleSlot>> GetScheduleSlot(int id)
    {
        try
        {
            var slot = await _context.ScheduleSlots.FindAsync(id);

            if (slot == null)
            {
                return NotFound(new { message = "Horário não encontrado" });
            }

            return Ok(slot);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza disponibilidade de um horário (Admin only)
    /// </summary>
    [HttpPatch("{id}/availability")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult> UpdateSlotAvailability(int id, [FromBody] bool isAvailable)
    {
        try
        {
            var slot = await _context.ScheduleSlots.FindAsync(id);

            if (slot == null)
            {
                return NotFound(new { message = "Horário não encontrado" });
            }

            slot.IsAvailable = isAvailable;
            slot.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Disponibilidade atualizada com sucesso", slot });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca preços por tipo de curso e plano
    /// </summary>
    [HttpGet("prices")]
    public async Task<ActionResult> GetPrices()
    {
        try
        {
            var prices = await _context.ScheduleSlots
                .GroupBy(s => new { s.CourseType, s.PlanType })
                .Select(g => new
                {
                    CourseType = g.Key.CourseType,
                    PlanType = g.Key.PlanType,
                    Price = g.First().Price
                })
                .OrderBy(p => p.CourseType)
                .ThenBy(p => p.PlanType)
                .ToListAsync();

            return Ok(prices);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
} 