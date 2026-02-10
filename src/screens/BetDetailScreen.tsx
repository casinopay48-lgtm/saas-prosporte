import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function BetDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bet }: any = route.params;

  const handleShareTicket = async () => {
    try {
      const message = `⚽ *BILHETE SAASPORTES* ⚽\n\n` +
                      `🆔 ID: ${bet.id}\n` +
                      `📅 Data: ${bet.date}\n` +
                      `💰 Valor: R$ ${bet.amount.toFixed(2)}\n` +
                      `📈 Retorno: R$ ${bet.potentialReturn.toFixed(2)}\n\n` +
                      `Boa sorte! 🍀`;

      await Share.share({
        message,
        title: 'Compartilhar Bilhete',
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da Aposta</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>ID do Bilhete:</Text>
          <Text style={styles.value}>#{bet.id}</Text>

          <Text style={styles.label}>Valor Apostado:</Text>
          <Text style={styles.value}>R$ {bet.amount.toFixed(2)}</Text>

          <Text style={styles.label}>Possível Retorno:</Text>
          <Text style={styles.valueSuccess}>R$ {bet.potentialReturn.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareTicket}>
          <Text style={styles.shareButtonText}>Compartilhar com Cliente</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#0D1117', flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#E6EDF3', marginRight: 20, fontSize: 16 },
  title: { color: '#E6EDF3', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  card: { backgroundColor: '#0D1117', padding: 20, borderRadius: 0, marginBottom: 20, borderWidth: 0.5, borderColor: '#30363D' },
  label: { color: '#8B949E', fontSize: 14, marginTop: 10 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#E6EDF3' },
  valueSuccess: { fontSize: 22, fontWeight: 'bold', color: '#EBD08B' },
  shareButton: { backgroundColor: '#30363D', padding: 18, borderRadius: 0, alignItems: 'center' },
  shareButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
