# 📲 GUIA: Como Instruir a IA do Android

**Para usar quando comunicar com IA responsável pelo código Android**

---

## 🎯 Instrução Padrão

Copie e cole EXATAMENTE isto:

```
O JSON da API agora envia um campo booleano chamado acontecendo_gol. 
Se for true, mostre uma View circular verde com uma animação de Alpha 
ou Scale (piscar) ao lado do placar no item da lista.

Detalhes técnicos:
- Campo: "acontecendo_gol" (boolean)
- Localização: Ao lado do placar (entre o time casa/fora e o placar)
- Tamanho: 12dp
- Cor: #4CAF50 (verde)
- Animação: Scale (1.0 → 1.3 → 1.0) ou Alpha (1.0 → 0.3 → 1.0)
- Duração: 600-800ms por ciclo
- Quando false: ocultar o indicador (ou deixar invisível)

Referências:
1. Leia: ANDROID_IA_INSTRUCTION.md (instruções completas)
2. Teste: http://localhost:8888 (preview da animação)
3. API: https://api.prosporte.com.br/api/v1/sync (JSON com o novo campo)
```

---

## 🏗️ Estrutura da Resposta que você receberá

A IA deve fornecer código como:

```kotlin
// MatchCard.jsx (React Native)

if (match.acontecendo_gol) {
  // Renderizar View circular verde com animação
  <Animated.View
    style={[styles.golIndicator, { transform: [{ scale: anim }] }]}
  />
}
```

---

## ✅ Checklist: Validar a Resposta da IA

Após a IA implementar, verifique se:

- [ ] Quando `acontecendo_gol` é **true** → bolinha verde aparece
- [ ] Quando `acontecendo_gol` é **false** → bolinha fica invisível/oculta
- [ ] A bolinha está **ao lado do placar** (não sobre ele)
- [ ] A animação é **contínua** (loop)
- [ ] A animação dura **~600-800ms** por ciclo
- [ ] A cor é **verde** (#4CAF50 ou similar)
- [ ] O tamanho é **pequeno** (12dp ≈ 48px)
- [ ] Funciona em **todas as partidas** da lista

---

## 🧪 Teste Prático

1. Inicie backend: `npm start` (em `backend/`)
2. Teste API: `curl http://localhost:3000/api/v1/sync`
3. Veja preview: `http://localhost:8888` (bolinha piscando)
4. Confirme com IA: "Faça igual ao preview do HTML"

---

## 📊 Formato do JSON que a IA Receberá

```json
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
  "acontecendo_gol": true    ← NOVO CAMPO
}
```

A IA precisa usar este campo para renderizar ou ocultar a bolinha.

---

## 💭 Contexto para a IA

Se a IA perguntar por contexto, responda:

> **P: Por que adicionar `acontecendo_gol`?**
> 
> R: Para alertar o usuário em tempo real quando há movimento importante na partida (gol iminente, falta, etc). É uma melhoria de UX para manter usuário engajado.

> **P: Isso quebra compatibilidade?**
>
> R: Não. Use `match.acontecendo_gol ?? false` (null coalescing) para segurança. Se campo não existir, comportamento padrão é `false` (oculto).

> **P: Funciona com hardcoded ou precisa integração com API?**
>
> R: Funciona se o JSON vier de `https://api.prosporte.com.br/api/v1/sync`. Backend já está normalizando o campo.

---

## 📞 Fluxo de Comunicação

```
VOCÊ (Product)
    ↓
[ Instrução com ANDROID_IA_INSTRUCTION.md ]
    ↓
IA DO ANDROID
    ↓
[ Implementa MatchCard.jsx com Animated.View ]
    ↓
[ Testa localmente com http://localhost:3000/api/v1/sync ]
    ↓
PRONTO! ✅
```

---

## 🔗 Arquivos Relacionados

| Arquivo | Propósito |
|---------|-----------|
| `ANDROID_IA_INSTRUCTION.md` | Instruções técnicas completas (copie para IA) |
| `prosporte-preview.html` | Visualização visual da animação |
| `FLUXO_ACONTECENDO_GOL.md` | Documentação técnica do fluxo |
| `serve-preview.js` | Servidor para ver o preview |

---

## 🚀 Um-Liner para Compartilhar

**Use isto para comunicação rápida:**

```
"O backend agora envia campo booleano 'acontecendo_gol'. 
Implemente bolinha verde (#4CAF50) com animação Scale ao lado 
do placar quando true, baseado no exemplo em ANDROID_IA_INSTRUCTION.md"
```

---

**Última atualização:** 2026-01-31  
**Status:** ✅ Pronto para instruir IA do Android
