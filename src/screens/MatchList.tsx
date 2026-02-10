import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Button, Image } from 'react-native';
import MatchCard from '../components/MatchCard';
import tokens from '../theme/tokens';
import SkeletonMatchCard from '../components/Skeleton';
import { api } from '../services/api';
import { onSyncRequested } from '../services/syncEvents';

type Match = {
  id: number;
  liga: string;
  casa: string;
  fora: string;
  p_casa: number;
  p_fora: number;
  status: string;
  acontecendo_gol?: boolean;
};

const MOCK: Match[] = [
  { id: 1, liga: 'BRASILEIRÃO', casa: 'FLAMENGO', fora: 'PALMEIRAS', p_casa: 1, p_fora: 0, status: "42'", acontecendo_gol: true },
  { id: 2, liga: 'BRASILEIRÃO', casa: 'SÃO PAULO', fora: 'CORINTHIANS', p_casa: 0, p_fora: 1, status: "28'" },
  { id: 3, liga: 'LIBERTADORES', casa: 'BOTAFOGO', fora: 'FLUMINENSE', p_casa: 2, p_fora: 0, status: 'FINALIZADO' },
];

const MatchList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [banca, setBanca] = useState<{ nome?: string; logo?: string; cor?: string } | null>(null);
  const isMounted = useRef(true);

  const fetchSync = useCallback(async () => {
    try {
      const res = await api.get('/api/v1/sync');
      const data = res.data;
      if (!isMounted.current) return;
      setMatches(Array.isArray(data.jogos) ? data.jogos : MOCK);
      setBanca(data.banca || null);
      setError(null);
    } catch (err: any) {
      if (!isMounted.current) return;
      console.warn('sync error', err?.message || err);
      setError('Falha ao conectar com o HUB. Usando dados em cache.');
      if (matches.length === 0) setMatches(MOCK);
    } finally {
      if (isMounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // primeira chamada imediata
    fetchSync();

    // polling seguro a cada 5s
    const id = setInterval(fetchSync, 5000);

    // subscribe to manual sync requests (emitted by AdminPanel)
    const unsub = onSyncRequested(() => {
      fetchSync();
    });

    return () => {
      isMounted.current = false;
      clearInterval(id);
      if (unsub) unsub();
    };
  }, [fetchSync]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: banca?.cor ? tokens.colors.neutralBg : tokens.colors.neutralBg }]}>
      <View style={[styles.header, { backgroundColor: tokens.colors.surface }] }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {banca?.logo ? (
            <Image source={{ uri: banca.logo }} style={styles.logoImage} resizeMode="contain" />
          ) : (
            <Text style={styles.logo}>PROSPORTE</Text>
          )}
        </View>
        <Button title="Entrar" onPress={() => { /* hook de login */ }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.center}>
            <SkeletonMatchCard />
            <SkeletonMatchCard />
            <SkeletonMatchCard />
          </View>
        )}

        {error && (
          <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
        )}

        {!loading && !error && matches.length === 0 && (
          <View style={styles.center}><Text style={styles.emptyText}>Nenhuma partida disponível</Text></View>
        )}

        {!loading && !error && matches.map(m => (
          <MatchCard key={m.id} match={m} brandingColor={banca?.cor} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.colors.neutralBg },
  header: { height: 64, backgroundColor: tokens.colors.surface, paddingHorizontal: tokens.spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: tokens.colors.white, fontWeight: '700', fontSize: 18 },
  container: { padding: tokens.spacing.md },
  center: { alignItems: 'center', marginTop: tokens.spacing.lg },
  loadingText: { color: tokens.colors.white, marginTop: tokens.spacing.sm },
  errorText: { color: tokens.colors.danger },
  emptyText: { color: tokens.colors.muted },
});

export default MatchList;
