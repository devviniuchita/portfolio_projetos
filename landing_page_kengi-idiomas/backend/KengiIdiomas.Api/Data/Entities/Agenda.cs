using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KengiIdiomas.Api.Data.Entities;

[Table("agendas")]
public class Agenda
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("usuario_id")]
    public int UsuarioId { get; set; }

    [Required]
    [Column("plano_id")]
    public int PlanoId { get; set; }

    [Required]
    [Column("data_hora_inicio")]
    public DateTime DataHoraInicio { get; set; }

    [Required]
    [Column("data_hora_fim")]
    public DateTime DataHoraFim { get; set; }

    [Required]
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "agendado"; // "agendado", "concluido", "cancelado", "remarcado"

    [Column("observacao")]
    [MaxLength(255)]
    public string? Observacao { get; set; }

    [Column("recorrente")]
    public bool Recorrente { get; set; } = true;

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("data_atualizacao")]
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    [ForeignKey("UsuarioId")]
    public virtual Usuario Usuario { get; set; } = null!;

    [ForeignKey("PlanoId")]
    public virtual Plano Plano { get; set; } = null!;
} 