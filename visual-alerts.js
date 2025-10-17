// Sistema de Indicadores Visuais e Alertas Sonoros
class VisualAlertsSystem {
    constructor() {
        this.soundEnabled = true;
        this.visualEnabled = true;
        this.lastVisitorCount = 0;
        this.alertHistory = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.createFloatingIndicator();
        this.startMonitoring();
        this.setupSoundSystem();
        
        // Só adicionar controles no admin
        if (window.location.pathname.includes('admin.html')) {
            this.setupControls();
        }
    }

    loadSettings() {
        this.soundEnabled = localStorage.getItem('sound_enabled') !== 'false';
        this.visualEnabled = localStorage.getItem('visual_enabled') !== 'false';
        this.lastVisitorCount = parseInt(localStorage.getItem('last_visitor_count') || '0');
    }

    saveSettings() {
        localStorage.setItem('sound_enabled', this.soundEnabled);
        localStorage.setItem('visual_enabled', this.visualEnabled);
        localStorage.setItem('last_visitor_count', this.lastVisitorCount);
    }

    createFloatingIndicator() {
        // Só mostrar no admin
        if (!window.location.pathname.includes('admin.html')) return;

        const indicator = document.createElement('div');
        indicator.id = 'floatingIndicator';
        indicator.innerHTML = `
            <div class="indicator-circle">
                <div class="visitor-count" id="visitorCount">0</div>
                <div class="indicator-label">Visitantes</div>
            </div>
            <div class="pulse-ring"></div>
            <div class="activity-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            bottom: 250px;
            left: 20px;
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        
        // Adicionar estilos
        this.addIndicatorStyles();
        
        // Clique para mostrar detalhes
        indicator.addEventListener('click', () => {
            this.showQuickStats();
        });
        
        // Atualizar contador inicial
        this.updateVisitorCount();
    }

    addIndicatorStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            #floatingIndicator {
                position: relative;
                width: 80px;
                height: 80px;
            }
            
            .indicator-circle {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #00d4ff, #8b5cf6);
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
                position: relative;
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            .indicator-circle:hover {
                transform: scale(1.1);
                box-shadow: 0 15px 40px rgba(0, 212, 255, 0.5);
            }
            
            .visitor-count {
                font-size: 24px;
                line-height: 1;
                margin-bottom: 2px;
            }
            
            .indicator-label {
                font-size: 10px;
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80px;
                height: 80px;
                border: 3px solid #00d4ff;
                border-radius: 50%;
                opacity: 0;
                z-index: 1;
            }
            
            .pulse-ring.active {
                animation: pulseRing 2s infinite;
            }
            
            @keyframes pulseRing {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            .activity-dots {
                position: absolute;
                top: -10px;
                right: -5px;
                display: flex;
                gap: 2px;
                z-index: 3;
            }
            
            .dot {
                width: 6px;
                height: 6px;
                background: #ff6b6b;
                border-radius: 50%;
                opacity: 0.3;
                transition: all 0.3s ease;
            }
            
            .dot.active {
                opacity: 1;
                animation: dotBlink 1s infinite alternate;
            }
            
            @keyframes dotBlink {
                0% { opacity: 1; }
                100% { opacity: 0.3; }
            }
            
            .new-visitor-alert {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #00d4ff, #8b5cf6);
                color: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                z-index: 10002;
                box-shadow: 0 20px 50px rgba(0, 212, 255, 0.5);
                animation: alertPopup 0.5s ease;
                min-width: 280px;
            }
            
            @keyframes alertPopup {
                0% {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            
            .alert-icon {
                font-size: 48px;
                margin-bottom: 15px;
                animation: bounce 1s infinite;
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .quick-stats {
                position: fixed;
                bottom: 340px;
                left: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 15px;
                z-index: 10001;
                min-width: 200px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 212, 255, 0.3);
            }
            
            .stats-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .stats-item:last-child {
                border-bottom: none;
            }
            
            .controls-panel {
                position: fixed;
                bottom: 220px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                min-width: 180px;
            }
        `;
        document.head.appendChild(styles);
    }

    updateVisitorCount() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const currentCount = visitors.length;
        const countElement = document.getElementById('visitorCount');
        
        if (countElement) {
            countElement.textContent = currentCount;
        }
        
        // Verificar se houve aumento
        if (currentCount > this.lastVisitorCount) {
            this.triggerNewVisitorAlert(currentCount - this.lastVisitorCount);
            this.lastVisitorCount = currentCount;
            this.saveSettings();
        }
    }

    triggerNewVisitorAlert(newVisitors) {
        // Efeito visual
        if (this.visualEnabled) {
            this.showVisualAlert(newVisitors);
            this.activatePulseRing();
            this.activateActivityDots();
        }
        
        // Efeito sonoro
        if (this.soundEnabled) {
            this.playAlertSound();
        }
        
        // Registrar no histórico
        this.alertHistory.unshift({
            timestamp: Date.now(),
            newVisitors,
            type: 'new_visitor'
        });
        
        // Manter apenas os últimos 50 alertas
        if (this.alertHistory.length > 50) {
            this.alertHistory.splice(50);
        }
    }

    showVisualAlert(count) {
        const alert = document.createElement('div');
        alert.className = 'new-visitor-alert';
        alert.innerHTML = `
            <div class="alert-icon">🎉</div>
            <h3 style="margin: 0 0 10px 0;">${count === 1 ? 'Novo Visitante!' : `${count} Novos Visitantes!`}</h3>
            <p style="margin: 0; opacity: 0.9;">Alguém está visitando seu portfólio agora!</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                margin-top: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                OK
            </button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    activatePulseRing() {
        const pulseRing = document.querySelector('.pulse-ring');
        if (pulseRing) {
            pulseRing.classList.add('active');
            setTimeout(() => {
                pulseRing.classList.remove('active');
            }, 4000);
        }
    }

    activateActivityDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            setTimeout(() => {
                dot.classList.add('active');
                setTimeout(() => {
                    dot.classList.remove('active');
                }, 2000);
            }, index * 200);
        });
    }

    setupSoundSystem() {
        // Criar contexto de áudio se não existir
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playAlertSound() {
        if (!this.soundEnabled || !window.audioContext) return;
        
        try {
            // Som de notificação mais elaborado
            const oscillator1 = window.audioContext.createOscillator();
            const oscillator2 = window.audioContext.createOscillator();
            const gainNode = window.audioContext.createGain();
            
            // Configurar osciladores
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(window.audioContext.destination);
            
            // Frequências harmônicas
            oscillator1.frequency.setValueAtTime(523.25, window.audioContext.currentTime); // C5
            oscillator2.frequency.setValueAtTime(659.25, window.audioContext.currentTime); // E5
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            // Envelope de volume
            gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, window.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + 0.8);
            
            // Tocar
            oscillator1.start(window.audioContext.currentTime);
            oscillator2.start(window.audioContext.currentTime);
            
            oscillator1.stop(window.audioContext.currentTime + 0.8);
            oscillator2.stop(window.audioContext.currentTime + 0.8);
            
            // Som de confirmação após o primeiro
            setTimeout(() => {
                this.playConfirmationBeep();
            }, 900);
            
        } catch (error) {
            console.log('Erro ao reproduzir som:', error);
        }
    }

    playConfirmationBeep() {
        if (!window.audioContext) return;
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(784, window.audioContext.currentTime); // G5
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, window.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, window.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + 0.3);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.3);
    }

    startMonitoring() {
        // Atualizar contador a cada 3 segundos
        setInterval(() => {
            this.updateVisitorCount();
        }, 3000);
        
        // Primeira atualização imediata
        setTimeout(() => {
            this.updateVisitorCount();
        }, 1000);
    }

    showQuickStats() {
        // Remover stats existente se houver
        const existing = document.querySelector('.quick-stats');
        if (existing) {
            existing.remove();
            return;
        }
        
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = new Date();
        const today = now.toDateString();
        const thisHour = now.getHours();
        
        const todayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );
        
        const thisHourVisitors = visitors.filter(v => {
            const vDate = new Date(v.timestamp);
            return vDate.toDateString() === today && vDate.getHours() === thisHour;
        });
        
        const last5MinVisitors = visitors.filter(v => {
            const vTime = new Date(v.timestamp).getTime();
            return (now.getTime() - vTime) < 5 * 60 * 1000;
        });
        
        const stats = document.createElement('div');
        stats.className = 'quick-stats';
        stats.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #00d4ff; text-align: center;">
                📊 Estatísticas Rápidas
            </h4>
            <div class="stats-item">
                <span>Total:</span>
                <span style="color: #00d4ff; font-weight: bold;">${visitors.length}</span>
            </div>
            <div class="stats-item">
                <span>Hoje:</span>
                <span style="color: #00ff88; font-weight: bold;">${todayVisitors.length}</span>
            </div>
            <div class="stats-item">
                <span>Esta Hora:</span>
                <span style="color: #ffd700; font-weight: bold;">${thisHourVisitors.length}</span>
            </div>
            <div class="stats-item">
                <span>Últimos 5min:</span>
                <span style="color: #ff6b6b; font-weight: bold;">${last5MinVisitors.length}</span>
            </div>
            <button onclick="this.parentElement.remove()" style="
                width: 100%;
                background: linear-gradient(45deg, #00d4ff, #8b5cf6);
                border: none;
                color: white;
                padding: 8px;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
                font-size: 12px;
            ">Fechar</button>
        `;
        
        document.body.appendChild(stats);
        
        // Auto-remover após 10 segundos
        setTimeout(() => {
            if (stats.parentElement) {
                stats.remove();
            }
        }, 10000);
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'controls-panel';
        controls.innerHTML = `
            <h4 style="color: #00d4ff; margin-bottom: 10px; font-size: 14px;">
                <i class="fas fa-sliders-h"></i> Alertas
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="soundAlerts" ${this.soundEnabled ? 'checked' : ''}>
                    <i class="fas fa-volume-up"></i> Sons
                </label>
                <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="visualAlerts" ${this.visualEnabled ? 'checked' : ''}>
                    <i class="fas fa-eye"></i> Visuais
                </label>
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    <button id="testAlert" style="
                        background: #00d4ff;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                        flex: 1;
                    ">Testar</button>
                    <button id="resetCount" style="
                        background: #ff6b6b;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 11px;
                        cursor: pointer;
                        flex: 1;
                    ">Reset</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Event listeners
        document.getElementById('soundAlerts').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('visualAlerts').addEventListener('change', (e) => {
            this.visualEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('testAlert').addEventListener('click', () => {
            this.triggerNewVisitorAlert(1);
        });
        
        document.getElementById('resetCount').addEventListener('click', () => {
            this.lastVisitorCount = 0;
            this.saveSettings();
            this.updateVisitorCount();
        });
    }
}

// Inicializar sistema de alertas visuais
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.visualAlertsSystem = new VisualAlertsSystem();
    }, 1500);
});