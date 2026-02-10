import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { emitSyncRequested } from '../services/syncEvents';
import tokens from '../theme/tokens';
import { Server, Image, Users } from 'lucide-react-native';

type Game = any;

export default function BancaPanel() {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [cambistas, setCambistas] = useState<any[]>([]);
  const [color, setColor] = useState<string>('');
  const [logo, setLogo] = useState<string>('');

  const BRAND_KEY = '@banca:branding';

  const load = async () => {
    setLoading(true);
    try {
      const [gRes, cRes, stored] = await Promise.all([
        api.get('/api/v1/sync'),
        api.get('/api/v1/banca/cambistas'),
        AsyncStorage.getItem(BRAND_KEY),
      ]);
      setGames(Array.isArray(gRes.data.jogos) ? gRes.data.jogos : []);
      setCambistas(Array.isArray(cRes.data) ? cRes.data : (cRes.data.cambistas || []));
      if (stored) {
        try { const parsed = JSON.parse(stored); setColor(parsed.color || ''); setLogo(parsed.logo || ''); } catch (e) {}
      }
    } catch (e) {
      console.warn('banca load failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const saveBranding = async () => {
    const payload = { color, logo };
    try {
      await AsyncStorage.setItem(BRAND_KEY, JSON.stringify(payload));
      await api.post('/api/v1/banca/branding', payload).catch(() => {});
    } catch (e) {
      console.warn('save branding failed', e);
    }
  };

  const toggleGol = async (g: Game) => {
    const newVal = !g.acontecendo_gol;
    setGames(s => s.map(x => x.id === g.id ? { ...x, acontecendo_gol: newVal } : x));
    try {
      await api.post(`/api/v1/banca/jogo/${g.id}`, { acontecendo_gol: newVal });
      emitSyncRequested();
    } catch (e) {
      console.warn('toggle gol banca failed', e);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={tokens.colors.primary} size="large"/></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image color="#fff" strokeWidth={1.5} height={20} width={20} />
          <Text style={styles.title}>Painel Dono da Banca</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Branding</Text>
        <TextInput placeholder="#RRGGBB" placeholderTextColor="#888" value={color} onChangeText={setColor} style={styles.input} />
        <TextInput placeholder="URL da Logo" placeholderTextColor="#888" value={logo} onChangeText={setLogo} style={styles.input} />
        <TouchableOpacity style={styles.button} onPress={saveBranding}><Text style={styles.btnText}>Salvar Branding</Text></TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jogos</Text>
        <FlatList data={games} keyExtractor={i => String(i.id)} renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ color: '#fff', flex: 1 }}>{item.casa} x {item.fora}</Text>
            <TouchableOpacity style={[styles.smallBtn, item.acontecendo_gol ? styles.btnActive : null]} onPress={() => toggleGol(item)}>
              <Text style={{ color: '#fff' }}>{item.acontecendo_gol ? 'Remover GOL' : 'Marcar GOL'}</Text>
            </TouchableOpacity>
          </View>
        )} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cambistas</Text>
        <FlatList data={cambistas} keyExtractor={c => String(c.id)} renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={{ color: '#fff', flex: 1 }}>{item.name}</Text>
            <Text style={{ color: '#9AA' }}>R$ {Number(item.balance ?? 0).toFixed(2)}</Text>
          </View>
        )} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#0D1117' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1117' },
  headerRow: { marginBottom: 12 },
  title: { color: '#FFF', fontSize: 18, marginLeft: 8, fontWeight: '700' },
  section: { marginBottom: 12 },
  sectionTitle: { color: '#9FB', marginBottom: 8, fontWeight: '700' },
  input: { backgroundColor: '#0B1116', color: '#fff', padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  button: { backgroundColor: '#2E8B57', padding: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#1F6FEB', borderRadius: 6 },
  btnActive: { backgroundColor: '#00A86B' },
});
