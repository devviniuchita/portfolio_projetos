using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class PagamentoPixRequest
{
    [Required(ErrorMessage = "O ID do plano é obrigatório")]
    public int PlanoId { get; set; }
    
    [Required(ErrorMessage = "O ID do horário é obrigatório")]
    public int HorarioId { get; set; }
    
    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }
    
    // Informações adicionais
    public string? Email { get; set; }
    
    // CPF/CNPJ do pagador (opcional mas recomendado)
    public string? Documento { get; set; }
    
    public string? Observacoes { get; set; }
} 