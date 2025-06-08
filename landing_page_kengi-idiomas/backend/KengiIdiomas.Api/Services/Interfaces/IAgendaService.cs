using KengiIdiomas.Api.Models.DTOs;

namespace KengiIdiomas.Api.Services.Interfaces;

public interface IAgendaService
{
    Task<List<AgendaDisponivelDto>> GetHorariosDisponiveisAsync();
    Task<AgendaDisponivelDto> GetHorariosDisponiveisByTipoAsync(string tipo);
    Task<List<HorarioDisponivelDto>> GetHorariosByPlanoAsync(int planoId);
    Task<HorarioDisponivelDto> ReservarHorarioAsync(ReservarHorarioDto reservaDto);
    Task<FilaEsperaDto> AdicionarFilaEsperaAsync(int horarioId, int usuarioId);
    Task<List<FilaEsperaDto>> GetFilaEsperaByHorarioAsync(int horarioId);
    Task<bool> LiberarHorarioAsync(int horarioId);
    Task<List<HorarioDisponivelDto>> CreateHorariosAsync(List<HorarioDisponivelCreateDto> horariosDto);
} 