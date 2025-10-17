// Sistema de Autenticação para Painel Administrativo
class AdminAuth {
    constructor() {
        this.checkAuthAndInit();
    }

    checkAuthAndInit() {
        // Se já está autenticado, permitir que a página carregue normalmente
        if (this.isAuthenticated()) {
            console.log('Usuário autenticado, carregando painel...');
            return;
        }
        
        // Se não está autenticado, mostrar tela de login
        console.log('Usuário não autenticado, mostrando login...');
        this.showLoginForm();
    }

    isAuthenticated() {
        const authData = localStorage.getItem('admin_auth');
        if (!authData) return false;

        try {
            const data = JSON.parse(authData);
            const now = Date.now();
            
            // Verificar se a sessão não expirou (24 horas)
            if (now - data.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('admin_auth');
                return false;
            }

            return data.authenticated === true;
        } catch (error) {
            localStorage.removeItem('admin_auth');
            return false;
        }
    }

    showLoginForm() {
        document.body.innerHTML = `
            <div class="login-container">
                <div class="login-box">
                    <div class="login-header">
                        <i class="fas fa-shield-alt"></i>
                        <h1>Acesso Restrito</h1>
                        <p>Painel Administrativo - Vicente Souza</p>
                    </div>
                    
                    <form class="login-form" id="loginForm">
                        <div class="input-group">
                            <i class="fas fa-user"></i>
                            <input type="text" id="username" placeholder="Usuário" required>
                        </div>
                        
                        <div class="input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="password" placeholder="Senha" required>
                        </div>
                        
                        <button type="submit" class="login-btn">
                            <i class="fas fa-sign-in-alt"></i>
                            Entrar
                        </button>
                        
                        <div class="login-footer">
                            <a href="index.html" class="back-link">
                                <i class="fas fa-arrow-left"></i>
                                Voltar ao Portfólio
                            </a>
                        </div>
                    </form>
                    
                    <div class="error-message" id="errorMessage" style="display: none;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Credenciais inválidas!</span>
                    </div>
                </div>
                
                <div class="particles-bg"></div>
            </div>
        `;

        this.setupLoginStyles();
        this.setupLoginEvents();
    }

    setupLoginStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
                color: #ffffff;
                height: 100vh;
                overflow: hidden;
            }

            .login-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                position: relative;
            }

            .particles-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(2px 2px at 20px 30px, #00d4ff, transparent),
                    radial-gradient(2px 2px at 40px 70px, #8b5cf6, transparent),
                    radial-gradient(1px 1px at 90px 40px, #00ff88, transparent),
                    radial-gradient(1px 1px at 130px 80px, #ff6b6b, transparent);
                background-size: 200px 200px;
                animation: particlesMove 20s infinite linear;
                opacity: 0.3;
                z-index: -1;
            }

            @keyframes particlesMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(-200px, -200px); }
            }

            .login-box {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 15px;
                padding: 40px;
                width: 400px;
                max-width: 90vw;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.8s ease;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .login-header i {
                font-size: 3rem;
                color: #00d4ff;
                margin-bottom: 15px;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .login-header h1 {
                font-size: 1.8rem;
                margin-bottom: 8px;
                background: linear-gradient(45deg, #00d4ff, #8b5cf6);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .login-header p {
                color: #888;
                font-size: 0.9rem;
            }

            .login-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .input-group {
                position: relative;
                display: flex;
                align-items: center;
            }

            .input-group i {
                position: absolute;
                left: 15px;
                color: #00d4ff;
                z-index: 1;
            }

            .input-group input {
                width: 100%;
                padding: 15px 15px 15px 45px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 8px;
                color: #ffffff;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .input-group input:focus {
                outline: none;
                border-color: #00d4ff;
                box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                background: rgba(255, 255, 255, 0.08);
            }

            .input-group input::placeholder {
                color: #888;
            }

            .login-btn {
                padding: 15px;
                background: linear-gradient(45deg, #00d4ff, #8b5cf6);
                border: none;
                border-radius: 8px;
                color: #ffffff;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 10px;
            }

            .login-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 212, 255, 0.4);
            }

            .login-btn:active {
                transform: translateY(0);
            }

            .login-footer {
                text-align: center;
                margin-top: 20px;
            }

            .back-link {
                color: #888;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .back-link:hover {
                color: #00d4ff;
            }

            .error-message {
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid #ff6b6b;
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                color: #ff6b6b;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: shake 0.5s ease;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @media (max-width: 480px) {
                .login-box {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .login-header h1 {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupLoginEvents() {
        const form = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.validateCredentials(username, password)) {
                this.authenticate();
                window.location.reload(); // Recarregar página após login bem-sucedido
            } else {
                this.showError();
            }
        });
    }

    validateCredentials(username, password) {
        // Verificar se está bloqueado por tentativas excessivas
        if (this.isBlocked()) {
            return false;
        }

        // Credenciais personalizadas do Vicente
        const validCredentials = [
            { username: 'vicente371', password: 'Abacaxi371@' }
        ];

        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (!isValid) {
            this.recordFailedAttempt();
        } else {
            this.clearFailedAttempts();
        }

        return isValid;
    }

    recordFailedAttempt() {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
        attempts.push(Date.now());
        
        // Manter apenas tentativas das últimas 2 horas
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        const recentAttempts = attempts.filter(time => time > twoHoursAgo);
        
        localStorage.setItem('login_attempts', JSON.stringify(recentAttempts));
    }

    clearFailedAttempts() {
        localStorage.removeItem('login_attempts');
    }

    isBlocked() {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
        const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
        const recentAttempts = attempts.filter(time => time > fifteenMinutesAgo);
        
        return recentAttempts.length >= 5; // Bloquear após 5 tentativas em 15 minutos
    }

    getBlockTimeRemaining() {
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
        if (attempts.length === 0) return 0;
        
        const lastAttempt = Math.max(...attempts);
        const blockUntil = lastAttempt + (15 * 60 * 1000); // 15 minutos de bloqueio
        const remaining = blockUntil - Date.now();
        
        return Math.max(0, Math.ceil(remaining / 1000 / 60)); // minutos restantes
    }

    authenticate() {
        const authData = {
            authenticated: true,
            timestamp: Date.now(),
            user: document.getElementById('username').value
        };
        
        localStorage.setItem('admin_auth', JSON.stringify(authData));
    }

    showError() {
        const errorMessage = document.getElementById('errorMessage');
        const errorSpan = errorMessage.querySelector('span');
        
        if (this.isBlocked()) {
            const remainingTime = this.getBlockTimeRemaining();
            errorSpan.textContent = `Muitas tentativas falharam. Tente novamente em ${remainingTime} minutos.`;
            errorMessage.style.borderColor = '#ff8e8e';
            errorMessage.style.background = 'rgba(255, 142, 142, 0.15)';
        } else {
            const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
            const recentAttempts = attempts.filter(time => time > Date.now() - (15 * 60 * 1000));
            const remaining = 5 - recentAttempts.length;
            
            errorSpan.textContent = `Credenciais inválidas! ${remaining} tentativas restantes.`;
            errorMessage.style.borderColor = '#ff6b6b';
            errorMessage.style.background = 'rgba(255, 107, 107, 0.1)';
        }
        
        errorMessage.style.display = 'flex';
        
        // Ocultar erro após 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }



    logout() {
        localStorage.removeItem('admin_auth');
        window.location.reload();
    }
}

// Função global para logout
function adminLogout() {
    if (window.adminAuth) {
        window.adminAuth.logout();
    }
}

// Verificar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});