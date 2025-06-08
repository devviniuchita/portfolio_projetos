namespace KengiIdiomas.Api.Models.DTOs;

public class HorarioDisponivelDto
{
    public int Id { get; set; }
    public int PlanoId { get; set; }
    public string PlanoNome { get; set; } = string.Empty;
    public int DiaSemana { get; set; }
    public string DiaSemanaTexto { get; set; } = string.Empty;
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public bool Ocupado { get; set; }
    public bool Ativo { get; set; }
}

public class HorarioDisponivelCreateDto
{
    public int PlanoId { get; set; }
    public int DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
}

public class AgendaDisponivelDto
{
    public string TipoPlano { get; set; } = string.Empty; // particular ou grupo
    public List<PlanoComHorariosDto> Planos { get; set; } = new();
}

public class PlanoComHorariosDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Duracao { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? Descricao { get; set; }
    public List<DiaComHorariosDto> Dias { get; set; } = new();
}

public class DiaComHorariosDto
{
    public int DiaSemana { get; set; }
    public string DiaSemanaTexto { get; set; } = string.Empty;
    public List<HorarioDisponivelDto> Horarios { get; set; } = new();
}

public class ReservarHorarioDto
{
    public int HorarioId { get; set; }
    public int UsuarioId { get; set; }
}

public class FilaEsperaDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNome { get; set; } = string.Empty;
    public int HorarioId { get; set; }
    public int Posicao { get; set; }
    public DateTime DataEntrada { get; set; }
} 