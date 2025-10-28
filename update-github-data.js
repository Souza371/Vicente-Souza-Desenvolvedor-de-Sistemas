// Script para atualizar dados do GitHub localmente
// Execute: node update-github-data.js

const https = require('https');
const fs = require('fs');

async function fetchGitHubData() {
    const username = 'Souza371';
    
    try {
        console.log('🔍 Buscando dados do GitHub...');
        
        // Buscar dados do usuário
        const userData = await fetch(`https://api.github.com/users/${username}`);
        const user = await userData.json();
        
        // Buscar repositórios
        const reposData = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await reposData.json();
        
        // Calcular estatísticas
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))];
        
        // Montar dados finais
        const githubData = {
            user: {
                login: user.login,
                name: user.name,
                bio: user.bio,
                public_repos: user.public_repos,
                followers: user.followers,
                following: user.following,
                created_at: user.created_at,
                updated_at: user.updated_at
            },
            stats: {
                total_stars: totalStars,
                total_forks: totalForks,
                languages_count: languages.length,
                languages: languages.slice(0, 10)
            },
            repositories: repos.slice(0, 12).map(repo => ({
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                homepage: repo.homepage,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                updated_at: repo.updated_at,
                topics: repo.topics || []
            })),
            last_updated: new Date().toISOString()
        };
        
        // Salvar arquivo
        fs.writeFileSync('github-data.json', JSON.stringify(githubData, null, 2));
        
        console.log('✅ Dados atualizados com sucesso!');
        console.log(`📊 ${user.public_repos} repositórios, ${totalStars} stars, ${languages.length} linguagens`);
        
        return githubData;
        
    } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
    }
}

// Função para usar com Node.js mais antigo (sem fetch)
function fetchAPI(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Portfolio-Auto-Update'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Executar se for chamado diretamente
if (require.main === module) {
    fetchGitHubData();
}

module.exports = { fetchGitHubData };