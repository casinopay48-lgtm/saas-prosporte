import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { api, setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrentTenant } from '../config/tenant.service';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const { colors, assets, tenantName } = useTheme();
  const tenant = getCurrentTenant();

  const handleLogin = async () => {
    // Validação básica de campos vazios
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // Tentativa de login na API da VPS
      const response = await api.post('/api/v1/auth/login', { email, password });
      const token = response.data?.token;
      const user = response.data?.user ?? null;

      if (!token) throw new Error('Token não recebido');

      // persist via auth context (login will set header and store token/user)
      auth.login(token, (user?.role ?? response.data?.role ?? 'cambista').toLowerCase(), user);
    } catch (error: any) {
      console.log('Erro no login:', error.message);

      // --- FALLBACK: LOGIN FAKE (Para testes se a VPS estiver offline) ---
      const validEmails = ['admin@saasportes.com', 'teste@saasportes.com'];
      const isTestUser = validEmails.includes(email.toLowerCase());
      const isTestPass = password === 'Admin@123' || password === 'Teste@123';

      if (isTestUser && isTestPass) {
        console.log('VPS Offline - Entrando com modo de teste local');
        auth.login('fake-token-vps-offline', 'cambista', { name: 'Teste Offline', role: 'cambista' });
      } else {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar à VPS e as credenciais não são de teste.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo da Banca */}
      {assets.logo && (
        <Image
          source={{ uri: assets.logo }}
          style={styles.logoImage}
          resizeMode="contain"
        />
      )}
      
      <Text style={[styles.logo, { color: colors.primary }]}>{tenantName}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Sistema de Apostas Esportivas
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            borderColor: colors.surface, 
            backgroundColor: colors.surface,
            color: colors.text 
          }]}
          placeholder="E-mail"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={[styles.input, { 
            borderColor: colors.surface, 
            backgroundColor: colors.surface,
            color: colors.text 
          }]}
          placeholder="Senha"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button, 
          { backgroundColor: colors.primary },
          loading && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.background }]}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        Conectando a: {tenant.apiUrl.replace('https://', '')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
  },
  logoImage: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logo: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: { 
    marginBottom: 20 
  },
  input: { 
    borderWidth: 1, 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15,
  },
  button: { 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    height: 55, 
    justifyContent: 'center',
  },
  buttonDisabled: { 
    opacity: 0.6,
  },
  buttonText: { 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  footerText: { 
    marginTop: 20, 
    textAlign: 'center', 
    fontSize: 12,
  }
});
