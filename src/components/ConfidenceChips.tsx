/**
 * LOW x1 / MED x2 / HIGH x3. A chip the remaining budget cannot pay for is
 * visibly disabled and does not press (rule 4.3).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CONFIDENCE_COST,
  CONFIDENCE_LEVELS,
  CONFIDENCE_MULTIPLIER,
  ConfLevel,
} from '../constants/config';
import { theme } from '../constants/theme';
import { PressScale } from './PressScale';

type Props = {
  value: ConfLevel;
  onChange: (level: ConfLevel) => void;
  /** budget still available if the current fixture were unassigned */
  affordable: number;
  chipWidth: number;
  gap: number;
};

function ConfidenceChipsBase({
  value,
  onChange,
  affordable,
  chipWidth,
  gap,
}: Props) {
  return (
    <View style={[styles.row, { gap }]}>
      {CONFIDENCE_LEVELS.map(level => {
        const cost = CONFIDENCE_COST[level];
        const disabled = cost > affordable;
        const active = value === level && !disabled;
        return (
          <PressScale
            key={level}
            onPress={() => onChange(level)}
            disabled={disabled}
            accessibilityLabel={level}
            scaleTo={0.95}
            style={[
              styles.chip,
              { width: chipWidth, height: 44 },
              active ? styles.chipActive : null,
              disabled ? styles.chipDisabled : null,
            ]}>
            <View style={styles.inner}>
              <Text
                style={[styles.label, active ? styles.labelActive : null]}>
                {level}
              </Text>
              <Text
                style={[styles.mult, active ? styles.labelActive : null]}>
                {'x' + CONFIDENCE_MULTIPLIER[level]}
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
  chip: {
    borderRadius: 12,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  chipActive: {
    backgroundColor: 'rgba(255,176,32,0.14)',
    borderWidth: 2,
    borderColor: theme.colors.accent.secondary,
  },
  chipDisabled: {
    opacity: 0.38,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mult: {
    color: theme.colors.text.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  labelActive: {
    color: theme.colors.accent.secondary,
  },
});

export const ConfidenceChips = React.memo(ConfidenceChipsBase);
