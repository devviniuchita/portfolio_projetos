using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Entities;

namespace KengiIdiomas.Api.Data.Context;

public class KengiIdiomasDbContext : DbContext
{
    public KengiIdiomasDbContext(DbContextOptions<KengiIdiomasDbContext> options) : base(options)
    {
    }

    // DbSets para as entidades
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações das entidades
        ConfigureUser(modelBuilder);
        ConfigureCourse(modelBuilder);
        ConfigureEnrollment(modelBuilder);
        ConfigureLesson(modelBuilder);
        ConfigurePayment(modelBuilder);
    }

    private void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }

    private void ConfigureCourse(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }

    private void ConfigureEnrollment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Enrollments)
                  .HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Enrollments)
                  .HasForeignKey(e => e.CourseId);
            entity.Property(e => e.EnrolledAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }

    private void ConfigureLesson(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Content).HasColumnType("TEXT");
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Lessons)
                  .HasForeignKey(e => e.CourseId);
        });
    }

    private void ConfigurePayment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Payments)
                  .HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Payments)
                  .HasForeignKey(e => e.CourseId);
        });
    }
} 