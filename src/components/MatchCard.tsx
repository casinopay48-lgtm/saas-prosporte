import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '../theme/tokens';

type Match = {
  id?: number;
  liga?: string;
  casa: string;
  fora: string;
  p_casa: number;
  p_fora: number;
  status?: string;
  acontecendo_gol?: boolean;
};

export const MatchCard: React.FC<{ match: Match; brandingColor?: string; goalColor?: string }> = ({ match, brandingColor, goalColor }) => {
  const live = String(match.status || '').toUpperCase().includes("'") || match.status === 'AO VIVO' || match.acontecendo_gol;

  const scoreColor = brandingColor || tokens.colors.primary;
  const indicatorColor = goalColor || brandingColor || tokens.colors.success;

  return (
    <View style={[styles.card, { borderLeftColor: scoreColor, borderLeftWidth: 4 }]}>
      <Text style={styles.league}>{match.liga || '—'}</Text>

      <View style={styles.row}>
        <View style={styles.teamContainer}>
          <Text style={styles.team}>{match.casa}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: scoreColor }]}>{`${match.p_casa} - ${match.p_fora}`}</Text>
          <Text style={styles.status}>{match.status || '—'}</Text>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.team}>{match.fora}</Text>
        </View>
      </View>

      {live && (
        <View style={styles.badgeRow}>
          <View style={[styles.liveDot, { backgroundColor: indicatorColor, shadowColor: indicatorColor }]} />
          <Text style={[styles.liveText, { color: indicatorColor }]}>AO VIVO</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  league: {
    color: tokens.colors.muted,
    fontSize: 12,
    marginBottom: tokens.spacing.sm,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  team: {
    color: tokens.colors.white,
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
  },
  scoreContainer: {
    width: 100,
    alignItems: 'center',
  },
  score: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.large,
    fontWeight: tokens.typography.bold,
  },
  status: {
    color: tokens.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.sm,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: tokens.colors.success,
    marginRight: 8,
  },
  liveText: {
    color: tokens.colors.success,
    fontWeight: '700',
  },
});

export default MatchCard;
