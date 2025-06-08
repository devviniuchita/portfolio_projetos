using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly KengiIdiomasDbContext _context;

    public BookingController(KengiIdiomasDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Cria uma nova reserva de horário
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking([FromBody] CreateBookingRequest request)
    {
        try
        {
            // Validar se o slot existe e está disponível
            var slot = await _context.ScheduleSlots.FindAsync(request.ScheduleSlotId);
            if (slot == null)
            {
                return NotFound(new { message = "Horário não encontrado" });
            }

            if (!slot.IsAvailable)
            {
                return BadRequest(new { message = "Horário não está disponível" });
            }

            // Verificar se já existe uma reserva ativa para este slot
            var existingBooking = await _context.Bookings
                .Where(b => b.ScheduleSlotId == request.ScheduleSlotId && b.IsActive)
                .FirstOrDefaultAsync();

            if (existingBooking != null)
            {
                return BadRequest(new { message = "Este horário já está reservado" });
            }

            // Criar nova reserva
            var booking = new Booking
            {
                ScheduleSlotId = request.ScheduleSlotId,
                UserId = request.UserId,
                StudentName = request.StudentName,
                StudentEmail = request.StudentEmail,
                StudentPhone = request.StudentPhone,
                Status = "Pending",
                BookingDate = DateTime.UtcNow,
                Notes = request.Notes
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Carregar dados relacionados para retorno
            await _context.Entry(booking)
                .Reference(b => b.ScheduleSlot)
                .LoadAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca uma reserva por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Booking>> GetBooking(int id)
    {
        try
        {
            var booking = await _context.Bookings
                .Include(b => b.ScheduleSlot)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null)
            {
                return NotFound(new { message = "Reserva não encontrada" });
            }

            return Ok(booking);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Lista todas as reservas com filtros opcionais
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings(
        [FromQuery] string? status = null,
        [FromQuery] int? userId = null,
        [FromQuery] string? studentEmail = null)
    {
        try
        {
            var query = _context.Bookings
                .Include(b => b.ScheduleSlot)
                .Include(b => b.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(b => b.Status == status);

            if (userId.HasValue)
                query = query.Where(b => b.UserId == userId.Value);

            if (!string.IsNullOrEmpty(studentEmail))
                query = query.Where(b => b.StudentEmail.Contains(studentEmail));

            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca reservas de um usuário específico
    /// </summary>
    [HttpGet("my-bookings")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Booking>>> GetMyBookings()
    {
        try
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var bookings = await _context.Bookings
                .Include(b => b.ScheduleSlot)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Confirma uma reserva
    /// </summary>
    [HttpPatch("{id}/confirm")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<ActionResult> ConfirmBooking(int id)
    {
        try
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Reserva não encontrada" });
            }

            if (booking.Status != "Pending")
            {
                return BadRequest(new { message = "Apenas reservas pendentes podem ser confirmadas" });
            }

            booking.Status = "Confirmed";
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reserva confirmada com sucesso", booking });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Cancela uma reserva
    /// </summary>
    [HttpPatch("{id}/cancel")]
    public async Task<ActionResult> CancelBooking(int id, [FromBody] CancelBookingRequest request)
    {
        try
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Reserva não encontrada" });
            }

            if (!booking.CanBeCancelled)
            {
                return BadRequest(new { message = "Esta reserva não pode ser cancelada" });
            }

            booking.Status = "Cancelled";
            booking.CancellationReason = request.Reason;
            booking.CancelledAt = DateTime.UtcNow;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reserva cancelada com sucesso", booking });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza informações de uma reserva
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateBooking(int id, [FromBody] UpdateBookingRequest request)
    {
        try
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Reserva não encontrada" });
            }

            if (booking.Status == "Cancelled" || booking.Status == "Completed")
            {
                return BadRequest(new { message = "Não é possível atualizar reservas canceladas ou concluídas" });
            }

            // Atualizar campos permitidos
            if (!string.IsNullOrEmpty(request.StudentName))
                booking.StudentName = request.StudentName;

            if (!string.IsNullOrEmpty(request.StudentEmail))
                booking.StudentEmail = request.StudentEmail;

            if (!string.IsNullOrEmpty(request.StudentPhone))
                booking.StudentPhone = request.StudentPhone;

            if (!string.IsNullOrEmpty(request.Notes))
                booking.Notes = request.Notes;

            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reserva atualizada com sucesso", booking });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
} 