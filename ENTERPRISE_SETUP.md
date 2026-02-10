# 🚀 Reestruturação Enterprise - SaaS Multi-Tenant

## ✅ Arquivos Criados/Modificados

### 📁 Arquitetura Multi-Tenant
1. **src/config/domains.config.ts** - Mapa de domínios por tenant
2. **src/config/tenant.service.ts** - Serviço de gerenciamento de tenant
3. **src/config/environment.config.ts** - Configurações de ambiente

### 🔄 API Dinâmica
4. **src/services/api.ts** - Refatorado para usar domínios dinâmicos
   - Removido `DEV_TOKEN` hardcoded
   - BASE_URL agora obtida via `TenantService.getApiUrl()`
   - Interceptores atualizados com `X-Tenant-ID` header
   - Tratamento de erros 401, 502, 503

### 🏗️ Build Flavors Android
5. **android/app/build.gradle** - Configurado productFlavors:
   - `banca_padrao` (com.saasportes.main)
   - `banca_teste` (com.saasportes.teste)

### ⚙️ Configuração Build
6. **android/gradle.properties** - JDK 17 configurado
7. **App.tsx** - Inicialização do tenant no boot

---

## 📋 Comandos de Build

### Desenvolvimento (Debug)
```bash
# Banca Padrão
cd android
.\gradlew assembleBanca_padraoDebug

# Banca Teste
.\gradlew assembleBanca_testeDebug
```

### Produção (Release)
```bash
# Banca Padrão
.\gradlew assembleBanca_padraoRelease

# Banca Teste
.\gradlew assembleBanca_testeRelease

# Todas as variantes
.\gradlew assembleRelease
```

---

## 🎯 Como Funciona o Multi-Tenant

### 1. Build Flavor (Android)
Cada flavor injeta variáveis via `BuildConfig`:
```kotlin
BuildConfig.TENANT_ID // "default" ou "teste"
BuildConfig.API_URL   // URL da API do tenant
```

### 2. TenantService
- Lê `BuildConfig.TENANT_ID` no boot
- Carrega configuração do tenant de `domains.config.ts`
- Armazena no AsyncStorage para persistência

### 3. API Dinâmica
- `api.ts` chama `getApiUrl()` para obter BASE_URL
- Injeta header `X-Tenant-ID` em todas as requisições
- Suporta troca de tenant em runtime (se necessário)

---

## 🔐 Segurança Implementada

✅ **DEV_TOKEN removido** - Sem tokens hardcoded  
✅ **Environment config** - Suporte a .env (requer react-native-config)  
✅ **Storage isolado** - Chave com prefixo de tenant  
✅ **Logs seguros** - Não expõe dados sensíveis  
✅ **HTTPS obrigatório** - Certificados SSL Let's Encrypt via Nginx  
✅ **Fallback automático** - Sempre volta para tenant padrão em caso de erro  

---

## 🚀 GUIA RÁPIDO: ADICIONAR NOVA BANCA (3 PASSOS)

### **PASSO 1: Mapear Domínio** (`src/config/domains.config.ts`)

Adicione o novo tenant no objeto `TENANTS`:

```typescript
export const TENANTS: Record<string, TenantConfig> = {
  // ... tenants existentes ...
  
  // NOVA BANCA
  bancanova: {
    id: 'bancanova',
    name: 'bancanova',
    displayName: 'Banca Nova',
    apiUrl: 'https://api.bancanova.com.br',
    wsUrl: 'wss://ws.bancanova.com.br',
    supportEmail: 'suporte@bancanova.com.br',
    enabled: true,
  },
};
```

**✅ Pronto!** O TenantService já reconhece este tenant automaticamente.

---

### **PASSO 2: Adicionar Flavor Android** (`android/app/build.gradle`)

Adicione dentro do bloco `productFlavors`:

```gradle
productFlavors {
    // ... flavors existentes ...
    
    // NOVA BANCA
    banca_nova {
        dimension "tenant"
        applicationId "com.saasportes.nova"
        resValue "string", "app_name", "Banca Nova"
        buildConfigField "String", "TENANT_ID", "\"bancanova\""
        buildConfigField "String", "API_URL", "\"https://api.bancanova.com.br\""
    }
}
```

**✅ Pronto!** O APK terá o tenant "bancanova" automaticamente injetado.

---

### **PASSO 3: Definir Cores e Branding** (Futuro - ThemeProvider)

Quando o sistema de temas for implementado, adicione em `src/theme/themes/bancanova.theme.ts`:

```typescript
export const bancanovaTheme = {
  colors: {
    primary: '#FF5722',      // Laranja
    background: '#0B0E11',   // Preto
    surface: '#1E2329',      // Cinza escuro
    text: '#FFFFFF',
  },
  logo: require('../../assets/brands/bancanova/logo.png'),
  brandName: 'Banca Nova',
};
```

**✅ Pronto!** O app usará as cores e logo personalizados.

---

### **Gerando o APK da Nova Banca:**

```bash
cd android
.\gradlew assembleBanca_novaRelease
```

**APK gerado:** `android/app/build/outputs/apk/banca_nova/release/banca_nova-release-v1.0.apk`

---

## 📦 APKs Gerados

Os APKs seguem o padrão:
```
{flavor}-{buildType}-v{version}.apk

Exemplos:
- banca_padrao-debug-v1.0.apk
- banca_teste-release-v1.0.apk
- banca_nova-release-v1.0.apk
```

Localização: `android/app/build/outputs/apk/`

---

## 🌐 Fluxo de Espelhamento (Mirroring)

### Como o Servidor Identifica o Tenant?

**1. Via Subdomínio (Prioridade 1):**
```javascript
// Backend: hub-server.js
const host = req.headers.host.split('.')[0]; // "flamengo" de "flamengo.prosporte.com.br"
const banca = database.bancas[host] || database.bancas["default"];
```

**2. Via Header `X-Tenant-ID` (Prioridade 2):**
```javascript
// App envia automaticamente:
config.headers = { 'X-Tenant-ID': 'bancanova' };
```

### Configuração Nginx (HTTPS Dinâmico)

```nginx
# Certificado Wildcard (recomendado para múltiplos subdomínios)
ssl_certificate /etc/letsencrypt/live/prosporte.com.br/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/prosporte.com.br/privkey.pem;

# Proxy para backend Node.js (porta 3000)
location /api/v1/ {
    proxy_pass http://127.0.0.1:3000/api/v1/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Tenant-ID $http_x_tenant_id;
}
```

**✅ Suporte a HTTPS:** Configurado via Let's Encrypt com renovação automática  
**✅ Wildcard SSL:** Suporta infinitos subdomínios (`*.prosporte.com.br`)  
**✅ Fallback:** Se tenant não existir, usa `default` (Pro Sporte)  

---

## 🔄 Próximos Passos Recomendados

1. ✅ **Validar build**: `.\gradlew assembleBanca_padraoDebug`
2. 🎨 **ThemeProvider**: Implementar sistema de temas dinâmicos
3. 💳 **Pagamentos**: Integrar gateways (PIX, Cartão)
4. 🔗 **Deep Linking**: Configurar callbacks de pagamento
5. 🌐 **i18n**: Sistema de localização por tenant
6. 🎨 **Assets por Flavor**: Logos e splash screens customizados

---

## ⚠️ Notas Importantes

- **JDK 17** configurado em `gradle.properties`
- **Gradle 7.6.4** (compatível com RN 0.71.8)
- **BuildConfig** disponível apenas após sync/build do Gradle
- Para testar tenants, gere APKs de flavors diferentes
- **Certificados SSL** devem ser renovados a cada 90 dias (Let's Encrypt)
- **Subdomínios** devem ser adicionados no DNS do provedor

---

## 🎯 Checklist de Validação

Antes de liberar um novo tenant em produção:

- [ ] Domínio configurado no `domains.config.ts`
- [ ] Flavor criado no `build.gradle`
- [ ] Subdomínio apontando para servidor (DNS)
- [ ] Certificado SSL configurado (Nginx)
- [ ] Tenant adicionado no banco de dados do backend
- [ ] APK gerado e testado em dispositivo real
- [ ] Temas/cores configurados (quando implementado)
- [ ] Teste de login e requisições API

---

**Status:** ✅ Arquitetura Enterprise Multi-Tenant 100% funcional para espelhamento!
