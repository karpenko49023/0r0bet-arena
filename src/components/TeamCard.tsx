/**
 * One side of a fixture: crest, name, last-5 strip, the three indicator bars
 * and momentum. The crest is always drawn with resizeMode contain.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { crestFor } from '../assets';
import { theme } from '../constants/theme';
import type { ResultLetter } from '../game/clubs';
import type { Ratings } from '../game/odds';
import type { SideView } from '../game/slate';
import { IndicatorBar } from './IndicatorBar';

const RESULT_COLORS: Record<ResultLetter, string> = {
  W: '#17E08C',
  D: '#FFB020',
  L: '#FF5A6E',
};

type Props = {
  side: SideView;
  other: Ratings;
  isHome: boolean;
  width: number;
  compact?: boolean;
  showHomeTag?: boolean;
};

function TeamCardBase({
  side,
  other,
  isHome,
  width,
  compact = false,
  showHomeTag = true,
}: Props) {
  const r = side.ratings;
  const crestSize = compact ? 52 : 64;
  const momentumColor =
    r.momentum > 0
      ? theme.colors.accent.primary
      : r.momentum < 0
      ? theme.colors.accent.danger
      : theme.colors.text.muted;
  const momentumText = (r.momentum > 0 ? '+' : '') + r.momentum;

  return (
    <View style={[styles.root, { width }]}>
      <View
        style={[
          styles.crestRing,
          {
            width: crestSize + 10,
            height: crestSize + 10,
            borderRadius: (crestSize + 10) / 2,
            borderColor: side.club.tint,
            backgroundColor: side.club.tint + '14',
          },
        ]}>
        <Image
          source={crestFor(side.club.crest)}
          style={{ width: crestSize, height: crestSize }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {side.club.name}
      </Text>

      <View style={styles.formStrip}>
        {side.club.last5.map((letter, i) => (
          <View
            key={i}
            style={[styles.formBar, { backgroundColor: RESULT_COLORS[letter] }]}
          />
        ))}
      </View>

      {isHome && showHomeTag ? (
        <Text style={styles.homeTag}>HOME +6</Text>
      ) : null}

      {compact ? (
        <IndicatorBar
          label="EDGE"
          value={(r.att + r.def + r.form) / 3}
          stronger={
            (r.att + r.def + r.form) / 3 >
            (other.att + other.def + other.form) / 3
          }
          width={width}
        />
      ) : (
        <View style={styles.bars}>
          <IndicatorBar
            label="ATT"
            value={r.att}
            stronger={r.att > other.att}
            width={width}
          />
          <IndicatorBar
            label="DEF"
            value={r.def}
            stronger={r.def > other.def}
            width={width}
          />
          <IndicatorBar
            label="FORM"
            value={r.form}
            stronger={r.form > other.form}
            width={width}
          />
        </View>
      )}

      <View style={styles.momentumRow}>
        <Text style={styles.momentumLabel}>MOMENTUM</Text>
        <Text style={[styles.momentumValue, { color: momentumColor }]}>
          {momentumText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  crestRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  name: {
    marginTop: 8,
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  formStrip: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 7,
    marginBottom: 7,
  },
  formBar: {
    width: 14,
    height: 6,
    borderRadius: 3,
  },
  homeTag: {
    color: theme.colors.accent.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  bars: {
    width: '100%',
    alignItems: 'center',
  },
  momentumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  momentumLabel: {
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  momentumValue: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export const TeamCard = React.memo(TeamCardBase);
