using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KengiIdiomas.Api.Data.Entities;

[Table("planos")]
public class Plano
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("nome")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Column("tipo")]
    [MaxLength(20)]
    public string Tipo { get; set; } = string.Empty; // "particular", "grupo", "comunidade"

    [Required]
    [Column("duracao")]
    [MaxLength(20)]
    public string Duracao { get; set; } = string.Empty; // "mensal", "semestral", "anual"

    [Column("preco", TypeName = "decimal(10,2)")]
    public decimal Preco { get; set; }

    [Column("descricao")]
    [MaxLength(500)]
    public string? Descricao { get; set; }

    [Column("aulas_por_semana")]
    public int AulasPorSemana { get; set; }

    [Column("duracao_aula_minutos")]
    public int DuracaoAulaMinutos { get; set; } = 60;

    [Column("ativo")]
    public bool Ativo { get; set; } = true;

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Relacionamentos
    public virtual ICollection<HorarioDisponivel> HorariosDisponiveis { get; set; } = new List<HorarioDisponivel>();
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
} 