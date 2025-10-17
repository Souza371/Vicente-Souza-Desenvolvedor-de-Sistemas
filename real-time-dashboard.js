// Dashboard em Tempo Real - Atualizações Automáticas
class RealTimeDashboard {
    constructor() {
        this.updateInterval = 5000; // Atualizar a cada 5 segundos
        this.isActive = true;
        this.lastUpdate = 0;
        this.visibilityThreshold = 30000; // 30 segundos para detectar inatividade
        this.init();
    }

    init() {
        // Só ativar no painel admin
        if (!window.location.pathname.includes('admin.html')) return;
        
        this.startAutoUpdate();
        this.setupVisibilityDetection();
        this.addLiveIndicator();
        this.setupAutoRefreshControls();
    }

    startAutoUpdate() {
        // Atualização principal
        this.updateTimer = setInterval(() => {
            if (this.isActive) {
                this.performLiveUpdate();
            }
        }, this.updateInterval);

        // Primeira atualização imediata
        setTimeout(() => this.performLiveUpdate(), 1000);
    }

    performLiveUpdate() {
        const now = Date.now();
        
        // Atualizar estatísticas
        this.updateLiveStats();
        
        // Atualizar lista de visitantes
        this.updateVisitorsList();
        
        // Atualizar indicador de atividade
        this.updateActivityIndicator();
        
        // Verificar novos visitantes
        this.checkForNewVisitors();
        
        this.lastUpdate = now;
    }

    updateLiveStats() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = new Date();
        const today = now.toDateString();
        const thisHour = now.getHours();
        
        // Visitantes hoje
        const todayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );
        
        // Visitantes na última hora
        const lastHour = visitors.filter(v => {
            const visitorTime = new Date(v.timestamp);
            return (now - visitorTime) < 60 * 60 * 1000; // 1 hora
        });
        
        // Visitantes ativos (últimos 5 minutos)
        const activeVisitors = visitors.filter(v => {
            const visitorTime = new Date(v.timestamp);
            return (now - visitorTime) < 5 * 60 * 1000; // 5 minutos
        });

        // Atualizar elementos se existirem
        this.updateStatElement('todayVisitors', todayVisitors.length);
        this.updateStatElement('totalVisitors', visitors.length);
        this.updateStatElement('hourlyVisitors', lastHour.length);
        this.updateStatElement('activeVisitors', activeVisitors.length);
        
        // Adicionar estatísticas extras se não existirem
        this.addExtraStats(lastHour.length, activeVisitors.length);
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const oldValue = parseInt(element.textContent) || 0;
            element.textContent = value;
            
            // Animar se houve mudança
            if (value > oldValue) {
                element.style.animation = 'none';
                setTimeout(() => {
                    element.style.animation = 'pulse 0.5s ease';
                }, 10);
            }
        }
    }

    addExtraStats(hourlyCount, activeCount) {
        // Adicionar estatísticas de hora e ativos se não existirem
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        // Verificar se já existem
        if (!document.getElementById('hourlyVisitors')) {
            const hourlyCard = this.createStatCard('hourlyVisitors', hourlyCount, 'Última Hora', 'fa-clock');
            statsGrid.appendChild(hourlyCard);
        }

        if (!document.getElementById('activeVisitors')) {
            const activeCard = this.createStatCard('activeVisitors', activeCount, 'Ativos Agora', 'fa-eye', '#00ff88');
            statsGrid.appendChild(activeCard);
        }
    }

    createStatCard(id, value, label, icon, color = '#00d4ff') {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <i class="fas ${icon}" style="color: ${color}"></i>
            <h3 id="${id}">${value}</h3>
            <p>${label}</p>
        `;
        return card;
    }

    updateVisitorsList() {
        // Verificar se há novos visitantes para atualizar a lista
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const visitorsList = document.getElementById('visitorsList');
        
        if (!visitorsList || !window.adminPanel) return;
        
        // Se o número de visitantes mudou, atualizar
        if (visitors.length !== this.lastVisitorCount) {
            window.adminPanel.visitors = visitors;
            window.adminPanel.renderVisitors();
            this.lastVisitorCount = visitors.length;
        }
    }

    updateActivityIndicator() {
        let indicator = document.getElementById('liveIndicator');
        if (!indicator) return;
        
        const now = Date.now();
        const timeSinceUpdate = now - this.lastUpdate;
        
        // Atualizar status baseado na última atualização
        if (timeSinceUpdate < 10000) { // Menos de 10 segundos
            indicator.className = 'live-indicator active';
            indicator.querySelector('.status-text').textContent = 'Ao Vivo';
        } else {
            indicator.className = 'live-indicator inactive';
            indicator.querySelector('.status-text').textContent = 'Reconectando...';
        }
    }

    addLiveIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'liveIndicator';
        indicator.className = 'live-indicator active';
        indicator.innerHTML = `
            <div class="live-dot"></div>
            <span class="status-text">Ao Vivo</span>
            <span class="last-update">Agora</span>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 212, 255, 0.3);
        `;
        
        document.body.appendChild(indicator);
        
        // Adicionar estilos CSS
        this.addIndicatorStyles();
        
        // Atualizar timestamp a cada segundo
        setInterval(() => {
            this.updateTimestamp();
        }, 1000);
    }

    addIndicatorStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .live-indicator.active .live-dot {
                width: 8px;
                height: 8px;
                background: #00ff88;
                border-radius: 50%;
                animation: livePulse 2s infinite;
            }
            
            .live-indicator.inactive .live-dot {
                width: 8px;
                height: 8px;
                background: #ff6b6b;
                border-radius: 50%;
                animation: errorBlink 1s infinite;
            }
            
            @keyframes livePulse {
                0%, 100% { 
                    transform: scale(1);
                    opacity: 1;
                }
                50% { 
                    transform: scale(1.2);
                    opacity: 0.7;
                }
            }
            
            @keyframes errorBlink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            
            .status-text {
                font-weight: 500;
            }
            
            .last-update {
                opacity: 0.7;
                font-size: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    updateTimestamp() {
        const indicator = document.getElementById('liveIndicator');
        if (!indicator) return;
        
        const now = Date.now();
        const timeSinceUpdate = Math.floor((now - this.lastUpdate) / 1000);
        const lastUpdateElement = indicator.querySelector('.last-update');
        
        if (timeSinceUpdate < 60) {
            lastUpdateElement.textContent = timeSinceUpdate < 5 ? 'Agora' : `${timeSinceUpdate}s atrás`;
        } else {
            const minutes = Math.floor(timeSinceUpdate / 60);
            lastUpdateElement.textContent = `${minutes}m atrás`;
        }
    }

    setupVisibilityDetection() {
        // Pausar atualizações quando a aba não está visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                console.log('Dashboard pausado - aba não visível');
            } else {
                this.isActive = true;
                console.log('Dashboard retomado - aba visível');
                // Atualizar imediatamente ao voltar
                setTimeout(() => this.performLiveUpdate(), 100);
            }
        });
        
        // Detectar inatividade do usuário
        let inactivityTimer;
        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            this.isActive = true;
            
            inactivityTimer = setTimeout(() => {
                console.log('Dashboard pausado - usuário inativo');
                this.isActive = false;
            }, this.visibilityThreshold);
        };
        
        // Eventos de atividade
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, true);
        });
        
        resetInactivityTimer();
    }

    setupAutoRefreshControls() {
        // Adicionar controles de auto-refresh ao painel
        const controls = document.createElement('div');
        controls.id = 'autoRefreshControls';
        controls.innerHTML = `
            <div style="
                position: fixed;
                bottom: 80px;
                left: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                min-width: 200px;
            ">
                <h4 style="color: #00d4ff; margin-bottom: 10px; font-size: 14px;">
                    <i class="fas fa-sync-alt"></i> Auto-Atualização
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: white; font-size: 12px;">
                        Intervalo: <select id="updateInterval" style="background: rgba(0,0,0,0.5); color: white; border: 1px solid #333; border-radius: 3px; padding: 2px;">
                            <option value="5000">5 segundos</option>
                            <option value="10000">10 segundos</option>
                            <option value="30000">30 segundos</option>
                            <option value="60000">1 minuto</option>
                        </select>
                    </label>
                    <div style="display: flex; gap: 5px; margin-top: 5px;">
                        <button id="pauseUpdates" style="
                            background: #ff6b6b;
                            border: none;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 11px;
                            cursor: pointer;
                            flex: 1;
                        ">Pausar</button>
                        <button id="forceUpdate" style="
                            background: #00d4ff;
                            border: none;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 11px;
                            cursor: pointer;
                            flex: 1;
                        ">Atualizar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Event listeners
        document.getElementById('updateInterval').addEventListener('change', (e) => {
            this.updateInterval = parseInt(e.target.value);
            this.restartTimer();
        });
        
        document.getElementById('pauseUpdates').addEventListener('click', (e) => {
            this.isActive = !this.isActive;
            e.target.textContent = this.isActive ? 'Pausar' : 'Continuar';
            e.target.style.background = this.isActive ? '#ff6b6b' : '#00ff88';
        });
        
        document.getElementById('forceUpdate').addEventListener('click', () => {
            this.performLiveUpdate();
        });
    }

    restartTimer() {
        clearInterval(this.updateTimer);
        this.startAutoUpdate();
    }

    checkForNewVisitors() {
        // Verificar se há visitantes muito recentes (últimos 30 segundos)
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = Date.now();
        const recentVisitors = visitors.filter(v => {
            const visitorTime = new Date(v.timestamp).getTime();
            return (now - visitorTime) < 30000; // 30 segundos
        });
        
        if (recentVisitors.length > 0 && window.realTimeNotifications) {
            // Mostrar notificação de visitante muito recente
            recentVisitors.forEach(visitor => {
                if (!visitor.notified) {
                    window.realTimeNotifications.showAdminNotification(
                        `🔥 Visitante ativo: ${visitor.location?.city || 'Local desconhecido'}`
                    );
                    visitor.notified = true;
                }
            });
            
            // Salvar de volta com flag de notificado
            localStorage.setItem('portfolio_visitors', JSON.stringify(visitors));
        }
    }

    // Método para estatísticas avançadas
    getAdvancedStats() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = new Date();
        
        return {
            totalVisitors: visitors.length,
            todayVisitors: visitors.filter(v => 
                new Date(v.timestamp).toDateString() === now.toDateString()
            ).length,
            thisWeekVisitors: visitors.filter(v => {
                const visitorDate = new Date(v.timestamp);
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return visitorDate >= weekAgo;
            }).length,
            averageSessionTime: this.calculateAverageTime(visitors),
            topCountries: this.getTopCountries(visitors.slice(-50)), // Últimos 50
            peakHour: this.getPeakHour(visitors)
        };
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

    getTopCountries(visitors) {
        const countries = {};
        visitors.forEach(v => {
            const country = v.location?.country || 'Desconhecido';
            countries[country] = (countries[country] || 0) + 1;
        });
        
        return Object.entries(countries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
    }

    getPeakHour(visitors) {
        const hours = {};
        visitors.forEach(v => {
            const hour = new Date(v.timestamp).getHours();
            hours[hour] = (hours[hour] || 0) + 1;
        });
        
        const peakHour = Object.entries(hours)
            .sort(([,a], [,b]) => b - a)[0];
        
        return peakHour ? parseInt(peakHour[0]) : null;
    }
}

// Inicializar dashboard em tempo real
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros sistemas carregaram
    setTimeout(() => {
        window.realTimeDashboard = new RealTimeDashboard();
    }, 2000);
});