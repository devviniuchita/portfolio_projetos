namespace KengiIdiomas.Api.Models.DTOs;

public class PagamentoCreateDto
{
    public int UsuarioId { get; set; }
    public int PlanoId { get; set; }
    public int? HorarioId { get; set; }
    public decimal Valor { get; set; }
    public string MetodoPagamento { get; set; } = string.Empty; // "cartao", "pix", "boleto"
    public object? DadosPagamento { get; set; } // Dados específicos do método
}

public class PagamentoCartaoDto
{
    public string NumeroCartao { get; set; } = string.Empty;
    public string NomePortador { get; set; } = string.Empty;
    public string ValidadeCartao { get; set; } = string.Empty; // MM/AA
    public string CVV { get; set; } = string.Empty;
    public int Parcelas { get; set; } = 1;
}

public class PagamentoPixDto
{
    public string ChavePix { get; set; } = string.Empty;
    public string? EmailNotificacao { get; set; }
}

public class PagamentoBoletoDto
{
    public string NomePagador { get; set; } = string.Empty;
    public string CpfPagador { get; set; } = string.Empty;
    public string EnderecoCompleto { get; set; } = string.Empty;
    public DateTime DataVencimento { get; set; }
}

public class PagamentoResponseDto
{
    public int PedidoId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string? QrCodePix { get; set; }
    public string? LinkBoleto { get; set; }
    public string? LinkPagamento { get; set; }
    public DateTime DataCriacao { get; set; }
    public string Mensagem { get; set; } = string.Empty;
}

public class WebhookPagamentoDto
{
    public string TransactionId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // "approved", "pending", "rejected"
    public decimal Valor { get; set; }
    public string MetodoPagamento { get; set; } = string.Empty;
    public DateTime DataPagamento { get; set; }
    public object? DadosAdicionais { get; set; }
}

public class PedidoDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNome { get; set; } = string.Empty;
    public int PlanoId { get; set; }
    public string PlanoNome { get; set; } = string.Empty;
    public int? HorarioId { get; set; }
    public decimal Valor { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? MetodoPagamento { get; set; }
    public string? GatewayTransactionId { get; set; }
    public DateTime? DataPagamento { get; set; }
    public DateTime DataCriacao { get; set; }
} 