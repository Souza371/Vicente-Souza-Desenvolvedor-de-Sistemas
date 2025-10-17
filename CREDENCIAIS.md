# Configuração do Sistema de Analytics

## 🔐 Credenciais de Acesso (IMPORTANTE!)

**⚠️ ALTERE ESTAS CREDENCIAIS IMEDIATAMENTE!**

Abra o arquivo `auth.js` e procure por esta seção:

```javascript
validateCredentials(username, password) {
    // Credenciais de exemplo - MUDE ESTAS CREDENCIAIS!
    const validCredentials = [
        { username: 'vicente', password: 'admin2024' },
        { username: 'admin', password: 'vicente123' },
        { username: 'vsouza', password: 'portfolio2024' }
    ];
```

### 🔧 Como Alterar as Credenciais:

1. **Abra o arquivo `auth.js`**
2. **Encontre a função `validateCredentials`**
3. **Substitua as credenciais pelos seus dados:**

```javascript
const validCredentials = [
    { username: 'SEU_USUARIO_AQUI', password: 'SUA_SENHA_FORTE_AQUI' },
    // Você pode ter múltiplas combinações
    { username: 'vicente_admin', password: 'MinhaS3nh@Fort3!' },
];
```

### 🛡️ Dicas de Segurança:

**✅ FAÇA:**
- Use senhas fortes (8+ caracteres, números, símbolos)
- Use usuários únicos (não "admin", "root", etc)
- Mude as credenciais regularmente
- Mantenha as credenciais em segredo

**❌ NÃO FAÇA:**
- Use senhas óbvias (123456, password, etc)
- Compartilhe as credenciais
- Use as credenciais padrão em produção
- Deixe as credenciais no código se for open source

### 🔒 Credenciais Configuradas:

**Usuário:** `vicente371`
**Senha:** `Abacaxi371@`

## ✅ SEGURANÇA: 
**Credenciais personalizadas configuradas com sucesso!**
- ✅ Usuário único e personalizado
- ✅ Senha forte (maiúsculas, números, símbolos)
- ✅ Fácil de lembrar para o Vicente
- ✅ Difícil de adivinhar por terceiros

---

## ⚙️ Configurações Adicionais

### Tempo de Sessão
Por padrão, a sessão expira em 24 horas. Para alterar:

```javascript
// No arquivo auth.js, linha ~27
if (now - data.timestamp > 24 * 60 * 60 * 1000) { // 24 horas
```

Altere para:
- `12 * 60 * 60 * 1000` = 12 horas
- `8 * 60 * 60 * 1000` = 8 horas
- `60 * 60 * 1000` = 1 hora

### Limite de Tentativas
Para adicionar proteção contra ataques de força bruta, você pode implementar um sistema de bloqueio após várias tentativas incorretas.

---

## 📱 Como Acessar

1. **Vá para:** `https://seusite.com/admin.html`
2. **Digite suas credenciais**
3. **Clique em "Entrar"**
4. **Visualize os dados dos visitantes**

## 🔄 Como Sair

- Clique no botão "Sair" no canto superior direito
- Ou feche o navegador (sessão expira automaticamente)

---

**Desenvolvido por Vicente Souza**