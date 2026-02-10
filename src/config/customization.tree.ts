/**
 * Customization Tree - Árvore de Customização por Tenant
 * 
 * Define ONDE e COMO cada banca personaliza o app:
 * - Nome da banca
 * - Cores (tema)
 * - Logos e assets
 * - Textos customizáveis (futuramente i18n)
 */

import { getCurrentTenant } from './tenant.service';

/**
 * Interface de customização de uma banca
 */
export interface TenantCustomization {
  // Identidade
  tenantId: string;
  displayName: string; // Nome exibido no app
  tagline?: string; // Slogan da banca
  
  // Branding Visual
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    error: string;
    warning: string;
  };
  
  // Assets (Logos, Ícones)
  assets: {
    logo: string; // URL ou require()
    logoSmall?: string;
    favicon?: string;
    splashScreen?: string;
  };
  
  // Tipografia
  typography?: {
    fontFamily: string;
    fontSizeBase: number;
  };
  
  // Textos Customizáveis
  labels?: {
    betLabel?: string; // "Aposta" ou "Palpite" ou "Bilhete"
    walletLabel?: string; // "Saldo" ou "Carteira" ou "Créditos"
    homeTitle?: string;
  };
}

/**
 * Customizações de cada tenant
 */
export const TENANT_CUSTOMIZATIONS: Record<string, TenantCustomization> = {
  
  // ========================================
  // 🏆 BANCA PADRÃO (Pro Sporte)
  // ========================================
  default: {
    tenantId: 'default',
    displayName: 'Pro Sporte',
    tagline: 'Apostas Esportivas Profissionais',
    
    colors: {
      primary: '#F0B90B', // Amarelo/Dourado
      secondary: '#FCD535',
      background: '#0B0E11', // Preto
      surface: '#1E2329', // Cinza escuro
      text: '#FFFFFF',
      textSecondary: '#848E9C',
      success: '#0ECB81', // Verde
      error: '#F6465D', // Vermelho
      warning: '#F0B90B',
    },
    
    assets: {
      logo: 'https://via.placeholder.com/200x60/F0B90B/0B0E11?text=Pro+Sporte',
      logoSmall: 'https://via.placeholder.com/40x40/F0B90B/0B0E11?text=PS',
      // Para production, usar: require('../../assets/brands/default/logo.png')
    },
    
    typography: {
      fontFamily: 'System',
      fontSizeBase: 14,
    },
    
    labels: {
      betLabel: 'Aposta',
      walletLabel: 'Saldo',
      homeTitle: 'Jogos Disponíveis',
    },
  },
  
  // ========================================
  // 🧪 BANCA TESTE
  // ========================================
  teste: {
    tenantId: 'teste',
    displayName: 'Banca Teste',
    tagline: 'Ambiente de Testes',
    
    colors: {
      primary: '#FF5722', // Laranja
      secondary: '#FF8A65',
      background: '#0D1117',
      surface: '#161B22',
      text: '#FFFFFF',
      textSecondary: '#8B949E',
      success: '#56D364',
      error: '#F85149',
      warning: '#D29922',
    },
    
    assets: {
      logo: 'https://via.placeholder.com/200x60/FF5722/0D1117?text=Banca+Teste',
      logoSmall: 'https://via.placeholder.com/40x40/FF5722/0D1117?text=BT',
    },
    
    typography: {
      fontFamily: 'System',
      fontSizeBase: 14,
    },
    
    labels: {
      betLabel: 'Palpite',
      walletLabel: 'Carteira',
      homeTitle: 'Campeonatos',
    },
  },
};

/**
 * Obtém a customização do tenant atual
 */
export function getCurrentCustomization(): TenantCustomization {
  const tenant = getCurrentTenant();
  const customization = TENANT_CUSTOMIZATIONS[tenant.id];
  
  if (!customization) {
    console.warn(`[Customization] Customização não encontrada para tenant "${tenant.id}". Usando default.`);
    return TENANT_CUSTOMIZATIONS['default'];
  }
  
  return customization;
}

/**
 * Obtém apenas as cores do tenant atual
 */
export function getCurrentColors() {
  return getCurrentCustomization().colors;
}

/**
 * Obtém apenas os assets do tenant atual
 */
export function getCurrentAssets() {
  return getCurrentCustomization().assets;
}

/**
 * Obtém apenas os labels customizados
 */
export function getCurrentLabels() {
  return getCurrentCustomization().labels || TENANT_CUSTOMIZATIONS['default'].labels!;
}

/**
 * Estrutura de Pastas de Assets por Flavor (Android)
 * 
 * Para organizar logos e ícones por banca, use:
 * 
 * android/app/src/
 * ├── main/res/               (Assets comuns)
 * ├── banca_padrao/res/       (Assets da Banca Padrão)
 * │   ├── mipmap-hdpi/ic_launcher.png
 * │   ├── mipmap-mdpi/ic_launcher.png
 * │   ├── mipmap-xhdpi/ic_launcher.png
 * │   ├── mipmap-xxhdpi/ic_launcher.png
 * │   └── mipmap-xxxhdpi/ic_launcher.png
 * ├── banca_teste/res/        (Assets da Banca Teste)
 * │   └── ... (mesma estrutura)
 * └── banca_nova/res/         (Assets da Banca Nova)
 *     └── ... (mesma estrutura)
 * 
 * O Gradle automaticamente usa os assets do flavor ativo durante o build.
 */

/**
 * Guia de Customização por Flavor (3 Passos)
 * 
 * PASSO 1: Adicionar em TENANT_CUSTOMIZATIONS (acima)
 * PASSO 2: Adicionar assets em android/app/src/{flavor}/res/
 * PASSO 3: Build com o flavor: ./gradlew assembleBanca_novaRelease
 */

export const CUSTOMIZATION_GUIDE = {
  step1: 'Adicionar objeto em TENANT_CUSTOMIZATIONS',
  step2: 'Adicionar assets em android/app/src/{flavor}/res/',
  step3: 'Build: ./gradlew assembleBanca_novaRelease',
};
