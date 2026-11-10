/**
 * The forecast arena — G3 split panel. One fixture at a time on top, the
 * confidence controls fixed at the bottom. Every tap changes the frame.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { ConfidenceChips } from '../components/ConfidenceChips';
import { ConfirmOverlay } from '../components/ConfirmOverlay';
import { FixtureCard } from '../components/FixtureCard';
import { IconRoundButton } from '../components/IconRoundButton';
import { OutcomePicker } from '../components/OutcomePicker';
import { PrimaryButton } from '../components/PrimaryButton';
import { RevealOverlay } from '../components/RevealOverlay';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatStrip } from '../components/StatStrip';
import {
  CONFIDENCE_COST,
  REVEAL_STEP_MS,
  REVEAL_STEP_MS_REDUCED,
} from '../constants/config';
import {
  BOARD_CONTENT_W,
  CHIP_GAP,
  DENSE,
  CONTENT_W,
  HEADER_TOTAL,
  H_PADDING,
  PICK_GAP,
  PICK_W,
  SECONDARY_W,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { formatPoints } from '../game/odds';
import type { Outcome } from '../game/odds';
import type { GameResult } from '../game/result';
import { effectivePick, scoreSlate } from '../game/scoring';
import type { MatchResult } from '../game/simulate';
import { resolveSlate } from '../game/simulate';
import { applySlateResult, markDailyPlayed } from '../game/store';
import { useGameStore } from '../hooks/useGameStore';
import { useSlate } from '../hooks/useSlate';

const GO_LIVE_W = CONTENT_W - SECONDARY_W - 10;

type Props = {
  mode: 'arena' | 'daily';
  onGameOver: (result: GameResult) => void;
  onMenu: () => void;
};

export default function GameScreen({ mode, onGameOver, onMenu }: Props) {
  const slateState = useSlate(mode);
  const tokens = useGameStore(s => s.tokens);
  const oddsFormat = useGameStore(s => s.settings.oddsFormat);
  const homeHint = useGameStore(s => s.settings.homeHint);
  const reducedMotion = useGameStore(s => s.settings.reducedMotion);

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const resultRef = useRef<GameResult | null>(null);

  const { slate, picks, index, budget, budgetLeft, potential } = slateState;
  const fixture = slate.fixtures[index];
  const pick = picks[index];

  const pulse = useRef(new Animated.Value(1)).current;

  const affordable = useMemo(() => {
    const others = picks.reduce(
      (sum, p, i) =>
        i === index || !p.outcome ? sum : sum + CONFIDENCE_COST[p.confidence],
      0,
    );
    return budget - others;
  }, [picks, index, budget]);

  const onPick = useCallback(
    (o: Outcome) => {
      slateState.choose(o);
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 110,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [slateState, pulse],
  );

  const goLive = useCallback(() => {
    if (revealing) {
      return;
    }
    const resolved = resolveSlate(slate.seed, slate.fixtures);
    const score = scoreSlate(slate.fixtures, picks, resolved);
    const clubPairs = slate.fixtures.map(
      f => [f.home.club.id, f.away.club.id] as [number, number],
    );
    const applied = applySlateResult(score, clubPairs, mode);
    if (mode === 'daily') {
      markDailyPlayed(score.correct > 0);
    }
    resultRef.current = {
      mode,
      score,
      fixtures: slate.fixtures,
      results: resolved,
      unlockedClubIds: applied.unlockedClubIds,
      tokensGained: applied.tokensGained,
      xpGained: applied.xpGained,
      usedFallback: slate.fallback,
    };
    setResults(resolved);
    setRevealing(true);
  }, [revealing, slate, picks, mode]);

  const finishReveal = useCallback(() => {
    const payload = resultRef.current;
    setRevealing(false);
    if (payload) {
      onGameOver(payload);
    }
  }, [onGameOver]);

  const rows = useMemo(() => {
    if (!results) {
      return [];
    }
    return scoreSlate(slate.fixtures, picks, results).rows;
  }, [results, slate.fixtures, picks]);

  const pickedLabel = effectivePick(pick, fixture);

  return (
    <AppShell variant="game" blobTop={HEADER_TOTAL} blobColor="rgba(23,224,140,0.08)">
      <ScreenHeader
        title=""
        leftWidth={56}
        rightWidth={56}
        leftSlot={
          <IconRoundButton
            icon={assets.iconHome}
            onPress={() => setLeaveOpen(true)}
            accessibilityLabel="HOME"
          />
        }
        rightSlot={
          <IconRoundButton
            icon={assets.iconPause}
            onPress={() => setLeaveOpen(true)}
            accessibilityLabel="PAUSE"
          />
        }
        centerSlot={
          <View style={styles.headerCenter}>
            <Text style={styles.matchLabel}>
              {'MATCH ' + (index + 1) + ' / ' + slate.fixtures.length}
            </Text>
            <View style={styles.pips}>
              {slate.fixtures.map((f, i) => (
                <View
                  key={f.id}
                  style={[
                    styles.pip,
                    i === index
                      ? styles.pipCurrent
                      : picks[i].outcome
                      ? styles.pipPicked
                      : null,
                  ]}
                />
              ))}
            </View>
          </View>
        }
      />

      <View style={styles.board}>
        {slate.fallback ? (
          <Text style={styles.fallbackNote}>USING BACKUP FIXTURES</Text>
        ) : null}

        <FixtureCard
          fixture={fixture}
          insight={slateState.insightFor(index)}
          tokens={tokens}
          onInsight={slateState.useInsight}
          homeHint={homeHint}
          compact={DENSE}
        />

        <View style={styles.pickerWrap}>
          <OutcomePicker
            odds={fixture.odds}
            prob={fixture.prob}
            value={pick.outcome}
            onChange={onPick}
            format={oddsFormat}
            pickWidth={PICK_W}
            gap={PICK_GAP}
          />
        </View>
      </View>

      <View style={styles.controls}>
        <StatStrip
          cells={[
            { label: 'BUDGET', value: budgetLeft + ' / ' + budget },
            {
              label: 'PICKS',
              value: slateState.pickedCount + ' / ' + slate.fixtures.length,
              tone: theme.colors.accent.primary,
            },
            {
              label: 'POTENTIAL',
              value: formatPoints(potential),
              tone: theme.colors.accent.secondary,
            },
          ]}
        />

        <View style={styles.chipsWrap}>
          <ConfidenceChips
            value={pick.confidence}
            onChange={slateState.setConfidence}
            affordable={affordable}
            chipWidth={Math.floor((CONTENT_W - 2 * CHIP_GAP) / 3)}
            gap={CHIP_GAP}
          />
        </View>

        <Text style={styles.caption} numberOfLines={1}>
          {'LOCK THE SLATE AND KICK OFF · ' + pickedLabel + ' ON THIS MATCH'}
        </Text>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.actionRow, { transform: [{ scale: pulse }] }]}>
          <SecondaryButton
            label="NEXT"
            onPress={slateState.next}
            width={SECONDARY_W}
            height={56}
          />
          <PrimaryButton
            label="GO LIVE"
            Icon={Zap}
            onPress={goLive}
            width={GO_LIVE_W}
            height={56}
          />
        </Animated.View>
      </View>

      {revealing && results ? (
        <RevealOverlay
          fixtures={slate.fixtures}
          results={results}
          rows={rows}
          stepMs={reducedMotion ? REVEAL_STEP_MS_REDUCED : REVEAL_STEP_MS}
          onDone={finishReveal}
        />
      ) : null}

      {leaveOpen ? (
        <ConfirmOverlay
          title="LEAVE ARENA?"
          body="The slate is not locked yet. Leaving drops these fixtures and keeps your points as they are."
          confirmLabel="LEAVE"
          cancelLabel="KEEP PLAYING"
          onConfirm={onMenu}
          onCancel={() => setLeaveOpen(false)}
          danger
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerCenter: {
    alignItems: 'center',
  },
  matchLabel: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  pips: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A2A33',
  },
  pipPicked: {
    backgroundColor: '#17E08C',
  },
  pipCurrent: {
    backgroundColor: '#FFB020',
  },
  board: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
  },
  fallbackNote: {
    marginBottom: 8,
    color: theme.colors.accent.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  pickerWrap: {
    width: BOARD_CONTENT_W,
    marginTop: 12,
  },
  controls: {
    paddingHorizontal: H_PADDING,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#15151A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  chipsWrap: {
    marginTop: 10,
  },
  caption: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
