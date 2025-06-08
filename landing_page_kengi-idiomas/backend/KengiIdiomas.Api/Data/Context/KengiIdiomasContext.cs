using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Entities;

namespace KengiIdiomas.Api.Data.Context;

public class KengiIdiomasContext : DbContext
{
    public KengiIdiomasContext(DbContextOptions<KengiIdiomasContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Plano> Planos { get; set; }
    public DbSet<HorarioDisponivel> HorariosDisponiveis { get; set; }
    public DbSet<FilaEspera> FilaEspera { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<Agenda> Agendas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações de relacionamentos
        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<HorarioDisponivel>()
            .HasOne(h => h.Plano)
            .WithMany(p => p.HorariosDisponiveis)
            .HasForeignKey(h => h.PlanoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<HorarioDisponivel>()
            .HasOne(h => h.Usuario)
            .WithMany()
            .HasForeignKey(h => h.UsuarioId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<FilaEspera>()
            .HasOne(f => f.Usuario)
            .WithMany()
            .HasForeignKey(f => f.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FilaEspera>()
            .HasOne(f => f.HorarioDisponivel)
            .WithMany(h => h.FilaEspera)
            .HasForeignKey(f => f.HorarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Usuario)
            .WithMany(u => u.Pedidos)
            .HasForeignKey(p => p.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Plano)
            .WithMany()
            .HasForeignKey(p => p.PlanoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.HorarioDisponivel)
            .WithMany()
            .HasForeignKey(p => p.HorarioId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Agenda>()
            .HasOne(a => a.Usuario)
            .WithMany(u => u.Agendas)
            .HasForeignKey(a => a.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Agenda>()
            .HasOne(a => a.Plano)
            .WithMany()
            .HasForeignKey(a => a.PlanoId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed Data - Planos iniciais
        modelBuilder.Entity<Plano>().HasData(
            new Plano
            {
                Id = 1,
                Nome = "Aulas Particulares - Mensal",
                Tipo = "particular",
                Duracao = "mensal",
                Preco = 400.00m,
                Descricao = "Aulas particulares de japonês - Plano mensal",
                AulasPorSemana = 2,
                DuracaoAulaMinutos = 60,
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            },
            new Plano
            {
                Id = 2,
                Nome = "Aulas Particulares - Semestral",
                Tipo = "particular",
                Duracao = "semestral",
                Preco = 2200.00m,
                Descricao = "Aulas particulares de japonês - Plano semestral",
                AulasPorSemana = 2,
                DuracaoAulaMinutos = 60,
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            },
            new Plano
            {
                Id = 3,
                Nome = "Aulas em Grupo - Mensal",
                Tipo = "grupo",
                Duracao = "mensal",
                Preco = 200.00m,
                Descricao = "Aulas em grupo de japonês - Plano mensal",
                AulasPorSemana = 2,
                DuracaoAulaMinutos = 60,
                Ativo = true,
                DataCriacao = DateTime.UtcNow
            }
        );
    }
} 