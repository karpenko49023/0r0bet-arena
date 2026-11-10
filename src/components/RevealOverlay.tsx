/**
 * The LIVE sequence. Rows flip in one at a time; input is blocked while it
 * runs and the busy flag is reset by the completion callback in useReveal.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { crestFor } from '../assets';
import { CONTENT_W, SCREEN_H, SCREEN_W } from '../constants/layout';
import { theme } from '../constants/theme';
import type { Fixture } from '../game/slate';
import type { MatchResult } from '../game/simulate';
import { formatPoints } from '../game/odds';
import type { PickOutcomeRow } from '../game/scoring';
import { useReveal } from '../hooks/useReveal';

type Props = {
  fixtures: Fixture[];
  results: MatchResult[];
  rows: PickOutcomeRow[];
  stepMs: number;
  onDone: () => void;
};

function Row({
  fixture,
  row,
  visible,
}: {
  fixture: Fixture;
  row: PickOutcomeRow;
  visible: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const rotateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.row,
        { opacity: anim, transform: [{ perspective: 600 }, { rotateX }] },
      ]}>
      <Image
        source={crestFor(fixture.home.club.crest)}
        style={styles.crest}
        resizeMode="contain"
      />
      <View style={styles.rowText}>
        <Text style={styles.score} numberOfLines={1}>
          {fixture.home.club.short +
            '  ' +
            row.homeGoals +
            ' - ' +
            row.awayGoals +
            '  ' +
            fixture.away.club.short}
        </Text>
        <Text style={styles.pickTag} numberOfLines={1}>
          {'YOUR CALL: ' + row.picked + ' · ' + row.confidence}
        </Text>
      </View>
      <Image
        source={crestFor(fixture.away.club.crest)}
        style={styles.crest}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.payout,
          { color: row.correct ? '#17E08C' : '#FF5A6E' },
        ]}>
        {row.correct ? '+' + formatPoints(row.points) : '+0'}
      </Text>
    </Animated.View>
  );
}

function RevealOverlayBase({
  fixtures,
  results,
  rows,
  stepMs,
  onDone,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const { shown, start } = useReveal(fixtures.length, stepMs, onDone);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
    start();
  }, [fade, start]);

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <Text style={styles.title}>LIVE FROM THE ARENA</Text>
      <Text style={styles.sub}>RESULTS COMING IN</Text>
      <View style={styles.list}>
        {fixtures.map((f, i) => (
          <Row
            key={f.id}
            fixture={f}
            row={rows[i]}
            visible={i < shown}
          />
        ))}
      </View>
      <Text style={styles.footer}>
        {results.length + ' FIXTURES · SEEDED SIMULATION'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: 'rgba(9,9,12,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sub: {
    marginTop: 6,
    marginBottom: 20,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
  },
  list: {
    width: CONTENT_W,
    gap: 8,
  },
  row: {
    width: CONTENT_W,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
    borderRadius: 14,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  crest: {
    width: 26,
    height: 26,
  },
  rowText: {
    flex: 1,
  },
  score: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  pickTag: {
    marginTop: 2,
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },
  payout: {
    width: 62,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    marginTop: 22,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
});

export const RevealOverlay = React.memo(RevealOverlayBase);
