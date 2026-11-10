/**
 * Result / game-over screen. Reached from the Arena, the Daily slate and the
 * Challenge session. Never a dead end: PLAY AGAIN and MENU are always live.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Layers, RotateCcw, TrendingUp } from 'lucide-react-native';
import { crestFor } from '../assets';
import { AccuracyRing } from '../components/AccuracyRing';
import { AppShell } from '../components/AppShell';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import {
  CONTENT_W,
  H_PADDING,
  RESULT_MAX_ROWS,
  RING_SIZE,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { clubById } from '../game/clubs';
import { formatPoints } from '../game/odds';
import type { GameResult } from '../game/result';
import { challengeVerdict, verdictFor } from '../game/scoring';
import { useGameStore } from '../hooks/useGameStore';

type Props = {
  result: GameResult;
  onAgain: () => void;
  onMenu: () => void;
  onProgress: () => void;
  onCollection: () => void;
};

function Counter({ value, instant }: { value: number; instant: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(instant ? value : 0);

  useEffect(() => {
    const id = anim.addListener(e => setShown(Math.round(e.value)));
    Animated.timing(anim, {
      toValue: value,
      duration: instant ? 0 : 700,
      useNativeDriver: false,
    }).start();
    return () => {
      anim.removeListener(id);
    };
  }, [anim, value, instant]);

  return <Text style={styles.counter}>{'+' + formatPoints(shown)}</Text>;
}

export default function ResultScreen({
  result,
  onAgain,
  onMenu,
  onProgress,
  onCollection,
}: Props) {
  const reducedMotion = useGameStore(s => s.settings.reducedMotion);
  const { score, fixtures, mode } = result;

  const verdict =
    mode === 'challenge'
      ? challengeVerdict(result.calls ? result.calls : score.total)
      : verdictFor(score.correct, score.total);

  const badgeScale = useRef(new Animated.Value(0.6)).current;
  const showChain = score.chain >= 3;

  useEffect(() => {
    if (!showChain) {
      return;
    }
    Animated.spring(badgeScale, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [badgeScale, showChain]);

  const unlockedName =
    result.unlockedClubIds.length > 0
      ? clubById(result.unlockedClubIds[0]).name
      : null;

  const rewards: Array<{ key: string; text: string; color: string }> = [];
  if (result.tokensGained > 0) {
    rewards.push({
      key: 'tokens',
      text: '+' + result.tokensGained + ' INSIGHT',
      color: '#FFB020',
    });
  }
  if (result.xpGained > 0) {
    rewards.push({
      key: 'xp',
      text: '+' + formatPoints(result.xpGained) + ' XP',
      color: '#17E08C',
    });
  }
  if (unlockedName) {
    rewards.push({
      key: 'club',
      text: 'CLUB UNLOCKED: ' + unlockedName,
      color: '#17E08C',
    });
  }

  const rows = score.rows.slice(0, RESULT_MAX_ROWS);
  const extraRows = score.rows.length - rows.length;
  const hasUnlock = result.unlockedClubIds.length > 0;
  const btnCount = hasUnlock ? 3 : 2;
  const btnW = Math.floor((CONTENT_W - 10 * (btnCount - 1)) / btnCount);

  const modeLabel =
    mode === 'challenge'
      ? 'CHALLENGE SESSION'
      : mode === 'daily'
      ? 'DAILY SLATE LOGGED'
      : 'ARENA SLATE';

  return (
    <AppShell
      variant="result"
      blobColor={verdict.color + '1F'}
      blobTop={90}>
      <ScreenHeader title="RESULT" subtitle={modeLabel} />

      <View style={styles.body}>
        <Text style={[styles.verdict, { color: verdict.color }]} numberOfLines={2}>
          {verdict.title}
        </Text>

        <View style={styles.ringWrap}>
          <AccuracyRing
            correct={score.correct}
            total={score.total}
            color={verdict.color}
            size={RING_SIZE}
            instant={reducedMotion}
          />
        </View>

        <Counter value={score.points} instant={reducedMotion} />
        <Text style={styles.counterLabel}>ARENA POINTS EARNED</Text>

        {showChain ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.chainBadge, { transform: [{ scale: badgeScale }] }]}>
            <Text style={styles.chainText}>
              {'CHAIN x' + score.bonus + ' · ' + score.chain + ' IN A ROW'}
            </Text>
          </Animated.View>
        ) : null}

        <View style={styles.rows}>
          {rows.map((row, i) => {
            const f = fixtures[i];
            return (
              <View key={row.fixtureId} style={styles.row}>
                <Image
                  source={crestFor(f.home.club.crest)}
                  style={styles.rowCrest}
                  resizeMode="contain"
                />
                <Text style={styles.rowScore} numberOfLines={1}>
                  {f.home.club.short +
                    ' ' +
                    row.homeGoals +
                    ' - ' +
                    row.awayGoals +
                    ' ' +
                    f.away.club.short}
                </Text>
                <Text style={styles.rowPick} numberOfLines={1}>
                  {row.picked}
                </Text>
                <Text
                  style={[
                    styles.rowPoints,
                    { color: row.correct ? '#17E08C' : '#FF5A6E' },
                  ]}>
                  {row.correct ? '+' + formatPoints(row.points) : 'MISS'}
                </Text>
              </View>
            );
          })}
          {extraRows > 0 ? (
            <Text style={styles.more}>{'+' + extraRows + ' MORE CALLS'}</Text>
          ) : null}
        </View>

        {rewards.length >= 2 ? (
          <View style={styles.rewardRow}>
            {rewards.map(r => (
              <View
                key={r.key}
                style={[styles.rewardPill, { borderColor: r.color + '55' }]}>
                <Text style={[styles.rewardText, { color: r.color }]} numberOfLines={1}>
                  {r.text}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.ctas}>
        <PrimaryButton
          label="PLAY AGAIN"
          Icon={RotateCcw}
          onPress={onAgain}
          width={CONTENT_W}
          height={56}
        />
        <View style={styles.ctaRow}>
          <SecondaryButton label="MENU" onPress={onMenu} width={btnW} height={48} />
          <SecondaryButton
            label="PROGRESS"
            Icon={TrendingUp}
            onPress={onProgress}
            width={btnW}
            height={48}
          />
          {hasUnlock ? (
            <SecondaryButton
              label="COLLECTION"
              Icon={Layers}
              onPress={onCollection}
              width={btnW}
              height={48}
            />
          ) : null}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
  },
  verdict: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  ringWrap: {
    marginTop: 10,
  },
  counter: {
    marginTop: 8,
    color: theme.colors.text.primary,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  counterLabel: {
    marginTop: 2,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
  chainBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    height: 28,
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,176,32,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.4)',
  },
  chainText: {
    color: theme.colors.accent.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  rows: {
    width: CONTENT_W,
    marginTop: 12,
    gap: 6,
  },
  row: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(24,24,28,0.82)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  rowCrest: {
    width: 20,
    height: 20,
  },
  rowScore: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  rowPick: {
    width: 42,
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  rowPoints: {
    width: 56,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  more: {
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  rewardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  rewardPill: {
    height: 28,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(24,24,28,0.8)',
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  ctas: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
    gap: 10,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
