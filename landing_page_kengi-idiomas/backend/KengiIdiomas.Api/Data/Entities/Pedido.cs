using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KengiIdiomas.Api.Data.Entities;

[Table("pedidos")]
public class Pedido
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

    [Column("horario_id")]
    public int? HorarioId { get; set; }

    [Required]
    [Column("valor", TypeName = "decimal(10,2)")]
    public decimal Valor { get; set; }

    [Required]
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "pendente"; // pendente, pago, cancelado, reembolsado

    [Column("metodo_pagamento")]
    [MaxLength(20)]
    public string? MetodoPagamento { get; set; } // cartao, pix, boleto

    [Column("gateway_transaction_id")]
    [MaxLength(255)]
    public string? GatewayTransactionId { get; set; }

    [Column("data_pagamento")]
    public DateTime? DataPagamento { get; set; }

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("data_atualizacao")]
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    [Column("codigo_transacao")]
    [MaxLength(255)]
    public string CodigoTransacao { get; set; }

    [Column("observacao")]
    [MaxLength(255)]
    public string? Observacao { get; set; }

    // Relacionamentos
    [ForeignKey("UsuarioId")]
    public virtual Usuario Usuario { get; set; } = null!;

    [ForeignKey("PlanoId")]
    public virtual Plano Plano { get; set; } = null!;

    [ForeignKey("HorarioId")]
    public virtual HorarioDisponivel? HorarioDisponivel { get; set; }

    public virtual ICollection<Agenda> Agendas { get; set; } = new List<Agenda>();
} 