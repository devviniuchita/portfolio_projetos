using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Services.Interfaces;

namespace KengiIdiomas.Api.Services.Implementations;

public class AgendaService : IAgendaService
{
    private readonly KengiIdiomasContext _context;
    private readonly Dictionary<int, string> _diasSemana = new()
    {
        { 1, "Segunda-feira" },
        { 2, "Terça-feira" },
        { 3, "Quarta-feira" },
        { 4, "Quinta-feira" },
        { 5, "Sexta-feira" },
        { 6, "Sábado" },
        { 7, "Domingo" }
    };

    public AgendaService(KengiIdiomasContext context)
    {
        _context = context;
    }

    public async Task<List<AgendaDisponivelDto>> GetHorariosDisponiveisAsync()
    {
        var result = new List<AgendaDisponivelDto>();

        // Buscar horários para aulas particulares
        var particulares = await GetHorariosDisponiveisByTipoAsync("particular");
        result.Add(particulares);

        // Buscar horários para aulas em grupo
        var grupos = await GetHorariosDisponiveisByTipoAsync("grupo");
        result.Add(grupos);

        return result;
    }

    public async Task<AgendaDisponivelDto> GetHorariosDisponiveisByTipoAsync(string tipo)
    {
        var planos = await _context.Planos
            .Where(p => p.Tipo == tipo && p.Ativo)
            .Include(p => p.HorariosDisponiveis)
            .ToListAsync();

        var planosComHorarios = new List<PlanoComHorariosDto>();

        foreach (var plano in planos)
        {
            var diasComHorarios = new List<DiaComHorariosDto>();

            // Agrupar horários por dia da semana
            var horariosPorDia = plano.HorariosDisponiveis
                .Where(h => h.Ativo)
                .GroupBy(h => h.DiaSemana)
                .OrderBy(g => g.Key);

            foreach (var grupo in horariosPorDia)
            {
                var horarios = grupo.Select(h => new HorarioDisponivelDto
                {
                    Id = h.Id,
                    PlanoId = h.PlanoId,
                    PlanoNome = plano.Nome,
                    DiaSemana = h.DiaSemana,
                    DiaSemanaTexto = _diasSemana[h.DiaSemana],
                    HoraInicio = h.HoraInicio,
                    HoraFim = h.HoraFim,
                    Ocupado = h.Ocupado,
                    Ativo = h.Ativo
                }).OrderBy(h => h.HoraInicio).ToList();

                diasComHorarios.Add(new DiaComHorariosDto
                {
                    DiaSemana = grupo.Key,
                    DiaSemanaTexto = _diasSemana[grupo.Key],
                    Horarios = horarios
                });
            }

            planosComHorarios.Add(new PlanoComHorariosDto
            {
                Id = plano.Id,
                Nome = plano.Nome,
                Duracao = plano.Duracao,
                Preco = plano.Preco,
                Descricao = plano.Descricao,
                Dias = diasComHorarios
            });
        }

        return new AgendaDisponivelDto
        {
            TipoPlano = tipo,
            Planos = planosComHorarios
        };
    }

    public async Task<List<HorarioDisponivelDto>> GetHorariosByPlanoAsync(int planoId)
    {
        var horarios = await _context.HorariosDisponiveis
            .Include(h => h.Plano)
            .Where(h => h.PlanoId == planoId && h.Ativo)
            .OrderBy(h => h.DiaSemana)
            .ThenBy(h => h.HoraInicio)
            .ToListAsync();

        return horarios.Select(h => new HorarioDisponivelDto
        {
            Id = h.Id,
            PlanoId = h.PlanoId,
            PlanoNome = h.Plano.Nome,
            DiaSemana = h.DiaSemana,
            DiaSemanaTexto = _diasSemana[h.DiaSemana],
            HoraInicio = h.HoraInicio,
            HoraFim = h.HoraFim,
            Ocupado = h.Ocupado,
            Ativo = h.Ativo
        }).ToList();
    }

    public async Task<HorarioDisponivelDto> ReservarHorarioAsync(ReservarHorarioDto reservaDto)
    {
        var horario = await _context.HorariosDisponiveis
            .Include(h => h.Plano)
            .FirstOrDefaultAsync(h => h.Id == reservaDto.HorarioId && h.Ativo);

        if (horario == null)
            throw new InvalidOperationException("Horário não encontrado");

        if (horario.Ocupado)
            throw new InvalidOperationException("Horário já está ocupado");

        // Verificar se usuário existe
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == reservaDto.UsuarioId && u.Ativo);

        if (usuario == null)
            throw new InvalidOperationException("Usuário não encontrado");

        // Reservar horário
        horario.Ocupado = true;
        horario.UsuarioId = reservaDto.UsuarioId;
        horario.DataReserva = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new HorarioDisponivelDto
        {
            Id = horario.Id,
            PlanoId = horario.PlanoId,
            PlanoNome = horario.Plano.Nome,
            DiaSemana = horario.DiaSemana,
            DiaSemanaTexto = _diasSemana[horario.DiaSemana],
            HoraInicio = horario.HoraInicio,
            HoraFim = horario.HoraFim,
            Ocupado = horario.Ocupado,
            Ativo = horario.Ativo
        };
    }

    public async Task<FilaEsperaDto> AdicionarFilaEsperaAsync(int horarioId, int usuarioId)
    {
        // Verificar se horário existe
        var horario = await _context.HorariosDisponiveis
            .FirstOrDefaultAsync(h => h.Id == horarioId && h.Ativo);

        if (horario == null)
            throw new InvalidOperationException("Horário não encontrado");

        // Verificar se usuário já está na fila
        var jaExiste = await _context.FilaEspera
            .AnyAsync(f => f.HorarioId == horarioId && f.UsuarioId == usuarioId && f.Ativo);

        if (jaExiste)
            throw new InvalidOperationException("Usuário já está na fila de espera para este horário");

        // Calcular próxima posição
        var ultimaPosicao = await _context.FilaEspera
            .Where(f => f.HorarioId == horarioId && f.Ativo)
            .MaxAsync(f => (int?)f.Posicao) ?? 0;

        var filaEspera = new FilaEspera
        {
            UsuarioId = usuarioId,
            HorarioId = horarioId,
            Posicao = ultimaPosicao + 1,
            DataEntrada = DateTime.UtcNow,
            Ativo = true
        };

        _context.FilaEspera.Add(filaEspera);
        await _context.SaveChangesAsync();

        // Buscar dados completos para retorno
        var filaCompleta = await _context.FilaEspera
            .Include(f => f.Usuario)
            .FirstAsync(f => f.Id == filaEspera.Id);

        return new FilaEsperaDto
        {
            Id = filaCompleta.Id,
            UsuarioId = filaCompleta.UsuarioId,
            UsuarioNome = filaCompleta.Usuario.Nome,
            HorarioId = filaCompleta.HorarioId,
            Posicao = filaCompleta.Posicao,
            DataEntrada = filaCompleta.DataEntrada
        };
    }

    public async Task<List<FilaEsperaDto>> GetFilaEsperaByHorarioAsync(int horarioId)
    {
        var fila = await _context.FilaEspera
            .Include(f => f.Usuario)
            .Where(f => f.HorarioId == horarioId && f.Ativo)
            .OrderBy(f => f.Posicao)
            .ToListAsync();

        return fila.Select(f => new FilaEsperaDto
        {
            Id = f.Id,
            UsuarioId = f.UsuarioId,
            UsuarioNome = f.Usuario.Nome,
            HorarioId = f.HorarioId,
            Posicao = f.Posicao,
            DataEntrada = f.DataEntrada
        }).ToList();
    }

    public async Task<bool> LiberarHorarioAsync(int horarioId)
    {
        var horario = await _context.HorariosDisponiveis
            .FirstOrDefaultAsync(h => h.Id == horarioId && h.Ativo);

        if (horario == null)
            return false;

        horario.Ocupado = false;
        horario.UsuarioId = null;
        horario.DataReserva = null;

        await _context.SaveChangesAsync();

        // Notificar primeiro da fila (implementar notificação depois)
        var primeiroFila = await _context.FilaEspera
            .Where(f => f.HorarioId == horarioId && f.Ativo)
            .OrderBy(f => f.Posicao)
            .FirstOrDefaultAsync();

        if (primeiroFila != null)
        {
            primeiroFila.Notificado = true;
            await _context.SaveChangesAsync();
        }

        return true;
    }

    public async Task<List<HorarioDisponivelDto>> CreateHorariosAsync(List<HorarioDisponivelCreateDto> horariosDto)
    {
        var horarios = new List<HorarioDisponivel>();

        foreach (var dto in horariosDto)
        {
            // Verificar se plano existe
            var plano = await _context.Planos
                .FirstOrDefaultAsync(p => p.Id == dto.PlanoId && p.Ativo);

            if (plano == null)
                throw new InvalidOperationException($"Plano {dto.PlanoId} não encontrado");

            var horario = new HorarioDisponivel
            {
                PlanoId = dto.PlanoId,
                DiaSemana = dto.DiaSemana,
                HoraInicio = dto.HoraInicio,
                HoraFim = dto.HoraFim,
                Ocupado = false,
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            };

            horarios.Add(horario);
        }

        _context.HorariosDisponiveis.AddRange(horarios);
        await _context.SaveChangesAsync();

        // Retornar horários criados com dados completos
        var result = new List<HorarioDisponivelDto>();
        foreach (var horario in horarios)
        {
            var plano = await _context.Planos.FindAsync(horario.PlanoId);
            result.Add(new HorarioDisponivelDto
            {
                Id = horario.Id,
                PlanoId = horario.PlanoId,
                PlanoNome = plano!.Nome,
                DiaSemana = horario.DiaSemana,
                DiaSemanaTexto = _diasSemana[horario.DiaSemana],
                HoraInicio = horario.HoraInicio,
                HoraFim = horario.HoraFim,
                Ocupado = horario.Ocupado,
                Ativo = horario.Ativo
            });
        }

        return result;
    }
} 