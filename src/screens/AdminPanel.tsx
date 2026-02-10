import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { emitSyncRequested } from '../services/syncEvents';
import tokens from '../theme/tokens';
import { showToast } from '../services/toast';

type Game = {
  id: number;
  liga?: string;
  casa: string;
  fora: string;
  p_casa: number;
  p_fora: number;
  status?: string;
  acontecendo_gol?: boolean;
};

export default function AdminPanel() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/v1/sync');
      setGames(Array.isArray(r.data.jogos) ? r.data.jogos : []);
    } catch (e: any) {
      console.warn('admin load failed', e?.message || e);
      showToast('Falha ao carregar jogos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleGol = async (g: Game) => {
    const newVal = !g.acontecendo_gol;
    // optimistic update
    setGames((s) => s.map(x => x.id === g.id ? { ...x, acontecendo_gol: newVal } : x));
    setLoadingMap((m) => ({ ...m, [g.id]: true }));
    try {
      await api.post(`/api/admin/jogo/${g.id}`, { acontecendo_gol: newVal });
      showToast(`${newVal ? 'Marcado GOL' : 'Removido GOL'} para jogo ${g.id}`);
      // force immediate sync across app
      try { emitSyncRequested(); } catch (e) {}
    } catch (e: any) {
      // revert
      setGames((s) => s.map(x => x.id === g.id ? { ...x, acontecendo_gol: g.acontecendo_gol } : x));
      console.warn('toggle failed', e?.message || e);
      showToast('Falha ao atualizar jogo (verifique permissões).');
    } finally {
      setLoadingMap((m) => ({ ...m, [g.id]: false }));
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color={tokens.colors.primary} /></View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área do Dono — Admin Panel</Text>
      <FlatList
        data={games}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.matchTitle}>{item.casa} x {item.fora}</Text>
              <Text style={styles.meta}>{item.liga} • {item.status}</Text>
            </View>
            <TouchableOpacity style={[styles.btn, item.acontecendo_gol ? styles.btnActive : null]} onPress={() => toggleGol(item)} disabled={!!loadingMap[item.id]}>
              {loadingMap[item.id] ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>{item.acontecendo_gol ? 'Remover GOL' : 'Marcar GOL'}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: tokens.colors.neutralBg },
  title: { color: tokens.colors.white, fontSize: 18, marginBottom: 12, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tokens.colors.neutralBg },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: tokens.colors.surface, borderRadius: 8, marginBottom: 10 },
  matchTitle: { color: tokens.colors.white, fontWeight: '700' },
  meta: { color: tokens.colors.muted, fontSize: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: tokens.colors.primary, borderRadius: 6 },
  btnActive: { backgroundColor: '#00A86B' },
  btnText: { color: '#fff', fontWeight: '700' },
});
