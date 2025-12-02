// Variáveis globais
let isLoading = true;
let currentSection = 'home';

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    createParticles();
    initNavigation();
    initTypewriterEffect();
    initScrollAnimations();
    initSkillsAnimations();
    initGitHubAPI();
    initBlogSystem();
    initContactForm();
    initPWA();
    initAnalytics();
    initAdminAccess();
    
    // Remover preloader após carregamento
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            isLoading = false;
        }, 500);
    }, 1500);
}

// Sistema de partículas de fundo
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${getRandomNeonColor()};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

function getRandomNeonColor() {
    const colors = ['#00d4ff', '#8b5cf6', '#00ff88', '#ff6b6b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Sistema de navegação
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.getElementById('themeToggle');
    
    // Navegação suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Fechar menu mobile se estiver aberto
            navMenu.classList.remove('active');
            updateActiveNavLink(targetId);
        });
    });
    
    // Menu hambúrguer para mobile
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Scroll do navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        updateActiveNavOnScroll();
    });
    
    // Sistema de alternância de tema
    initThemeToggle(themeToggle);
}

// Sistema de alternância de tema
function initThemeToggle(themeToggle) {
    if (!themeToggle) {
        console.error('Botão de tema não encontrado!');
        return;
    }
    
    // Verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema inicial (padrão: escuro)
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon(themeToggle, true);
    } else {
        document.body.classList.remove('light-theme');
        updateThemeIcon(themeToggle, false);
    }
    
    // Event listener para alternância
    themeToggle.addEventListener('click', function() {
        const isLightTheme = document.body.classList.contains('light-theme');
        
        if (isLightTheme) {
            // Mudar para tema escuro
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(themeToggle, false);
        } else {
            // Mudar para tema claro
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(themeToggle, true);
        }
        
        // Animação suave
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(themeToggle, isLightTheme) {
    const icon = themeToggle.querySelector('i');
    if (isLightTheme) {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
    }
}

function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            if (currentSection !== id) {
                currentSection = id;
                updateActiveNavLink(id);
            }
        }
    });
}

// Efeito de digitação no código
function initTypewriterEffect() {
    const codeElement = document.getElementById('typing-code');
    const codeLines = [
        'const desenvolvedor = {',
        '  nome: "Vicente Souza",',
        '  especialidade: "Full Stack",',
        '  linguagens: [',
        '    "Java",',
        '    "Python", ',
        '    "JavaScript",',
        '    "SQL"',
        '  ],',
        '  paixao: "resolver problemas",',
        '  objetivo: "criar soluções"',
        '};',
        '',
        'console.log(desenvolvedor);'
    ];
    
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';
    
    function typeWriter() {
        if (lineIndex < codeLines.length) {
            if (charIndex < codeLines[lineIndex].length) {
                currentText += codeLines[lineIndex].charAt(charIndex);
                codeElement.textContent = currentText;
                charIndex++;
                setTimeout(typeWriter, 100);
            } else {
                currentText += '\n';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriter, 300);
            }
        } else {
            // Reiniciar após uma pausa
            setTimeout(() => {
                currentText = '';
                lineIndex = 0;
                charIndex = 0;
                codeElement.textContent = '';
                typeWriter();
            }, 3000);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// Animações das habilidades
function initSkillsAnimations() {
    const skillsSection = document.getElementById('habilidades');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar barras de progresso
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const percent = bar.getAttribute('data-percent');
                        bar.style.width = percent + '%';
                        
                        // Animar contador
                        animateCounter(bar, percent);
                    }, index * 200);
                });
                
                // Animar cards de resumo
                const summaryCards = document.querySelectorAll('.summary-card');
                summaryCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'slideInUp 0.6s ease forwards';
                    }, 800 + (index * 150));
                });
                
                skillsObserver.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

function animateCounter(progressBar, targetPercent) {
    const percentageElement = progressBar.closest('.skill-item').querySelector('.skill-percentage');
    let currentPercent = 0;
    const increment = targetPercent / 100;
    
    const timer = setInterval(() => {
        currentPercent += increment;
        if (currentPercent >= targetPercent) {
            currentPercent = targetPercent;
            clearInterval(timer);
        }
        percentageElement.textContent = Math.round(currentPercent) + '%';
    }, 20);
}

// Integração com GitHub API (Melhorada com fallback para arquivo local)
async function initGitHubAPI() {
    console.log('🚀 Iniciando carregamento dos projetos...');
    const username = 'Souza371'; // Seu username do GitHub
    
    // Primeiro, carregar projetos estáticos como fallback
    loadStaticProjects();
    
    // Tentar carregar dados do arquivo local primeiro (mais rápido)
    const localData = await loadGitHubDataFromFile();
    
    if (localData) {
        console.log('📊 Usando dados atualizados do arquivo local');
        updateProjectsFromGitHub(localData.repositories);
        return; // Se temos dados locais, não precisa da API
    }
    
    try {
        // Se não temos dados locais, buscar da API com timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
        
        // Buscar informações do usuário
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            signal: controller.signal
        });
        
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Buscar repositórios
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
            signal: controller.signal
        });
        
        if (!reposResponse.ok) {
            throw new Error(`HTTP error! status: ${reposResponse.status}`);
        }
        
        const reposData = await reposResponse.json();
        
        clearTimeout(timeoutId);
        
        // Atualizar informações no portfólio
        updateGitHubStats(userData, reposData);
        updateProjectsFromGitHub(reposData);
        
        console.log('✅ Dados carregados diretamente da API do GitHub');
        
    } catch (error) {
        console.log('❌ Erro ao carregar dados do GitHub:', error);
        // Manter projetos estáticos se a API falhar
        console.log('🔄 Usando projetos estáticos como fallback');
    }
}

function updateGitHubStats(userData, reposData) {
    // Calcular estatísticas
    const totalRepos = userData.public_repos;
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const languages = [...new Set(reposData.map(repo => repo.language).filter(Boolean))];
    
    // Atualizar cards de resumo se necessário
    const summaryCards = document.querySelectorAll('.summary-card');
    if (summaryCards.length >= 2) {
        // Atualizar card de projetos
        const projectsCard = summaryCards[1];
        const projectsContent = projectsCard.querySelector('.summary-content h4');
        if (projectsContent) {
            projectsContent.textContent = `${totalRepos}+ Repositórios`;
        }
    }
    
    // Adicionar estatísticas do GitHub na seção sobre
    addGitHubStatsToAbout(userData, totalStars, languages);
}

function addGitHubStatsToAbout(userData, totalStars, languages) {
    const aboutText = document.querySelector('.about-text');
    if (!aboutText || document.querySelector('.github-stats')) return;
    
    const githubStats = document.createElement('div');
    githubStats.className = 'github-stats';
    githubStats.innerHTML = `
        <h4>📊 Estatísticas GitHub</h4>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-number">${userData.public_repos}</span>
                <span class="stat-label">Repositórios</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${totalStars}</span>
                <span class="stat-label">Stars</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${userData.followers}</span>
                <span class="stat-label">Seguidores</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${languages.length}</span>
                <span class="stat-label">Linguagens</span>
            </div>
        </div>
    `;
    
    aboutText.appendChild(githubStats);
}

function updateProjectsFromGitHub(repos) {
    // Filtrar repositórios relevantes (que não são forks e têm descrição)
    const relevantRepos = repos.filter(repo => 
        !repo.fork && 
        repo.description && 
        repo.description.trim() !== ''
    ).slice(0, 6);
    
    // Encontrar container de projetos
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    console.log('GitHub API carregou com sucesso:', relevantRepos.length, 'projetos');
    
    // Se temos repositórios do GitHub, substituir os estáticos
    if (relevantRepos.length > 0) {
        // Limpar container e adicionar novos projetos do GitHub
        projectsGrid.innerHTML = '';
        
        // Adicionar todos os cards do GitHub
        relevantRepos.forEach((repo) => {
            const projectCard = createProjectCardFromRepo(repo);
            projectsGrid.appendChild(projectCard);
        });
        
        // Adicionar indicador de que são projetos reais do GitHub
        const githubIndicator = document.createElement('div');
        githubIndicator.className = 'github-indicator';
        githubIndicator.innerHTML = `
            <div class="github-badge">
                <i class="fab fa-github"></i>
                <span>Projetos carregados do GitHub em tempo real</span>
            </div>
        `;
        projectsGrid.appendChild(githubIndicator);
    }
}

function createProjectCardFromRepo(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Determinar linguagens principais
    const languages = repo.language ? [repo.language] : ['Projeto'];
    
    // Determinar ícone baseado na linguagem
    const getLanguageIcon = (lang) => {
        const icons = {
            'JavaScript': 'fab fa-js-square',
            'Python': 'fab fa-python',
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'React': 'fab fa-react',
            'Vue': 'fab fa-vuejs',
            'Node': 'fab fa-node-js',
            'PHP': 'fab fa-php',
            'Java': 'fab fa-java',
            'TypeScript': 'fab fa-js-square',
            'C#': 'fas fa-code',
            'C++': 'fas fa-code',
            'Flutter': 'fas fa-mobile-alt',
            'Dart': 'fas fa-mobile-alt'
        };
        return icons[lang] || 'fas fa-code';
    };
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-icon">
                <i class="${getLanguageIcon(repo.language)}"></i>
            </div>
            <div class="project-overlay">
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link" title="Ver no GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" title="Ver Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </div>
        </div>
        
        <div class="project-content">
            <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p class="project-description">
                ${repo.description || 'Sistema desenvolvido para demonstrar habilidades técnicas e boas práticas de programação.'}
            </p>
            
            <div class="project-tech">
                ${languages.map(lang => `<span class="tech-tag">${lang}</span>`).join('')}
                ${repo.stargazers_count > 0 ? `<span class="stars-tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
            </div>
            
            <div class="project-footer">
                <div class="project-stats">
                    <span class="stat-item">
                        <i class="fas fa-calendar-alt"></i>
                        ${new Date(repo.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                    ${repo.size > 0 ? `<span class="stat-item">
                        <i class="fas fa-database"></i>
                        ${(repo.size / 1024).toFixed(1)}MB
                    </span>` : ''}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Projetos estáticos como fallback
function loadStaticProjects() {
    console.log('🔄 Carregando projetos estáticos...');
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.log('❌ Elemento .projects-grid não encontrado!');
        return;
    }
    
    // Remover loading
    const loading = projectsGrid.querySelector('.loading-projects');
    if (loading) {
        loading.remove();
    }
    
    // Projetos de exemplo
    const staticProjects = [
        {
            name: 'Portfólio Profissional',
            description: 'Site responsivo moderno com animações Matrix, tema escuro e integração com GitHub API.',
            language: 'JavaScript',
            html_url: 'https://github.com/Souza371/portfolio-vicente-souza',
            homepage: 'https://souza371.github.io/portfolio-vicente-souza/',
            updated_at: new Date().toISOString(),
            stargazers_count: 0
        },
        {
            name: 'Sistema de Automação',
            description: 'Automação web com Selenium para processos repetitivos e web scraping inteligente.',
            language: 'Python',
            html_url: '#',
            homepage: null,
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            stargazers_count: 2
        },
        {
            name: 'Calculadora IMC',
            description: 'Aplicação web interativa para cálculo de IMC com validações e design responsivo.',
            language: 'JavaScript',
            html_url: '#',
            homepage: '#',
            updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            stargazers_count: 1
        },
        {
            name: 'Sistema CRM Modular',
            description: 'Sistema de gerenciamento de clientes com módulos para vendas, contatos e relatórios.',
            language: 'HTML',
            html_url: '#',
            homepage: null,
            updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            stargazers_count: 3
        },
        {
            name: 'Game Interativo',
            description: 'Jogo desenvolvido com JavaScript puro, física simples e controles responsivos.',
            language: 'JavaScript',
            html_url: '#',
            homepage: '#',
            updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            stargazers_count: 5
        },
        {
            name: 'App Flutter Mobile',
            description: 'Aplicativo mobile multiplataforma com interface moderna e funcionalidades nativas.',
            language: 'Flutter',
            html_url: '#',
            homepage: null,
            updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            stargazers_count: 1
        }
    ];
    
    // Limpar grid
    projectsGrid.innerHTML = '';
    
    // Adicionar projetos estáticos
    staticProjects.forEach((project, index) => {
        const projectCard = createProjectCardFromRepo(project);
        projectsGrid.appendChild(projectCard);
        console.log(`✅ Projeto ${index + 1} adicionado: ${project.name}`);
    });
    
    console.log('🎉 Projetos estáticos carregados com sucesso!');
}

// Sistema de Blog e Filtros
function initBlogSystem() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    // Inicializar filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Atualizar botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar cards
            filterBlogCards(category, blogCards);
        });
    });
    
    // Inicializar botões de leitura
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.blog-card');
            const title = card.querySelector('h3').textContent;
            openBlogModal(title, card);
        });
    });
    
    // Animar cards quando entram na tela
    initBlogAnimations();
}

function filterBlogCards(category, cards) {
    cards.forEach((card, index) => {
        const cardCategories = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategories.includes(category);
        
        // Aplicar filtro com animação
        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('hidden');
                card.classList.add('animate-in');
            } else {
                card.classList.add('hidden');
                card.classList.remove('animate-in');
            }
        }, index * 100);
    });
    
    // Atualizar contagem de artigos (opcional)
    updateBlogCount(category, cards);
}

function updateBlogCount(category, cards) {
    const visibleCards = Array.from(cards).filter(card => {
        const cardCategories = card.getAttribute('data-category');
        return category === 'all' || cardCategories.includes(category);
    });
    
    // Opcional: mostrar contagem na interface
    console.log(`Mostrando ${visibleCards.length} artigo(s) da categoria: ${category}`);
}

function openBlogModal(title, card) {
    // Simular abertura de artigo (você pode implementar um modal ou redirecionar)
    const category = card.querySelector('.blog-category').textContent;
    const description = card.querySelector('p').textContent;
    
    // Por enquanto, mostramos um alert (você pode implementar um modal completo)
    const confirmation = confirm(`
📖 Abrir Artigo: "${title}"

Categoria: ${category}
Descrição: ${description}

Este é um artigo de exemplo. Em uma implementação real, 
este seria um link para o artigo completo ou abriria um modal.

Deseja continuar para uma versão de exemplo?
    `);
    
    if (confirmation) {
        // Aqui você poderia:
        // 1. Abrir um modal com o artigo completo
        // 2. Redirecionar para uma página específica do artigo
        // 3. Carregar o conteúdo via AJAX
        
        showNotification(`Artigo "${title}" carregado com sucesso!`, 'success');
        
        // Simular analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'blog_article_view', {
                'article_title': title,
                'article_category': category
            });
        }
    }
}

function initBlogAnimations() {
    const blogSection = document.getElementById('blog');
    const blogCards = document.querySelectorAll('.blog-card');
    
    const blogObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar cards sequencialmente
                blogCards.forEach((card, index) => {
                    setTimeout(() => {
                        if (!card.classList.contains('hidden')) {
                            card.style.animation = `blogCardIn 0.6s ease forwards`;
                        }
                    }, index * 150);
                });
                
                blogObserver.unobserve(blogSection);
            }
        });
    }, { threshold: 0.2 });
    
    if (blogSection) {
        blogObserver.observe(blogSection);
    }
}

// Funcionalidade adicional: Sistema de busca no blog
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                
                const matches = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               tags.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
}

// Configuração PWA (Progressive Web App)
function initPWA() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registrado com sucesso:', registration.scope);
                    
                    // Verificar atualizações
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    showUpdateNotification();
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.log('Falha ao registrar Service Worker:', error);
                });
        });
    }
    
    // Prompt de instalação PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir o prompt automático
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostrar botão de instalação personalizado
        showInstallButton();
    });
    
    // Detectar quando o app foi instalado
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA foi instalado');
        hideInstallButton();
        showNotification('App instalado com sucesso! 🎉', 'success');
    });
}

function showInstallButton() {
    // Criar botão de instalação se não existir
    let installButton = document.getElementById('install-button');
    if (!installButton) {
        installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installButton.className = 'btn btn-secondary install-btn';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        `;
        
        installButton.addEventListener('click', installPWA);
        document.body.appendChild(installButton);
    }
}

function hideInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.remove();
    }
}

async function installPWA() {
    if (deferredPrompt) {
        // Mostrar o prompt de instalação
        deferredPrompt.prompt();
        
        // Aguardar a escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
        } else {
            console.log('Usuário recusou a instalação');
        }
        
        deferredPrompt = null;
        hideInstallButton();
    }
}

function showUpdateNotification() {
    const updateNotification = document.createElement('div');
    updateNotification.className = 'update-notification';
    updateNotification.innerHTML = `
        <div class="update-content">
            <span>Nova versão disponível!</span>
            <button onclick="updateApp()" class="btn btn-primary">Atualizar</button>
            <button onclick="dismissUpdate()" class="btn btn-secondary">Depois</button>
        </div>
    `;
    
    updateNotification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 15px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(updateNotification);
    
    // Animar entrada
    setTimeout(() => {
        updateNotification.style.transform = 'translateY(0)';
    }, 100);
}

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        });
    }
    
    // Recarregar página após pequeno delay
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Sistema de Analytics Básico
function initAnalytics() {
    // Analytics básico sem cookies (GDPR friendly)
    const analytics = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        
        // Eventos básicos
        trackEvent(event, data = {}) {
            const eventData = {
                event: event,
                timestamp: Date.now(),
                sessionId: this.sessionId,
                url: window.location.href,
                userAgent: navigator.userAgent,
                ...data
            };
            
            // Log local (em produção você enviaria para seu servidor)
            console.log('Analytics Event:', eventData);
            
            // Armazenar localmente para análise posterior
            this.storeEvent(eventData);
        },
        
        storeEvent(eventData) {
            try {
                const events = JSON.parse(localStorage.getItem('portfolio_analytics') || '[]');
                events.push(eventData);
                
                // Manter apenas os últimos 100 eventos
                if (events.length > 100) {
                    events.splice(0, events.length - 100);
                }
                
                localStorage.setItem('portfolio_analytics', JSON.stringify(events));
            } catch (error) {
                console.log('Erro ao armazenar evento de analytics:', error);
            }
        },
        
        // Métricas de performance
        trackPerformance() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.timing;
                        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                        
                        this.trackEvent('page_performance', {
                            load_time: loadTime,
                            dom_ready: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                            first_paint: perfData.responseStart - perfData.navigationStart
                        });
                    }, 1000);
                });
            }
        },
        
        // Rastreamento de scroll
        trackScrollDepth() {
            let maxScroll = 0;
            let scrollTimer;
            
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                }
                
                // Debounce do evento de scroll
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    if (scrollPercent >= 25 && scrollPercent < 50 && maxScroll >= 25) {
                        this.trackEvent('scroll_depth', { depth: '25%' });
                    } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScroll >= 50) {
                        this.trackEvent('scroll_depth', { depth: '50%' });
                    } else if (scrollPercent >= 75 && scrollPercent < 90 && maxScroll >= 75) {
                        this.trackEvent('scroll_depth', { depth: '75%' });
                    } else if (scrollPercent >= 90 && maxScroll >= 90) {
                        this.trackEvent('scroll_depth', { depth: '90%' });
                    }
                }, 500);
            });
        },
        
        // Rastreamento de cliques
        trackClicks() {
            document.addEventListener('click', (e) => {
                const element = e.target.closest('a, button, .project-card, .nav-link');
                if (element) {
                    const elementType = element.tagName.toLowerCase();
                    const elementClass = element.className;
                    const elementText = element.textContent?.trim().substring(0, 50) || '';
                    
                    this.trackEvent('click', {
                        element_type: elementType,
                        element_class: elementClass,
                        element_text: elementText,
                        href: element.href || null
                    });
                }
            });
        },
        
        // Rastreamento de tempo na página
        trackTimeOnPage() {
            window.addEventListener('beforeunload', () => {
                const timeSpent = Date.now() - this.startTime;
                this.trackEvent('time_on_page', {
                    duration: timeSpent,
                    duration_formatted: formatTime(timeSpent)
                });
            });
        },
        
        // Inicializar todos os rastreamentos
        init() {
            this.trackEvent('page_view');
            this.trackPerformance();
            this.trackScrollDepth();
            this.trackClicks();
            this.trackTimeOnPage();
            
            // Rastrear mudanças de seção
            this.trackSectionViews();
        },
        
        trackSectionViews() {
            const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEvent('section_view', {
                            section: entry.target.id,
                            section_title: entry.target.querySelector('h2')?.textContent || entry.target.id
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            sections.forEach(section => observer.observe(section));
        }
    };
    
    // Inicializar analytics
    analytics.init();
    
    // Disponibilizar globalmente para uso
    window.portfolioAnalytics = analytics;
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Animações no scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Adicionar animações baseadas na classe
                if (element.classList.contains('project-card')) {
                    element.style.animation = 'slideInUp 0.8s ease forwards';
                } else if (element.classList.contains('about-text')) {
                    element.style.animation = 'slideInLeft 0.8s ease forwards';
                } else if (element.classList.contains('about-image')) {
                    element.style.animation = 'slideInRight 0.8s ease forwards';
                } else if (element.classList.contains('contact-info')) {
                    element.style.animation = 'slideInLeft 0.8s ease forwards';
                } else if (element.classList.contains('contact-form')) {
                    element.style.animation = 'slideInRight 0.8s ease forwards';
                }
                
                // Animação para tech items
                if (element.classList.contains('tech-item')) {
                    setTimeout(() => {
                        element.style.animation = 'slideInUp 0.5s ease forwards';
                    }, Math.random() * 300);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll(
        '.project-card, .about-text, .about-image, .contact-info, .contact-form, .tech-item'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        observer.observe(element);
    });
}

// Sistema de formulário de contato
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validar todos os campos
    const isValid = validateForm(form);
    
    if (!isValid) {
        showNotification('Por favor, corrija os erros no formulário.', 'error');
        return;
    }
    
    // Simular envio
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Coletar dados do formulário
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simular delay de envio
    setTimeout(() => {
        console.log('Dados do formulário:', data);
        
        // Reset do formulário
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification('Mensagem enviada com sucesso! Responderei em breve.', 'success');
        
        // Aqui você integraria com um serviço real como EmailJS ou Netlify Forms
        
    }, 2000);
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Verificar se o campo está vazio
    if (!value) {
        errorMessage = 'Este campo é obrigatório.';
        isValid = false;
    } else {
        // Validações específicas
        switch (fieldType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Por favor, insira um e-mail válido.';
                    isValid = false;
                }
                break;
            case 'text':
                if (field.name === 'name' && value.length < 2) {
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
                    isValid = false;
                }
                break;
        }
        
        // Validação para textarea
        if (field.tagName.toLowerCase() === 'textarea' && value.length < 10) {
            errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ff6b6b';
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showNotification(message, type = 'success') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : '#ff6b6b'};
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Efeitos adicionais
function addHoverEffects() {
    // Efeito de hover nos cards de projeto
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efeito de hover nos botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Otimizações de performance
function optimizePerformance() {
    // Throttle do scroll
    let ticking = false;
    
    function updateOnScroll() {
        updateActiveNavOnScroll();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Lazy loading para imagens (quando adicionadas)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Utilitários
function isMobile() {
    return window.innerWidth <= 768;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inicializar efeitos adicionais após o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addHoverEffects();
        optimizePerformance();
    }, 2000);
});

// Tratamento de redimensionamento da janela
window.addEventListener('resize', debounce(function() {
    // Recriar partículas se necessário
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createParticles();
    }
}, 250));

// Animações para as novas seções
function initNewSectionsAnimations() {
    // Animação dos itens de experiência
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observar elementos de experiência
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observar elementos do blog
    document.querySelectorAll('.blog-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observar estatísticas do GitHub
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observar tags de estudo
    document.querySelectorAll('.studying-tag').forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = `all 0.4s ease ${index * 0.05}s`;
        observer.observe(tag);
    });
}

// Função para atualizar informações do GitHub em tempo real
async function updateGitHubInfo() {
    try {
        const response = await fetch('https://api.github.com/users/Souza371');
        const userData = await response.json(); // ✅ CORRIGIDO: Adicionado await
        
        if (userData) {
            // Atualizar contadores se necessário
            const reposCount = document.querySelector('.stat-card .stat-number');
            if (reposCount && userData.public_repos) {
                reposCount.textContent = `${userData.public_repos}+`;
            }
        }
    } catch (error) {
        console.log('Info do GitHub será mantida estática');
    }
}

// Função para carregar dados do arquivo JSON local (fallback mais rápido)
async function loadGitHubDataFromFile() {
    try {
        const response = await fetch('./github-data.json');
        const data = await response.json();
        
        console.log('📊 Dados do GitHub carregados do arquivo local!');
        
        // Atualizar estatísticas na página
        updateStatsFromData(data);
        
        return data;
    } catch (error) {
        console.log('Arquivo github-data.json não encontrado, usando API');
        return null;
    }
}

// Função para atualizar estatísticas com os dados
function updateStatsFromData(data) {
    // Atualizar contadores no HTML
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((element, index) => {
        switch(index) {
            case 0: // Repositórios
                element.textContent = `${data.user.public_repos}+`;
                break;
            case 1: // Projetos em Destaque  
                element.textContent = `${Math.min(data.repositories.length, 12)}+`;
                break;
            case 2: // Linguagens
                element.textContent = `${data.stats.languages_count}+`;
                break;
            case 3: // Stars Total
                element.textContent = `${data.stats.total_stars}`;
                break;
        }
    });
    
    // Atualizar última atualização
    const lastUpdate = new Date(data.last_updated).toLocaleDateString('pt-BR');
    const updateElement = document.querySelector('.last-update');
    if (updateElement) {
        updateElement.textContent = `Última atualização: ${lastUpdate}`;
    }
}

// Função para adicionar efeitos hover personalizados
function initCustomHoverEffects() {
    // Efeito hover nos cartões de experiência
    document.querySelectorAll('.experience-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Efeito hover nos itens do blog
    document.querySelectorAll('.blog-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const image = this.querySelector('.blog-image i');
            if (image) {
                image.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.blog-image i');
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Função para animar números das estatísticas
function animateNumbers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                const finalNumber = number.textContent.replace(/\D/g, '');
                const duration = 1500;
                const increment = finalNumber / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalNumber) {
                        current = finalNumber;
                        clearInterval(timer);
                        number.textContent = finalNumber + (number.textContent.includes('+') ? '+' : '');
                    } else {
                        number.textContent = Math.floor(current);
                    }
                }, 16);
            }
        });
    });
    
    document.querySelectorAll('.stat-number').forEach(number => {
        observer.observe(number);
    });
}

// Função para criar a rede neural 3D
function createNeuralNetwork() {
    const neuralContainer = document.getElementById('neural-network');
    if (!neuralContainer) return;

    const nodes = [];
    const connections = [];
    
    // Criar nós da rede neural
    function createNodes() {
        const nodeCount = window.innerWidth < 768 ? 12 : 20;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = Math.random() > 0.6 ? 'neural-node purple' : 'neural-node';
            
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            node.style.left = x + 'px';
            node.style.top = y + 'px';
            node.style.animationDelay = Math.random() * 3 + 's';
            
            neuralContainer.appendChild(node);
            nodes.push({ element: node, x, y, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
        }
    }

    // Criar conexões entre nós
    function createConnections() {
        nodes.forEach((nodeA, i) => {
            nodes.forEach((nodeB, j) => {
                if (i !== j) {
                    const distance = Math.sqrt(
                        Math.pow(nodeA.x - nodeB.x, 2) + 
                        Math.pow(nodeA.y - nodeB.y, 2)
                    );
                    
                    if (distance < 200 && Math.random() > 0.7) {
                        const connection = document.createElement('div');
                        connection.className = 'neural-connection';
                        
                        const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
                        connection.style.left = nodeA.x + 'px';
                        connection.style.top = nodeA.y + 'px';
                        connection.style.width = distance + 'px';
                        connection.style.transform = `rotate(${angle}rad)`;
                        connection.style.animationDelay = Math.random() * 4 + 's';
                        
                        neuralContainer.appendChild(connection);
                        connections.push(connection);
                    }
                }
            });
        });
    }

    // Criar elementos flutuantes
    function createFloatingElements() {
        const floatingCount = window.innerWidth < 768 ? 3 : 6;
        
        for (let i = 0; i < floatingCount; i++) {
            const floating = document.createElement('div');
            floating.className = 'neural-floating';
            
            floating.style.left = Math.random() * window.innerWidth + 'px';
            floating.style.top = Math.random() * window.innerHeight + 'px';
            floating.style.animationDelay = Math.random() * 8 + 's';
            
            neuralContainer.appendChild(floating);
        }
    }

    // Criar efeito matrix de código
    function createCodeMatrix() {
        const codeSnippets = [
            'const neural = new Network()',
            'function connect(nodes)',
            'class AI extends Brain',
            'import tensorflow as tf',
            'let synapse = activate()',
            'neural.train(dataset)',
            '{ learning: true }',
            'async predict(input)',
            'model.compile()',
            'return intelligence'
        ];

        setInterval(() => {
            if (Math.random() > 0.7) {
                const matrix = document.createElement('div');
                matrix.className = 'code-matrix';
                matrix.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                
                matrix.style.left = Math.random() * window.innerWidth + 'px';
                matrix.style.top = '-50px';
                
                neuralContainer.appendChild(matrix);
                
                setTimeout(() => {
                    if (matrix.parentNode) {
                        matrix.parentNode.removeChild(matrix);
                    }
                }, 10000);
            }
        }, 3000);
    }

    // Animação dos nós (movimento suave)
    function animateNodes() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce nas bordas
            if (node.x <= 0 || node.x >= window.innerWidth) node.vx *= -1;
            if (node.y <= 0 || node.y >= window.innerHeight) node.vy *= -1;
            
            node.element.style.left = node.x + 'px';
            node.element.style.top = node.y + 'px';
        });
        
        requestAnimationFrame(animateNodes);
    }

    // Interação com o mouse
    function addMouseInteraction() {
        neuralContainer.addEventListener('mousemove', (e) => {
            nodes.forEach(node => {
                const distance = Math.sqrt(
                    Math.pow(e.clientX - node.x, 2) + 
                    Math.pow(e.clientY - node.y, 2)
                );
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(node.y - e.clientY, node.x - e.clientX);
                    
                    node.vx += Math.cos(angle) * force * 0.02;
                    node.vy += Math.sin(angle) * force * 0.02;
                    
                    // Limitar velocidade
                    const maxSpeed = 2;
                    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                    if (speed > maxSpeed) {
                        node.vx = (node.vx / speed) * maxSpeed;
                        node.vy = (node.vy / speed) * maxSpeed;
                    }
                }
            });
        });
    }

    // Inicializar tudo
    createNodes();
    createConnections();
    createFloatingElements();
    createCodeMatrix();
    animateNodes();
    addMouseInteraction();

    // Recriar ao redimensionar
    window.addEventListener('resize', debounce(() => {
        neuralContainer.innerHTML = '';
        nodes.length = 0;
        connections.length = 0;
        createNodes();
        createConnections();
        createFloatingElements();
    }, 250));
}

// Atualizar a função de inicialização principal
function initializeApp() {
    createParticles();
    createNeuralNetwork(); // Adicionar rede neural 2D
    initNavigation();
    initTypewriterEffect();
    initScrollAnimations();
    initSkillsAnimations();
    initGitHubAPI();
    initBlogSystem();
    initContactForm();
    initPWA();
    initAnalytics();
    
    // Adicionar as novas inicializações
    initNewSectionsAnimations();
    initCustomHoverEffects();
    animateNumbers();
    updateGitHubInfo();
    
    // Inicializar fundo profissional
    setTimeout(() => {
        initProfessionalBackground();
    }, 500);
    
    // Remover preloader após carregamento
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            isLoading = false;
        }, 500);
    }, 1500);
}

// Easter egg - console
console.log(`
%c
╔══════════════════════════════════════╗
║                                      ║
║      Olá, desenvolvedor curioso! 🚀   ║
║                                      ║
║   Este portfólio foi desenvolvido    ║
║   com muito ❤️ e ☕ por Vicente       ║
║                                      ║
║   Stack utilizada:                   ║
║   • HTML5 Semântico                  ║
║   • CSS3 com Flexbox e Grid          ║
║   • JavaScript ES6+                  ║
║   • Animações CSS/JS                 ║
║   • Design Responsivo                ║
║                                      ║
║   GitHub: github.com/Souza371        ║
║                                      ║
╚══════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace; font-size: 12px;');

console.log('%cSe você chegou até aqui, definitivamente temos algo em comum! 😄', 'color: #00ff88; font-size: 14px; font-weight: bold;');

// Professional Code Background
function initProfessionalBackground() {
    const canvas = document.getElementById('code-canvas');
    const floatingContainer = document.getElementById('floating-elements');
    
    if (!canvas || !floatingContainer) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Códigos que vão cair
    const codeSnippets = [
        'function createApp() {',
        'const neural = new AI();',
        'import React from "react";',
        'class Developer {',
        'async function process() {',
        'const data = await fetch();',
        'export default function() {',
        'npm install three.js',
        'git commit -m "feat:"',
        'SELECT * FROM projects;',
        'docker run --name app',
        'python main.py',
        'node server.js',
        'yarn build',
        'console.log("Hello");',
        'if (user.isActive) {',
        'return response.json();',
        'useState(false);',
        'useEffect(() => {',
        'npm run dev'
    ];
    
    const drops = [];
    
    // Criar gotas de código
    for (let i = 0; i < 15; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2 + 1,
            code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
            opacity: Math.random() * 0.5 + 0.2,
            size: Math.random() * 4 + 10
        });
    }
    
    // Animação do canvas
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drops.forEach((drop, index) => {
            // Configurar estilo
            ctx.font = `${drop.size}px 'Fira Code', monospace`;
            ctx.fillStyle = `rgba(0, 212, 255, ${drop.opacity})`;
            ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
            ctx.shadowBlur = 10;
            
            // Desenhar código
            ctx.fillText(drop.code, drop.x, drop.y);
            
            // Mover gota
            drop.y += drop.speed;
            
            // Reset quando sai da tela
            if (drop.y > canvas.height) {
                drop.y = -50;
                drop.x = Math.random() * canvas.width;
                drop.code = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                drop.opacity = Math.random() * 0.5 + 0.2;
            }
            
            // Variação de opacidade
            drop.opacity += (Math.sin(Date.now() * 0.001 + index) * 0.1);
            if (drop.opacity < 0.1) drop.opacity = 0.1;
            if (drop.opacity > 0.7) drop.opacity = 0.7;
        });
        
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
    
    // Criar elementos flutuantes
    function createFloatingElements() {
        const elements = ['cube', 'hex', 'circle'];
        
        for (let i = 0; i < 12; i++) {
            const elementType = elements[Math.floor(Math.random() * elements.length)];
            const element = document.createElement('div');
            element.className = `floating-${elementType}`;
            
            // Posição aleatória
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 8 + 's';
            
            floatingContainer.appendChild(element);
        }
        
        // Criar fragmentos de código flutuantes
        for (let i = 0; i < 8; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'code-fragment';
            fragment.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            fragment.style.top = Math.random() * 100 + '%';
            fragment.style.animationDelay = Math.random() * 12 + 's';
            
            floatingContainer.appendChild(fragment);
        }
    }
    
    createFloatingElements();
    
    // Interação com mouse
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Afetar velocidade das gotas baseado na posição do mouse
        drops.forEach((drop, index) => {
            const distance = Math.abs(drop.x - e.clientX) / canvas.width;
            drop.speed = (1 - distance) * 3 + 1;
        });
        
        // Mover elementos flutuantes sutilmente
        const floatingElements = floatingContainer.children;
        for (let element of floatingElements) {
            const rect = element.getBoundingClientRect();
            const elementX = rect.left / window.innerWidth;
            const elementY = rect.top / window.innerHeight;
            
            const deltaX = (mouseX - elementX) * 10;
            const deltaY = (mouseY - elementY) * 10;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
    });
}

// Sistema de acesso administrativo secreto
function initAdminAccess() {
    let keySequence = [];
    let adminVisible = false;
    
    document.addEventListener('keydown', function(e) {
        keySequence.push(e.key);
        
        // Manter apenas as últimas 5 teclas
        if (keySequence.length > 5) {
            keySequence.shift();
        }
        
        // Combinação: Ctrl+Alt+A (ou sequência especial)
        if ((e.ctrlKey && e.altKey && e.key === 'a') || 
            keySequence.join('').toLowerCase().includes('admin')) {
            
            const adminLink = document.getElementById('adminLink');
            if (adminLink && !adminVisible) {
                adminLink.style.display = 'inline-block';
                setTimeout(() => {
                    adminLink.style.opacity = '0.7';
                }, 100);
                
                adminVisible = true;
                
                // Mostrar notificação discreta
                showAdminNotification('Acesso administrativo ativado');
                
                // Ocultar novamente após 30 segundos se não usado
                setTimeout(() => {
                    if (adminVisible) {
                        adminLink.style.opacity = '0';
                        setTimeout(() => {
                            adminLink.style.display = 'none';
                            adminVisible = false;
                        }, 300);
                    }
                }, 30000);
            }
        }
    });
}

function showAdminNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 212, 255, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 212, 255, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Fade out e remover
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Professional background será inicializado pela função initializeApp()