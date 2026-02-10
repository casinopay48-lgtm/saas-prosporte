import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, Users, TrendingUp, Wallet } from 'lucide-react-native';

export default function BancaHome() {
  const { colors, assets, tenantName, labels } = useTheme();

  const stats = [
    { label: 'Apostas Hoje', value: '156', icon: BarChart3, color: colors.primary },
    { label: 'Cambistas Ativos', value: '8', icon: Users, color: colors.success },
    { label: 'Lucro Mensal', value: 'R$ 12.450', icon: TrendingUp, color: colors.warning },
    { label: 'Saldo Total', value: 'R$ 48.320', icon: Wallet, color: colors.secondary },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com Logo */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        {assets.logo && (
          <Image
            source={{ uri: assets.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Dashboard - {tenantName}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Painel de Controle da Banca
        </Text>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                <Icon size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Seção de Ações Rápidas */}
      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações Rápidas</Text>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.actionButtonText, { color: colors.background }]}>
            Ver Relatórios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Gerenciar Cambistas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Configurações da Banca
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        {tenantName} • Sistema SaaS de Apostas
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    width: 150,
    height: 45,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    padding: 20,
    fontSize: 12,
  },
});
