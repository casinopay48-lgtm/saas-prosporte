/**
 * Tenant Service - Gerencia o tenant (banca) ativo
 * Este serviço controla qual banca está sendo usada no momento
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTenantConfig, DEFAULT_TENANT_ID, TenantConfig } from './domains.config';

const STORAGE_TENANT_KEY = '@saasportes:tenant_id';

/**
 * Estado global do tenant atual
 */
let currentTenant: TenantConfig | null = null;

/**
 * Obtém o tenant configurado via build flavor ou ambiente
 * TENANT_ID é injetado via buildConfigField no Gradle
 */
function getTenantIdFromBuild(): string {
  // @ts-ignore - BuildConfig é injetado pelo Android
  if (typeof BuildConfig !== 'undefined' && BuildConfig.TENANT_ID) {
    // @ts-ignore
    return BuildConfig.TENANT_ID;
  }
  
  // Fallback para variável de ambiente (desenvolvimento)
  if (process.env.TENANT_ID) {
    return process.env.TENANT_ID;
  }
  
  return DEFAULT_TENANT_ID;
}

/**
 * Inicializa o serviço de tenant
 * Deve ser chamado no boot do app
 */
export async function initializeTenant(): Promise<TenantConfig> {
  try {
    // 1. Tentar obter do build flavor (prioridade máxima)
    const buildTenantId = getTenantIdFromBuild();
    
    // 2. Tentar obter do storage (para apps que permitem troca dinâmica)
    const storedTenantId = await AsyncStorage.getItem(STORAGE_TENANT_KEY);
    
    // Build flavor tem prioridade sobre storage
    const tenantId = buildTenantId !== DEFAULT_TENANT_ID ? buildTenantId : (storedTenantId || DEFAULT_TENANT_ID);
    
    currentTenant = getTenantConfig(tenantId);
    
    // Salvar no storage para consistência
    await AsyncStorage.setItem(STORAGE_TENANT_KEY, currentTenant.id);
    
    console.log(`[TenantService] Tenant inicializado: ${currentTenant.name} (${currentTenant.id})`);
    
    return currentTenant;
  } catch (error) {
    console.error('[TenantService] Erro ao inicializar tenant:', error);
    currentTenant = getTenantConfig(DEFAULT_TENANT_ID);
    return currentTenant;
  }
}

/**
 * Obtém o tenant atual
 * Se não foi inicializado, retorna o default
 */
export function getCurrentTenant(): TenantConfig {
  if (!currentTenant) {
    console.warn('[TenantService] Tenant não inicializado. Usando default.');
    return getTenantConfig(DEFAULT_TENANT_ID);
  }
  return currentTenant;
}

/**
 * Obtém a URL da API do tenant atual
 */
export function getApiUrl(): string {
  return getCurrentTenant().apiUrl;
}

/**
 * Obtém a URL do WebSocket do tenant atual
 */
export function getWsUrl(): string | undefined {
  return getCurrentTenant().wsUrl;
}

/**
 * Troca o tenant ativo (apenas para apps que permitem troca dinâmica)
 * @param tenantId - ID do novo tenant
 */
export async function switchTenant(tenantId: string): Promise<TenantConfig> {
  const newTenant = getTenantConfig(tenantId);
  
  // Salvar no storage
  await AsyncStorage.setItem(STORAGE_TENANT_KEY, newTenant.id);
  
  currentTenant = newTenant;
  
  console.log(`[TenantService] Tenant trocado para: ${newTenant.name} (${newTenant.id})`);
  
  return newTenant;
}

/**
 * Obtém o ID do tenant atual
 */
export function getCurrentTenantId(): string {
  return getCurrentTenant().id;
}

/**
 * Verifica se é o tenant default
 */
export function isDefaultTenant(): boolean {
  return getCurrentTenantId() === DEFAULT_TENANT_ID;
}
