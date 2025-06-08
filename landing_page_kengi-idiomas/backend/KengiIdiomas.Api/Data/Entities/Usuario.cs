using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KengiIdiomas.Api.Data.Entities;

[Table("usuarios")]
public class Usuario
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("nome")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Column("email")]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Column("senha_hash")]
    [Required]
    [JsonIgnore]
    public string SenhaHash { get; set; } = string.Empty;

    [Column("google_id")]
    [MaxLength(255)]
    public string? GoogleId { get; set; }

    [Column("telefone")]
    [MaxLength(20)]
    public string? Telefone { get; set; }

    [Column("data_nascimento")]
    public DateTime? DataNascimento { get; set; }

    [Column("ativo")]
    public bool Ativo { get; set; } = true;

    [Column("data_criacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    [Column("data_atualizacao")]
    public DateTime DataAtualizacao { get; set; } = DateTime.UtcNow;

    // ===== CAMPOS PARA GOOGLE OAUTH =====
    
    [Column("foto_perfil")]
    [MaxLength(500)]
    public string? FotoPerfil { get; set; }

    [Column("email_verificado")]
    public bool EmailVerificado { get; set; } = false;

    [Column("provider")]
    [MaxLength(50)]
    public string? Provider { get; set; } // 'local', 'google', etc.

    [MaxLength(50)]
    public string? Cidade { get; set; }

    [MaxLength(2)]
    public string? Estado { get; set; }

    [MaxLength(20)]
    [Required]
    public string Perfil { get; set; } = "aluno";

    public DateTime? UltimoLogin { get; set; }

    [MaxLength(255)]
    public string? TokenResetSenha { get; set; }

    public DateTime? ExpiracaoTokenResetSenha { get; set; }

    // Relacionamentos
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    public virtual ICollection<FilaEspera> FilasEspera { get; set; } = new List<FilaEspera>();
    public virtual ICollection<Agenda> Agendas { get; set; } = new List<Agenda>();
} 