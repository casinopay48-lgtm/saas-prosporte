/**
 * Multi-Tenant Domain Configuration
 * Define todos os tenants (bancas) do sistema SaaS
 */

export interface TenantConfig {
  id: string;
  name: string;
  displayName: string;
  apiUrl: string;
  wsUrl?: string;
  supportEmail?: string;
  enabled: boolean;
}

/**
 * Mapa de todos os tenants disponíveis
 * IMPORTANTE: Para adicionar nova banca, basta adicionar um novo objeto aqui
 */
export const TENANTS: Record<string, TenantConfig> = {
  default: {
    id: 'default',
    name: 'prosporte',
    displayName: 'Pro Sporte',
    apiUrl: 'https://api.prosporte.com.br',
    wsUrl: 'wss://ws.prosporte.com.br',
    supportEmail: 'suporte@prosporte.com.br',
    enabled: true,
  },
  teste: {
    id: 'teste',
    name: 'bancateste',
    displayName: 'Banca Teste',
    apiUrl: 'https://api.bancateste.com.br',
    wsUrl: 'wss://ws.bancateste.com.br',
    supportEmail: 'suporte@bancateste.com.br',
    enabled: true,
  },
};

/**
 * Tenant padrão (fallback para domínios não reconhecidos)
 */
export const DEFAULT_TENANT_ID = 'default';

/**
 * Obtém configuração de um tenant pelo ID
 * Se não encontrado ou desabilitado, retorna o tenant default (Pro Sporte)
 */
export function getTenantConfig(tenantId: string): TenantConfig {
  const tenant = TENANTS[tenantId];
  
  if (!tenant) {
    console.warn(`[Domains] Tenant "${tenantId}" não encontrado. Usando tenant default.`);
    return TENANTS[DEFAULT_TENANT_ID];
  }
  
  if (!tenant.enabled) {
    console.warn(`[Domains] Tenant "${tenantId}" está desabilitado. Usando tenant default.`);
    return TENANTS[DEFAULT_TENANT_ID];
  }
  
  return tenant;
}

/**
 * Lista todos os tenants habilitados
 */
export function getEnabledTenants(): TenantConfig[] {
  return Object.values(TENANTS).filter(t => t.enabled);
}

/**
 * Valida se um tenant existe e está habilitado
 */
export function isTenantValid(tenantId: string): boolean {
  const tenant = TENANTS[tenantId];
  return tenant !== undefined && tenant.enabled;
}

/**
 * Obtém o tenant padrão (Pro Sporte)
 */
export function getDefaultTenant(): TenantConfig {
  return TENANTS[DEFAULT_TENANT_ID];
}

