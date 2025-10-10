// ===============================================
// DIGITAL DEVELOPER MATRIX - SISTEMA ÚNICO
// Vicente Souza - Portfólio Digital
// ===============================================

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    initTerminalLoader();
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

// Sistema único de loading DNA Digital
function initTerminalLoader() {
    const loader = document.getElementById('dna-loader');
    if (!loader) return;
    
    // Inicializar canvas DNA
    initDNAHelix();
    
    // Sequência de status únicos
    const statusSequence = [
        'Inicializando...',
        'Decodificando DNA digital...',
        'Sequenciando habilidades...',
        'Compilando experiências...',
        'Sincronizando projetos...',
        'Ativando portfólio...',
        'Sequência completa!'
    ];
    
    let currentStatus = 0;
    let progress = 0;
    
    const statusElement = document.getElementById('progress-status');
    const percentageElement = document.getElementById('progress-percentage');
    
    function updateProgress() {
        if (currentStatus < statusSequence.length) {
            statusElement.textContent = statusSequence[currentStatus];
            progress = Math.min(((currentStatus + 1) / statusSequence.length) * 100, 100);
            percentageElement.textContent = Math.floor(progress) + '%';
            
            currentStatus++;
            
            // Tempo variável para cada etapa
            const delays = [1000, 800, 700, 600, 700, 800, 1000];
            setTimeout(updateProgress, delays[currentStatus - 1] || 800);
        } else {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1500);
            }, 1000);
        }
    }
    
    setTimeout(updateProgress, 800);
}

// Animação única da Hélice DNA
function initDNAHelix() {
    const canvas = document.getElementById('dna-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let time = 0;
    const helixHeight = canvas.height * 0.8;
    const helixWidth = canvas.width * 0.6;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Códigos binários para as bases do DNA
    const dnaBases = ['01000001', '01000011', '01000111', '01010100']; // A, C, G, T em binário
    const colors = ['#00ffff', '#ff00ff', '#7c3aed', '#ff6b35'];
    
    function drawDNAHelix() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const segments = 30;
        const segmentHeight = helixHeight / segments;
        
        for (let i = 0; i < segments; i++) {
            const y = (centerY - helixHeight/2) + (i * segmentHeight);
            const angle1 = (time * 0.02) + (i * 0.3);
            const angle2 = angle1 + Math.PI;
            
            // Primeira hélice
            const x1 = centerX + Math.cos(angle1) * (helixWidth / 4);
            const x2 = centerX + Math.cos(angle2) * (helixWidth / 4);
            
            // Conectores entre as hélices
            if (i % 3 === 0) {
                ctx.save();
                ctx.strokeStyle = colors[i % colors.length];
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors[i % colors.length];
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.8;
                
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
                
                // Códigos binários nas conexões
                ctx.font = '10px "Fira Code", monospace';
                ctx.fillStyle = colors[i % colors.length];
                ctx.textAlign = 'center';
                const baseCode = dnaBases[i % dnaBases.length];
                ctx.fillText(baseCode, (x1 + x2) / 2, y - 5);
                
                ctx.restore();
            }
            
            // Pontos da hélice
            ctx.save();
            ctx.fillStyle = colors[0]; // Ciano
            ctx.shadowBlur = 20;
            ctx.shadowColor = colors[0];
            ctx.globalAlpha = 0.9;
            
            ctx.beginPath();
            ctx.arc(x1, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = colors[1]; // Magenta
            ctx.shadowColor = colors[1];
            
            ctx.beginPath();
            ctx.arc(x2, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // Partículas flutuantes ao redor do DNA
        for (let j = 0; j < 8; j++) {
            const particleAngle = (time * 0.01) + (j * Math.PI / 4);
            const particleRadius = helixWidth / 2 + 30;
            const particleX = centerX + Math.cos(particleAngle) * particleRadius;
            const particleY = centerY + Math.sin(particleAngle) * (helixHeight / 3);
            
            ctx.save();
            ctx.fillStyle = colors[j % colors.length];
            ctx.shadowBlur = 10;
            ctx.shadowColor = colors[j % colors.length];
            ctx.globalAlpha = 0.6 + Math.sin(time * 0.03 + j) * 0.3;
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        time++;
        requestAnimationFrame(drawDNAHelix);
    }
    
    drawDNAHelix();
}

// Sistema Digital Matrix único
function initDigitalMatrix() {
    const matrixCanvas = document.getElementById('matrix-canvas');
    const hexCanvas = document.getElementById('hex-canvas');
    const particlesCanvas = document.getElementById('particles-canvas');
    
    if (!matrixCanvas || !hexCanvas || !particlesCanvas) return;
    
    // Matrix de códigos reais
    initCodeMatrix(matrixCanvas);
    
    // Hexadecimais flutuantes
    initHexNumbers(hexCanvas);
    
    // Partículas de dados
    initDataParticles(particlesCanvas);
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
    
    setInterval(draw, 50);
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
    
    // Criar números hex
    for (let i = 0; i < 25; i++) {
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
                
                if (distance < 150 && particle !== this) {
                    this.connections.push(particle);
                    
                    ctx.save();
                    ctx.globalAlpha = (150 - distance) / 150 * 0.3;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = this.color;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        }
    }
    
    // Criar partículas
    for (let i = 0; i < 80; i++) {
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
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simular envio (implementar com seu backend)
        try {
            console.log('Dados do formulário:', data);
            
            // Mostrar mensagem de sucesso
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Mensagem enviada com sucesso!';
            successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                z-index: 10000;
            `;
            
            document.body.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            
            form.reset();
            
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    });
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