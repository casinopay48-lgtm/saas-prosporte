# ✅ ProSporte - Guia de Testes Prático

## 🧪 Testes Manuais - Passo a Passo

### Prerequisitos
- Node.js 14+ instalado
- Postman ou cURL instalado
- Terminal aberto na pasta `backend/`

---

## 1️⃣ Setup e Inicialização

### Passo 1: Instalar Dependências
```bash
npm install
```

**Esperado:**
```
added XXX packages in Xsec
```

### Passo 2: Criar Arquivo .env
```bash
cp .env.example .env
```

**Verificar:** Arquivo `.env` foi criado

### Passo 3: Iniciar Servidor
```bash
npm start
```

**Esperado:**
```
============================================================
🚀 ProSporte Backend Hub - ONLINE
============================================================

📡 Servidor: http://localhost:3000
...
```

✅ **Status:** Server rodando

---

## 2️⃣ Testes de Endpoint

### Teste 1: Health Check

**Terminal/PowerShell:**
```bash
curl http://localhost:3000/health
```

**Esperado:**
```json
{
  "status": "online",
  "service": "ProSporte Backend Hub",
  "timestamp": "2026-01-31T14:30:00.000Z"
}
```

✅ **Resultado:** Server responde

---

### Teste 2: Obter Dados Normalizados

**Terminal:**
```bash
curl http://localhost:3000/api/v1/sync
```

**Esperado:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00.000Z",
  "metadata": {
    "version": "1.0.0",
    "provider": "mock",
    "lastSync": "2026-01-31T14:30:00.000Z",
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
    },
    // ... mais 2 partidas
  ],
  "totalMatches": 3
}
```

✅ **Validação:**
- [ ] `success` é `true`
- [ ] Array `matches` não está vazio
- [ ] Cada partida tem todos os 9 campos obrigatórios
- [ ] Nenhuma chave de API exposta

---

### Teste 3: Validar Estrutura de Partida

Pega qualquer partida da resposta anterior e verifica:

```json
{
  "id_partida": "1001",         // ✅ String
  "casa": "Real Madrid",         // ✅ Sem abreviações
  "fora": "Barcelona",           // ✅ Nome completo
  "placar_casa": 0,              // ✅ Int
  "placar_fora": 0,              // ✅ Int
  "status": "15:30",             // ✅ Horário ou status
  "liga": "La Liga",             // ✅ Nome da liga
  "data_partida": "ISO 8601",    // ✅ Timestamp
  "timestamp_sync": "ISO 8601"   // ✅ Quando foi sincronizado
}
```

✅ **Validação:** Todos os campos presentes e tipos corretos

---

### Teste 4: Listar Partidas (sem filtro)

**Terminal:**
```bash
curl http://localhost:3000/api/v1/sync/matches
```

**Esperado:**
```json
{
  "success": true,
  "timestamp": "...",
  "filters": {
    "status": "nenhum",
    "liga": "nenhum"
  },
  "totalMatches": 3,
  "matches": [ ... ]
}
```

✅ **Resultado:** Retorna todas as partidas

---

### Teste 5: Filtrar por Liga

**Terminal:**
```bash
curl "http://localhost:3000/api/v1/sync/matches?liga=La%20Liga"
```

**Esperado:**
```json
{
  "success": true,
  "filters": {
    "status": "nenhum",
    "liga": "La Liga"
  },
  "totalMatches": 1,
  "matches": [
    { "casa": "Real Madrid", "fora": "Barcelona", "liga": "La Liga", ... }
  ]
}
```

✅ **Validação:**
- [ ] Apenas partidas da "La Liga" retornam
- [ ] `totalMatches` = 1
- [ ] Filtro é refletido em `filters.liga`

---

### Teste 6: Filtrar por Status

**Terminal:**
```bash
curl "http://localhost:3000/api/v1/sync/matches?status=Ao%20Vivo"
```

**Esperado:**
```json
{
  "success": true,
  "filters": {
    "status": "Ao Vivo",
    "liga": "nenhum"
  },
  "totalMatches": 1,
  "matches": [ ... ]
}
```

✅ **Validação:** Apenas partidas com status "Ao Vivo" (se houver)

---

### Teste 7: Combinar Filtros

**Terminal:**
```bash
curl "http://localhost:3000/api/v1/sync/matches?liga=Campeonato%20Brasileiro&status=Finalizado"
```

**Esperado:**
```json
{
  "success": true,
  "filters": {
    "status": "Finalizado",
    "liga": "Campeonato Brasileiro"
  },
  "totalMatches": 1,
  "matches": [ 
    { "casa": "Flamengo", "fora": "Corinthians", "liga": "Campeonato Brasileiro", "status": "Finalizado", ... }
  ]
}
```

✅ **Validação:** Ambos os filtros aplicados

---

### Teste 8: Obter Status de Sincronização

**Terminal:**
```bash
curl http://localhost:3000/api/v1/sync/status
```

**Esperado:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:30:00.000Z",
  "status": {
    "lastSync": "2026-01-31T14:30:00.000Z",
    "provider": "mock",
    "totalMatches": 3,
    "dataStatus": "success"
  },
  "history": [
    {
      "provider": "mock",
      "timestamp": "2026-01-31T14:30:00.000Z",
      "status": "success",
      "matchesCount": 3,
      "duration": 125
    }
  ]
}
```

✅ **Validação:**
- [ ] `lastSync` é recente
- [ ] `provider` é "mock"
- [ ] Array `history` não está vazio

---

### Teste 9: Forçar Sincronização Manual (POST)

**Terminal:**
```bash
curl -X POST http://localhost:3000/api/v1/sync \
  -H "Content-Type: application/json" \
  -d '{"provider":"mock"}'
```

**Esperado:**
```json
{
  "success": true,
  "timestamp": "2026-01-31T14:31:00.000Z",
  "message": "Sincronização concluída com 3 partidas",
  "matchesCount": 3,
  "metadata": { ... },
  "matches": [ ... ]
}
```

✅ **Validação:** Nova sincronização disparada e dados retornados

---

## 3️⃣ Testes de Integração (Android/Web)

### Teste 10: Simular Requisição do Android (Retrofit)

**cURL (simula OkHttp/Retrofit):**
```bash
curl -H "Accept: application/json" \
  http://localhost:3000/api/v1/sync
```

**Esperado:** Mesmo JSON de antes (compatível com Retrofit)

✅ **Validação:** Android conseguirá fazer parse com Gson

---

### Teste 11: CORS Check

**Browser - Abra Console (F12):**
```javascript
fetch('http://localhost:3000/api/v1/sync')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

**Esperado:** Dados exibidos no console (sem erro de CORS)

✅ **Validação:** CORS configurado corretamente

---

## 4️⃣ Testes de Performance

### Teste 12: Tempo de Resposta

**Terminal:**
```bash
time curl http://localhost:3000/api/v1/sync > /dev/null
```

**Esperado:**
```
real    0m0.XXXs  (menos de 500ms)
```

✅ **Validação:** Response rápido

---

### Teste 13: Múltiplas Requisições Simultâneas

**PowerShell (Windows):**
```powershell
1..10 | ForEach-Object { 
  Invoke-WebRequest http://localhost:3000/api/v1/sync -UseBasicParsing
}
```

**Esperado:** Todas as requisições retornam 200 OK

✅ **Validação:** Server aguenta múltiplas requisições

---

## 5️⃣ Testes de Armazenamento

### Teste 14: Verificar jogos.json

**Terminal:**
```bash
ls -la data/
cat data/jogos.json
```

**Esperado:**
- [ ] Arquivo `jogos.json` existe em `data/`
- [ ] Contém JSON válido
- [ ] Tem os 3 campos: `metadata`, `matches`, `totalMatches` (se houver)

✅ **Validação:** Dados persistem

---

### Teste 15: Verificar sync.log

**Terminal:**
```bash
cat data/sync.log | head -20
```

**Esperado:**
```json
[
  {
    "provider": "mock",
    "timestamp": "2026-01-31T14:30:00.000Z",
    "status": "success",
    "matchesCount": 3,
    "duration": 125
  }
]
```

✅ **Validação:** Logs registrados

---

## 🐛 Testes de Erro

### Teste 16: Endpoint Inexistente

**Terminal:**
```bash
curl http://localhost:3000/api/v1/inexistente
```

**Esperado:**
```
404 Not Found
```

✅ **Validação:** Erro apropriado

---

### Teste 17: POST com Provedor Inválido

**Terminal:**
```bash
curl -X POST http://localhost:3000/api/v1/sync \
  -H "Content-Type: application/json" \
  -d '{"provider":"provedor_invalido"}'
```

**Esperado:**
```json
{
  "success": false,
  "error": "Provedor ... não encontrado"
}
```

✅ **Validação:** Erro tratado corretamente

---

## 📋 Checklist Final

Marque conforme completa:

```
Testes Básicos:
- [ ] Health check funciona
- [ ] GET /api/v1/sync retorna dados
- [ ] Estrutura de partida está correta
- [ ] Nenhuma chave de API exposta

Testes de Filtro:
- [ ] Filtro por liga funciona
- [ ] Filtro por status funciona
- [ ] Combinação de filtros funciona

Testes de Endpoint:
- [ ] GET /api/v1/sync/matches funciona
- [ ] GET /api/v1/sync/status funciona
- [ ] POST /api/v1/sync força sincronização

Testes de Integração:
- [ ] Retrofit consegue fazer parse
- [ ] CORS permite requisições
- [ ] Response time < 500ms

Testes de Armazenamento:
- [ ] jogos.json é criado
- [ ] sync.log é criado
- [ ] Dados persistem

Testes de Erro:
- [ ] 404 para endpoint inexistente
- [ ] Erro apropriado para provedor inválido
```

---

## 🎯 Próximo Passo

Se todos os testes passarem ✅:

1. **Android Developer** - Integre a URL `http://localhost:3000/api/v1` no Retrofit
2. **Web Developer** - Integre a URL `http://localhost:3000/api/v1` no seu fetch/axios
3. **Mude para API Real** - Substitua `mock` por `apiFootball` quando tiver chave

---

**Tudo funcionando? 🚀 Backend Hub está pronto para produção!**
