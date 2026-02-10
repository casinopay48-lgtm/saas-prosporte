# 🚀 Guia de Início Rápido - ProSporte Backend

## ⚡ Quick Start (5 minutos)

### 1. Setup Automático (Recomendado)

**Windows:**
```bash
cd backend
setup.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

Isso vai:
- ✅ Verificar Node.js
- ✅ Instalar npm packages
- ✅ Criar arquivo .env
- ✅ Criar pasta data/

### 2. Iniciar o Servidor

```bash
npm start
```

Esperado ver:
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

### 3. Testar Endpoints (Copie e Cola no Navegador ou Postman)

**Teste 1 - Health Check:**
```
GET http://localhost:3000/health
```

**Teste 2 - Obter Dados Normalizados:**
```
GET http://localhost:3000/api/v1/sync
```

**Teste 3 - Listar Partidas:**
```
GET http://localhost:3000/api/v1/sync/matches
```

**Teste 4 - Filtrar por Liga:**
```
GET http://localhost:3000/api/v1/sync/matches?liga=La%20Liga
```

**Teste 5 - Status de Sincronização:**
```
GET http://localhost:3000/api/v1/sync/status
```

---

## 📦 Estrutura de Pastas

Após setup, você terá:

```
backend/
├── node_modules/           ← Dependências instaladas
├── src/                    ← Código fonte
│   ├── services/           ← Lógica de negócio
│   ├── routes/             ← Endpoints
│   ├── controllers/        ← Handlers
│   ├── config/             ← Configurações
│   └── tasks/              ← Tarefas
├── data/                   ← Dados persistidos
│   ├── jogos.json          ← Partidas normalizadas
│   └── sync.log            ← Histórico de sincronizações
├── .env                    ← Variáveis de ambiente
├── server.js               ← Servidor principal
└── package.json            ← Dependências
```

---

## 🔧 Configurações Opcionais

### Mudar Porta

Edite `.env`:
```env
PORT=8080
```

### Mudar Intervalo de Sincronização

Edite `server.js`:
```javascript
const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutos
```

### Usar API Real (em vez de Mock)

1. Obtenha chave da [API-Football](https://www.api-football.com) via [RapidAPI](https://rapidapi.com/api-sports/api/api-football)

2. Edite `.env`:
```env
API_FOOTBALL_KEY=sua_chave_aqui
API_FOOTBALL_HOST=api-football-v3.p.rapidapi.com
```

3. Edite `server.js` - Mude:
```javascript
await syncManager.sync('mock');  // Antes
```

Para:
```javascript
await syncManager.sync('apiFootball');  // Depois
```

---

## 🧪 Testar com Postman

### Importar Collection

1. Abra **Postman**
2. **Import** → **Upload Files**
3. Selecione `ProSporte.postman_collection.json`
4. Clique em **Import**

Agora você tem todos os endpoints prontos para testar!

---

## 📊 Exemplo de Resposta

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
  ],
  "totalMatches": 3
}
```

---

## ❓ Problemas Comuns

### Erro: "port is already in use"
Mude a porta em `.env` ou feche o processo na porta 3000.

### Erro: "Cannot find module"
Execute `npm install` novamente.

### Dados não aparecem
Espere 5 segundos e recarregue a página (a primeira sincronização leva um tempo).

---

## 🎯 Próximos Passos

1. ✅ **Backend rodando?** Teste em: http://localhost:3000/health

2. 📱 **Integrar no Android** - Use a base URL: `http://localhost:3000/api/v1`

3. 🌐 **Integrar na Web** - Mesmo endpoint, diferente contexto

4. 🔐 **Adicionar chave de API real** - Substitua Mock por API-Football, etc

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Server não inicia | `npm install` → `npm start` |
| Dados vazios | Aguarde primeira sincronização (5-10s) |
| CORS error | Verifique domínio no cors() em server.js |
| Chave inválida | Revalide no RapidAPI / API provider |

---

**Pronto! Seu Backend Hub está online! 🚀**
