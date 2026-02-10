# 🚀 ProSporte Backend Hub

Hub de Integração centralizado para sincronização de dados de APIs esportivas profissionais. Responsável por conectar com provedores como API-Football, The-Odds-API e Sportmonks, normalizando os dados para um padrão único.

## 📋 Estrutura do Projeto

```
backend/
├── src/
│   ├── services/
│   │   ├── apiAdapter.js      # Adaptador de múltiplas APIs
│   │   ├── normalizer.js      # Transformação para padrão ProSporte
│   │   └── syncManager.js     # Orquestração da sincronização
│   ├── routes/
│   │   └── sync.js            # Rotas de sincronização
│   ├── controllers/
│   │   └── syncController.js  # Lógica dos endpoints
│   ├── config/
│   │   └── providers.js       # Configuração de provedores
│   └── tasks/
│       └── syncTask.js        # Sincronização manual
├── data/
│   ├── jogos.json             # Dados normalizados (saída)
│   └── sync.log               # Histórico de sincronizações
├── .env.example               # Modelo de variáveis
├── .env                       # Variáveis de ambiente (gitignored)
├── server.js                  # Servidor principal
├── package.json               # Dependências
└── README.md                  # Este arquivo
```

## 🎯 Padrão de Dados ProSporte

Todas as partidas são normalizadas para este formato:

```json
{
  "id_partida": "string/int",
  "casa": "string (nome do time)",
  "fora": "string (nome do time)",
  "placar_casa": "int (0-99)",
  "placar_fora": "int (0-99)",
  "status": "string (Ao Vivo|Finalizado|HH:MM|...)",
  "liga": "string (nome da liga)",
  "data_partida": "ISO 8601 timestamp",
  "timestamp_sync": "ISO 8601 timestamp"
}
```

### Exemplo de Resposta:
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00Z",
  "metadata": {
    "version": "1.0.0",
    "provider": "mock",
    "lastSync": "2026-01-31T14:30:00Z",
    "totalMatches": 3,
    "status": "success"
  },
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

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas chaves:

```env
# APIs
API_FOOTBALL_KEY=sua_chave_aqui
API_FOOTBALL_HOST=api-football-v3.p.rapidapi.com
THE_ODDS_API_KEY=sua_chave_aqui
SPORTMONKS_KEY=sua_chave_aqui

# Servidor
NODE_ENV=development
PORT=3000
DOMAIN=api.prosporte.com.br
```

## 🚀 Como Usar

### Iniciar o Servidor

```bash
npm start
```

Saída esperada:
```
============================================================
🚀 ProSporte Backend Hub - ONLINE
============================================================

📡 Servidor: http://localhost:3000
🔗 Endereço da API: http://localhost:3000/api/v1

📋 Endpoints disponíveis:
   GET  http://localhost:3000/api/v1/sync
   POST http://localhost:3000/api/v1/sync
   GET  http://localhost:3000/api/v1/sync/status
   GET  http://localhost:3000/api/v1/sync/matches

❤️  Health Check: http://localhost:3000/health
============================================================
```

### Modo Desenvolvimento (com hot-reload)

```bash
npm run dev
```

### Sincronização Manual

```bash
npm run sync
```

## 📡 Endpoints da API

### 1. GET `/api/v1/sync`
Retorna dados normalizados de todas as partidas

**Resposta:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00Z",
  "metadata": { ... },
  "matches": [ ... ],
  "totalMatches": 3
}
```

### 2. POST `/api/v1/sync`
Força uma sincronização manual

**Request:**
```json
{
  "provider": "mock"
}
```

**Resposta:** Igual ao GET /api/v1/sync

### 3. GET `/api/v1/sync/status`
Retorna status da sincronização e histórico

**Resposta:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00Z",
  "status": {
    "lastSync": "2026-01-31T14:30:00Z",
    "provider": "mock",
    "totalMatches": 3,
    "dataStatus": "success"
  },
  "history": [ ... ]
}
```

### 4. GET `/api/v1/sync/matches`
Lista de partidas com filtros opcionais

**Query Parameters:**
- `status`: Filtra por status (ex: "Ao Vivo", "Finalizado")
- `liga`: Filtra por liga (ex: "La Liga", "Premier League")

**Exemplos:**
```
GET /api/v1/sync/matches?status=Ao%20Vivo
GET /api/v1/sync/matches?liga=Premier%20League
GET /api/v1/sync/matches?status=Finalizado&liga=La%20Liga
```

**Resposta:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00Z",
  "filters": {
    "status": "Ao Vivo",
    "liga": "nenhum"
  },
  "totalMatches": 2,
  "matches": [ ... ]
}
```

### 5. GET `/health`
Verifica saúde do servidor

**Resposta:**
```json
{
  "status": "online",
  "service": "ProSporte Backend Hub",
  "timestamp": "2026-01-31T14:30:00Z"
}
```

## 🔄 Fluxo de Dados

```
1. API de Desenvolvedor (API-Football, The-Odds-API, etc)
        ↓
2. apiAdapter.js (Busca dados brutos)
        ↓
3. normalizer.js (Transforma para padrão ProSporte)
        ↓
4. syncManager.js (Valida e armazena)
        ↓
5. jogos.json (Dados persistidos)
        ↓
6. Rota /api/v1/sync (Entrega para Android e Web)
```

## 📱 Consumo no Android

A aplicação Android deve fazer requisições para:

```
GET https://api.prosporte.com.br/api/v1/sync
GET https://api.prosporte.com.br/api/v1/sync/matches?liga=Campeonato%20Brasileiro
```

### Retrofit Mapping:

```kotlin
data class PartidaResponse(
    @SerializedName("id_partida")
    val idPartida: String,
    val casa: String,
    val fora: String,
    @SerializedName("placar_casa")
    val placarCasa: Int,
    @SerializedName("placar_fora")
    val placarFora: Int,
    val status: String,
    val liga: String,
    @SerializedName("data_partida")
    val dataPartida: String,
    @SerializedName("timestamp_sync")
    val timestampSync: String
)
```

## 🌐 Consumo no Web

A dashboard web deve fazer requisições para:

```javascript
// Carregar partidas
fetch('https://api.prosporte.com.br/api/v1/sync')
  .then(res => res.json())
  .then(data => console.log(data.matches));

// Monitorar status
fetch('https://api.prosporte.com.br/api/v1/sync/status')
  .then(res => res.json())
  .then(data => console.log(data.status));

// Filtrar por liga
fetch('https://api.prosporte.com.br/api/v1/sync/matches?liga=Campeonato%20Brasileiro')
  .then(res => res.json())
  .then(data => console.log(data.matches));
```

## 🔐 Segurança

- ✅ **Chaves de API nunca são expostas** - Guardadas em `.env` no servidor
- ✅ **CORS configurado** - Permite requisições de domínios autorizados
- ✅ **Validação de dados** - Todos os dados são validados antes de serem entregues
- ✅ **Rate limiting** - (Implementar com express-rate-limit em produção)

## 🔧 Provedores Suportados

| Provedor | Status | Documentação |
|----------|--------|--------------|
| Mock Data | ✅ Ativo | Dados simulados para desenvolvimento |
| API-Football | ⏳ Ready | https://www.api-football.com |
| The-Odds-API | ⏳ Ready | https://the-odds-api.com |
| Sportmonks | ⏳ Ready | https://www.sportmonks.com |

**Status:**
- ✅ Implementado
- ⏳ Ready (aguardando chave)
- ⚠️ Em desenvolvimento

## 📊 Sincronização Automática

O servidor sincroniza dados automaticamente a cada **30 minutos**:

1. Busca dados da API configurada
2. Normaliza para padrão ProSporte
3. Valida integridade dos dados
4. Armazena em `jogos.json`
5. Registra log de sincronização

## 📝 Logs

- **Logs de Sincronização:** `data/sync.log`
- **Console:** Mensagens detalhadas durante execução

Exemplo de log:
```json
{
  "provider": "mock",
  "timestamp": "2026-01-31T14:30:00Z",
  "status": "success",
  "matchesCount": 3,
  "duration": 125
}
```

## 🐛 Troubleshooting

### Erro: "ENOENT: no such file or directory"
Solução: Crie manualmente a pasta `data/`
```bash
mkdir data
```

### Erro: "Cannot find module 'express'"
Solução: Instale as dependências
```bash
npm install
```

### API retornando erro 401
Solução: Verifique as chaves no `.env` e certifique-se de que não expiram

### Dados não estão sendo sincronizados
Solução: Verifique se o arquivo `.env` está configurado corretamente e se as chaves de API são válidas

## 📈 Próximos Passos

- [ ] Implementar rate limiting
- [ ] Adicionar autenticação de cliente
- [ ] Cache distribuído (Redis)
- [ ] Dashboard de monitoramento
- [ ] Webhooks para notificações em tempo real
- [ ] Suporte a múltiplas ligas simultâneas

## 📞 Suporte

Para problemas ou sugestões, abra uma issue no repositório.

---

**ProSporte © 2026** - Transformando dados brutos em inteligência esportiva 🏆
