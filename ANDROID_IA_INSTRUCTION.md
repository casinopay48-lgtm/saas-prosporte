# 📱 Instrução para IA do Android - ProSporte

## 🎯 Tarefa: Adicionar Indicador de Gol em Tempo Real

**Data:** 2026-01-31  
**Status:** Ativo  
**Prioridade:** Alta  

---

## 📋 Requisito Funcional

O JSON da API agora envia um campo booleano chamado **`acontecendo_gol`**.

### Regra de Negócio:
- Se `acontecendo_gol` for **true** → Mostrar View circular verde com animação de piscar (Alpha ou Scale)
- Se `acontecendo_gol` for **false** → Ocultar o indicador

### Onde Exibir:
- **Posição:** Ao lado do placar no item da lista
- **Tamanho:** 12dp (pequeno, não invasivo)
- **Cor:** Verde (#00FF00 ou #4CAF50)
- **Animação:** Piscar contínuo (Alpha 1.0 → 0.3 → 1.0) ou Scale (1.0 → 1.3 → 1.0)
- **Duração:** 600-800ms por ciclo

---

## 📊 Mudanças no JSON

**ANTES:**
```json
{
  "id_partida": "1003",
  "casa": "Flamengo RJ",
  "fora": "Corinthians SP",
  "placar_casa": 1,
  "placar_fora": 1,
  "status": "45 min",
  "liga": "Campeonato Brasileiro",
  "data_partida": "2026-01-31T10:30:00Z",
  "timestamp_sync": "2026-01-31T14:30:00Z"
}
```

**DEPOIS (Novo Campo):**
```json
{
  "id_partida": "1003",
  "casa": "Flamengo RJ",
  "fora": "Corinthians SP",
  "placar_casa": 1,
  "placar_fora": 1,
  "status": "45 min",
  "liga": "Campeonato Brasileiro",
  "data_partida": "2026-01-31T10:30:00Z",
  "timestamp_sync": "2026-01-31T14:30:00Z",
  "acontecendo_gol": true        ← NOVO CAMPO
}
```

---

## 💻 Implementação no React Native

### Passo 1: Atualizar Data Model

**Arquivo:** `src/types/match.ts`

```typescript
export interface Partida {
  id_partida: string;
  casa: string;
  fora: string;
  placar_casa: number;
  placar_fora: number;
  status: string;
  liga: string;
  data_partida: string;
  timestamp_sync: string;
  acontecendo_gol?: boolean;  // ← NOVO
}
```

### Passo 2: Atualizar o Layout do Item

**Arquivo:** `src/components/MatchCard.jsx`

```javascript
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

const MatchCard = ({ match }) => {
  const scaleAnim = new Animated.Value(1);

  // Animação do indicador de gol
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
        {/* Time da Casa */}
        <Text style={styles.teamName}>{match.casa}</Text>

        {/* Placar */}
        <View style={styles.scorContainer}>
          <Text style={styles.score}>
            {match.placar_casa} × {match.placar_fora}
          </Text>
          
          {/* ← INDICADOR DE GOL (NOVO) */}
          {match.acontecendo_gol && (
            <Animated.View
              style={[
                styles.golIndicator,
                { transform: [{ scale: scaleAnim }] },
              ]}
            />
          )}
        </View>

        {/* Time da Fora */}
        <Text style={styles.teamName}>{match.fora}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{match.liga}</Text>
        <Text style={styles.infoText}>•</Text>
        <Text style={styles.infoText}>{match.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  
  // ← NOVO ESTILO
  golIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Verde
    marginTop: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
});

export default MatchCard;
```

### Passo 3: Validar Parse do JSON

No seu serviço de API, certifique-se que está recebendo o novo campo:

```javascript
// src/services/api.js
export const fetchMatches = async () => {
  try {
    const response = await fetch('https://api.prosporte.com.br/api/v1/sync');
    const data = await response.json();
    
    // Log para debug
    console.log('Partidas recebidas:', data.matches);
    console.log('Primeira partida:', data.matches[0]);
    console.log('Campo acontecendo_gol:', data.matches[0].acontecendo_gol);
    
    return data.matches;
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

## ✅ Checklist de Implementação

- [ ] Type/Interface atualizado com `acontecendo_gol?: boolean`
- [ ] MatchCard recebe e renderiza o indicador
- [ ] Animação implementada (Scale ou Alpha)
- [ ] Estilo CSS aplicado (12dp, verde, sombra)
- [ ] Condição if verifica `match.acontecendo_gol === true`
- [ ] Indicador oculto quando false
- [ ] Testado com dados simulados
- [ ] Testado com API real

---

## 🧪 Como Testar

### Local (com dados Mock):
```javascript
// Teste com um match com acontecendo_gol = true
const testMatch = {
  id_partida: "1003",
  casa: "Flamengo RJ",
  fora: "Corinthians SP",
  placar_casa: 1,
  placar_fora: 1,
  status: "45 min",
  liga: "Campeonato Brasileiro",
  data_partida: "2026-01-31T10:30:00Z",
  timestamp_sync: "2026-01-31T14:30:00Z",
  acontecendo_gol: true  // ← Deve mostrar bolinha verde
};

// Renderize: <MatchCard match={testMatch} />
// Esperado: Bolinha verde piscando ao lado do placar
```

### Produção:
1. Abra `https://api.prosporte.com.br/api/v1/sync` no navegador
2. Veja se alguma partida tem `"acontecendo_gol": true`
3. Execute o app
4. A bolinha verde deve aparecer piscando

---

## 📞 Comunicação com Backend

**Se precisar de mudanças no Backend:**

Backend IA,

Adicionem o campo `acontecendo_gol` (boolean) ao JSON de `/api/v1/sync`:
- true = indicador ativo (gol em andamento)
- false = indicador inativo
- default = false

Para dados Mock, por favor, defina `acontecendo_gol: true` para a partida do Flamengo (fixture 1003) para teste.

---

**Pronto para integração! ✅**
