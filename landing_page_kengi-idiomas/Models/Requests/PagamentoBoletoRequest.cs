using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class PagamentoBoletoRequest
{
    [Required(ErrorMessage = "O ID do plano é obrigatório")]
    public int PlanoId { get; set; }
    
    [Required(ErrorMessage = "O ID do horário é obrigatório")]
    public int HorarioId { get; set; }
    
    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }
    
    [Required(ErrorMessage = "O nome do pagador é obrigatório")]
    public string NomePagador { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O CPF/CNPJ do pagador é obrigatório")]
    public string Documento { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O email do pagador é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;
    
    // Endereço
    [Required(ErrorMessage = "O endereço é obrigatório")]
    public string Endereco { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "A cidade é obrigatória")]
    public string Cidade { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O estado é obrigatório")]
    public string Estado { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O CEP é obrigatório")]
    public string CEP { get; set; } = string.Empty;
    
    public string? Observacoes { get; set; }
} 