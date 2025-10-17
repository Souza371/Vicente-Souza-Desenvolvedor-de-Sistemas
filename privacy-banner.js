// Banner de Privacidade/Cookies
class PrivacyBanner {
    constructor() {
        this.init();
    }

    init() {
        // Verificar se o usuário já aceitou
        if (localStorage.getItem('privacy_accepted') === 'true') {
            return;
        }

        this.createBanner();
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'privacy-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 20px;
            z-index: 10000;
            border-top: 2px solid #00d4ff;
            backdrop-filter: blur(10px);
            transform: translateY(100%);
            transition: transform 0.5s ease;
        `;

        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 300px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                        <i class="fas fa-info-circle" style="color: #00d4ff; margin-right: 8px;"></i>
                        Este site coleta dados de navegação para fins analíticos e melhoria da experiência do usuário. 
                        Os dados são armazenados localmente no seu navegador.
                    </p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button id="privacy-decline" style="
                        padding: 8px 16px;
                        background: transparent;
                        border: 1px solid #666;
                        color: #ccc;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 13px;
                        transition: all 0.3s ease;
                    ">Recusar</button>
                    <button id="privacy-accept" style="
                        padding: 8px 20px;
                        background: linear-gradient(45deg, #00d4ff, #8b5cf6);
                        border: none;
                        color: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 13px;
                        transition: all 0.3s ease;
                    ">Aceitar</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Animar entrada
        setTimeout(() => {
            banner.style.transform = 'translateY(0)';
        }, 1000);

        // Event listeners
        document.getElementById('privacy-accept').addEventListener('click', () => {
            this.acceptPrivacy(banner);
        });

        document.getElementById('privacy-decline').addEventListener('click', () => {
            this.declinePrivacy(banner);
        });

        // Adicionar hover effects
        const buttons = banner.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.3)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
    }

    acceptPrivacy(banner) {
        localStorage.setItem('privacy_accepted', 'true');
        this.removeBanner(banner);
        
        // Inicializar analytics se ainda não foi inicializado
        if (!window.portfolioAnalytics) {
            initPortfolioAnalytics();
        }
    }

    declinePrivacy(banner) {
        localStorage.setItem('privacy_accepted', 'false');
        localStorage.setItem('tracking_disabled', 'true');
        this.removeBanner(banner);
        
        // Desabilitar analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.disableTracking();
        }
    }

    removeBanner(banner) {
        banner.style.transform = 'translateY(100%)';
        setTimeout(() => {
            banner.remove();
        }, 500);
    }
}

// Inicializar banner quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyBanner();
});