# Sistema de Analytics do Portfólio

Este sistema permite rastrear visitantes do seu portfólio de forma discreta e em conformidade com práticas de privacidade.

## 🚀 Funcionalidades

### Rastreamento de Visitantes
- **Localização geográfica**: País, região e cidade (baseado no IP)
- **Informações do navegador**: Tipo, versão e sistema operacional
- **Tempo de permanência**: Duração total da visita
- **Interações**: Cliques, profundidade de scroll
- **Dados do dispositivo**: Resolução, tipo de dispositivo
- **Páginas visitadas**: Histórico de navegação na sessão

### Painel Administrativo
- **Estatísticas gerais**: Total de visitantes, visitantes do dia, tempo médio
- **Histórico detalhado**: Lista completa de todos os visitantes
- **Busca e filtros**: Pesquisar por IP, localização, navegador
- **Exportação de dados**: Download dos dados em formato JSON
- **Atualizações em tempo real**: Dados atualizados automaticamente

### Conformidade com Privacidade
- **Banner de consentimento**: Usuário pode aceitar ou recusar o rastreamento
- **Armazenamento local**: Todos os dados ficam no navegador do usuário
- **Controle do usuário**: Possibilidade de desabilitar o rastreamento
- **Transparência**: Informações claras sobre quais dados são coletados

## 📁 Arquivos do Sistema

```
portfolio/
├── admin.html          # Página do painel administrativo
├── admin.js            # JavaScript do painel administrativo
├── analytics.js        # Sistema de rastreamento principal
├── privacy-banner.js   # Banner de consentimento de privacidade
└── index.html          # Página principal (modificada)
```

## 🔧 Como Usar

### 1. Acessar o Painel Administrativo

**Opção 1**: Clique no ícone de gráfico (📊) no canto superior direito do seu portfólio

**Opção 2**: Acesse diretamente: `https://seudominio.com/admin.html`

### 2. Visualizar Estatísticas

O painel mostra:
- **Total de Visitantes**: Contador geral desde o início
- **Visitantes Hoje**: Quantos visitaram hoje
- **Tempo Médio**: Tempo médio de permanência no site
- **Países Únicos**: Quantos países diferentes acessaram

### 3. Analisar Visitantes

Na tabela de visitantes você pode ver:
- **Data/Hora**: Quando a pessoa visitou
- **IP/Localização**: Localização geográfica do visitante
- **Navegador**: Qual navegador foi usado
- **Página**: Qual página foi acessada
- **Duração**: Quanto tempo ficou no site

### 4. Buscar e Filtrar

Use a caixa de busca para encontrar:
- Visitantes de países específicos
- IPs específicos
- Tipos de navegador
- Datas específicas

### 5. Exportar Dados

Clique em "Exportar" para baixar todos os dados em formato JSON.

## 🔒 Privacidade e Segurança

### Dados Coletados
- **Localização**: Cidade, região, país (via IP)
- **Navegador**: Tipo, versão, idioma
- **Dispositivo**: Resolução de tela, tipo de dispositivo
- **Comportamento**: Tempo no site, páginas visitadas, cliques
- **Sessão**: Horário de entrada e saída

### Dados NÃO Coletados
- ❌ Informações pessoais identificáveis
- ❌ Senhas ou dados sensíveis
- ❌ Conteúdo de formulários
- ❌ Histórico de navegação de outros sites
- ❌ Dados de pagamento

### Armazenamento
- Todos os dados ficam armazenados localmente no navegador
- Não são enviados para servidores externos
- O usuário pode limpar os dados a qualquer momento

### Consentimento
- Banner de privacidade aparece na primeira visita
- Usuário pode aceitar ou recusar o rastreamento
- Sistema respeita a escolha do usuário
- Fácil de desabilitar posteriormente

## 🛠️ Configurações Avançadas

### Desabilitar Rastreamento Manualmente
```javascript
// No console do navegador
localStorage.setItem('tracking_disabled', 'true');
```

### Limpar Todos os Dados
```javascript
// No console do navegador
localStorage.removeItem('portfolio_visitors');
localStorage.removeItem('portfolio_events');
localStorage.removeItem('visitor_id');
```

### Verificar Status do Rastreamento
```javascript
// No console do navegador
console.log('Rastreamento ativo:', localStorage.getItem('tracking_disabled') !== 'true');
```

## 📊 APIs Utilizadas

- **ipapi.co**: Para obter localização baseada no IP (gratuita)
- **Navigator API**: Para informações do navegador e dispositivo
- **LocalStorage**: Para armazenamento dos dados

## 🔄 Atualizações em Tempo Real

O painel administrativo atualiza automaticamente a cada 30 segundos, mostrando novos visitantes sem necessidade de recarregar a página.

## 🚨 Solução de Problemas

### Não aparecem visitantes no painel
1. Verifique se os arquivos estão no servidor
2. Confirme que o JavaScript está sendo carregado
3. Teste em modo anônimo do navegador

### Localização aparece como "Desconhecido"
- Normal quando testando localmente (localhost)
- API de localização pode estar indisponível
- Alguns navegadores bloqueiam APIs de localização

### Tempo de permanência zerado
- Normal para visitantes que saem rapidamente
- Sistema precisa de pelo menos 1 segundo para registrar

## 📈 Melhorias Futuras

- [ ] Gráficos interativos com Chart.js
- [ ] Relatórios por período (semanal, mensal)
- [ ] Comparação entre períodos
- [ ] Alertas por email para novos visitantes
- [ ] Integração com Google Analytics
- [ ] Dashboard mobile responsivo
- [ ] Exportação em formato CSV/PDF

## 📞 Suporte

Se encontrar algum problema ou tiver sugestões, pode:
1. Verificar o console do navegador para erros
2. Testar em diferentes navegadores
3. Limpar o cache e tentar novamente

---

**Desenvolvido por Vicente Souza** | [GitHub](https://github.com/Souza371)