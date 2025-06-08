using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KengiIdiomas.Api.Data.Entities;

[Table("horarios_disponiveis")]
public class HorarioDisponivel
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("plano_id")]
    public int PlanoId { get; set; }

    [Column("usuario_id")]
    public int? UsuarioId { get; set; }  // Professor responsável (opcional)

    [Required]
    [Column("data_hora_inicio")]
    public DateTime DataHoraInicio { get; set; }

    [Required]
    [Column("data_hora_fim")]
    public DateTime DataHoraFim { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("dia_semana")]
    public string DiaSemana { get; set; }  // "segunda", "terca", etc.

    [Column("vagas_disponiveis")]
    public int VagasDisponiveis { get; set; }

    [Column("vagas_ocupadas")]
    public int VagasOcupadas { get; set; } = 0;

    [Column("ativo")]
    public bool Ativo { get; set; } = true;

    [MaxLength(255)]
    [Column("observacao")]
    public string? Observacao { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    [ForeignKey("PlanoId")]
    public virtual Plano Plano { get; set; } = null!;

    [ForeignKey("UsuarioId")]
    public virtual Usuario? Usuario { get; set; }

    public virtual ICollection<FilaEspera> FilaEspera { get; set; } = new List<FilaEspera>();
} 