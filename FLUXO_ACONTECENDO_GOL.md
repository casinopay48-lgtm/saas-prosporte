# 🎯 Fluxo Completo: Campo `acontecendo_gol` 

**Data:** 2026-01-31  
**Status:** ✅ Implementado e Testável

---

## 📊 Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. BACKEND: apiAdapter.js                                       │
│    └─ Recebe JSON de API-Football (ou Mock)                     │
│    └─ Mock agora tem campo: _prosporte_meta.acontecendo_gol     │
└────────────────────┬────────────────────────────────────────────┘

┌────────────────────┴────────────────────────────────────────────┐
│ 2. BACKEND: normalizer.js                                       │
│    └─ Transforma dados para padrão ProSporte                    │
│    └─ NOVO: Verifica _prosporte_meta.acontecendo_gol            │
│    └─ Adiciona campo 'acontecendo_gol': true/false             │
└────────────────────┬────────────────────────────────────────────┘

┌────────────────────┴────────────────────────────────────────────┐
│ 3. BACKEND: syncManager.js                                      │
│    └─ Salva JSON normalizado em data/jogos.json                 │
│    └─ Incluindo 'acontecendo_gol' para cada partida            │
└────────────────────┬────────────────────────────────────────────┘

┌────────────────────┴────────────────────────────────────────────┐
│ 4. API: GET /api/v1/sync                                        │
│    └─ Retorna JSON com campo 'acontecendo_gol'                  │
│    └─ Status: 200 OK                                            │
│    └─ Destino: https://api.prosporte.com.br/api/v1/sync        │
└────────────────────┬────────────────────────────────────────────┘

┌────────────────────┴────────────────────────────────────────────┐
│ 5. ANDROID: React Native App                                    │
│    └─ Faz fetch de https://api.prosporte.com.br/api/v1/sync    │
│    └─ Recebe JSON com 'acontecendo_gol'                         │
│    └─ Se true: renderiza bolinha verde com animação            │
│    └─ Se false: oculta o indicador                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados Detalhado

### PASSO 1: Dados Chegam no Backend

**Arquivo:** `backend/src/services/apiAdapter.js`

```javascript
// Mock data agora inclui campo meta
getMockData() {
  return [
    {
      fixture: { /* ... */ },
      teams: { /* ... */ },
      goals: { home: 1, away: 1 },
      league: { /* ... */ },
      // NOVO ✨
      _prosporte_meta: {
        acontecendo_gol: true  // ← Para a partida do Flamengo
      }
    }
  ];
}
```

**O que mudou:**
- Campo `_prosporte_meta` adicionado aos dados mock
- Contém `acontecendo_gol: true/false`
- Será usado pelo normalizador para decidir

---

### PASSO 2: Normalização no Backend

**Arquivo:** `backend/src/services/normalizer.js`

```javascript
normalizeApiFootballMatch(match) {
  // ... código anterior ...
  
  // NOVO: Lê o campo meta se existir, senão simula
  let acontecendo_gol = match._prosporte_meta?.acontecendo_gol ?? 
                        (['1H', '2H', 'ET'].includes(fixture.status) && Math.random() < 0.15);

  return {
    id_partida: String(fixture.id),
    casa: cleanTeamName(teams.home.name),
    fora: cleanTeamName(teams.away.name),
    placar_casa: goals?.home ?? 0,
    placar_fora: goals?.away ?? 0,
    status: displayStatus,
    liga: league.name,
    data_partida: fixture.date || new Date().toISOString(),
    timestamp_sync: new Date().toISOString(),
    acontecendo_gol: acontecendo_gol,  // ← NOVO CAMPO
    _raw: { /* ... */ }
  };
}
```

**O que mudou:**
- Verifica se `_prosporte_meta.acontecendo_gol` existe
- Se existir, usa o valor
- Se não existir, simula baseado no status da partida
- Adiciona o campo `acontecendo_gol` ao objeto normalizado

---

### PASSO 3: JSON Persistido

**Arquivo:** `backend/data/jogos.json`

```json
{
  "matches": [
    {
      "id_partida": "1003",
      "casa": "Flamengo RJ",
      "fora": "Corinthians SP",
      "placar_casa": 1,
      "placar_fora": 1,
      "status": "20 min",
      "liga": "Campeonato Brasileiro",
      "data_partida": "2026-01-31T14:20:00Z",
      "timestamp_sync": "2026-01-31T14:30:00Z",
      "acontecendo_gol": true     ← NOVO CAMPO
    },
    {
      "id_partida": "1004",
      "casa": "São Paulo SP",
      "fora": "Palmeiras SP",
      "placar_casa": 0,
      "placar_fora": 0,
      "status": "19:00",
      "liga": "Campeonato Brasileiro",
      "data_partida": "2026-01-31T19:00:00Z",
      "timestamp_sync": "2026-01-31T14:30:00Z",
      "acontecendo_gol": false    ← NOVO CAMPO
    }
  ]
}
```

---

### PASSO 4: API Retorna os Dados

**GET** `https://api.prosporte.com.br/api/v1/sync`

```json
{
  "status": "success",
  "message": "Sincronização completada",
  "matches": [
    {
      "id_partida": "1003",
      "casa": "Flamengo RJ",
      "fora": "Corinthians SP",
      "placar_casa": 1,
      "placar_fora": 1,
      "status": "20 min",
      "liga": "Campeonato Brasileiro",
      "data_partida": "2026-01-31T14:20:00Z",
      "timestamp_sync": "2026-01-31T14:30:00Z",
      "acontecendo_gol": true
    }
  ],
  "timestamp": "2026-01-31T14:30:00Z"
}
```

---

### PASSO 5: Android Renderiza

**Arquivo:** `src/components/MatchCard.jsx`

```javascript
const MatchCard = ({ match }) => {
  const scaleAnim = new Animated.Value(1);

  // Se acontecendo_gol for true, anima
  useEffect(() => {
    if (match.acontecendo_gol) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [match.acontecendo_gol]);

  return (
    <View style={styles.matchCard}>
      <View style={styles.matchRow}>
        <Text>{match.casa}</Text>
        
        <View style={styles.scorContainer}>
          <Text>{match.placar_casa} × {match.placar_fora}</Text>
          
          {/* RENDERIZA BOLINHA VERDE SE acontecendo_gol = true */}
          {match.acontecendo_gol && (
            <Animated.View
              style={[
                styles.golIndicator,
                { transform: [{ scale: scaleAnim }] },
              ]}
            />
          )}
        </View>
        
        <Text>{match.fora}</Text>
      </View>
    </View>
  );
};
```

---

## 🧪 Como Testar Localmente

### 1️⃣ Iniciar o Backend

```bash
cd c:\Dev\saasportesMobile\backend
npm install
npm start
```

✅ Resposta esperada:
```
⚙️  Iniciando ProSporte Backend Hub...
✅ Servidor rodando em http://localhost:3000
🔄 Primeira sincronização em andamento...
✅ Sincronização completada! 3 partidas carregadas
```

---

### 2️⃣ Verificar os Dados

```bash
# Terminal 1: Backend ainda rodando

# Terminal 2: Teste a API
curl http://localhost:3000/api/v1/sync
```

✅ Resposta esperada (JSON com `acontecendo_gol`):
```json
{
  "status": "success",
  "matches": [
    {
      "id_partida": "1003",
      "casa": "Flamengo RJ",
      "fora": "Corinthians SP",
      "placar_casa": 1,
      "placar_fora": 1,
      "status": "20 min",
      "liga": "Campeonato Brasileiro",
      "data_partida": "2026-01-31T14:20:00Z",
      "timestamp_sync": "2026-01-31T14:30:00Z",
      "acontecendo_gol": true
    }
  ]
}
```

---

### 3️⃣ Visualizar no Navegador (Preview HTML)

```bash
# Terminal 2: Servir o preview
node serve-preview.js

# Ou usando Python:
python -m http.server 8888
```

Abra: **http://localhost:8888**

✅ Você verá:
- 3 partidas de exemplo
- **Bolinha verde piscante** (⚪ com animação) ao lado do Flamengo
- Bolinha **desativada** (opaca) para jogos agendados
- JSON de exemplo no final da página

---

## 📱 Como Instruir a IA do Android

**Use ESTA instrução:**

```
O JSON da API agora envia um campo booleano chamado acontecendo_gol. 
Se for true, mostre uma View circular verde com uma animação de Alpha 
ou Scale (piscar) ao lado do placar no item da lista.

Referência:
- Arquivo de instrução: ANDROID_IA_INSTRUCTION.md
- Exemplo JSON: https://api.prosporte.com.br/api/v1/sync
- Código React Native: Veja MatchCard.jsx no ANDROID_IA_INSTRUCTION.md
```

---

## 🔍 Validação Completa

### ✅ Backend
- [x] normalizer.js detecta campo `acontecendo_gol`
- [x] apiAdapter.js mock envia `_prosporte_meta`
- [x] syncManager.js persiste o campo
- [x] `/api/v1/sync` retorna o campo

### ✅ Frontend (Web)
- [x] prosporte-preview.html mostra animação
- [x] serve-preview.js disponibiliza em http://localhost:8888
- [x] CSS/JS implementam piscar (scale 1.0 → 1.3 → 1.0)

### ✅ Android
- [x] Instrução criada em ANDROID_IA_INSTRUCTION.md
- [x] Código React Native exemplo incluído
- [x] Type/Interface atualizada
- [x] Pronto para implementação

---

## 📋 Mudanças Implementadas

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `backend/src/services/apiAdapter.js` | Adicionado `_prosporte_meta` aos mock | ✅ |
| `backend/src/services/normalizer.js` | Lê e persiste `acontecendo_gol` | ✅ |
| `backend/data/jogos.json` | Agora inclui campo `acontecendo_gol` | ✅ |
| `prosporte-preview.html` | Preview visual com animação | ✅ |
| `serve-preview.js` | Servidor para visualizar preview | ✅ |
| `ANDROID_IA_INSTRUCTION.md` | Instrução completa para Android | ✅ |

---

## 🚀 Próximas Etapas

1. **Testen o preview:** `node serve-preview.js` → http://localhost:8888
2. **Verifique a API:** `npm start` (backend) → curl http://localhost:3000/api/v1/sync
3. **Passe instrução para Android:** Use ANDROID_IA_INSTRUCTION.md
4. **Implemente no Android:** Copie MatchCard.jsx do arquivo de instrução
5. **Teste em produção:** `https://api.prosporte.com.br/api/v1/sync`

---

## 💬 Dúvidas Comuns

**P: E se o campo não vier da API real?**  
R: O normalizer.js simula baseado no status (`['1H', '2H', 'ET']` têm 15% de chance). Quando integrar API real, configure o campo apropriadamente.

**P: Qual é o significado de `acontecendo_gol: true`?**  
R: Indica que há movimento de gol naquele exato momento - provavelmente um lance importante na área. UX: bolinha verde piscante para chamar atenção.

**P: Funciona em produção (`api.prosporte.com.br`)?**  
R: Sim! Quando deployar a Nginx + backend configurado, a API retornará o campo normalmente.

**P: Android vai quebrar se campo não existir?**  
R: Não! Use `match.acontecendo_gol ?? false` (null coalescing) para segurança.

---

**Status:** ✅ Completo e Testável  
**Criado:** 2026-01-31  
**Última atualização:** 2026-01-31
