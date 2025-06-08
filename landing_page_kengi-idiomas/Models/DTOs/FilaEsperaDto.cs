using System;

namespace KengiIdiomas.Api.Models.DTOs;

public class FilaEsperaDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string DiaSemana { get; set; } = string.Empty;
    public string TipoAula { get; set; } = string.Empty;
    public DateTime DataSolicitacao { get; set; }
} 