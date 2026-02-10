# 🎯 ProSporte - System Prompt Mestre para IAs

## 📋 Contexto Geral

O **ProSporte** é um SaaS de Esportes que abandonou web scraping e agora opera exclusivamente via APIs de Desenvolvedores profissionais (API-Football, The-Odds-API, Sportmonks).

A arquitetura segue o padrão **Hub de Integração**, com o backend centralizado como ponto único de sincronização de dados.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│           APIs de Desenvolvedores                   │
│  (API-Football | The-Odds-API | Sportmonks)        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│      Backend Hub (Node.js)                          │
│  ┌──────────────────────────────────────────────┐  │
│  │ 1. Adaptador de API (apiAdapter.js)          │  │
│  │ 2. Normalizador (normalizer.js)              │  │
│  │ 3. Gerenciador (syncManager.js)              │  │
│  │ 4. Rotas (/api/v1/sync)                      │  │
│  └──────────────────────────────────────────────┘  │
└──────┬──────────────────────────────────┬───────────┘
       │                                  │
       ▼                                  ▼
┌──────────────────┐            ┌──────────────────┐
│  Aplicativo      │            │  Dashboard       │
│  Android         │            │  Web             │
│                  │            │                  │
│ Retrofit/OkHttp  │            │ Vue/React/Next   │
│ ↓                │            │ ↓                │
│ /api/v1/sync     │            │ /api/v1/sync     │
│ (JSON)           │            │ (JSON)           │
└──────────────────┘            └──────────────────┘
```

---

## 📊 Padrão de Dados Obrigatório

**TODAS as partidas devem ter esta estrutura:**

```json
{
  "id_partida": "string ou int",
  "casa": "string (nome real do time)",
  "fora": "string (nome real do time)",
  "placar_casa": 0,
  "placar_fora": 0,
  "status": "string (Ao Vivo|Finalizado|15:30|...)",
  "liga": "string (nome real da liga)",
  "data_partida": "ISO 8601",
  "timestamp_sync": "ISO 8601"
}
```

**NUNCA use:**
- ❌ `home_team_id` em vez de `casa`
- ❌ `score` em vez de `placar_casa` e `placar_fora`
- ❌ Códigos de times (ex: "123")
- ❌ Nomes abreviados (ex: "RM" em vez de "Real Madrid")

---

## 🌐 Infraestrutura de Domínios

| Serviço | URL | Tipo | Responsável |
|---------|-----|------|-------------|
| **Web/Dashboard** | `https://prosporte.com.br` | HTML/JS | IA da Web |
| **API (Android/Web)** | `https://api.prosporte.com.br` | JSON | Backend Hub |
| **Web API** | `https://prosporte.com.br/api/v1` | JSON | IA da Web |

---

## 🔌 Endpoints Padrão

### Backend Hub Endpoints

```
GET /api/v1/sync
   ↳ Retorna: { matches: [...], metadata: {...} }
   
POST /api/v1/sync
   ↳ Body: { provider: "mock" | "apiFootball" | "theOddsApi" }
   ↳ Força sincronização manual

GET /api/v1/sync/status
   ↳ Retorna: { lastSync, provider, totalMatches, history }
   
GET /api/v1/sync/matches?liga=La%20Liga&status=Ao%20Vivo
   ↳ Retorna: { matches: [...], filters: {...} }
```

---

## 🎯 Responsabilidades por IA

### 1️⃣ IA do Backend

**Arquivo:** `Backend Node.js`

**Responsabilidades:**
- ✅ Manter `apiAdapter.js` atualizado com novas APIs
- ✅ Garantir normalização em `normalizer.js`
- ✅ Manter rotas `/api/v1/sync` funcionando
- ✅ Gerenciar `.env` e credenciais
- ✅ Logs e monitoramento

**NÃO PODE:**
- ❌ Expor chaves de API no código
- ❌ Alterar estrutura de dados sem notificar outras IAs
- ❌ Retornar dados não normalizados

---

### 2️⃣ IA do Android

**Arquivo:** `App Android (Kotlin/Java)`

**Responsabilidades:**
- ✅ Consumir `GET /api/v1/sync`
- ✅ Mapear JSON para Data Classes (Retrofit)
- ✅ Exibir dados na UI
- ✅ Cache local em Room/SQLite

**Mapeamento Obrigatório:**
```kotlin
data class Partida(
    @SerializedName("id_partida") val idPartida: String,
    val casa: String,
    val fora: String,
    @SerializedName("placar_casa") val placarCasa: Int,
    @SerializedName("placar_fora") val placarFora: Int,
    val status: String,
    val liga: String,
    @SerializedName("data_partida") val dataPartida: String,
    @SerializedName("timestamp_sync") val timestampSync: String
)
```

**NÃO PODE:**
- ❌ Fazer requisições diretas para APIs de desenvolvedores
- ❌ Expor chaves de API
- ❌ Armazenar dados não normalizados

---

### 3️⃣ IA da Web

**Arquivo:** `Dashboard Web (React/Vue/Next.js)`

**Responsabilidades:**
- ✅ Consumir `GET /api/v1/sync`
- ✅ Exibir partidas no dashboard
- ✅ Monitorar status via `/api/v1/sync/status`
- ✅ Filtros e buscas

**Exemplo de Consumo:**
```javascript
const fetchMatches = async () => {
  const response = await fetch('https://api.prosporte.com.br/api/v1/sync');
  const data = await response.json();
  return data.matches;
};
```

**NÃO PODE:**
- ❌ Fazer requisições diretas para APIs de desenvolvedores
- ❌ Expor chaves de API
- ❌ Alterar estrutura de dados

---

## 🔐 Segurança - Checklist

- [ ] Chaves de API estão em `.env` (não no código)
- [ ] `.env` está no `.gitignore`
- [ ] CORS está configurado para domínios autorizados
- [ ] Todos os dados passam por validação
- [ ] Nenhuma chave é printada em logs
- [ ] Rate limiting está implementado (em produção)
- [ ] HTTPS obrigatório (em produção)

---

## 🔄 Fluxo de Sincronização

```
1. Backend inicia
   ↓
2. Executa apiAdapter.fetchFromProvider('mock')
   ↓
3. Recebe array de partidas (formato bruto da API)
   ↓
4. Normalizer transforma para padrão ProSporte
   ↓
5. SyncManager valida cada partida
   ↓
6. Salva em data/jogos.json
   ↓
7. Registra log em data/sync.log
   ↓
8. Endpoints /api/v1/sync retornam dados normalizados
   ↓
9. Android e Web consomem dados via HTTP
```

---

## 📱 Instruções para Integração Android

### Setup Retrofit

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.prosporte.com.br/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

interface SyncService {
    @GET("api/v1/sync")
    suspend fun getMatches(): Response<SyncResponse>
    
    @GET("api/v1/sync/matches")
    suspend fun getFilteredMatches(
        @Query("liga") liga: String?,
        @Query("status") status: String?
    ): Response<SyncResponse>
}
```

### Data Models

```kotlin
data class SyncResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("matches") val matches: List<Partida>,
    @SerializedName("totalMatches") val totalMatches: Int
)

data class Partida(
    @SerializedName("id_partida") val idPartida: String,
    val casa: String,
    val fora: String,
    @SerializedName("placar_casa") val placarCasa: Int,
    @SerializedName("placar_fora") val placarFora: Int,
    val status: String,
    val liga: String,
    @SerializedName("data_partida") val dataPartida: String,
    @SerializedName("timestamp_sync") val timestampSync: String
)
```

---

## 🌐 Instruções para Integração Web

### Setup Fetch

```javascript
const baseURL = 'https://api.prosporte.com.br/api/v1';

const fetchMatches = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${baseURL}/sync/matches?${params}`);
  
  if (!response.ok) throw new Error('Erro ao buscar dados');
  
  return response.json();
};

const fetchStatus = async () => {
  const response = await fetch(`${baseURL}/sync/status`);
  return response.json();
};
```

### TypeScript Types

```typescript
interface Partida {
  id_partida: string;
  casa: string;
  fora: string;
  placar_casa: number;
  placar_fora: number;
  status: string;
  liga: string;
  data_partida: string;
  timestamp_sync: string;
}

interface SyncResponse {
  success: boolean;
  timestamp: string;
  matches: Partida[];
  totalMatches: number;
}

interface SyncStatus {
  lastSync: string;
  provider: string;
  totalMatches: number;
  dataStatus: string;
}
```

---

## 🚨 Comunicação Entre IAs

Quando uma IA precisa fazer mudanças que afetam outras:

1. **Backend** modifica estrutura de dados
   → Notifica **Android** e **Web** sobre mudança
   → Ambas atualizam mapeamento

2. **Android/Web** solicita novo campo
   → Notifica **Backend**
   → Backend avalia adição ao padrão

3. **Em caso de conflito**
   → Consultar o **Prompt Mestre** (este documento)
   → Manter compatibilidade com versão anterior

---

## 📝 Exemplo de Integração Completa

### 1. Backend sincroniza dados:

```bash
POST /api/v1/sync
```

Response:
```json
{
  "success": true,
  "matches": [
    {
      "id_partida": "1001",
      "casa": "Real Madrid",
      "fora": "Barcelona",
      "placar_casa": 0,
      "placar_fora": 0,
      "status": "15:30",
      "liga": "La Liga",
      "data_partida": "2026-01-31T15:30:00Z",
      "timestamp_sync": "2026-01-31T14:30:00Z"
    }
  ]
}
```

### 2. Android consome:

```kotlin
val matches = syncService.getMatches()
adapter.setMatches(matches.matches)
recyclerView.notifyDataSetChanged()
```

### 3. Web exibe:

```html
<div class="partida">
  <span class="casa">Real Madrid</span>
  <span class="placar">0 x 0</span>
  <span class="fora">Barcelona</span>
  <span class="status">15:30</span>
</div>
```

---

## ✅ Checklist de Desenvolvimento

Antes de fazer commit:

- [ ] Estrutura JSON segue padrão `id_partida`, `casa`, `fora`, etc
- [ ] Nenhuma chave de API exposta
- [ ] CORS configurado corretamente
- [ ] Testes de integração passam
- [ ] Documentação atualizada
- [ ] Versão incrementada em `package.json`
- [ ] Log de mudanças atualizado
- [ ] Notificação enviada para outras IAs (se necessário)

---

## 🎓 Regras de Ouro

1. **Uma Fonte de Verdade** - Backend Hub é a única origem de dados
2. **Dados Sempre Normalizados** - Nunca envie dados brutos
3. **Segurança First** - API Keys nunca no frontend
4. **Versionamento** - Manter compatibilidade com versões anteriores
5. **Documentação** - Manter este documento atualizado
6. **Comunicação** - Notificar quando mudar algo que afeta outros

---

## 🔗 Referências Rápidas

- **Backend:** `c:\Dev\saasportesMobile\backend\`
- **Android:** `c:\Dev\saasportesMobile\android\`
- **Documentação:** Backend `README.md` e `QUICKSTART.md`
- **Postman Collection:** `ProSporte.postman_collection.json`

---

**Versão:** 1.0.0  
**Data:** 2026-01-31  
**Última Atualização:** Setup inicial  

🚀 **ProSporte - Transformando dados brutos em inteligência esportiva**
