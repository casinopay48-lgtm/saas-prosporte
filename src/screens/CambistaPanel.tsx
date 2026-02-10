import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { api } from '../services/api';
import tokens from '../theme/tokens';
import { Printer, Search } from 'lucide-react-native';

export default function CambistaPanel() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ total: 0, commission: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, tRes] = await Promise.all([api.get('/api/v1/cambista/summary'), api.get('/api/v1/cambista/tickets')].map(p => p.catch((e) => ({ data: null }))));
      if (sRes && sRes.data) setSummary(sRes.data);
      if (tRes && tRes.data) setTickets(Array.isArray(tRes.data) ? tRes.data : []);
    } catch (e) {
      console.warn('cambista load', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const validateTicket = async () => {
    if (!code) return Alert.alert('Informe o código/QR');
    try {
      const r = await api.get(`/api/v1/tickets/validate/${encodeURIComponent(code)}`);
      Alert.alert('Resultado', r.data?.message || 'Bilhete processado');
      load();
    } catch (e) { console.warn('validate failed', e); Alert.alert('Erro ao validar'); }
  };

  const printTicket = (t: any) => {
    // placeholder: in-device print / pdf generation
    Alert.alert('Imprimir', `Gerando PDF para bilhete ${t.id}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={tokens.colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Cambista</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Vendas do Dia</Text>
        <Text style={styles.value}>R$ {Number(summary.total ?? 0).toFixed(2)}</Text>
        <Text style={styles.small}>Comissão: R$ {Number(summary.commission ?? 0).toFixed(2)}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Validar Bilhete</Text>
        <View style={{ flexDirection: 'row' }}>
          <TextInput placeholder="Código ou QR" placeholderTextColor="#888" value={code} onChangeText={setCode} style={styles.input} />
          <TouchableOpacity style={styles.iconBtn} onPress={validateTicket}><Search color="#fff"/></TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Bilhetes</Text>
        <FlatList data={tickets} keyExtractor={t => String(t.id)} renderItem={({ item }) => (
          <View style={styles.ticketRow}>
            <Text style={{ color: '#fff', flex: 1 }}>{item.code}</Text>
            <TouchableOpacity onPress={() => printTicket(item)} style={styles.smallBtn}><Text style={{ color: '#fff' }}>Imprimir</Text></TouchableOpacity>
          </View>
        )} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, marginBottom: 12, fontWeight: '700' },
  box: { marginBottom: 12, backgroundColor: '#0B1116', padding: 10, borderRadius: 6 },
  label: { color: '#9FB', marginBottom: 8, fontWeight: '700' },
  value: { color: '#fff', fontSize: 16, fontWeight: '700' },
  small: { color: '#9AA', fontSize: 12 },
  input: { flex: 1, backgroundColor: '#061015', color: '#fff', padding: 8, marginRight: 8 },
  iconBtn: { backgroundColor: '#1F6FEB', padding: 8, justifyContent: 'center', alignItems: 'center' },
  ticketRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  smallBtn: { backgroundColor: '#2E8B57', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
});
