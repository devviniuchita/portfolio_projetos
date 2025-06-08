using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KengiIdiomas.Api.Data.Entities;

[Table("fila_espera")]
public class FilaEspera
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("usuario_id")]
    public int UsuarioId { get; set; }

    [Required]
    [Column("horario_id")]
    public int HorarioId { get; set; }

    [Required]
    [Column("data_solicitacao")]
    public DateTime DataSolicitacao { get; set; } = DateTime.UtcNow;

    [Column("posicao")]
    public int Posicao { get; set; }

    [Column("notificado")]
    public bool Notificado { get; set; } = false;

    [Column("data_notificacao")]
    public DateTime? DataNotificacao { get; set; }

    [MaxLength(255)]
    [Column("observacao")]
    public string? Observacao { get; set; }

    // Relacionamentos
    [ForeignKey("UsuarioId")]
    public virtual Usuario Usuario { get; set; } = null!;

    [ForeignKey("HorarioId")]
    public virtual HorarioDisponivel HorarioDisponivel { get; set; } = null!;
} 