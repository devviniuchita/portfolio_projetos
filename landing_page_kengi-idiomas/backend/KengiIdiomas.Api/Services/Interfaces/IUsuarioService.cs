using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Models.Requests;

namespace KengiIdiomas.Api.Services.Interfaces;

public interface IUsuarioService
{
    Task<UsuarioDTO> Autenticar(LoginRequest request);
    Task<UsuarioDTO> Registrar(RegistroRequest request);
    Task<bool> AlterarSenha(int usuarioId, AlterarSenhaRequest request);
    Task<bool> SolicitarResetSenha(string email);
    Task<bool> ResetarSenha(ResetSenhaRequest request);
    Task<UsuarioDTO> ObterPorId(int id);
    Task<List<UsuarioDTO>> ListarTodos();
    Task<UsuarioDTO> Atualizar(int id, AtualizarUsuarioRequest request);
} 