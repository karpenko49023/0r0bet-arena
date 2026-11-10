/**
 * HOME / DRAW / AWAY. Three buttons sized from PICK_W, never intrinsic.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { OUTCOMES, Outcome, formatOdds } from '../game/odds';
import type { Odds, Probabilities } from '../game/odds';
import { PressScale } from './PressScale';

type Props = {
  odds: Odds;
  prob: Probabilities;
  value: Outcome | null;
  onChange: (o: Outcome) => void;
  format: 'decimal' | 'percent';
  pickWidth: number;
  gap: number;
  height?: number;
};

function OutcomePickerBase({
  odds,
  prob,
  value,
  onChange,
  format,
  pickWidth,
  gap,
  height = 64,
}: Props) {
  return (
    <View style={[styles.row, { gap }]}>
      {OUTCOMES.map(outcome => {
        const selected = value === outcome;
        const o =
          outcome === 'HOME'
            ? odds.home
            : outcome === 'AWAY'
            ? odds.away
            : odds.draw;
        const p =
          outcome === 'HOME'
            ? prob.home
            : outcome === 'AWAY'
            ? prob.away
            : prob.draw;

        return (
          <PressScale
            key={outcome}
            onPress={() => onChange(outcome)}
            accessibilityLabel={outcome}
            scaleTo={0.95}
            style={[
              styles.pick,
              { width: pickWidth, height },
              selected ? styles.pickSelected : null,
            ]}>
            <View style={styles.pickInner}>
              <Text
                style={[
                  styles.label,
                  selected ? styles.labelSelected : null,
                ]}>
                {outcome}
              </Text>
              <Text
                style={[
                  styles.value,
                  selected ? styles.valueSelected : null,
                ]}>
                {formatOdds(o, p, format)}
              </Text>
            </View>
          </PressScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pick: {
    borderRadius: 14,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  pickSelected: {
    backgroundColor: 'rgba(23,224,140,0.14)',
    borderWidth: 2,
    borderColor: theme.colors.accent.primary,
  },
  pickInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  labelSelected: {
    color: theme.colors.accent.primary,
  },
  value: {
    marginTop: 4,
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  valueSelected: {
    color: theme.colors.accent.primary,
  },
});

export const OutcomePicker = React.memo(OutcomePickerBase);
