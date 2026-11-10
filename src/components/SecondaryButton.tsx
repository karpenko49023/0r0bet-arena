/**
 * Secondary CTA — same icon geometry as PrimaryButton (24x24, lineHeight 24,
 * gap 10) so the two never look mismatched on one screen.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { PressScale } from './PressScale';

const ICON_SIZE = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  width: number;
  height?: number;
  tone?: 'neutral' | 'danger';
  disabled?: boolean;
};

function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  width,
  height = 48,
  tone = 'neutral',
  disabled = false,
}: Props) {
  const color =
    tone === 'danger' ? theme.colors.accent.danger : theme.colors.text.primary;
  const border =
    tone === 'danger' ? 'rgba(255,90,110,0.42)' : 'rgba(255,255,255,0.10)';

  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[
        styles.press,
        { width, height, borderColor: border, opacity: disabled ? 0.38 : 1 },
      ]}>
      <View style={styles.row}>
        {Icon ? (
          <View style={styles.iconBox}>
            <Icon size={ICON_SIZE} strokeWidth={2} color={color} />
          </View>
        ) : null}
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 14,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export const SecondaryButton = React.memo(SecondaryButtonBase);
