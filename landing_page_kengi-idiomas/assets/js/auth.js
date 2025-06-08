// Authentication Management
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        console.log('✅ AuthManager inicializado');
    }

    checkAuthStatus() {
        const isAuthenticated = KengiAPI.AuthAPI.isAuthenticated();
        const currentUser = KengiAPI.AuthAPI.getCurrentUser();
        
        this.updateUI(isAuthenticated, currentUser);
    }

    updateUI(isAuthenticated, user = null) {
        const authButtons = document.querySelectorAll('.auth-required');
        const guestButtons = document.querySelectorAll('.guest-only');
        const userInfo = document.querySelectorAll('.user-info');

        if (isAuthenticated && user) {
            // Show authenticated content
            authButtons.forEach(btn => btn.style.display = 'block');
            guestButtons.forEach(btn => btn.style.display = 'none');
            
            // Update user info
            userInfo.forEach(info => {
                info.innerHTML = `
                    <span>Olá, ${user.nome}</span>
                    <button onclick="authManager.logout()" class="btn-logout">Sair</button>
                `;
            });
        } else {
            // Show guest content
            authButtons.forEach(btn => btn.style.display = 'none');
            guestButtons.forEach(btn => btn.style.display = 'block');
            
            userInfo.forEach(info => {
                info.innerHTML = `
                    <button onclick="authManager.showLoginModal()" class="btn-login">Entrar</button>
                    <button onclick="authManager.showRegisterModal()" class="btn-register">Cadastrar</button>
                `;
            });
        }
    }

    setupEventListeners() {
        // Login form - modal
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form - modal
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Login form - payment page
        const emailLoginForm = document.getElementById('email-login');
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('✅ Email login form listener added');
        }

        // Register form - payment page
        const emailRegisterForm = document.getElementById('email-register');
        if (emailRegisterForm) {
            emailRegisterForm.addEventListener('submit', (e) => this.handleRegister(e));
            console.log('✅ Email register form listener added');
        }

        // Switch between login and register forms
        const switchToRegister = document.getElementById('switch-to-register');
        if (switchToRegister) {
            switchToRegister.addEventListener('click', () => {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('register-form').classList.remove('hidden');
            });
        }

        const switchToLogin = document.getElementById('switch-to-login');
        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                document.getElementById('register-form').classList.add('hidden');
                document.getElementById('login-form').classList.remove('hidden');
            });
        }

        // Google login
        const googleLoginBtn = document.getElementById('google-login-custom');
        if (googleLoginBtn) {
            // Já tem onclick direto no HTML
            console.log('✅ Google login button detected');
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        let form = event.target;
        let email, password;
        
        // Check which form is being submitted
        if (form.id === 'loginForm') {
            const formData = new FormData(form);
            email = formData.get('email');
            password = formData.get('senha');
        } else if (form.id === 'email-login') {
            email = document.getElementById('login-email').value;
            password = document.getElementById('login-password').value;
        }
        
        const credentials = {
            email: email,
            senha: password
        };

        // Validation
        if (!KengiAPI.FormValidation.validateEmail(credentials.email)) {
            KengiAPI.UIHelpers.showError('Email inválido');
            return;
        }

        if (!KengiAPI.FormValidation.validateRequired(credentials.senha)) {
            KengiAPI.UIHelpers.showError('Senha é obrigatória');
            return;
        }

        try {
            console.log('🔄 Processando login...');
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processando...';
            }
            
            // Simulate successful login (demo mode)
            const response = {
                success: true,
                data: {
                    token: 'demo_token_' + Date.now(),
                    usuario: {
                        id: 1,
                        nome: 'Usuário Demo',
                        email: credentials.email
                    }
                }
            };
            
            if (response.success) {
                // Save authentication data
                localStorage.setItem('kengi_auth_token', response.data.token);
                localStorage.setItem('kengi_user', JSON.stringify(response.data.usuario));
                
                console.log('✅ Login realizado com sucesso!');
                KengiAPI.UIHelpers.showSuccess('Login realizado com sucesso!');
                
                // Close modal if exists
                if (form.id === 'loginForm') {
                    this.closeModal('loginModal');
                }
                
                this.checkAuthStatus();
                
                // Proceed to next step if on payment page
                if (window.location.pathname.includes('pagamento')) {
                    console.log('📱 Estamos na página de pagamento, avançando para seleção de plano...');
                    setTimeout(() => {
                        this.proceedToPlanSelection();
                    }, 500);
                }
                
                // Redirect if needed
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            KengiAPI.UIHelpers.showError(error.message || 'Erro ao fazer login');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Entrar';
            }
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        let form = event.target;
        let userData;
        
        // Check which form is being submitted
        if (form.id === 'registerForm') {
            const formData = new FormData(form);
            userData = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                senha: formData.get('senha'),
                telefone: formData.get('telefone'),
                dataNascimento: formData.get('dataNascimento') || null
            };
        } else if (form.id === 'email-register') {
            userData = {
                nome: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                senha: document.getElementById('register-password').value,
                telefone: document.getElementById('register-phone')?.value || '',
                dataNascimento: null
            };
        }

        // Validation
        if (!KengiAPI.FormValidation.validateRequired(userData.nome)) {
            KengiAPI.UIHelpers.showError('Nome é obrigatório');
            return;
        }

        if (!KengiAPI.FormValidation.validateEmail(userData.email)) {
            KengiAPI.UIHelpers.showError('Email inválido');
            return;
        }

        if (!KengiAPI.FormValidation.validatePassword(userData.senha)) {
            KengiAPI.UIHelpers.showError('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (form.id === 'registerForm') {
            const confirmSenha = formData.get('confirmSenha');
            if (userData.senha !== confirmSenha) {
                KengiAPI.UIHelpers.showError('Senhas não coincidem');
                return;
            }
        } else {
            const confirmSenha = document.getElementById('register-confirm-password').value;
            if (userData.senha !== confirmSenha) {
                KengiAPI.UIHelpers.showError('Senhas não coincidem');
                return;
            }
        }

        try {
            console.log('🔄 Processando cadastro...');
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processando...';
            }
            
            // Simulate successful registration (demo mode)
            const response = {
                success: true,
                data: {
                    token: 'demo_token_' + Date.now(),
                    usuario: {
                        id: 1,
                        nome: userData.nome,
                        email: userData.email
                    }
                }
            };
            
            if (response.success) {
                // Save authentication data automatically after registration
                localStorage.setItem('kengi_auth_token', response.data.token);
                localStorage.setItem('kengi_user', JSON.stringify(response.data.usuario));
                
                console.log('✅ Cadastro realizado com sucesso!');
                KengiAPI.UIHelpers.showSuccess('Cadastro realizado com sucesso!');
                
                // Close modal if exists
                if (form.id === 'registerForm') {
                    this.closeModal('registerModal');
                }
                
                this.checkAuthStatus();
                
                // Proceed to next step if on payment page
                if (window.location.pathname.includes('pagamento')) {
                    console.log('📱 Estamos na página de pagamento, avançando para seleção de plano...');
                    setTimeout(() => {
                        this.proceedToPlanSelection();
                    }, 500);
                }
                
                // Redirect if needed
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }
            }
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            KengiAPI.UIHelpers.showError(error.message || 'Erro ao fazer cadastro');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Cadastrar';
            }
        }
    }
    
    // Método específico para avançar na página de pagamento
    proceedToPlanSelection() {
        // Atualizar a barra de progresso
        const step2 = document.getElementById('step-2');
        const step2Text = document.getElementById('step-2-text');
        
        if (step2 && step2Text) {
            // Atualizar o visual do passo 2
            step2.classList.remove('bg-[#ccd6e6]');
            step2.classList.add('bg-[#003057]');
            step2.classList.remove('text-[#003057]');
            step2.classList.add('text-white');
            step2Text.classList.remove('text-gray-500');
            step2Text.classList.add('text-[#003057]');
            
            // Esconder seção de auth e mostrar seção de planos
            const authSection = document.getElementById('auth-section');
            const planSection = document.getElementById('plan-section');
            
            if (authSection && planSection) {
                authSection.classList.add('hidden');
                planSection.classList.remove('hidden');
                console.log('✅ Avançado para seleção de plano!');
            } else {
                console.error('❌ Seções de auth ou plano não encontradas!');
            }
        } else {
            console.error('❌ Elementos do passo 2 não encontrados!');
        }
    }

    logout() {
        KengiAPI.AuthAPI.logout();
        this.checkAuthStatus();
        KengiAPI.UIHelpers.showSuccess('Logout realizado com sucesso!');
        
        // Redirect to home if on protected page
        if (window.location.pathname.includes('particular') || 
            window.location.pathname.includes('pagamento')) {
            window.location.href = '/';
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showRegisterModal() {
        this.showModal('registerModal');
    }

    showModal(modalId) {
        // Create modal if it doesn't exist
        if (!document.getElementById(modalId)) {
            this.createModal(modalId);
        }
        
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    createModal(modalId) {
        const modalHTML = modalId === 'loginModal' ? this.getLoginModalHTML() : this.getRegisterModalHTML();
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Setup event listeners for the new modal
        this.setupModalEventListeners(modalId);
    }

    setupModalEventListeners(modalId) {
        const modal = document.getElementById(modalId);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });

        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modalId));
        }

        // Switch between login/register
        const switchBtns = modal.querySelectorAll('.switch-modal');
        switchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetModal = btn.dataset.target;
                this.closeModal(modalId);
                this.showModal(targetModal);
            });
        });
    }

    getLoginModalHTML() {
        return `
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Entrar</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="loginForm" class="auth-form">
                        <div class="form-group">
                            <label for="loginEmail">Email:</label>
                            <input type="email" id="loginEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="loginSenha">Senha:</label>
                            <input type="password" id="loginSenha" name="senha" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Entrar</button>
                        </div>
                        <div class="form-footer">
                            <p>Não tem conta? <a href="#" class="switch-modal" data-target="registerModal">Cadastre-se</a></p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    getRegisterModalHTML() {
        return `
            <div id="registerModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Cadastrar</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="registerForm" class="auth-form">
                        <div class="form-group">
                            <label for="registerNome">Nome completo:</label>
                            <input type="text" id="registerNome" name="nome" required>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email:</label>
                            <input type="email" id="registerEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="registerTelefone">Telefone:</label>
                            <input type="tel" id="registerTelefone" name="telefone">
                        </div>
                        <div class="form-group">
                            <label for="registerDataNascimento">Data de nascimento:</label>
                            <input type="date" id="registerDataNascimento" name="dataNascimento">
                        </div>
                        <div class="form-group">
                            <label for="registerSenha">Senha:</label>
                            <input type="password" id="registerSenha" name="senha" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label for="registerConfirmSenha">Confirmar senha:</label>
                            <input type="password" id="registerConfirmSenha" name="confirmSenha" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">Cadastrar</button>
                        </div>
                        <div class="form-footer">
                            <p>Já tem conta? <a href="#" class="switch-modal" data-target="loginModal">Entrar</a></p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // Check if user needs to be authenticated for current page
    requireAuth() {
        if (!KengiAPI.AuthAPI.isAuthenticated()) {
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            this.showLoginModal();
            return false;
        }
        return true;
    }
}

// Google OAuth Functions
function initializeGoogleAuth() {
    console.log('Google OAuth initialized in demo mode');
}

function handleGoogleSignIn(googleUser) {
    // Simulate Google response in demo mode
    const profile = googleUser.getBasicProfile();
    const authResponse = googleUser.getAuthResponse();
    
    const demoUser = {
        id: 'demo_' + Date.now(),
        nome: 'Usuário Google Demo',
        email: profile.getEmail(),
        token: 'google_demo_token_' + Date.now()
    };

    // Save authentication data
    localStorage.setItem('kengi_auth_token', demoUser.token);
    localStorage.setItem('kengi_user', JSON.stringify({
        id: demoUser.id,
        nome: demoUser.nome,
        email: demoUser.email
    }));

    KengiAPI.UIHelpers.showSuccess('Login com Google realizado com sucesso!');
    window.authManager.checkAuthStatus();
    
    // Proceed to next step if on payment page
    if (window.location.pathname.includes('pagamento')) {
        setTimeout(() => {
            if (window.updateProgressStep && window.proceedToPlanSelection) {
                window.updateProgressStep(2);
                document.getElementById('auth-section').classList.add('hidden');
                document.getElementById('plan-section').classList.remove('hidden');
            }
        }, 1000);
    }
}

function handleGoogleSignInClick() {
    // Simulate Google login in demo mode
    const demoUser = {
        id: 'demo_' + Date.now(),
        nome: 'Usuário Google Demo',
        email: 'demo.user@gmail.com',
        token: 'google_demo_token_' + Date.now()
    };

    // Save authentication data
    localStorage.setItem('kengi_auth_token', demoUser.token);
    localStorage.setItem('kengi_user', JSON.stringify({
        id: demoUser.id,
        nome: demoUser.nome,
        email: demoUser.email
    }));

    KengiAPI.UIHelpers.showSuccess('Login com Google realizado com sucesso!');
    window.authManager.checkAuthStatus();
    
    // Proceed to next step if on payment page
    if (window.location.pathname.includes('pagamento')) {
        setTimeout(() => {
            if (window.updateProgressStep && window.proceedToPlanSelection) {
                window.updateProgressStep(2);
                document.getElementById('auth-section').classList.add('hidden');
                document.getElementById('plan-section').classList.remove('hidden');
            }
        }, 1000);
    }
}

// Expose functions globally
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleGoogleSignInClick = handleGoogleSignInClick;

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// CSS for modals (inject into head)
const modalCSS = `
<style>
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 0;
    border-radius: 12px;
    width: 90%;
    max-width: 450px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8f9fa;
    border-radius: 12px 12px 0 0;
}

.modal-header h2 {
    margin: 0;
    color: #003057;
    font-size: 24px;
    font-weight: 700;
}

.close-modal {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #6b7280;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
}

.close-modal:hover {
    color: #003057;
    background-color: #e5e7eb;
}

.auth-form {
    padding: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #003057;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #003057;
    box-shadow: 0 0 0 3px rgba(0, 48, 87, 0.1);
}

.form-actions {
    margin: 24px 0;
}

.btn-primary {
    width: 100%;
    padding: 14px;
    background-color: #d22630 !important;
    color: white !important;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease !important;
    box-shadow: 0 2px 4px rgba(210, 38, 48, 0.2);
}

.btn-primary:hover {
    background-color: #a91d25 !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(210, 38, 48, 0.4);
}

.btn-primary:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
}

.form-footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
}

.form-footer a {
    color: #d22630 !important;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.4s ease !important;
}

.form-footer a:hover {
    color: #a91d25 !important;
    text-decoration: underline;
}

.alert {
    padding: 12px 16px;
    margin: 12px 0;
    border-radius: 8px;
    position: relative;
    font-size: 14px;
}

.alert-error {
    background-color: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
}

.alert-success {
    background-color: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
}

.alert button {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
}

.alert button:hover {
    opacity: 1;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #6b7280;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-logout {
    padding: 6px 12px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease;
}

.btn-logout:hover {
    background-color: #c82333;
}

.btn-login, .btn-register {
    padding: 10px 20px;
    margin: 0 6px;
    background-color: #d22630 !important;
    color: white !important;
    border-radius: 8px;
    cursor: pointer;
    display: inline-block;
    font-weight: 500;
    transition: all 0.4s ease !important;
    font-size: 14px;
}

.btn-login:hover, .btn-register:hover {
    background-color: #a91d25 !important;
    color: white !important;
    text-decoration: underline white !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 12px rgba(210, 38, 48, 0.4);
}

.btn-register {
    background-color: #d22630 !important;
    border-color: #d22630 !important;
    color: white !important;
    transition: all 0.4s ease !important;
}

.btn-register:hover {
    background-color: #a91d25 !important;
    color: white !important;
    box-shadow: 0 6px 12px rgba(210, 38, 48, 0.4);
    transform: translateY(-2px) !important;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalCSS);