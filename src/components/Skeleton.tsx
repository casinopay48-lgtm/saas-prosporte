import React from 'react';
import { View, StyleSheet } from 'react-native';
import tokens from '../theme/tokens';

type Props = {
  width?: number | string;
  height?: number;
  style?: object;
  circle?: boolean;
};

const SkeletonBox: React.FC<Props> = ({ width = '100%', height = 16, style, circle = false }) => {
  return <View style={[styles.box, { width, height, borderRadius: circle ? height! / 2 : 6 }, style]} />;
};

export const SkeletonMatchCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View style={styles.card}>
    <SkeletonBox width={120} height={12} style={{ marginBottom: 8 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <SkeletonBox width={80} height={20} />
      </View>
      <View style={{ width: 100, alignItems: 'center' }}>
        <SkeletonBox width={80} height={28} />
        <SkeletonBox width={60} height={10} style={{ marginTop: 6 }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <SkeletonBox width={80} height={20} />
      </View>
    </View>
    <View style={{ height: 8 }} />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox key={i} width={'40%'} height={10} style={{ marginTop: 6 }} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#1B2228',
  },
  card: {
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
});

export default SkeletonBox;
