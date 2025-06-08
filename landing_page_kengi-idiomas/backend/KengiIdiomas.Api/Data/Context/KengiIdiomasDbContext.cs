using Microsoft.EntityFrameworkCore;
using KengiIdiomas.Api.Data.Entities;

namespace KengiIdiomas.Api.Data.Context;

public class KengiIdiomasDbContext : DbContext
{
    public KengiIdiomasDbContext(DbContextOptions<KengiIdiomasDbContext> options) : base(options)
    {
    }

    // Entidades principais
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Payment> Payments { get; set; }
    
    // Entidades do sistema de agendamento (CORE DO NEGÓCIO)
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<ScheduleSlot> ScheduleSlots { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configurações Course
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configurações Schedule (SISTEMA DE AGENDAMENTO)
        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CourseType).IsRequired().HasMaxLength(50); // "Particular" ou "Grupo"
            entity.Property(e => e.PlanType).IsRequired().HasMaxLength(50); // "Mensal", "Semestral", "Anual"
            entity.Property(e => e.DayOfWeek).IsRequired(); // 1-7 (Segunda a Domingo)
            entity.Property(e => e.StartTime).IsRequired();
            entity.Property(e => e.EndTime).IsRequired();
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Índice único para evitar duplicatas
            entity.HasIndex(e => new { e.CourseType, e.PlanType, e.DayOfWeek, e.StartTime })
                  .IsUnique()
                  .HasDatabaseName("IX_Schedule_Unique_Slot");
        });

        // Configurações ScheduleSlot (HORÁRIOS COMO PRODUTOS)
        modelBuilder.Entity<ScheduleSlot>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CourseType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PlanType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.DayOfWeek).IsRequired();
            entity.Property(e => e.TimeSlot).IsRequired().HasMaxLength(20); // "11:00-12:00"
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Cada slot é único (produto único)
            entity.HasIndex(e => new { e.CourseType, e.PlanType, e.DayOfWeek, e.TimeSlot })
                  .IsUnique()
                  .HasDatabaseName("IX_ScheduleSlot_Unique_Product");
        });

        // Configurações Booking (RESERVAS)
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.StudentName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.StudentEmail).IsRequired().HasMaxLength(255);
            entity.Property(e => e.StudentPhone).HasMaxLength(20);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50); // "Pending", "Confirmed", "Cancelled"
            entity.Property(e => e.BookingDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relacionamentos
            entity.HasOne(e => e.ScheduleSlot)
                  .WithMany()
                  .HasForeignKey(e => e.ScheduleSlotId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configurações Enrollment
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EnrollmentDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);

            // Relacionamentos
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configurações Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
            entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TransactionId).HasMaxLength(100);
            entity.Property(e => e.PaymentDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Relacionamentos
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Booking)
                  .WithMany()
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed Data - Horários disponíveis do Professor Kengi
        SeedScheduleSlots(modelBuilder);
    }

    private void SeedScheduleSlots(ModelBuilder modelBuilder)
    {
        var slots = new List<ScheduleSlot>();
        var slotId = 1;

        // Horários para Aulas Particulares
        var particularSlots = new[]
        {
            "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
            "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",
            "19:00-20:00", "20:00-21:00"
        };

        // Horários para Aulas em Grupo
        var grupoSlots = new[]
        {
            "08:00-09:30", "09:30-11:00", "14:00-15:30", 
            "15:30-17:00", "19:00-20:30"
        };

        var planTypes = new[] { "Mensal", "Semestral", "Anual" };
        var prices = new Dictionary<string, decimal>
        {
            { "Particular-Mensal", 200.00m },
            { "Particular-Semestral", 1000.00m },
            { "Particular-Anual", 1800.00m },
            { "Grupo-Mensal", 120.00m },
            { "Grupo-Semestral", 600.00m },
            { "Grupo-Anual", 1000.00m }
        };

        // Gerar slots para Segunda a Sexta (1-5)
        for (int dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++)
        {
            foreach (var planType in planTypes)
            {
                // Aulas Particulares
                foreach (var timeSlot in particularSlots)
                {
                    slots.Add(new ScheduleSlot
                    {
                        Id = slotId++,
                        CourseType = "Particular",
                        PlanType = planType,
                        DayOfWeek = dayOfWeek,
                        TimeSlot = timeSlot,
                        IsAvailable = true,
                        Price = prices[$"Particular-{planType}"],
                        CreatedAt = DateTime.UtcNow
                    });
                }

                // Aulas em Grupo
                foreach (var timeSlot in grupoSlots)
                {
                    slots.Add(new ScheduleSlot
                    {
                        Id = slotId++,
                        CourseType = "Grupo",
                        PlanType = planType,
                        DayOfWeek = dayOfWeek,
                        TimeSlot = timeSlot,
                        IsAvailable = true,
                        Price = prices[$"Grupo-{planType}"],
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        modelBuilder.Entity<ScheduleSlot>().HasData(slots);
    }
}
