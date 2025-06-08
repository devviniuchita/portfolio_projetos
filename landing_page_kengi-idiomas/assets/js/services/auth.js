/**
 * Serviço de Autenticação - Kengi Idiomas
 * Gerencia autenticação, registro e sessão de usuários
 */

class AuthService {
  constructor() {
    this.apiUrl = '/api/auth';
    this.tokenKey = 'kengi_auth_token';
    this.userKey = 'kengi_user';
    this.googleAuthInitialized = false;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} Status de autenticação
   */
  isAuthenticated() {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  /**
   * Obtém o usuário atual
   * @returns {Object|null} Dados do usuário ou null
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
      } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  /**
   * Obtém o token de autenticação
   * @returns {string|null} Token ou null
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Login de usuário
   * @param {string} email Email do usuário
   * @param {string} password Senha do usuário
   * @returns {Promise} Promessa com resultado da operação
   */
  async login(email, password) {
    try {
      // Em ambiente de desenvolvimento, simular login
      if (process.env.NODE_ENV === 'development' || !this.apiUrl) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simular sucesso
        const userData = {
          id: 1,
          email: email,
          name: email.split('@')[0]
        };
        
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzdWFyaW90ZXN0ZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        
        // Armazenar na sessão
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      // Em produção, usar API real
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha na autenticação');
      }
      
      // Armazenar token e dados do usuário
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Registro de novo usuário
   * @param {string} name Nome completo
   * @param {string} email Email
   * @param {string} password Senha
   * @returns {Promise} Promessa com resultado da operação
   */
  async register(name, email, password) {
    try {
      // Em ambiente de desenvolvimento, simular registro
      if (process.env.NODE_ENV === 'development' || !this.apiUrl) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular sucesso
        const userData = {
          id: Date.now(),
          email: email,
          name: name
        };
        
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6InVzdWFyaW90ZXN0ZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        
        // Armazenar na sessão
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      // Em produção, usar API real
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: name, email, password, fullName: name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha no cadastro');
      }
      
      // Armazenar token e dados do usuário
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Login com Google
   * @returns {Promise} Promessa com resultado da operação
   */
  async loginWithGoogle() {
    try {
      // Em ambiente de desenvolvimento, simular login com Google
      if (process.env.NODE_ENV === 'development' || !this.apiUrl) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Simular sucesso
        const userData = {
          id: 'google-' + Date.now(),
          email: 'usuario.google@gmail.com',
          name: 'Usuário Google',
          picture: 'https://lh3.googleusercontent.com/a/default-user'
        };
        
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb29nbGUtdXNlciIsIm5hbWUiOiJVc3XDoXJpbyBHb29nbGUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTYxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        
        // Armazenar na sessão
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      // Em produção, essa função seria chamada pelo callback do Google
      // após o login bem-sucedido com o Google OAuth
      
      // Aqui chamaríamos a API para validar o token do Google
      // const response = await fetch(`${this.apiUrl}/google-login`, ...);
      
      throw new Error('Login com Google não implementado em produção');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  }
  
  /**
   * Fazer logout do usuário
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    // Redirecionar para a página inicial, se necessário
    // window.location.href = '/';
  }

  /**
   * Verificar token no servidor
   * @returns {Promise} Promessa com resultado da operação
   */
  async verifyToken() {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      // Em ambiente de desenvolvimento, simular verificação
      if (process.env.NODE_ENV === 'development' || !this.apiUrl) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { valid: true };
      }
      
      // Em produção, verificar com API
      const response = await fetch(`${this.apiUrl}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        this.logout(); // Token inválido, fazer logout
        throw new Error(data.message || 'Token inválido');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      throw error;
    }
  }

  /**
   * Inicializar Google Auth API
   * @returns {Promise} Promessa resolvida quando API estiver pronta
   */
  async initGoogleAuth() {
    if (this.googleAuthInitialized) {
      return Promise.resolve();
    }
    
    // Em desenvolvimento, apenas simular inicialização
    return new Promise(resolve => {
      console.log('Simulando inicialização do Google Auth...');
      setTimeout(() => {
        this.googleAuthInitialized = true;
        resolve();
      }, 500);
    });
    
    // Em produção, seria algo como:
    /*
    return new Promise((resolve, reject) => {
      // Carregar API do Google
      gapi.load('auth2', () => {
        try {
          gapi.auth2.init({
            client_id: 'SEU_CLIENT_ID_GOOGLE.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          }).then(() => {
            this.googleAuthInitialized = true;
            resolve();
          }, reject);
    } catch (error) {
          reject(error);
    }
      });
    });
    */
  }
}

// Exportar instância singleton
export const authService = new AuthService();
