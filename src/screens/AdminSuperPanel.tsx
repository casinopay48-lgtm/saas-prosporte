import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { api } from '../services/api';
import tokens from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import { Server, Plus } from 'lucide-react-native';

export default function AdminSuperPanel() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [bancas, setBancas] = useState<any[]>([]);
  const [slug, setSlug] = useState('');
  const [owner, setOwner] = useState('');
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  const mounted = useRef(true);

  // 🔐 Proteção de acesso
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      Alert.alert('Acesso negado', 'Você não tem permissão para acessar esta área.');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = async () => {
    setLoading(true);

    // 📦 Carregar bancas
    try {
      const r = await api.get('/api/admin/bancas');
      if (!mounted.current) return;

      setBancas(Array.isArray(r.data) ? r.data : r.data?.bancas || []);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        Alert.alert('Sem permissão', 'Seu usuário não é administrador.');
      } else {
        console.warn('load bancas', e);
      }
    }

    // 🖥 Health check (SEM IP FIXO)
    try {
      const res = await api.get('/health');
      if (!mounted.current) return;

      setServerOk(res.status === 200);
    } catch {
      if (!mounted.current) return;
      setServerOk(false);
    }

    if (mounted.current) setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createBanca = async () => {
    if (!slug || !owner) {
      return Alert.alert('Validação', 'Preencha slug e dono');
    }

    try {
      await api.post('/api/admin/bancas', { slug, owner });
      setSlug('');
      setOwner('');
      load();
    } catch (e) {
      console.warn('create banca', e);
      Alert.alert('Erro', 'Falha ao criar banca');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={tokens.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Server color="#fff" />
        <Text style={styles.title}>Admin Supremo</Text>
      </View>

      {/* STATUS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status do Servidor</Text>
        <Text style={{ color: serverOk ? '#0F0' : '#F55' }}>
          {serverOk === null ? '—' : serverOk ? 'Conectado' : 'Offline'}
        </Text>
      </View>

      {/* CRIAR BANCA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Criar Banca</Text>

        <TextInput
          placeholder="slug (domínio)"
          placeholderTextColor="#888"
          value={slug}
          onChangeText={setSlug}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="owner (user id)"
          placeholderTextColor="#888"
          value={owner}
          onChangeText={setOwner}
          style={styles.input}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={createBanca}>
          <Plus color="#fff" />
          <Text style={styles.btnText}>Criar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bancas</Text>

        <FlatList
          data={bancas}
          keyExtractor={(b) => String(b.id)}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={{ color: '#fff' }}>{item.name || item.slug}</Text>
              <Text style={{ color: '#9AA' }}>{item.owner}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0D1117',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '700',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#9FB',
    marginBottom: 6,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#0B1116',
    color: '#fff',
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1F6FEB',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
});
