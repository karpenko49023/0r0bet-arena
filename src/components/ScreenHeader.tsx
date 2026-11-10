/**
 * ONE header component, reused on every screen with different slots.
 * 72 px tall + paddingTop 44 so the status bar stays visible (rule #6).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  HEADER_H,
  HEADER_TOP,
  H_PADDING,
} from '../constants/layout';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  leftWidth?: number;
  rightWidth?: number;
};

function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  centerSlot,
  leftWidth = 88,
  rightWidth = 88,
}: Props) {
  return (
    <View style={styles.root}>
      <View style={[styles.side, { width: leftWidth }]}>{leftSlot}</View>
      <View style={styles.center}>
        {centerSlot ? (
          centerSlot
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </>
        )}
      </View>
      <View style={[styles.sideRight, { width: rightWidth }]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: HEADER_H + HEADER_TOP,
    paddingTop: HEADER_TOP,
    paddingHorizontal: H_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 88,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sideRight: {
    width: 88,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  subtitle: {
    marginTop: 3,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});

export const ScreenHeader = React.memo(ScreenHeaderBase);
