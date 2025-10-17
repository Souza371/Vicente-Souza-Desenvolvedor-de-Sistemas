// Sistema de Notificações em Tempo Real
class RealTimeNotifications {
    constructor() {
        this.isMonitoring = false;
        this.lastVisitorCount = 0;
        this.notificationPermission = false;
        this.soundEnabled = true;
        this.emailReports = false;
        this.init();
    }

    async init() {
        // Solicitar permissão para notificações
        await this.requestNotificationPermission();
        
        // Iniciar monitoramento se estiver no admin
        if (window.location.pathname.includes('admin.html')) {
            this.startRealTimeMonitoring();
            this.setupNotificationControls();
        }
        
        // Registrar visitante se estiver na página principal
        if (!window.location.pathname.includes('admin.html')) {
            this.registerVisitorAndNotify();
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
            
            if (this.notificationPermission) {
                console.log('✅ Notificações habilitadas');
            } else {
                console.log('❌ Notificações negadas pelo usuário');
            }
        }
    }

    registerVisitorAndNotify() {
        // Só registrar se o analytics estiver ativo
        if (window.portfolioAnalytics) {
            // Adicionar evento personalizado para nova visita
            setTimeout(() => {
                this.notifyAdminOfNewVisitor();
            }, 2000); // Aguardar 2 segundos para registrar a visita
        }
    }

    async notifyAdminOfNewVisitor() {
        const visitorData = this.getCurrentVisitorData();
        
        // Salvar notificação para o admin
        this.saveNotificationForAdmin(visitorData);
        
        // Se o admin estiver online, notificar imediatamente
        this.sendBrowserNotification(visitorData);
    }

    getCurrentVisitorData() {
        const now = new Date();
        return {
            timestamp: now.toISOString(),
            time: now.toLocaleString('pt-BR'),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Acesso direto',
            language: navigator.language,
            screenSize: `${screen.width}x${screen.height}`
        };
    }

    saveNotificationForAdmin(visitorData) {
        const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        
        const notification = {
            id: Date.now(),
            type: 'new_visitor',
            data: visitorData,
            timestamp: Date.now(),
            read: false
        };
        
        notifications.unshift(notification);
        
        // Manter apenas as últimas 100 notificações
        if (notifications.length > 100) {
            notifications.splice(100);
        }
        
        localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    }

    sendBrowserNotification(visitorData) {
        if (!this.notificationPermission) return;
        
        const notification = new Notification('🆕 Novo Visitante no Portfólio!', {
            body: `Alguém está visitando ${visitorData.page} agora\n${visitorData.time}`,
            icon: 'favicon.svg',
            tag: 'new-visitor',
            requireInteraction: false,
            silent: false
        });
        
        // Tocar som se habilitado
        if (this.soundEnabled) {
            this.playNotificationSound();
        }
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
        
        // Ao clicar, abrir painel admin
        notification.onclick = () => {
            window.open('/admin.html', '_blank');
            notification.close();
        };
    }

    playNotificationSound() {
        // Criar som de notificação usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Sequência de tons para notificação agradável
        const notes = [440, 554.37, 659.25]; // A4, C#5, E5
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }, index * 100);
        });
    }

    startRealTimeMonitoring() {
        this.isMonitoring = true;
        this.lastVisitorCount = this.getVisitorCount();
        
        // Verificar novos visitantes a cada 10 segundos
        setInterval(() => {
            this.checkForNewVisitors();
        }, 10000);
        
        // Atualizar badge de notificações
        this.updateNotificationBadge();
        setInterval(() => {
            this.updateNotificationBadge();
        }, 5000);
    }

    checkForNewVisitors() {
        const currentCount = this.getVisitorCount();
        
        if (currentCount > this.lastVisitorCount) {
            const newVisitors = currentCount - this.lastVisitorCount;
            this.showAdminNotification(`🆕 ${newVisitors} novo(s) visitante(s)!`);
            
            // Tocar som
            if (this.soundEnabled) {
                this.playNotificationSound();
            }
            
            this.lastVisitorCount = currentCount;
        }
    }

    getVisitorCount() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        return visitors.length;
    }

    showAdminNotification(message) {
        // Criar notificação no painel admin
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-users"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(45deg, #00d4ff, #8b5cf6);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover após 8 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    updateNotificationBadge() {
        const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        const unreadCount = notifications.filter(n => !n.read).length;
        
        let badge = document.getElementById('notificationBadge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'notificationBadge';
            badge.style.cssText = `
                position: fixed;
                top: 15px;
                right: 80px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                z-index: 10001;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(badge);
        }
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
            badge.style.animation = 'pulse 2s infinite';
        } else {
            badge.style.display = 'none';
        }
    }

    setupNotificationControls() {
        // Adicionar controles de notificação ao painel admin
        const controls = document.createElement('div');
        controls.id = 'notificationControls';
        controls.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
            ">
                <h4 style="color: #00d4ff; margin-bottom: 10px; font-size: 14px;">
                    <i class="fas fa-bell"></i> Notificações
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="soundToggle" ${this.soundEnabled ? 'checked' : ''}>
                        <i class="fas fa-volume-up"></i> Som
                    </label>
                    <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="browserNotifications" ${this.notificationPermission ? 'checked' : ''}>
                        <i class="fas fa-desktop"></i> Push
                    </label>
                    <button id="testNotification" style="
                        background: #00d4ff;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                    ">Testar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Event listeners
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            localStorage.setItem('sound_notifications', this.soundEnabled);
        });
        
        document.getElementById('testNotification').addEventListener('click', () => {
            this.sendBrowserNotification({
                page: '/test',
                time: new Date().toLocaleString('pt-BR')
            });
        });
    }

    // Método para gerar relatório diário
    generateDailyReport() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const today = new Date().toDateString();
        const todayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );
        
        const report = {
            date: today,
            totalVisitors: todayVisitors.length,
            visitors: todayVisitors,
            topCountries: this.getTopCountries(todayVisitors),
            topBrowsers: this.getTopBrowsers(todayVisitors),
            averageTime: this.calculateAverageTime(todayVisitors)
        };
        
        return report;
    }

    getTopCountries(visitors) {
        const countries = {};
        visitors.forEach(v => {
            const country = v.location?.country || 'Desconhecido';
            countries[country] = (countries[country] || 0) + 1;
        });
        
        return Object.entries(countries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    getTopBrowsers(visitors) {
        const browsers = {};
        visitors.forEach(v => {
            const browser = this.getBrowserName(v.userAgent);
            browsers[browser] = (browsers[browser] || 0) + 1;
        });
        
        return Object.entries(browsers)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    getBrowserName(userAgent) {
        if (userAgent?.includes('Chrome')) return 'Chrome';
        if (userAgent?.includes('Firefox')) return 'Firefox';
        if (userAgent?.includes('Safari')) return 'Safari';
        if (userAgent?.includes('Edge')) return 'Edge';
        return 'Outro';
    }

    calculateAverageTime(visitors) {
        const validDurations = visitors
            .map(v => v.duration)
            .filter(d => d && d > 0);
        
        if (validDurations.length === 0) return 0;
        
        return Math.round(
            validDurations.reduce((a, b) => a + b, 0) / validDurations.length
        );
    }
}

// Adicionar estilos CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 1;
        }
        50% { 
            transform: scale(1.1);
            opacity: 0.8;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
`;

document.head.appendChild(notificationStyles);

// Inicializar sistema de notificações
document.addEventListener('DOMContentLoaded', () => {
    window.realTimeNotifications = new RealTimeNotifications();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeNotifications;
}