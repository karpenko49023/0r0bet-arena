/**
 * Thin 3-cell strip for the in-game HUD. Cells with nothing to show are
 * filtered out; fewer than two cells means the strip is not rendered.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export type StripCell = {
  label: string;
  value: string;
  tone?: string;
};

type Props = { cells: StripCell[] };

function StatStripBase({ cells }: Props) {
  const visible = cells.filter(c => c.value.length > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.root}>
      {visible.map((cell, i) => (
        <View
          key={cell.label}
          style={[styles.cell, i > 0 ? styles.divider : null]}>
          <Text style={styles.label} numberOfLines={1}>
            {cell.label}
          </Text>
          <Text
            style={[
              styles.value,
              { color: cell.tone ? cell.tone : theme.colors.text.primary },
            ]}
            numberOfLines={1}>
            {cell.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(31,31,36,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.07)',
  },
  label: {
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  value: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export const StatStrip = React.memo(StatStripBase);
