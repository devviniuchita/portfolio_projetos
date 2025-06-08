using Microsoft.AspNetCore.Mvc;

namespace KengiIdiomas.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "API Kengi Idiomas funcionando!", timestamp = DateTime.UtcNow });
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "Healthy", service = "Kengi Idiomas API" });
    }
} 