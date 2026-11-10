/**
 * The bento tile used across the Menu hub. Explicit width AND height always.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { PressScale } from './PressScale';

type Props = {
  Icon: LucideIcon;
  label: string;
  sub?: string;
  width: number;
  height: number;
  accent?: string;
  onPress: () => void;
  trailing?: string;
};

function BentoTileBase({
  Icon,
  label,
  sub,
  width,
  height,
  accent = theme.colors.accent.primary,
  onPress,
  trailing,
}: Props) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityLabel={label}
      scaleTo={0.97}
      style={[styles.press, { width, height }]}>
      <View style={styles.inner}>
        <View style={styles.topRow}>
          <View style={[styles.iconPad, { backgroundColor: accent + '1F' }]}>
            <Icon size={18} strokeWidth={1.5} color={accent} />
          </View>
          {trailing ? (
            <Text style={styles.trailing}>{trailing}</Text>
          ) : null}
        </View>
        <View>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          {sub ? (
            <Text style={styles.sub} numberOfLines={1}>
              {sub}
            </Text>
          ) : null}
        </View>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 18,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  inner: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPad: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: {
    color: theme.colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  sub: {
    marginTop: 3,
    color: theme.colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});

export const BentoTile = React.memo(BentoTileBase);
