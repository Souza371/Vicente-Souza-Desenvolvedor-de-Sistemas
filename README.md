# Vicente Souza | Desenvolvedor de Sistemas 🚀

Portfólio profissional moderno e interativo desenvolvido com HTML5, CSS3 e JavaScript.

## 🎯 Sobre o Projeto

Este é meu portfólio pessoal que apresenta minha jornada como desenvolvedor, projetos realizados e habilidades técnicas. O site foi desenvolvido com foco em performance, acessibilidade e design moderno.

## ✨ Características

- **Design Moderno**: Tema escuro com elementos neon e animações fluidas
- **Totalmente Responsivo**: Adaptado para desktop, tablet e mobile
- **Performance Otimizada**: Carregamento rápido e animações suaves
- **Interativo**: Efeitos de scroll, formulário funcional e navegação dinâmica
- **Acessível**: Estrutura semântica e navegação por teclado

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Fontes**: Google Fonts (Inter, Fira Code)
- **Ícones**: Font Awesome
- **Hospedagem**: GitHub Pages

## 🚀 Como Executar

### Opção 1: Visualização Local
1. Clone este repositório:
```bash
git clone https://github.com/Souza371/Vicente-Souza-Desenvolvedor-de-Sistemas.git
```

2. Navegue até a pasta do projeto:
```bash
cd Vicente-Souza-Desenvolvedor-de-Sistemas
```

3. Abra o arquivo `index.html` no seu navegador ou use um servidor local:
```bash
# Com Python
python -m http.server 8000

# Com Node.js (live-server)
npx live-server

# Com PHP
php -S localhost:8000
```

### Opção 2: GitHub Pages
O site está automaticamente disponível em: `https://souza371.github.io/Vicente-Souza-Desenvolvedor-de-Sistemas/`

## 📁 Estrutura do Projeto

```
Vicente-Souza-Desenvolvedor-de-Sistemas/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js              # JavaScript interativo
├── assets/                # Recursos visuais
│   └── images/
│       ├── profile/       # Fotos de perfil
│       └── projects/      # Screenshots dos projetos
└── README.md              # Documentação
```

## 🎨 Seções do Site

### 1. **Home (Hero)**
- Apresentação visual com animação de digitação
- Links para redes sociais
- Call-to-action para projetos e contato

### 2. **Sobre Mim**
- Biografia profissional
- Stack de tecnologias
- Foto/avatar profissional

### 3. **Projetos**
- Card destacado do projeto principal
- Grid responsivo com outros projetos
- Links para repositórios no GitHub

### 4. **Contato**
- Formulário funcional de contato
- Links para redes sociais
- Informações de contato direto

## 🔧 Personalização

### Adicionar Sua Foto
1. Adicione sua foto em `assets/images/profile/`
2. Atualize o HTML na seção "Sobre":
```html
<img src="assets/images/profile/sua-foto.jpg" alt="Vicente Souza" />
```

### Adicionar Screenshots dos Projetos
1. Adicione screenshots em `assets/images/projects/`
2. Atualize o background-image no CSS:
```css
.project-image {
    background-image: url('assets/images/projects/projeto.png');
}
```

### Personalizar Informações
Edite as seguintes seções no `index.html`:
- **Links sociais**: Atualize URLs do GitHub, LinkedIn, etc.
- **Informações de contato**: E-mail, telefone, WhatsApp
- **Projetos**: Adicione/edite seus projetos
- **Tecnologias**: Atualize sua stack atual

### Personalizar Cores
No arquivo `styles.css`, modifique as variáveis CSS:
```css
:root {
    --neon-blue: #00d4ff;      /* Cor principal */
    --neon-purple: #8b5cf6;     /* Cor secundária */
    --neon-green: #00ff88;      /* Cor de destaque */
}
```

## 📱 Responsividade

O site está otimizado para:
- **Desktop**: 1920px+
- **Laptop**: 1024px - 1919px
- **Tablet**: 768px - 1023px
- **Mobile**: até 767px

## ⚡ Performance

- **Lazy loading** para imagens
- **Otimização de animações** com requestAnimationFrame
- **Compressão de recursos**
- **Minificação de CSS/JS** (recomendada para produção)

## 🌐 Deploy no GitHub Pages

1. **Fork ou Clone** este repositório
2. **Configure o GitHub Pages**:
   - Vá em Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
3. **Acesse** seu site em: `https://seu-usuario.github.io/nome-do-repositorio/`

### Automatização com Actions (Opcional)
Crie `.github/workflows/deploy.yml` para deploy automático:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

Vicente Souza - [@Souza371](https://github.com/Souza371)

Link do Projeto: [https://github.com/Souza371/Vicente-Souza-Desenvolvedor-de-Sistemas](https://github.com/Souza371/Vicente-Souza-Desenvolvedor-de-Sistemas)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐
Desenvolvedor de Sistemas focado em soluções práticas e eficientes. Experiência em HTML, CSS, JavaScript, Python e SQL. Apaixonado por tecnologia, automação e interfaces funcionais.
