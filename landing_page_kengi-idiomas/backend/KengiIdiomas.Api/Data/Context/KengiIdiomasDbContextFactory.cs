using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KengiIdiomas.Api.Data.Context;

public class KengiIdiomasDbContextFactory : IDesignTimeDbContextFactory<KengiIdiomasContext>
{
    public KengiIdiomasContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<KengiIdiomasContext>();
        
        // Configuração temporária para migrations
        var connectionString = "Server=localhost;Database=kengi_idiomas;User=root;Password=;";
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        
        return new KengiIdiomasContext(optionsBuilder.Options);
    }
} 