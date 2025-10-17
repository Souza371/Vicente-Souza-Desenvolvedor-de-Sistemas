// Sistema de Relatórios Automáticos
class AutoReportSystem {
    constructor() {
        this.reportSchedule = {
            daily: true,
            weekly: true,
            monthly: false
        };
        this.lastReports = {
            daily: null,
            weekly: null,
            monthly: null
        };
        this.init();
    }

    init() {
        // Só ativar no painel admin
        if (!window.location.pathname.includes('admin.html')) return;
        
        this.loadSettings();
        this.checkAndGenerateReports();
        this.setupReportControls();
        this.scheduleReports();
    }

    loadSettings() {
        const saved = localStorage.getItem('report_settings');
        if (saved) {
            this.reportSchedule = { ...this.reportSchedule, ...JSON.parse(saved) };
        }
        
        const lastReports = localStorage.getItem('last_reports');
        if (lastReports) {
            this.lastReports = JSON.parse(lastReports);
        }
    }

    saveSettings() {
        localStorage.setItem('report_settings', JSON.stringify(this.reportSchedule));
        localStorage.setItem('last_reports', JSON.stringify(this.lastReports));
    }

    checkAndGenerateReports() {
        const now = new Date();
        const today = now.toDateString();
        const thisWeek = this.getWeekString(now);
        const thisMonth = `${now.getFullYear()}-${now.getMonth()}`;

        // Verificar relatório diário
        if (this.reportSchedule.daily && this.lastReports.daily !== today) {
            this.generateDailyReport();
            this.lastReports.daily = today;
        }

        // Verificar relatório semanal (segunda-feira)
        if (this.reportSchedule.weekly && now.getDay() === 1 && this.lastReports.weekly !== thisWeek) {
            this.generateWeeklyReport();
            this.lastReports.weekly = thisWeek;
        }

        // Verificar relatório mensal (primeiro dia do mês)
        if (this.reportSchedule.monthly && now.getDate() === 1 && this.lastReports.monthly !== thisMonth) {
            this.generateMonthlyReport();
            this.lastReports.monthly = thisMonth;
        }

        this.saveSettings();
    }

    generateDailyReport() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const today = new Date().toDateString();
        const todayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );

        const report = this.createReport('daily', todayVisitors, {
            title: `Relatório Diário - ${new Date().toLocaleDateString('pt-BR')}`,
            period: 'Hoje',
            comparison: this.getYesterdayComparison(visitors)
        });

        this.saveAndNotifyReport(report, 'daily');
    }

    generateWeeklyReport() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weekVisitors = visitors.filter(v => {
            const visitorDate = new Date(v.timestamp);
            return visitorDate >= weekAgo;
        });

        const report = this.createReport('weekly', weekVisitors, {
            title: `Relatório Semanal - ${this.getWeekString(now)}`,
            period: 'Esta Semana',
            comparison: this.getLastWeekComparison(visitors)
        });

        this.saveAndNotifyReport(report, 'weekly');
    }

    generateMonthlyReport() {
        const visitors = JSON.parse(localStorage.getItem('portfolio_visitors') || '[]');
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthVisitors = visitors.filter(v => {
            const visitorDate = new Date(v.timestamp);
            return visitorDate >= monthStart;
        });

        const report = this.createReport('monthly', monthVisitors, {
            title: `Relatório Mensal - ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
            period: 'Este Mês',
            comparison: this.getLastMonthComparison(visitors)
        });

        this.saveAndNotifyReport(report, 'monthly');
    }

    createReport(type, visitors, options) {
        const report = {
            type,
            title: options.title,
            period: options.period,
            generatedAt: new Date().toISOString(),
            summary: {
                totalVisitors: visitors.length,
                uniqueCountries: new Set(visitors.map(v => v.location?.country).filter(Boolean)).size,
                averageSessionTime: this.calculateAverageTime(visitors),
                totalPageViews: visitors.reduce((sum, v) => sum + (v.pageViews?.length || 1), 0),
                bounceRate: this.calculateBounceRate(visitors)
            },
            analytics: {
                topCountries: this.getTopCountries(visitors),
                topBrowsers: this.getTopBrowsers(visitors),
                topPages: this.getTopPages(visitors),
                peakHours: this.getPeakHours(visitors),
                deviceTypes: this.getDeviceTypes(visitors)
            },
            comparison: options.comparison,
            visitors: visitors.map(v => ({
                timestamp: v.timestamp,
                country: v.location?.country || 'Desconhecido',
                city: v.location?.city || 'Desconhecida',
                browser: this.getBrowserName(v.userAgent),
                duration: v.duration,
                pages: v.pageViews?.length || 1
            }))
        };

        return report;
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

    calculateBounceRate(visitors) {
        if (visitors.length === 0) return 0;
        
        const bounces = visitors.filter(v => 
            v.duration < 30 || (v.pageViews && v.pageViews.length <= 1)
        ).length;
        
        return Math.round((bounces / visitors.length) * 100);
    }

    getTopCountries(visitors) {
        const countries = {};
        visitors.forEach(v => {
            const country = v.location?.country || 'Desconhecido';
            countries[country] = (countries[country] || 0) + 1;
        });
        
        return Object.entries(countries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([country, count]) => ({ country, count, percentage: Math.round((count / visitors.length) * 100) }));
    }

    getTopBrowsers(visitors) {
        const browsers = {};
        visitors.forEach(v => {
            const browser = this.getBrowserName(v.userAgent);
            browsers[browser] = (browsers[browser] || 0) + 1;
        });
        
        return Object.entries(browsers)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / visitors.length) * 100) }));
    }

    getTopPages(visitors) {
        const pages = {};
        visitors.forEach(v => {
            const page = v.page || '/';
            pages[page] = (pages[page] || 0) + 1;
        });
        
        return Object.entries(pages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([page, count]) => ({ page, count, percentage: Math.round((count / visitors.length) * 100) }));
    }

    getPeakHours(visitors) {
        const hours = {};
        visitors.forEach(v => {
            const hour = new Date(v.timestamp).getHours();
            hours[hour] = (hours[hour] || 0) + 1;
        });
        
        return Object.entries(hours)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
    }

    getDeviceTypes(visitors) {
        const devices = {};
        visitors.forEach(v => {
            const device = this.getDeviceType(v.device);
            devices[device] = (devices[device] || 0) + 1;
        });
        
        return Object.entries(devices)
            .map(([device, count]) => ({ device, count, percentage: Math.round((count / visitors.length) * 100) }));
    }

    getDeviceType(deviceInfo) {
        if (!deviceInfo) return 'Desconhecido';
        
        if (deviceInfo.touchSupport && deviceInfo.viewportWidth < 768) return 'Mobile';
        if (deviceInfo.touchSupport && deviceInfo.viewportWidth >= 768) return 'Tablet';
        return 'Desktop';
    }

    getBrowserName(userAgent) {
        if (!userAgent) return 'Desconhecido';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Outro';
    }

    getYesterdayComparison(visitors) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        const yesterdayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === yesterdayStr
        );
        
        const today = new Date().toDateString();
        const todayVisitors = visitors.filter(v => 
            new Date(v.timestamp).toDateString() === today
        );
        
        const change = todayVisitors.length - yesterdayVisitors.length;
        const percentChange = yesterdayVisitors.length > 0 ? 
            Math.round((change / yesterdayVisitors.length) * 100) : 0;
        
        return {
            previous: yesterdayVisitors.length,
            current: todayVisitors.length,
            change,
            percentChange,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
        };
    }

    getLastWeekComparison(visitors) {
        const now = new Date();
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        
        const thisWeekVisitors = visitors.filter(v => {
            const date = new Date(v.timestamp);
            return date >= thisWeekStart;
        });
        
        const lastWeekVisitors = visitors.filter(v => {
            const date = new Date(v.timestamp);
            return date >= lastWeekStart && date < thisWeekStart;
        });
        
        const change = thisWeekVisitors.length - lastWeekVisitors.length;
        const percentChange = lastWeekVisitors.length > 0 ? 
            Math.round((change / lastWeekVisitors.length) * 100) : 0;
        
        return {
            previous: lastWeekVisitors.length,
            current: thisWeekVisitors.length,
            change,
            percentChange,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
        };
    }

    getLastMonthComparison(visitors) {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        const thisMonthVisitors = visitors.filter(v => {
            const date = new Date(v.timestamp);
            return date >= thisMonthStart;
        });
        
        const lastMonthVisitors = visitors.filter(v => {
            const date = new Date(v.timestamp);
            return date >= lastMonthStart && date < thisMonthStart;
        });
        
        const change = thisMonthVisitors.length - lastMonthVisitors.length;
        const percentChange = lastMonthVisitors.length > 0 ? 
            Math.round((change / lastMonthVisitors.length) * 100) : 0;
        
        return {
            previous: lastMonthVisitors.length,
            current: thisMonthVisitors.length,
            change,
            percentChange,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
        };
    }

    saveAndNotifyReport(report, type) {
        // Salvar relatório
        const reports = JSON.parse(localStorage.getItem('generated_reports') || '[]');
        reports.unshift(report);
        
        // Manter apenas os últimos 20 relatórios
        if (reports.length > 20) {
            reports.splice(20);
        }
        
        localStorage.setItem('generated_reports', JSON.stringify(reports));
        
        // Notificar sobre novo relatório
        if (window.realTimeNotifications) {
            window.realTimeNotifications.showAdminNotification(
                `📊 Relatório ${type} gerado automaticamente!`
            );
        }
        
        // Auto-download do relatório
        this.downloadReport(report);
    }

    downloadReport(report) {
        const htmlReport = this.generateHTMLReport(report);
        const blob = new Blob([htmlReport], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_${report.type}_${new Date().toISOString().split('T')[0]}.html`;
        
        // Auto-download silencioso (opcional)
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        
        // Por enquanto, apenas salvar URL para download manual
        this.saveReportDownloadLink(url, link.download);
        
        URL.revokeObjectURL(url);
    }

    generateHTMLReport(report) {
        const trendIcon = report.comparison.trend === 'up' ? '📈' : 
                         report.comparison.trend === 'down' ? '📉' : '➡️';
        const trendColor = report.comparison.trend === 'up' ? '#00ff88' : 
                          report.comparison.trend === 'down' ? '#ff6b6b' : '#ffd700';
        
        return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .summary-card h3 {
            font-size: 2.5rem;
            margin: 0 0 10px 0;
        }
        .summary-card p {
            margin: 0;
            opacity: 0.9;
        }
        .comparison {
            background: ${trendColor}20;
            border-left: 4px solid ${trendColor};
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        .analytics-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            border-top: 4px solid #667eea;
        }
        .analytics-card h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .list-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .list-item:last-child {
            border-bottom: none;
        }
        .percentage {
            color: #667eea;
            font-weight: bold;
        }
        .visitors-table {
            margin-top: 40px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ${report.title}</h1>
            <p>Gerado em: ${new Date(report.generatedAt).toLocaleString('pt-BR')}</p>
            <p>Período: ${report.period}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>${report.summary.totalVisitors}</h3>
                <p>Total de Visitantes</p>
            </div>
            <div class="summary-card">
                <h3>${report.summary.uniqueCountries}</h3>
                <p>Países Únicos</p>
            </div>
            <div class="summary-card">
                <h3>${Math.floor(report.summary.averageSessionTime / 60)}m ${report.summary.averageSessionTime % 60}s</h3>
                <p>Tempo Médio</p>
            </div>
            <div class="summary-card">
                <h3>${report.summary.bounceRate}%</h3>
                <p>Taxa de Rejeição</p>
            </div>
        </div>

        <div class="comparison">
            <h3>${trendIcon} Comparação com Período Anterior</h3>
            <p>
                <strong>${report.comparison.current}</strong> visitantes 
                (${report.comparison.change > 0 ? '+' : ''}${report.comparison.change} / ${report.comparison.percentChange > 0 ? '+' : ''}${report.comparison.percentChange}%)
                comparado a <strong>${report.comparison.previous}</strong> no período anterior.
            </p>
        </div>

        <div class="analytics-grid">
            <div class="analytics-card">
                <h3>🌍 Top Países</h3>
                ${report.analytics.topCountries.map(item => `
                    <div class="list-item">
                        <span>${item.country}</span>
                        <span class="percentage">${item.count} (${item.percentage}%)</span>
                    </div>
                `).join('')}
            </div>

            <div class="analytics-card">
                <h3>🌐 Top Navegadores</h3>
                ${report.analytics.topBrowsers.map(item => `
                    <div class="list-item">
                        <span>${item.browser}</span>
                        <span class="percentage">${item.count} (${item.percentage}%)</span>
                    </div>
                `).join('')}
            </div>

            <div class="analytics-card">
                <h3>📱 Tipos de Dispositivo</h3>
                ${report.analytics.deviceTypes.map(item => `
                    <div class="list-item">
                        <span>${item.device}</span>
                        <span class="percentage">${item.count} (${item.percentage}%)</span>
                    </div>
                `).join('')}
            </div>

            <div class="analytics-card">
                <h3>⏰ Horários de Pico</h3>
                ${report.analytics.peakHours.map(item => `
                    <div class="list-item">
                        <span>${item.hour}</span>
                        <span class="percentage">${item.count} visitantes</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="visitors-table">
            <h3>📋 Detalhes dos Visitantes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data/Hora</th>
                        <th>País</th>
                        <th>Cidade</th>
                        <th>Navegador</th>
                        <th>Duração</th>
                        <th>Páginas</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.visitors.slice(0, 50).map(visitor => `
                        <tr>
                            <td>${new Date(visitor.timestamp).toLocaleString('pt-BR')}</td>
                            <td>${visitor.country}</td>
                            <td>${visitor.city}</td>
                            <td>${visitor.browser}</td>
                            <td>${Math.floor(visitor.duration / 60)}m ${visitor.duration % 60}s</td>
                            <td>${visitor.pages}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>📊 Relatório gerado automaticamente pelo Sistema de Analytics</p>
            <p>Vicente Souza - Desenvolvedor de Sistemas</p>
        </div>
    </div>
</body>
</html>`;
    }

    saveReportDownloadLink(url, filename) {
        const downloads = JSON.parse(localStorage.getItem('pending_downloads') || '[]');
        downloads.unshift({
            url,
            filename,
            timestamp: Date.now(),
            downloaded: false
        });
        
        localStorage.setItem('pending_downloads', JSON.stringify(downloads));
    }

    setupReportControls() {
        const controls = document.createElement('div');
        controls.id = 'reportControls';
        controls.innerHTML = `
            <div style="
                position: fixed;
                bottom: 150px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                min-width: 220px;
            ">
                <h4 style="color: #00d4ff; margin-bottom: 10px; font-size: 14px;">
                    <i class="fas fa-file-alt"></i> Relatórios Automáticos
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="dailyReports" ${this.reportSchedule.daily ? 'checked' : ''}>
                        📅 Relatórios Diários
                    </label>
                    <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="weeklyReports" ${this.reportSchedule.weekly ? 'checked' : ''}>
                        📊 Relatórios Semanais
                    </label>
                    <label style="color: white; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" id="monthlyReports" ${this.reportSchedule.monthly ? 'checked' : ''}>
                        📈 Relatórios Mensais
                    </label>
                    <div style="display: flex; gap: 5px; margin-top: 8px;">
                        <button id="generateNow" style="
                            background: #00d4ff;
                            border: none;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 11px;
                            cursor: pointer;
                            flex: 1;
                        ">Gerar Agora</button>
                        <button id="viewReports" style="
                            background: #8b5cf6;
                            border: none;
                            color: white;
                            padding: 5px 10px;
                            border-radius: 4px;
                            font-size: 11px;
                            cursor: pointer;
                            flex: 1;
                        ">Ver Relatórios</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Event listeners
        document.getElementById('dailyReports').addEventListener('change', (e) => {
            this.reportSchedule.daily = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('weeklyReports').addEventListener('change', (e) => {
            this.reportSchedule.weekly = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('monthlyReports').addEventListener('change', (e) => {
            this.reportSchedule.monthly = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('generateNow').addEventListener('click', () => {
            this.generateDailyReport();
        });
        
        document.getElementById('viewReports').addEventListener('click', () => {
            this.showReportsModal();
        });
    }

    showReportsModal() {
        const reports = JSON.parse(localStorage.getItem('generated_reports') || '[]');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                padding: 30px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <h2 style="color: #667eea; margin-bottom: 20px;">📊 Relatórios Gerados</h2>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
                
                ${reports.length === 0 ? 
                    '<p style="text-align: center; color: #666;">Nenhum relatório gerado ainda.</p>' :
                    reports.map(report => `
                        <div style="
                            border: 1px solid #eee;
                            border-radius: 8px;
                            padding: 15px;
                            margin-bottom: 15px;
                            background: #f8f9fa;
                        ">
                            <h4 style="margin: 0 0 10px 0; color: #333;">${report.title}</h4>
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                ${new Date(report.generatedAt).toLocaleString('pt-BR')}
                            </p>
                            <div style="display: flex; gap: 10px;">
                                <span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                    ${report.summary.totalVisitors} visitantes
                                </span>
                                <span style="background: #00ff88; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                    ${report.summary.uniqueCountries} países
                                </span>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    scheduleReports() {
        // Verificar e gerar relatórios a cada hora
        setInterval(() => {
            this.checkAndGenerateReports();
        }, 60 * 60 * 1000); // 1 hora
    }

    getWeekString(date) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        return startOfWeek.toISOString().slice(0, 10);
    }
}

// Inicializar sistema de relatórios
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.autoReportSystem = new AutoReportSystem();
    }, 3000);
});