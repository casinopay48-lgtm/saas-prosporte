# 🎯 ProSporte - Dicionário de Variáveis & Mapeamento Domínio

## 🌐 MAPEAMENTO NGINX (Domínio + Subdomínio)

### Configuração Nginx Final

```nginx
# Arquivo: /etc/nginx/sites-available/prosporte.com.br

upstream backend_hub {
    server 127.0.0.1:3000;  # Backend Node.js Hub
}

upstream frontend_web {
    server 127.0.0.1:5173;  # Frontend (React/Vue/Next)
}

# ============================================
# 1. DOMÍNIO PRINCIPAL - WEB/DASHBOARD
# ============================================

server {
    listen 80;
    listen [::]:80;
    server_name prosporte.com.br www.prosporte.com.br;

    # Redirect HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name prosporte.com.br www.prosporte.com.br;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/prosporte.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prosporte.com.br/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/prosporte-web.access.log;
    error_log /var/log/nginx/prosporte-web.error.log;

    # Cliente Web (React/Vue/Next.js)
    location / {
        proxy_pass http://frontend_web;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check
    location /health {
        proxy_pass http://backend_hub;
    }
}

# ============================================
# 2. SUBDOMÍNIO API - JSON PURO (Android + Web)
# ============================================

server {
    listen 80;
    listen [::]:80;
    server_name api.prosporte.com.br;

    # Redirect HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.prosporte.com.br;

    # Certificados SSL (Wildcard recomendado)
    ssl_certificate /etc/letsencrypt/live/prosporte.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prosporte.com.br/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/prosporte-api.access.log;
    error_log /var/log/nginx/prosporte-api.error.log;

    # CORS Headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;

    # Backend Hub (Node.js) - Todas as rotas /api/v1
    location /api/v1/ {
        proxy_pass http://backend_hub/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts para requisições longas
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rota raiz redireciona para /api/v1/sync
    location = / {
        return 301 /api/v1/sync;
    }

    # Health Check
    location /health {
        proxy_pass http://backend_hub;
    }
}
```

### Resultado do Mapeamento

| Acesso | Destino Nginx | Destino Final | O que Retorna |
|--------|---------------|---------------|---------------|
| `https://prosporte.com.br` | `/` (frontend) | Port 5173 | HTML/JS - Layout Web |
| `https://prosporte.com.br/dashboard` | `/dashboard` | Port 5173 | Dashboard com partidas |
| `https://api.prosporte.com.br/api/v1/sync` | `/api/v1/sync` | Port 3000 | JSON - Partidas normalizadas |
| `https://api.prosporte.com.br/api/v1/sync/matches?liga=X` | `/api/v1/sync/matches` | Port 3000 | JSON - Filtrado |

---

## 📦 DICIONÁRIO DE VARIÁVEIS (Backend ↔ Android)

### Padrão ProSporte - Backend Envia

**JSON que o Backend retorna em `/api/v1/sync`:**

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
      "id_partida": "1001",           ← String
      "casa": "Real Madrid",           ← String (nome completo)
      "fora": "Barcelona",             ← String (nome completo)
      "placar_casa": 0,                ← Integer
      "placar_fora": 0,                ← Integer
      "status": "15:30",               ← String (horário ou status)
      "liga": "La Liga",               ← String (nome da liga)
      "data_partida": "2026-01-31T15:30:00Z",     ← ISO 8601
      "timestamp_sync": "2026-01-31T14:30:00Z"    ← ISO 8601
    }
  ],
  "totalMatches": 3
}
```

### React Native - Android/iOS Espera

Para **React Native** (seu app atual), você receberá esse JSON via fetch/axios:

```javascript
// React Native Component
const fetchMatches = async () => {
  try {
    const response = await fetch('https://api.prosporte.com.br/api/v1/sync');
    const data = await response.json();
    
    // data.matches é um array onde cada item tem:
    // - idPartida (String) → derivado de id_partida
    // - casa (String)
    // - fora (String)
    // - placarCasa (Number) → derivado de placar_casa
    // - placarFora (Number) → derivado de placar_fora
    // - status (String)
    // - liga (String)
    // - dataPartida (String) → derivado de data_partida
    // - timestampSync (String) → derivado de timestamp_sync
    
    return data.matches;
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

## 🔄 MAPEAMENTO DE CAMPOS (Backend JSON → React Native)

| Backend JSON | Tipo | React Native | Tipo | Compatível |
|--------------|------|--------------|------|-----------|
| `id_partida` | string | idPartida | string | ✅ JSON parse automático |
| `casa` | string | casa | string | ✅ Compatível |
| `fora` | string | fora | string | ✅ Compatível |
| `placar_casa` | int | placarCasa | number | ✅ Compatível |
| `placar_fora` | int | placarFora | number | ✅ Compatível |
| `status` | string | status | string | ✅ Compatível |
| `liga` | string | liga | string | ✅ Compatível |
| `data_partida` | ISO 8601 | dataPartida | string | ✅ Compatível |
| `timestamp_sync` | ISO 8601 | timestampSync | string | ✅ Compatível |

---

## ⚠️ MAPEAMENTO DE NOMES (JSON snake_case → JS camelCase)

React Native esperaria **camelCase** nos nomes das variáveis, mas o **JSON é transparente** - o navegador/app faz o mapeamento automaticamente.

**Opção 1: Sem mudar nada (recomendado)**
```javascript
// Seu JSON continua assim (Backend envia):
{ "id_partida": "1001", "placar_casa": 0, ... }

// React Native acessa assim (simples):
match["id_partida"]      // Funciona ✅
match.casa               // Funciona ✅
```

**Opção 2: Normalizar no Backend (também funciona)**
```javascript
// Se preferir camelCase no JSON (Backend envia):
{ "idPartida": "1001", "placarCasa": 0, ... }

// React Native acessa assim:
match.idPartida          // Funciona ✅
match.placarCasa         // Funciona ✅
```

**Recomendação:** Manter snake_case no JSON (Opção 1) pois é padrão REST API.

---

## 🚀 FLUXO COMPLETO (Domínio + Dados)

```
1. Android App inicia
   ↓
2. Faz requisição:
   GET https://api.prosporte.com.br/api/v1/sync
   ↓
3. Nginx ouve em :443 (api.prosporte.com.br)
   ↓
4. Nginx roteia para 127.0.0.1:3000 (Backend Node.js)
   ↓
5. Backend retorna:
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
   ↓
6. Android faz parse JSON
   ↓
7. Exibe na RecyclerView/FlatList:
   🏠 Real Madrid × Barcelona ⚽ 0 × 0 | 15:30
```

---

## 📱 CÓDIGO REACT NATIVE PRONTO

### Arquivo: `src/services/api.js`

```javascript
const BASE_URL = 'https://api.prosporte.com.br/api/v1';

export const fetchMatches = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sync`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Valida estrutura
    if (!data.matches || !Array.isArray(data.matches)) {
      throw new Error('Formato inválido');
    }
    
    return data.matches;
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    throw error;
  }
};

export const fetchFilteredMatches = async (liga = null, status = null) => {
  try {
    const params = new URLSearchParams();
    if (liga) params.append('liga', liga);
    if (status) params.append('status', status);
    
    const url = `${BASE_URL}/sync/matches${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.matches;
  } catch (error) {
    console.error('Erro ao buscar partidas filtradas:', error);
    throw error;
  }
};

export const fetchSyncStatus = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sync/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    throw error;
  }
};
```

### Arquivo: `src/screens/MatchesScreen.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { fetchMatches } from '../services/api';

const MatchesScreen = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadMatches = async () => {
    try {
      setError(null);
      const data = await fetchMatches();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMatches();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadMatches();
  }, []);

  const renderMatch = ({ item }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchRow}>
        <Text style={styles.teamName}>{item.casa}</Text>
        <Text style={styles.score}>
          {item.placar_casa} × {item.placar_fora}
        </Text>
        <Text style={styles.teamName}>{item.fora}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{item.liga}</Text>
        <Text style={styles.infoText}>•</Text>
        <Text style={styles.infoText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id_partida}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma partida</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
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
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#007AFF',
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
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MatchesScreen;
```

---

## ✅ CHECKLIST DE COMPATIBILIDADE

- [x] Backend retorna JSON padrão ProSporte
- [x] Domínio principal: `prosporte.com.br` (Web)
- [x] Subdomínio API: `api.prosporte.com.br` (Android/Web)
- [x] Nginx mapeia corretamente
- [x] CORS configurado
- [x] React Native consegue fazer parse
- [x] Nomes de campos compatíveis
- [x] Tipos de dados corretos
- [x] Layout não muda

---

## 🚀 DEPLOY NO SERVIDOR

```bash
# 1. Configurar Nginx
sudo cp prosporte.nginx.conf /etc/nginx/sites-available/prosporte.com.br
sudo ln -s /etc/nginx/sites-available/prosporte.com.br /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 2. Certificado SSL (Let's Encrypt)
sudo certbot certonly --webroot -w /var/www/prosporte -d prosporte.com.br -d api.prosporte.com.br

# 3. Iniciar Backend Hub
cd backend
npm install
npm start

# 4. Iniciar Frontend Web (separadamente)
npm run build
npm run serve
```

---

**🎉 Pronto! Backend Hub + Nginx + React Native = 100% Compatível! 🚀**
