using System.ComponentModel.DataAnnotations;

namespace KengiIdiomas.Api.Models.Requests;

public class PagamentoCartaoRequest
{
    [Required(ErrorMessage = "O ID do plano é obrigatório")]
    public int PlanoId { get; set; }
    
    [Required(ErrorMessage = "O ID do horário é obrigatório")]
    public int HorarioId { get; set; }
    
    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }
    
    [Required(ErrorMessage = "O número do cartão é obrigatório")]
    [StringLength(19, MinimumLength = 13, ErrorMessage = "Número do cartão inválido")]
    public string NumeroCartao { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O nome do titular é obrigatório")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Nome do titular inválido")]
    public string NomeTitular { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "A data de validade é obrigatória")]
    [StringLength(5, MinimumLength = 5, ErrorMessage = "Data de validade deve ter o formato MM/AA")]
    [RegularExpression(@"^(0[1-9]|1[0-2])\/([0-9]{2})$", ErrorMessage = "Data de validade inválida")]
    public string Validade { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O código de segurança é obrigatório")]
    [StringLength(4, MinimumLength = 3, ErrorMessage = "Código de segurança inválido")]
    public string CodigoSeguranca { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O número de parcelas é obrigatório")]
    [Range(1, 12, ErrorMessage = "O número de parcelas deve ser entre 1 e 12")]
    public int Parcelas { get; set; }
} 