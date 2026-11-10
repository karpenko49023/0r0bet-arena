/**
 * ATT / DEF / FORM comparison bar. The stronger side on a metric is green,
 * the weaker one muted — the comparison is readable at a glance.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  label: string;
  value: number;
  stronger: boolean;
  width: number;
  align?: 'left' | 'right';
};

function IndicatorBarBase({
  label,
  value,
  stronger,
  width,
  align = 'left',
}: Props) {
  const tone = stronger
    ? theme.colors.accent.primary
    : theme.colors.text.muted;
  const pct = Math.max(4, Math.min(100, value));

  return (
    <View style={[styles.root, { width }]}>
      <View
        style={[
          styles.labelRow,
          align === 'right' ? styles.rowReverse : null,
        ]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: tone }]}>{Math.round(value)}</Text>
      </View>
      <View
        style={[
          styles.track,
          align === 'right' ? styles.trackRight : null,
        ]}>
        <View
          style={[
            styles.fill,
            { width: (pct / 100) * (width - 2), backgroundColor: tone },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  label: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  value: {
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#232329',
    overflow: 'hidden',
  },
  trackRight: {
    alignItems: 'flex-end',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});

export const IndicatorBar = React.memo(IndicatorBarBase);
