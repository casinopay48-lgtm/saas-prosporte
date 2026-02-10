/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, ActivityIndicator } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { initializeTenant, getCurrentTenant } from './src/config/tenant.service';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [tenantReady, setTenantReady] = useState(false);
  const [tenantName, setTenantName] = useState('');

  useEffect(() => {
    // Inicializar o tenant no boot do app
    initializeTenant()
      .then((tenant) => {
        setTenantName(tenant.displayName);
        setTenantReady(true);
        console.log(`[App] Tenant inicializado: ${tenant.name}`);
      })
      .catch((error) => {
        console.error('[App] Erro ao inicializar tenant:', error);
        setTenantReady(true); // Continua mesmo com erro
      });
  }, []);

  if (!tenantReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F0B90B" />
          <Text style={styles.loadingText}>Inicializando...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent tenantName={tenantName} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ tenantName }: { tenantName: string }) {
  const safeAreaInsets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.tenantText, { color: colors.primary }]}>
          Tenant: {tenantName}
        </Text>
      </View>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0E11',
  },
  loadingText: {
    marginTop: 16,
    color: '#848E9C',
    fontSize: 14,
  },
  header: {
    padding: 12,
    alignItems: 'center',
  },
  tenantText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default App;

