/**
 * Environment Configuration
 * Carrega variáveis de ambiente de forma segura
 */

interface EnvConfig {
  API_URL?: string;
  WS_URL?: string;
  TENANT_ID?: string;
  NODE_ENV?: string;
  ENABLE_DEBUG_LOGS?: boolean;
}

/**
 * Configurações padrão
 */
const DEFAULT_CONFIG: EnvConfig = {
  NODE_ENV: 'production',
  ENABLE_DEBUG_LOGS: false,
};

/**
 * Carrega as variáveis de ambiente
 * Em produção, use react-native-config ou similar
 */
export function loadEnvConfig(): EnvConfig {
  return {
    ...DEFAULT_CONFIG,
    API_URL: process.env.API_URL,
    WS_URL: process.env.WS_URL,
    TENANT_ID: process.env.TENANT_ID,
    NODE_ENV: process.env.NODE_ENV || DEFAULT_CONFIG.NODE_ENV,
    ENABLE_DEBUG_LOGS: process.env.ENABLE_DEBUG_LOGS === 'true',
  };
}

export const ENV = loadEnvConfig();
