// ===============================================
// DIGITAL DEVELOPER MATRIX - SISTEMA ÚNICO
// Vicente Souza - Portfólio Digital
// ===============================================

// Performance monitor
let performanceMode = 'normal';

function detectPerformance() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Detectar dispositivos de baixa performance
    if (!gl || navigator.hardwareConcurrency < 4 || window.innerWidth < 768) {
        performanceMode = 'low';
    }
}

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    detectPerformance();
    initDigitalMatrix();
    initThemeToggle();
    initNavigation();
    initTypewriter();
    initScrollEffects();
    initTechIcons();
    initSmoothScroll();
    initSkillsAnimation();
    initContactForm();
});



// Sistema Digital Matrix único com otimização de performance
function initDigitalMatrix() {
    const matrixCanvas = document.getElementById('matrix-canvas');
    const hexCanvas = document.getElementById('hex-canvas');
    const particlesCanvas = document.getElementById('particles-canvas');
    
    if (!matrixCanvas || !hexCanvas || !particlesCanvas) return;
    
    // Matrix de códigos reais
    initCodeMatrix(matrixCanvas);
    
    // Apenas carregar outros efeitos se performance for boa
    if (performanceMode === 'normal') {
        // Hexadecimais flutuantes
        initHexNumbers(hexCanvas);
        
        // Partículas de dados
        initDataParticles(particlesCanvas);
    }
}

// Matrix de códigos de programação reais
function initCodeMatrix(canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const codes = [
        'function()', 'const data', 'let result', 'if (true)', 'return value',
        'async/await', 'Promise.resolve', 'addEventListener', 'querySelector',
        'map()', 'filter()', 'reduce()', 'forEach()', 'getElementById',
        'classList.add', 'innerHTML', 'createElement', 'appendChild',
        'setTimeout', 'setInterval', 'JSON.parse', 'fetch()', 'response.json()',
        'console.log', 'import/export', 'try/catch', 'new Promise', 'await fetch',
        '{ ...spread }', '[destructure]', '=> arrow', 'class extends', 'super()'
    ];
    
    const columns = Math.floor(canvas.width / 120);
    const drops = Array(columns).fill(0);
    const speeds = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.3);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 8, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = '14px "Fira Code", monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const code = codes[Math.floor(Math.random() * codes.length)];
            
            // Cores únicas para cada coluna
            const colors = ['#00ffff', '#ff00ff', '#00d4ff', '#7c3aed', '#ff6b35'];
            const color = colors[i % colors.length];
            
            ctx.fillStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            
            ctx.fillText(code, i * 120, drops[i] * 20);
            
            drops[i] += speeds[i];
            
            if (drops[i] * 20 > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
                speeds[i] = Math.random() * 0.5 + 0.3;
            }
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Otimizado: usar requestAnimationFrame ao invés de setInterval
    let lastTime = 0;
    const targetFPS = 30; // Reduzir FPS para melhor performance
    const interval = 1000 / targetFPS;
    
    function animateMatrix(currentTime) {
        if (currentTime - lastTime >= interval) {
            draw();
            lastTime = currentTime;
        }
        requestAnimationFrame(animateMatrix);
    }
    
    requestAnimationFrame(animateMatrix);
}

// Números hexadecimais flutuantes únicos
function initHexNumbers(canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const hexNumbers = [];
    
    class HexNumber {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.dx = (Math.random() - 0.5) * 0.5;
            this.dy = (Math.random() - 0.5) * 0.5;
            this.value = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase();
            this.color = ['#00ffff', '#ff00ff', '#00d4ff', '#7c3aed', '#ff6b35'][Math.floor(Math.random() * 5)];
            this.opacity = Math.random() * 0.7 + 0.3;
            this.size = Math.random() * 12 + 8;
        }
        
        update() {
            this.x += this.dx;
            this.y += this.dy;
            
            if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
            
            // Regenerar valor periodicamente
            if (Math.random() < 0.002) {
                this.value = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px "Fira Code", monospace`;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillText(`0x${this.value}`, this.x, this.y);
            ctx.restore();
        }
    }
    
    // Reduzir números hex para melhor performance
    for (let i = 0; i < 15; i++) {
        hexNumbers.push(new HexNumber());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hexNumbers.forEach(hex => {
            hex.update();
            hex.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Partículas de dados únicas
function initDataParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let mouse = { x: 0, y: 0 };
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Rastrear mouse
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    const particles = [];
    
    class DataParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.dx = (Math.random() - 0.5) * 0.8;
            this.dy = (Math.random() - 0.5) * 0.8;
            this.size = Math.random() * 3 + 1;
            this.color = ['#00ffff', '#ff00ff', '#00d4ff', '#7c3aed'][Math.floor(Math.random() * 4)];
            this.opacity = Math.random() * 0.8 + 0.2;
            this.connections = [];
        }
        
        update() {
            // Interação com mouse
            const distToMouse = Math.sqrt(
                Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)
            );
            
            if (distToMouse < 100) {
                const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
                this.dx += Math.cos(angle) * 0.1;
                this.dy += Math.sin(angle) * 0.1;
            }
            
            this.x += this.dx;
            this.y += this.dy;
            
            // Limites da tela
            if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
            
            // Reduzir velocidade
            this.dx *= 0.99;
            this.dy *= 0.99;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
        
        drawConnections() {
            this.connections = [];
            particles.forEach(particle => {
                const distance = Math.sqrt(
                    Math.pow(this.x - particle.x, 2) + Math.pow(this.y - particle.y, 2)
                );
                
                // Otimizado: reduzir distância de conexão e remover shadow para performance
                if (distance < 120 && particle !== this) {
                    this.connections.push(particle);
                    
                    ctx.save();
                    ctx.globalAlpha = (120 - distance) / 120 * 0.2;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        }
    }
    
    // Reduzir número de partículas para melhor performance
    for (let i = 0; i < 40; i++) {
        particles.push(new DataParticle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar conexões primeiro
        particles.forEach(particle => {
            particle.drawConnections();
        });
        
        // Depois desenhar partículas
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Funcionalidades básicas do site
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        icon.className = 'fas fa-sun';
    }
}

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Scroll navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const texts = typewriterElement.dataset.text.split(',');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    type();
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

function initTechIcons() {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            const tech = icon.dataset.tech;
            if (tech) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.dataset.percentage;
                progressBar.style.width = percentage + '%';
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Mostrar loading
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Usando Formspree (serviço gratuito de formulários)
            const response = await fetch('https://formspree.io/f/xpwaqnlr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    _replyto: data.email,
                    _subject: `Novo contato do portfólio - ${data.name}`
                })
            });
            
            if (response.ok) {
                // Sucesso real
                showMessage('✅ Mensagem enviada com sucesso! Responderei em breve.', 'success');
                form.reset();
            } else {
                throw new Error('Erro no servidor');
            }
            
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            // Fallback: abrir cliente de email
            const subject = encodeURIComponent('Contato do Portfólio');
            const body = encodeURIComponent(`Nome: ${data.name}\nEmail: ${data.email}\n\nMensagem:\n${data.message}`);
            const mailtoLink = `mailto:vicenteesouza371@gmail.com?subject=${subject}&body=${body}`;
            
            showMessage('⚠️ Erro no envio automático. Abrindo seu cliente de e-mail...', 'warning');
            
            setTimeout(() => {
                window.open(mailtoLink, '_blank');
            }, 1000);
        } finally {
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Função para mostrar mensagens
function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `contact-message ${type}`;
    message.textContent = text;
    
    const colors = {
        success: 'linear-gradient(45deg, #00ff88, #00ffff)',
        error: 'linear-gradient(45deg, #ff4444, #ff0066)',
        warning: 'linear-gradient(45deg, #ffaa00, #ff6600)'
    };
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        z-index: 10000;
        font-weight: 600;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Efeitos especiais únicos
function addMatrixGlitch() {
    const glitchElements = document.querySelectorAll('.hero-title, .nav-logo');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'glitch 0.3s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        });
    });
}

// CSS dinâmico para efeito glitch
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }
`;
document.head.appendChild(glitchStyle);

// Inicializar efeitos especiais
setTimeout(addMatrixGlitch, 2000);

console.log('🚀 Digital Developer Matrix - Sistema Inicializado!');