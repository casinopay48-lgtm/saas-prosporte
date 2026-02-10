import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { api, setAuthToken } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const auth = useAuth();

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Preencha todos os campos');
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setErrorMessage('E-mail inválido');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Senha deve ter ao menos 6 caracteres');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/register', { name, email, password });
      const token = response.data?.token;
      if (!token) throw new Error('Token não recebido');
      await AsyncStorage.setItem('@saasportes:token', token);
      setAuthToken(token);

      // persist user
      const user = response.data?.user ?? null;
      if (user) await AsyncStorage.setItem('@saasportes:user', JSON.stringify(user));

      // role retornado deve ser CLIENT
      const userRole = user?.role ?? 'CLIENT';
      const normalized = String(userRole).toLowerCase();
      auth.login(token, normalized as any, user);

      // navegar para fluxo do cliente
      navigation.replace('AppClient');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      const message = err?.response?.data?.message || err.message || 'Erro ao cadastrar';
      setErrorMessage(message);
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} autoCapitalize="words" />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={[styles.button, loading ? { opacity: 0.7 } : {}]} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#0D1117' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#30363D', padding: 15, borderRadius: 0, marginBottom: 15, backgroundColor: '#0B1116', fontSize: 16, color: '#E6EDF3' },
  button: { backgroundColor: '#30363D', padding: 16, borderRadius: 0, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
