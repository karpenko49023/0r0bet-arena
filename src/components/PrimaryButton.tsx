/**
 * The primary CTA. Icon is ALWAYS 24x24, label lineHeight 24, gap 10,
 * row centred — never an absolutely positioned glyph (rule #20 / #14).
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { assets } from '../assets';
import { PressScale } from './PressScale';

export const ICON_SIZE = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  width: number;
  height?: number;
  disabled?: boolean;
};

function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  width,
  height = 56,
  disabled = false,
}: Props) {
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[
        styles.press,
        { width, height, opacity: disabled ? 0.38 : 1 },
      ]}>
      <LinearGradient
        colors={['#17E08C', '#0FB873']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, { borderRadius: 16 }]}>
        <Image
          source={assets.buttonRect}
          style={styles.backing}
          resizeMode="stretch"
        />
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON_SIZE} strokeWidth={2} color="#07140E" />
            </View>
          ) : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 16,
    shadowColor: '#17E08C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.22,
  },
  row: {
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
    color: '#07140E',
    fontSize: 16,
    lineHeight: ICON_SIZE,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export const PrimaryButton = React.memo(PrimaryButtonBase);
