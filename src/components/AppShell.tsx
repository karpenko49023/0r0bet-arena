/**
 * Every screen: the one background image bg_game + a screen-specific gradient
 * overlay + a decor layer. Screens are told apart by the overlay, never by a
 * second background asset.
 */
import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { PitchGrid } from './PitchGrid';

export type ShellVariant =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'hub';

const OVERLAYS: Record<ShellVariant, string[]> = {
  loader: ['rgba(5,5,6,0.93)', 'rgba(17,17,20,0.97)', '#09090C'],
  menu: ['rgba(17,17,20,0.72)', 'rgba(17,17,20,0.88)', 'rgba(9,9,12,0.96)'],
  game: ['rgba(17,17,20,0.86)', 'rgba(9,9,12,0.95)'],
  result: ['rgba(9,9,12,0.80)', 'rgba(17,17,20,0.94)'],
  hub: ['rgba(17,17,20,0.90)', 'rgba(9,9,12,0.96)'],
};

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
  blobColor?: string;
  blobTop?: number;
  gridOpacity?: number;
};

function AppShellBase({
  variant,
  children,
  blobColor = 'rgba(23,224,140,0.10)',
  blobTop = 120,
  gridOpacity = 0.03,
}: Props) {
  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={assets.bg}
        style={styles.bg}
        resizeMode="cover">
        <LinearGradient
          colors={OVERLAYS[variant]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        <View
          pointerEvents="none"
          style={[
            styles.blob,
            { top: blobTop, backgroundColor: blobColor },
          ]}
        />
        <PitchGrid opacity={gridOpacity} />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  bg: {
    flex: 1,
    width: '100%',
  },
  blob: {
    position: 'absolute',
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  content: {
    flex: 1,
  },
});

export const AppShell = React.memo(AppShellBase);
