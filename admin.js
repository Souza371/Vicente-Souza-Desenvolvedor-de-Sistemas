// Sistema de Analytics e Painel Administrativo
class AdminPanel {
    constructor() {
        this.visitors = this.loadVisitors();
        this.init();
    }

    init() {
        this.updateStats();
        this.renderVisitors();
        this.setupSearch();
        this.setupRealTimeUpdates();
        this.updateSessionInfo();
        this.startSessionTimer();
    }

    loadVisitors() {
        const stored = localStorage.getItem('portfolio_visitors');
        return stored ? JSON.parse(stored) : [];
    }

    saveVisitors() {
        localStorage.setItem('portfolio_visitors', JSON.stringify(this.visitors));
    }

    updateStats() {
        const today = new Date().toDateString();
        const todayVisitors = this.visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );

        // Total de visitantes
        document.getElementById('totalVisitors').textContent = this.visitors.length;

        // Visitantes hoje
        document.getElementById('todayVisitors').textContent = todayVisitors.length;

        // Tempo médio de permanência
        const avgDuration = this.calculateAverageDuration();
        document.getElementById('avgDuration').textContent = avgDuration;

        // Países únicos
        const uniqueCountries = new Set(
            this.visitors.map(v => v.location?.country).filter(Boolean)
        ).size;
        document.getElementById('uniqueCountries').textContent = uniqueCountries;
    }

    calculateAverageDuration() {
        const validDurations = this.visitors
            .map(v => v.duration)
            .filter(d => d && d > 0);

        if (validDurations.length === 0) return '0min';

        const avgSeconds = validDurations.reduce((a, b) => a + b, 0) / validDurations.length;
        const minutes = Math.round(avgSeconds / 60);
        return `${minutes}min`;
    }

    renderVisitors() {
        const container = document.getElementById('visitorsList');
        
        if (this.visitors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>Nenhum visitante registrado ainda</h3>
                    <p>Os dados aparecerão aqui quando alguém visitar seu portfólio</p>
                </div>
            `;
            return;
        }

        // Ordenar por data mais recente
        const sortedVisitors = [...this.visitors].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        container.innerHTML = sortedVisitors.map(visitor => `
            <div class="visitor-item" data-visitor='${JSON.stringify(visitor)}'>
                <span data-label="Data/Hora">
                    ${this.formatDateTime(visitor.timestamp)}
                </span>
                <span data-label="IP/Localização">
                    <div>${visitor.ip || 'N/A'}</div>
                    <div style="font-size: 0.9em; color: #888;">
                        ${this.formatLocation(visitor.location)}
                    </div>
                </span>
                <span data-label="Navegador" class="visitor-browser">
                    ${this.formatBrowser(visitor.userAgent)}
                </span>
                <span data-label="Página">
                    ${visitor.page || '/'}
                </span>
                <span data-label="Duração" class="visitor-duration">
                    ${this.formatDuration(visitor.duration)}
                </span>
            </div>
        `).join('');
    }

    formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatLocation(location) {
        if (!location) return 'Localização desconhecida';
        
        const parts = [];
        if (location.city) parts.push(location.city);
        if (location.region) parts.push(location.region);
        if (location.country) parts.push(location.country);
        
        return parts.join(', ') || 'Localização desconhecida';
    }

    formatBrowser(userAgent) {
        if (!userAgent) return 'Navegador desconhecido';
        
        // Detectar navegador principal
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        
        return 'Outro';
    }

    formatDuration(duration) {
        if (!duration || duration < 1) return '< 1s';
        
        if (duration < 60) return `${Math.round(duration)}s`;
        
        const minutes = Math.floor(duration / 60);
        const seconds = Math.round(duration % 60);
        
        if (minutes < 60) {
            return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
        }
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterVisitors(e.target.value);
        });
    }

    filterVisitors(searchTerm) {
        const items = document.querySelectorAll('.visitor-item');
        const term = searchTerm.toLowerCase();

        items.forEach(item => {
            const visitorData = JSON.parse(item.dataset.visitor);
            const searchableText = [
                visitorData.ip,
                this.formatLocation(visitorData.location),
                this.formatBrowser(visitorData.userAgent),
                visitorData.page,
                this.formatDateTime(visitorData.timestamp)
            ].join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                item.style.display = 'grid';
            } else {
                item.style.display = 'none';
            }
        });
    }

    setupRealTimeUpdates() {
        // Atualizar dados a cada 30 segundos
        setInterval(() => {
            const newVisitors = this.loadVisitors();
            if (newVisitors.length !== this.visitors.length) {
                this.visitors = newVisitors;
                this.updateStats();
                this.renderVisitors();
                this.showNotification('Novos visitantes detectados!');
            }
        }, 30000);
    }

    updateSessionInfo() {
        const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
        const sessionUser = document.getElementById('sessionUser');
        
        if (sessionUser && authData.user) {
            sessionUser.textContent = `Logado como: ${authData.user}`;
        }
    }

    startSessionTimer() {
        const updateTimer = () => {
            const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
            const sessionTime = document.getElementById('sessionTime');
            
            if (sessionTime && authData.timestamp) {
                const elapsed = Date.now() - authData.timestamp;
                const hours = Math.floor(elapsed / (1000 * 60 * 60));
                const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
                
                sessionTime.textContent = `Sessão: ${hours}h ${minutes}m`;
                
                // Verificar se a sessão está prestes a expirar (últimos 30 minutos)
                const timeLeft = (24 * 60 * 60 * 1000) - elapsed;
                if (timeLeft < 30 * 60 * 1000 && timeLeft > 0) {
                    const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
                    this.showNotification(`Sessão expira em ${minutesLeft} minutos`);
                }
            }
        };
        
        updateTimer();
        setInterval(updateTimer, 60000); // Atualizar a cada minuto
    }

    showNotification(message) {
        // Criar notificação simples
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #00d4ff, #8b5cf6);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    exportData() {
        const dataStr = JSON.stringify(this.visitors, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `visitors_${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Dados exportados com sucesso!');
    }

    clearData() {
        if (confirm('Tem certeza que deseja limpar todos os dados de visitantes? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('portfolio_visitors');
            this.visitors = [];
            this.updateStats();
            this.renderVisitors();
            this.showNotification('Dados limpos com sucesso!');
        }
    }
}

// Funções globais para os botões
function exportData() {
    window.adminPanel.exportData();
}

function clearData() {
    window.adminPanel.clearData();
}

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Inicializar painel apenas se autenticado
function initAdminPanel() {
    window.adminPanel = new AdminPanel();
}

// Verificar autenticação antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar verificação de autenticação
    setTimeout(() => {
        const authData = localStorage.getItem('admin_auth');
        if (authData) {
            try {
                const data = JSON.parse(authData);
                const now = Date.now();
                
                // Verificar se a sessão não expirou
                if (data.authenticated && (now - data.timestamp <= 24 * 60 * 60 * 1000)) {
                    initAdminPanel();
                }
            } catch (error) {
                console.log('Erro na autenticação');
            }
        }
    }, 100);
});