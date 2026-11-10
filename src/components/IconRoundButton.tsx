/**
 * 44x44 round navigation button: button_round plate + a contract icon asset.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { assets } from '../assets';
import { PressScale } from './PressScale';

type Props = {
  icon: ImageSourcePropType;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
};

function IconRoundButtonBase({
  icon,
  onPress,
  accessibilityLabel,
  size = 44,
}: Props) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[styles.press, { width: size, height: size }]}>
      <View style={styles.inner}>
        <Image source={assets.buttonRound} style={styles.plate} />
        <Image source={icon} style={styles.glyph} />
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 22,
    backgroundColor: 'rgba(31,31,36,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    position: 'absolute',
    width: 38,
    height: 38,
    opacity: 0.35,
    resizeMode: 'contain',
  },
  glyph: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export const IconRoundButton = React.memo(IconRoundButtonBase);
