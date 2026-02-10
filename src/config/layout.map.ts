/**
 * Layout Map - Catálogo de Telas e Componentes
 * 
 * Este arquivo mapeia TODAS as telas e componentes do projeto,
 * facilitando a navegação, customização e manutenção do código.
 */

export interface LayoutMetadata {
  path: string;
  component: string;
  description: string;
  requiredRole?: string[];
  requiresAuth: boolean;
  category: 'auth' | 'admin' | 'banca' | 'cambista' | 'client' | 'shared';
  customizable: boolean; // Se pode ser customizado por tema
  status: 'implemented' | 'missing' | 'placeholder';
}

/**
 * MAPA COMPLETO DE LAYOUTS
 */
export const LAYOUT_MAP: Record<string, LayoutMetadata> = {
  
  // ========================================
  // 🔐 AUTENTICAÇÃO
  // ========================================
  
  LOGIN: {
    path: 'src/screens/LoginScreen.tsx',
    component: 'LoginScreen',
    description: 'Tela de login com email/senha',
    requiresAuth: false,
    category: 'auth',
    customizable: true, // Logo, cores
    status: 'implemented',
  },
  
  REGISTER: {
    path: 'src/screens/RegisterScreen.tsx',
    component: 'RegisterScreen',
    description: 'Tela de cadastro de novo usuário',
    requiresAuth: false,
    category: 'auth',
    customizable: true,
    status: 'implemented',
  },
  
  // ========================================
  // 👑 ADMIN (Super Admin)
  // ========================================
  
  ADMIN_HOME: {
    path: 'src/app/(admin)/AdminHome.tsx',
    component: 'AdminHome',
    description: 'Dashboard principal do Super Admin',
    requiredRole: ['admin'],
    requiresAuth: true,
    category: 'admin',
    customizable: false, // Admin não customiza por tenant
    status: 'implemented',
  },
  
  ADMIN_SUPER_PANEL: {
    path: 'src/screens/AdminSuperPanel.tsx',
    component: 'AdminSuperPanel',
    description: 'Painel de gerenciamento de bancas (CRUD)',
    requiredRole: ['admin'],
    requiresAuth: true,
    category: 'admin',
    customizable: false,
    status: 'implemented',
  },
  
  ADMIN_PANEL: {
    path: 'src/screens/AdminPanel.tsx',
    component: 'AdminPanel',
    description: 'Painel administrativo geral (placeholder)',
    requiredRole: ['admin'],
    requiresAuth: true,
    category: 'admin',
    customizable: false,
    status: 'placeholder',
  },
  
  // ========================================
  // 🏦 BANCA (Dono da Banca)
  // ========================================
  
  BANCA_HOME: {
    path: 'src/app/(banca)/BancaHome.tsx',
    component: 'BancaHome',
    description: 'Dashboard do dono da banca',
    requiredRole: ['banca'],
    requiresAuth: true,
    category: 'banca',
    customizable: true,
    status: 'implemented',
  },
  
  BANCA_PANEL: {
    path: 'src/screens/BancaPanel.tsx',
    component: 'BancaPanel',
    description: 'Painel de controle da banca (jogos, cambistas, branding)',
    requiredRole: ['banca'],
    requiresAuth: true,
    category: 'banca',
    customizable: true,
    status: 'implemented',
  },
  
  BANCA_REPORTS: {
    path: 'MISSING',
    component: 'BancaReports',
    description: 'Relatórios financeiros e estatísticas da banca',
    requiredRole: ['banca'],
    requiresAuth: true,
    category: 'banca',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  BANCA_SETTINGS: {
    path: 'MISSING',
    component: 'BancaSettings',
    description: 'Configurações da banca (tema, logo, domínio)',
    requiredRole: ['banca'],
    requiresAuth: true,
    category: 'banca',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  // ========================================
  // 💼 CAMBISTA (Operador de Apostas)
  // ========================================
  
  CAMBISTA_HOME: {
    path: 'src/app/(cambista)/CambistaHome.tsx',
    component: 'CambistaHome',
    description: 'Dashboard do cambista',
    requiredRole: ['cambista'],
    requiresAuth: true,
    category: 'cambista',
    customizable: true,
    status: 'implemented',
  },
  
  CAMBISTA_PANEL: {
    path: 'src/screens/CambistaPanel.tsx',
    component: 'CambistaPanel',
    description: 'Painel de operação do cambista',
    requiredRole: ['cambista'],
    requiresAuth: true,
    category: 'cambista',
    customizable: true,
    status: 'implemented',
  },
  
  // ========================================
  // 🎮 CLIENTE (Apostador)
  // ========================================
  
  CLIENT_HOME: {
    path: 'src/app/(cliente)/ClientHome.tsx',
    component: 'ClientHome',
    description: 'Home do apostador (lista de jogos)',
    requiredRole: ['client'],
    requiresAuth: true,
    category: 'client',
    customizable: true,
    status: 'implemented',
  },
  
  CLIENT_PROFILE: {
    path: 'MISSING',
    component: 'ClientProfile',
    description: 'Perfil do apostador (dados, histórico, saldo)',
    requiredRole: ['client'],
    requiresAuth: true,
    category: 'client',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  CLIENT_BETS: {
    path: 'MISSING',
    component: 'ClientBets',
    description: 'Histórico de apostas do cliente',
    requiredRole: ['client'],
    requiresAuth: true,
    category: 'client',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  CLIENT_WALLET: {
    path: 'MISSING',
    component: 'ClientWallet',
    description: 'Carteira/saldo do cliente (depósito, saque)',
    requiredRole: ['client'],
    requiresAuth: true,
    category: 'client',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  // ========================================
  // 🔗 COMPARTILHADAS (Todas as Roles)
  // ========================================
  
  HOME_SCREEN: {
    path: 'src/screens/HomeScreen.tsx',
    component: 'HomeScreen',
    description: 'Tela home genérica (placeholder)',
    requiresAuth: false,
    category: 'shared',
    customizable: true,
    status: 'placeholder',
  },
  
  MATCH_LIST: {
    path: 'src/screens/MatchList.tsx',
    component: 'MatchList',
    description: 'Lista de partidas/jogos disponíveis',
    requiresAuth: false,
    category: 'shared',
    customizable: true,
    status: 'implemented',
  },
  
  BET_DETAIL: {
    path: 'src/screens/BetDetailScreen.tsx',
    component: 'BetDetailScreen',
    description: 'Detalhes de uma aposta específica',
    requiresAuth: true,
    category: 'shared',
    customizable: true,
    status: 'implemented',
  },
  
  TENANT_SELECTOR: {
    path: 'MISSING',
    component: 'TenantSelector',
    description: 'Tela de seleção de banca (para apps multi-tenant dinâmicos)',
    requiresAuth: false,
    category: 'shared',
    customizable: true,
    status: 'missing', // ⚠️ OPCIONAL (para apps que permitem troca de banca)
  },
};

/**
 * COMPONENTES REUTILIZÁVEIS
 */
export const COMPONENTS_MAP: Record<string, LayoutMetadata> = {
  
  MATCH_CARD: {
    path: 'src/components/MatchCard.tsx',
    component: 'MatchCard',
    description: 'Card de exibição de partida (placar, times, odds)',
    requiresAuth: false,
    category: 'shared',
    customizable: true, // Cores, fontes
    status: 'implemented',
  },
  
  SKELETON: {
    path: 'src/components/Skeleton.tsx',
    component: 'Skeleton',
    description: 'Componente de loading/placeholder',
    requiresAuth: false,
    category: 'shared',
    customizable: true,
    status: 'implemented',
  },
  
  HEADER: {
    path: 'MISSING',
    component: 'Header',
    description: 'Header customizável com logo da banca',
    requiresAuth: false,
    category: 'shared',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
  
  DRAWER_MENU: {
    path: 'MISSING',
    component: 'DrawerMenu',
    description: 'Menu lateral customizável por tenant',
    requiresAuth: true,
    category: 'shared',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO (atualmente usa Drawer padrão)
  },
  
  BET_SLIP: {
    path: 'MISSING',
    component: 'BetSlip',
    description: 'Componente de cupom de apostas (carrinho)',
    requiresAuth: true,
    category: 'shared',
    customizable: true,
    status: 'missing', // ⚠️ PRECISA SER CRIADO
  },
};

/**
 * Funções Utilitárias
 */

export function getLayoutsByCategory(category: LayoutMetadata['category']): LayoutMetadata[] {
  return Object.values(LAYOUT_MAP).filter(layout => layout.category === category);
}

export function getMissingLayouts(): LayoutMetadata[] {
  return Object.values(LAYOUT_MAP).filter(layout => layout.status === 'missing');
}

export function getCustomizableLayouts(): LayoutMetadata[] {
  return Object.values(LAYOUT_MAP).filter(layout => layout.customizable);
}

export function getLayoutByRole(role: string): LayoutMetadata[] {
  return Object.values(LAYOUT_MAP).filter(
    layout => !layout.requiredRole || layout.requiredRole.includes(role)
  );
}

/**
 * Contadores para Dashboard
 */
export const LAYOUT_STATS = {
  total: Object.keys(LAYOUT_MAP).length,
  implemented: Object.values(LAYOUT_MAP).filter(l => l.status === 'implemented').length,
  missing: Object.values(LAYOUT_MAP).filter(l => l.status === 'missing').length,
  placeholder: Object.values(LAYOUT_MAP).filter(l => l.status === 'placeholder').length,
  customizable: Object.values(LAYOUT_MAP).filter(l => l.customizable).length,
};
