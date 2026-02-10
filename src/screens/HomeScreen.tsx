import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import SkeletonMatchCard from '../components/Skeleton';
import { api } from '../services/api';

interface Game {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  odds: {
    one: number;
    draw: number;
    two: number;
  };
}

const MOCK_GAMES: Game[] = [
  {
    id: '1',
    teamA: 'Flamengo',
    teamB: 'Vasco',
    date: '2026-02-01 19:00',
    odds: { one: 1.80, draw: 3.20, two: 4.50 },
  },
  {
    id: '2',
    teamA: 'São Paulo',
    teamB: 'Corinthians',
    date: '2026-02-01 20:30',
    odds: { one: 2.10, draw: 3.40, two: 3.80 },
  },
  {
    id: '3',
    teamA: 'Palmeiras',
    teamB: 'Santos',
    date: '2026-02-02 18:00',
    odds: { one: 1.95, draw: 3.10, two: 4.20 },
  },
  {
    id: '4',
    teamA: 'Botafogo',
    teamB: 'Fluminense',
    date: '2026-02-02 19:30',
    odds: { one: 2.25, draw: 3.50, two: 3.00 },
  },
  {
    id: '5',
    teamA: 'Atlético MG',
    teamB: 'Cruzeiro',
    date: '2026-02-03 18:00',
    odds: { one: 1.85, draw: 3.30, two: 4.10 },
  },
];

export default function HomeScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [balance, setBalance] = useState('R$ 0,00');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBRL = (value: any) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.,-]/g, '').replace(',', '.')) : Number(value);
    if (Number.isFinite(num)) {
      try {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
      } catch (e) {
        return `R$ ${num.toFixed(2)}`;
      }
    }
    return 'R$ 0,00';
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      // Backend sync endpoint
      const response = await api.get('/api/v1/sync');
      const data = response.data;

      // Expecting { jogos: [...] } from the server
      if (data && Array.isArray(data.jogos)) {
        const mapped = data.jogos.map((j: any) => ({
          id: String(j.id),
          teamA: j.casa || j.teamA || 'Casa',
          teamB: j.fora || j.teamB || 'Fora',
          date: j.status || '',
          odds: {
            one: Number(j.p_casa ?? 0),
            draw: 0,
            two: Number(j.p_fora ?? 0),
          },
        }));
        setGames(mapped);
      } else if (Array.isArray(data)) {
        // fallback: if API returned array directly
        setGames(data as any);
      } else {
        setGames(MOCK_GAMES);
      }

      // Balance: optional
      if (data && (data.balance !== undefined || (data.wallet && data.wallet.balance !== undefined))) {
        const bal = data.balance !== undefined ? data.balance : data.wallet.balance;
        setBalance(formatBRL(bal));
      }
    } catch (err) {
      setError('Sem conexão com o servidor. Usando dados de teste.');
      setGames(MOCK_GAMES);
    } finally {
      setLoading(false);
    }
  };

  const CASINOPAY_KEY = 'cp_sk_4kjb3s6vm3tm81tf94g0u';

  const handleDeposit = () => {
    // Placeholder flow: in production this should open Casinopay SDK / redirect with the store key
    Alert.alert('Depósito', `Abrindo fluxo de pagamento (chave: ${CASINOPAY_KEY})`, [{ text: 'OK' }]);
  };

  // Ticket modal state
  const [ticketVisible, setTicketVisible] = useState(false);
  const [ticketStake, setTicketStake] = useState('');
  const [selectedBet, setSelectedBet] = useState<null | { match: string; oddType: string; oddValue: number }>(null);

  const openTicket = (item: Game, oddType: string, oddValue: number) => {
    setSelectedBet({ match: `${item.teamA} vs ${item.teamB}` , oddType, oddValue });
    setTicketStake('');
    setTicketVisible(true);
  };

  const confirmBet = () => {
    if (!selectedBet) return;
    const stake = parseFloat(ticketStake) || 0;
    // Placeholder: in production call bets endpoint and ledger flows
    Alert.alert('Aposta', `Aposta registrada (demo)\n${selectedBet.match}\n${selectedBet.oddType}: ${selectedBet.oddValue}\nValor: R$ ${stake.toFixed(2)}`);
    setTicketVisible(false);
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(() => {
      fetchGames();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchGames();
    } finally {
      setRefreshing(false);
    }
  };

  const renderGameRow = ({ item }: { item: Game }) => (
    <View style={styles.tableRow}>
      <View style={styles.timeCell}>
        <Text style={styles.cellText}>{item.teamA}</Text>
        <Text style={styles.vsText}>vs</Text>
        <Text style={styles.cellText}>{item.teamB}</Text>
      </View>

      <View style={styles.dateCell}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <TouchableOpacity style={[styles.oddButton, styles.oddButtonHome]} onPress={() => openTicket(item, '1', item.odds.one)}>
        <Text style={styles.oddLabel}>1</Text>
        <Text style={styles.oddValue}>{item.odds.one.toFixed(2)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.oddButton, styles.oddButtonDraw]} onPress={() => openTicket(item, 'X', item.odds.draw)}>
        <Text style={styles.oddLabel}>X</Text>
        <Text style={styles.oddValue}>{item.odds.draw.toFixed(2)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.oddButton, styles.oddButtonAway]} onPress={() => openTicket(item, '2', item.odds.two)}>
        <Text style={styles.oddLabel}>2</Text>
        <Text style={styles.oddValue}>{item.odds.two.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && games.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        {/* skeleton placeholders for premium UX */}
        <SkeletonMatchCard />
        <SkeletonMatchCard />
        <SkeletonMatchCard />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>PROSPORTE</Text>
          <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
            <Text style={styles.depositButtonText}>Depositar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Saldo: {balance}</Text>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGames}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.timeCellHeader}>
          <Text style={styles.headerText}>TIMES</Text>
        </View>
        <View style={styles.dateCellHeader}>
          <Text style={styles.headerText}>HORÁRIO</Text>
        </View>
        <Text style={[styles.headerText, styles.oddHeaderText]}>CASA</Text>
        <Text style={[styles.headerText, styles.oddHeaderText]}>EMPATE</Text>
        <Text style={[styles.headerText, styles.oddHeaderText]}>FORA</Text>
      </View>

      {/* Games List */}
      <FlatList
        data={games}
        renderItem={renderGameRow}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum jogo disponível</Text>
          </View>
        }
      />

      {/* Ticket Modal */}
      <Modal visible={ticketVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bilhete de Aposta</Text>
            {selectedBet && (
              <>
                <Text style={styles.modalText}>{selectedBet.match}</Text>
                <Text style={styles.modalText}>Tipo: {selectedBet.oddType} — {selectedBet.oddValue.toFixed(2)}</Text>
                <TextInput
                  value={ticketStake}
                  onChangeText={setTicketStake}
                  placeholder="Valor (R$)"
                  keyboardType="numeric"
                  style={styles.stakeInput}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmBet}>
                    <Text style={{ color: '#000', fontWeight: '700' }}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setTicketVisible(false)}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    backgroundColor: '#1C2230',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E6EDF3',
    letterSpacing: 1.5,
  },
  depositButton: {
    backgroundColor: '#30363D',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  depositButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  balanceContainer: {
    paddingVertical: 4,
  },
  balanceText: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#3D2817',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E89E28',
  },
  errorText: {
    color: '#D4A574',
    fontSize: 12,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#E89E28',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 0,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#161B22',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#30363D',
    alignItems: 'center',
  },
  timeCellHeader: {
    flex: 2,
  },
  dateCellHeader: {
    flex: 1,
  },
  headerText: {
    color: '#58A6FF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  oddHeaderText: {
    flex: 0.8,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#21262D',
    alignItems: 'center',
  },
  timeCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellText: {
    color: '#E6EDF3',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  vsText: {
    color: '#6E7681',
    fontSize: 11,
    marginHorizontal: 4,
  },
  dateCell: {
    flex: 1,
  },
  dateText: {
    color: '#8B949E',
    fontSize: 12,
  },
  oddButton: {
    flex: 0.8,
    marginHorizontal: 3,
    paddingVertical: 6,
    borderRadius: 0,
    alignItems: 'center',
    borderWidth: 0.5,
  },
  oddButtonHome: {
    backgroundColor: '#0D1117',
    borderColor: '#30363D',
  },
  oddButtonDraw: {
    backgroundColor: '#0D1117',
    borderColor: '#30363D',
  },
  oddButtonAway: {
    backgroundColor: '#0D1117',
    borderColor: '#30363D',
  },
  oddLabel: {
    color: '#8B949E',
    fontSize: 9,
    fontWeight: 'bold',
  },
  oddValue: {
    color: '#E6EDF3',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8B949E',
    marginTop: 16,
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 0,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6E7681',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#0D1117',
    padding: 16,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#21262D',
  },
  modalTitle: {
    color: '#E6EDF3',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    color: '#E6EDF3',
    fontSize: 14,
    marginBottom: 6,
  },
  stakeInput: {
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 10,
    borderRadius: 0,
    color: '#E6EDF3',
    backgroundColor: '#0B1116',
  },
  confirmButton: {
    backgroundColor: '#EBD08B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#161B22',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
    alignItems: 'center',
  },
});
