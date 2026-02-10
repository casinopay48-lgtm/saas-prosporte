/**
 * Theme Context - Sistema de Temas Dinâmicos
 * 
 * Provedora de tema que injeta cores, assets e labels
 * baseados no tenant ativo (configurado via Build Flavor ou Runtime).
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentCustomization, TenantCustomization } from '../config/customization.tree';
import { getCurrentTenant } from '../config/tenant.service';

/**
 * Interface do contexto de tema
 */
interface ThemeContextValue {
  theme: TenantCustomization;
  colors: TenantCustomization['colors'];
  assets: TenantCustomization['assets'];
  labels: TenantCustomization['labels'];
  typography: TenantCustomization['typography'];
  tenantName: string;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
}

/**
 * Context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Provedora de tema dinâmico
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<TenantCustomization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega o tema do tenant atual
   */
  const loadTheme = async () => {
    try {
      setIsLoading(true);
      
      // Obtém customização do tenant ativo
      const customization = getCurrentCustomization();
      setTheme(customization);
      
      const tenant = getCurrentTenant();
      console.log(`[ThemeProvider] Tema carregado para tenant: ${tenant.name}`, {
        displayName: customization.displayName,
        primaryColor: customization.colors.primary,
      });
    } catch (error) {
      console.error('[ThemeProvider] Erro ao carregar tema:', error);
      // Em caso de erro, usar tema default
      const defaultCustomization = getCurrentCustomization();
      setTheme(defaultCustomization);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicializa tema no mount
   */
  useEffect(() => {
    loadTheme();
  }, []);

  /**
   * Permite recarregar tema (útil para troca dinâmica de tenant)
   */
  const refreshTheme = async () => {
    await loadTheme();
  };

  /**
   * Fallback enquanto carrega
   */
  if (isLoading || !theme) {
    return null; // Ou um splash screen customizado
  }

  /**
   * Valor do contexto
   */
  const contextValue: ThemeContextValue = {
    theme,
    colors: theme.colors,
    assets: theme.assets,
    labels: theme.labels || {},
    typography: theme.typography,
    tenantName: theme.displayName,
    isLoading,
    refreshTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook useTheme() - Acessa o tema do tenant atual
 * 
 * @example
 * const { colors, assets, labels } = useTheme();
 * <View style={{ backgroundColor: colors.primary }}>
 *   <Image source={{ uri: assets.logo }} />
 *   <Text>{labels.betLabel}</Text>
 * </View>
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

/**
 * Hook useColors() - Atalho para acessar apenas cores
 */
export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

/**
 * Hook useAssets() - Atalho para acessar apenas assets
 */
export const useAssets = () => {
  const { assets } = useTheme();
  return assets;
};

/**
 * Hook useLabels() - Atalho para acessar apenas labels
 */
export const useLabels = () => {
  const { labels } = useTheme();
  return labels;
};
