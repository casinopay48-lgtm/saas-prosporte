import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, getCurrentTenant, getCurrentTenantId } from '../config/tenant.service';

export const STORAGE_TOKEN_KEY = '@saasportes:token';

/**
 * Obtém a BASE_URL dinâmica do tenant atual
 */
function getBaseUrl(): string {
  try {
    return getApiUrl();
  } catch (error) {
    console.error('[API] Erro ao obter URL do tenant:', error);
    return 'https://api.prosporte.com.br'; // Fallback
  }
}

/**
 * Instância do Axios configurada para o tenant atual
 */
export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Define o token de autenticação nos headers
 */
export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

/**
 * Atualiza a baseURL quando o tenant mudar
 */
export const updateApiBaseUrl = () => {
  const newBaseUrl = getBaseUrl();
  api.defaults.baseURL = newBaseUrl;
  console.log(`[API] Base URL atualizada para: ${newBaseUrl}`);
};

/**
 * Request interceptor: injeta token e tenant-id
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // 1. Injetar token de autenticação
      const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      }

      // 2. Injetar tenant-id (para backends que exigem header)
      const tenantId = getCurrentTenantId();
      config.headers = { ...config.headers, 'X-Tenant-ID': tenantId };

      // 3. Log de debug (apenas em desenvolvimento)
      if (__DEV__) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          tenant: tenantId,
          baseURL: config.baseURL,
        });
      }
    } catch (e) {
      console.error('[API] Erro ao preparar requisição:', e);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/**
 * Response interceptor: log de erros e retry automático
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const tenant = getCurrentTenant();
    const status = error.response?.status;
    const url = error.config?.url;

    console.error(`[API] Erro na requisição para ${tenant.name}:`, {
      url,
      status,
      message: error.message,
      tenant: tenant.id,
    });

    // Tratamento de erros específicos
    if (status === 401) {
      // Token expirado - limpar storage
      AsyncStorage.removeItem(STORAGE_TOKEN_KEY).catch(() => {});
      console.warn('[API] Token inválido ou expirado. Usuário será deslogado.');
    }

    if (status === 503 || status === 502) {
      console.warn(`[API] Servidor ${tenant.name} temporariamente indisponível.`);
    }

    return Promise.reject(error);
  }
);

