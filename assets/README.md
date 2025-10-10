# Assets do Portfólio

Esta pasta contém os recursos visuais do portfólio.

## Estrutura de Pastas

```
assets/
├── images/
│   ├── profile/          # Foto de perfil e avatares
│   ├── projects/         # Screenshots dos projetos
│   ├── icons/           # Ícones personalizados
│   └── backgrounds/     # Imagens de fundo
└── README.md           # Este arquivo
```

## Imagens Recomendadas

### Foto de Perfil
- **Nome:** `profile.jpg` ou `avatar.png`
- **Tamanho:** 400x400px (quadrada)
- **Formato:** JPG ou PNG
- **Descrição:** Sua foto profissional ou um avatar estilizado

### Screenshots de Projetos
- **Formato:** PNG ou JPG
- **Tamanho:** 800x600px (proporção 4:3)
- **Qualidade:** Alta resolução para demonstrar os projetos

#### Projetos Sugeridos:
1. `guincho-on-demand.png` - Screenshot do sistema Guincho On Demand
2. `game-of-thrones.png` - Screenshot do jogo
3. `automation-system.png` - Screenshot do sistema de automação
4. `sql-studies.png` - Screenshot dos estudos SQL/OOP

### Ícones Técnicos (Opcionais)
Se quiser personalizar os ícones das tecnologias:
- `java-icon.svg`
- `python-icon.svg`
- `javascript-icon.svg`
- `sql-icon.svg`

## Como Adicionar Imagens

1. Adicione suas imagens nas pastas apropriadas
2. Atualize o HTML para referenciar as imagens:

```html
<!-- Exemplo para foto de perfil -->
<img src="assets/images/profile/avatar.jpg" alt="Vicente Souza" />

<!-- Exemplo para projeto -->
<img src="assets/images/projects/guincho-on-demand.png" alt="Guincho On Demand" />
```

3. Certifique-se de que as imagens estejam otimizadas para web (tamanho de arquivo pequeno)

## Otimização de Imagens

Para melhor performance:
- Use formatos WebP quando possível
- Comprima as imagens mantendo boa qualidade
- Considere usar lazy loading (já implementado no JavaScript)

## Ferramentas Recomendadas

- **Compressão:** TinyPNG, ImageOptim
- **Edição:** GIMP, Photoshop, Canva
- **Conversão:** Convertio, CloudConvert