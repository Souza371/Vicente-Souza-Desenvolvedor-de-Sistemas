// Sistema de Analytics para Portfólio
class PortfolioAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.visitorId = this.generateVisitorId();
        this.pageViews = [];
        this.isTracking = true;
        
        this.init();
    }

    init() {
        this.trackPageView();
        this.trackTimeOnPage();
        this.trackUserInteractions();
        this.getLocationData();
        
        // Salvar dados quando o usuário sair da página
        window.addEventListener('beforeunload', () => {
            this.saveVisitorData();
        });

        // Salvar dados periodicamente
        setInterval(() => {
            this.saveVisitorData();
        }, 30000); // A cada 30 segundos
    }

    generateVisitorId() {
        let id = localStorage.getItem('visitor_id');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitor_id', id);
        }
        return id;
    }

    async getLocationData() {
        try {
            // Usar uma API gratuita para obter localização baseada no IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            this.locationData = {
                country: data.country_name,
                region: data.region,
                city: data.city,
                ip: data.ip,
                timezone: data.timezone
            };
        } catch (error) {
            console.log('Não foi possível obter dados de localização:', error);
            this.locationData = {
                country: 'Desconhecido',
                region: 'Desconhecido',
                city: 'Desconhecido',
                ip: 'Desconhecido',
                timezone: 'Desconhecido'
            };
        }
    }

    trackPageView() {
        const pageData = {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'Direct'
        };

        this.pageViews.push(pageData);
    }

    trackTimeOnPage() {
        this.startTime = Date.now();
        
        // Rastrear quando a aba perde o foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTime = Date.now();
            } else {
                if (this.pauseTime) {
                    this.startTime += (Date.now() - this.pauseTime);
                }
            }
        });
    }

    trackUserInteractions() {
        let interactions = 0;
        let scrollDepth = 0;
        let clicks = 0;

        // Rastrear cliques
        document.addEventListener('click', (e) => {
            clicks++;
            interactions++;
            
            // Rastrear cliques em links específicos
            if (e.target.tagName === 'A') {
                this.trackEvent('link_click', {
                    href: e.target.href,
                    text: e.target.textContent.trim()
                });
            }
        });

        // Rastrear scroll
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                scrollDepth = Math.max(scrollDepth, scrollPercent);
            }
        });

        // Salvar dados de interação
        this.interactions = {
            clicks: () => clicks,
            scrollDepth: () => scrollDepth,
            total: () => interactions
        };
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };

        // Salvar evento no localStorage
        const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
        events.push(event);
        
        // Manter apenas os últimos 1000 eventos
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('portfolio_events', JSON.stringify(events));
    }

    calculateTimeOnSite() {
        const now = Date.now();
        const timeOnSite = now - this.sessionStart;
        return Math.round(timeOnSite / 1000); // em segundos
    }

    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';

        if (ua.indexOf('Chrome') > -1) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Firefox') > -1) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Safari') > -1) {
            browser = 'Safari';
            version = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
        } else if (ua.indexOf('Edge') > -1) {
            browser = 'Edge';
            version = ua.match(/Edge\/([0-9.]+)/)?.[1] || 'Unknown';
        }

        return {
            browser,
            version,
            userAgent: ua,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    getDeviceInfo() {
        return {
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.angle : 0
        };
    }

    saveVisitorData() {
        if (!this.isTracking) return;

        const visitorData = {
            id: this.visitorId,
            timestamp: new Date().toISOString(),
            sessionStart: this.sessionStart,
            duration: this.calculateTimeOnSite(),
            page: window.location.pathname,
            pageTitle: document.title,
            referrer: document.referrer || 'Direct',
            location: this.locationData,
            browser: this.getBrowserInfo(),
            device: this.getDeviceInfo(),
            interactions: {
                clicks: this.interactions?.clicks() || 0,
                scrollDepth: this.interactions?.scrollDepth() || 0,
                total: this.interactions?.total() || 0
            },
            pageViews: this.pageViews,
            ip: this.locationData?.ip || 'Unknown',
            userAgent: navigator.userAgent
        };

        // Salvar no localStorage
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        
        // Verificar se já existe uma entrada para esta sessão
        const existingIndex = visitors.findIndex(v => v.id === this.visitorId && 
            new Date(v.timestamp).toDateString() === new Date().toDateString());

        if (existingIndex >= 0) {
            // Atualizar entrada existente
            visitors[existingIndex] = visitorData;
        } else {
            // Adicionar nova entrada
            visitors.push(visitorData);
        }

        // Manter apenas os últimos 500 visitantes
        if (visitors.length > 500) {
            visitors.splice(0, visitors.length - 500);
        }

        localStorage.setItem('portfolio_visitors', JSON.stringify(visitors));
    }

    // Método para desabilitar o rastreamento (GDPR compliance)
    disableTracking() {
        this.isTracking = false;
        localStorage.setItem('tracking_disabled', 'true');
    }

    // Método para habilitar o rastreamento
    enableTracking() {
        this.isTracking = true;
        localStorage.removeItem('tracking_disabled');
    }

    // Verificar se o rastreamento está desabilitado
    isTrackingDisabled() {
        return localStorage.getItem('tracking_disabled') === 'true';
    }
}

// Função para inicializar o analytics
function initPortfolioAnalytics() {
    // Verificar se o usuário optou por não ser rastreado
    if (localStorage.getItem('tracking_disabled') === 'true') {
        console.log('Rastreamento desabilitado pelo usuário');
        return;
    }

    // Criar instância do analytics
    window.portfolioAnalytics = new PortfolioAnalytics();
    
    // Adicionar eventos personalizados
    window.trackEvent = (name, data) => {
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent(name, data);
        }
    };
}

// Auto-inicializar se não estiver na página admin e se o usuário aceitou
if (!window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Verificar se o usuário já aceitou os termos de privacidade
        if (localStorage.getItem('privacy_accepted') === 'true') {
            initPortfolioAnalytics();
        }
    });
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnalytics;
}