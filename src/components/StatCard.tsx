/**
 * ONE stat-pill design shared by Menu / Progress / Result.
 * Identical geometry everywhere: 44x44 icon wrap, same padding, same radius,
 * differentiated only by valueColor, the number and the label.
 * width:'100%' (NOT flex:1) so it never collapses inside a flex:1 slot.
 * Renders null when there is nothing to show (rule 8.3).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor?: string;
};

function StatCardBase({
  Icon,
  value,
  label,
  valueColor = theme.colors.accent.primary,
}: Props) {
  if (!value || value.length === 0) {
    return null;
  }
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        <Icon size={22} strokeWidth={1.5} color={valueColor} />
      </View>
      <View style={styles.texts}>
        <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});

export const StatCard = React.memo(StatCardBase);
