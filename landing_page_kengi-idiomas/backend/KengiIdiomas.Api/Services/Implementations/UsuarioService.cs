using KengiIdiomas.Api.Data.Context;
using KengiIdiomas.Api.Data.Entities;
using KengiIdiomas.Api.Models.DTOs;
using KengiIdiomas.Api.Models.Requests;
using KengiIdiomas.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace KengiIdiomas.Api.Services.Implementations;

public class UsuarioService : IUsuarioService
{
    private readonly KengiIdiomasContext _context;
    private readonly ITokenService _tokenService;

    public UsuarioService(KengiIdiomasContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<UsuarioDTO> Autenticar(LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (usuario == null || !BC.Verify(request.Senha, usuario.SenhaHash))
        {
            throw new Exception("Email ou senha inválidos");
        }

        // Atualiza último login
        usuario.UltimoLogin = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Gera o token JWT
        var token = _tokenService.GenerateJwtToken(usuario);
        
        return new UsuarioDTO
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cidade = usuario.Cidade,
            Estado = usuario.Estado,
            Perfil = usuario.Perfil,
            Ativo = usuario.Ativo,
            DataCriacao = usuario.DataCriacao,
            UltimoLogin = usuario.UltimoLogin,
            Token = token
        };
    }

    public async Task<UsuarioDTO> Registrar(RegistroRequest request)
    {
        // Verifica se e-mail já existe
        if (await _context.Usuarios.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            throw new Exception("Email já cadastrado");
        }

        // Cria o novo usuário
        var usuario = new Usuario
        {
            Nome = request.Nome,
            Email = request.Email.ToLower(),
            SenhaHash = BC.HashPassword(request.Senha),
            Telefone = request.Telefone,
            Cidade = request.Cidade,
            Estado = request.Estado,
            Perfil = "aluno",
            Ativo = true,
            DataCriacao = DateTime.UtcNow,
            UltimoLogin = DateTime.UtcNow
        };

        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();

        // Gera o token JWT
        var token = _tokenService.GenerateJwtToken(usuario);
        
        return new UsuarioDTO
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cidade = usuario.Cidade,
            Estado = usuario.Estado,
            Perfil = usuario.Perfil,
            Ativo = usuario.Ativo,
            DataCriacao = usuario.DataCriacao,
            UltimoLogin = usuario.UltimoLogin,
            Token = token
        };
    }

    public async Task<bool> AlterarSenha(int usuarioId, AlterarSenhaRequest request)
    {
        var usuario = await _context.Usuarios.FindAsync(usuarioId);
        if (usuario == null)
        {
            throw new Exception("Usuário não encontrado");
        }

        // Verifica se a senha atual está correta
        if (!BC.Verify(request.SenhaAtual, usuario.SenhaHash))
        {
            throw new Exception("Senha atual incorreta");
        }

        // Atualiza a senha
        usuario.SenhaHash = BC.HashPassword(request.NovaSenha);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SolicitarResetSenha(string email)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

        if (usuario == null)
        {
            // Por segurança, não informamos se o e-mail existe ou não
            return false;
        }

        // Gera um token para reset de senha
        var token = Guid.NewGuid().ToString();
        usuario.TokenResetSenha = token;
        usuario.ExpiracaoTokenResetSenha = DateTime.UtcNow.AddHours(1); // Token válido por 1 hora
        
        await _context.SaveChangesAsync();

        // TODO: Enviar e-mail com o token
        
        return true;
    }

    public async Task<bool> ResetarSenha(ResetSenhaRequest request)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (usuario == null)
        {
            throw new Exception("Email não encontrado");
        }

        // Verifica se o token é válido
        if (usuario.TokenResetSenha != request.Token)
        {
            throw new Exception("Token inválido");
        }

        // Verifica se o token não expirou
        if (usuario.ExpiracaoTokenResetSenha < DateTime.UtcNow)
        {
            throw new Exception("Token expirado");
        }

        // Atualiza a senha
        usuario.SenhaHash = BC.HashPassword(request.NovaSenha);
        usuario.TokenResetSenha = null;
        usuario.ExpiracaoTokenResetSenha = null;
        
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UsuarioDTO> ObterPorId(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            throw new Exception("Usuário não encontrado");
        }

        return new UsuarioDTO
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cidade = usuario.Cidade,
            Estado = usuario.Estado,
            Perfil = usuario.Perfil,
            Ativo = usuario.Ativo,
            DataCriacao = usuario.DataCriacao,
            UltimoLogin = usuario.UltimoLogin
        };
    }

    public async Task<List<UsuarioDTO>> ListarTodos()
    {
        var usuarios = await _context.Usuarios.ToListAsync();
        return usuarios.Select(u => new UsuarioDTO
        {
            Id = u.Id,
            Nome = u.Nome,
            Email = u.Email,
            Telefone = u.Telefone,
            Cidade = u.Cidade,
            Estado = u.Estado,
            Perfil = u.Perfil,
            Ativo = u.Ativo,
            DataCriacao = u.DataCriacao,
            UltimoLogin = u.UltimoLogin
        }).ToList();
    }

    public async Task<UsuarioDTO> Atualizar(int id, AtualizarUsuarioRequest request)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null)
        {
            throw new Exception("Usuário não encontrado");
        }

        // Atualiza apenas os campos enviados
        if (!string.IsNullOrEmpty(request.Nome))
            usuario.Nome = request.Nome;

        if (!string.IsNullOrEmpty(request.Telefone))
            usuario.Telefone = request.Telefone;

        if (!string.IsNullOrEmpty(request.Cidade))
            usuario.Cidade = request.Cidade;

        if (!string.IsNullOrEmpty(request.Estado))
            usuario.Estado = request.Estado;

        await _context.SaveChangesAsync();

        return new UsuarioDTO
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            Cidade = usuario.Cidade,
            Estado = usuario.Estado,
            Perfil = usuario.Perfil,
            Ativo = usuario.Ativo,
            DataCriacao = usuario.DataCriacao,
            UltimoLogin = usuario.UltimoLogin
        };
    }
} 