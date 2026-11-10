/**
 * Challenge — a 90 second rapid-fire session. One fixture at a time, no
 * confidence budget, no insights. Correct: +3 s. Wrong: -5 s and a strike.
 * The session ends on the clock or on the third strike (inside a second of
 * the bad input), and always lands on the Result screen.
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame, Play } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { FixtureCard } from '../components/FixtureCard';
import { IconRoundButton } from '../components/IconRoundButton';
import { OutcomePicker } from '../components/OutcomePicker';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TimerBar } from '../components/TimerBar';
import {
  CHALLENGE_BASE_POINTS,
  CHALLENGE_CORRECT_BONUS_S,
  CHALLENGE_DURATION_S,
  CHALLENGE_MAX_STRIKES,
  CHALLENGE_WRONG_PENALTY_S,
} from '../constants/config';
import {
  BOARD_CONTENT_W,
  CONTENT_W,
  HEADER_TOTAL,
  H_PADDING,
  PICK_GAP,
  PICK_W,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { formatPoints, oddsValue } from '../game/odds';
import type { Outcome } from '../game/odds';
import type { GameResult } from '../game/result';
import { chainBonus, longestChain } from '../game/scoring';
import type { Pick, PickOutcomeRow, SlateScore } from '../game/scoring';
import { generateSlate } from '../game/slate';
import type { Fixture } from '../game/slate';
import { mulberry32 } from '../game/rng';
import { sampleOutcome, scorelineFor } from '../game/simulate';
import type { MatchResult } from '../game/simulate';
import { applySlateResult, getState } from '../game/store';
import { formatClock, useCountdown } from '../hooks/useCountdown';
import { useGameStore } from '../hooks/useGameStore';

type Props = {
  onGameOver: (result: GameResult) => void;
  onMenu: () => void;
};

const POOL = 6;

export default function ChallengeScreen({ onGameOver, onMenu }: Props) {
  const oddsFormat = useGameStore(s => s.settings.oddsFormat);
  const homeHint = useGameStore(s => s.settings.homeHint);

  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [points, setPoints] = useState(0);

  const baseRef = useRef(Math.floor(Date.now() / 1000));
  const rowsRef = useRef<PickOutcomeRow[]>([]);
  const resultsRef = useRef<MatchResult[]>([]);
  const playedRef = useRef<Fixture[]>([]);
  const endedRef = useRef(false);
  const rngRef = useRef(mulberry32(baseRef.current ^ 0x5bf03635));

  const pool = useMemo(
    () => generateSlate(baseRef.current, POOL, getState().mastery),
    [],
  );
  const extraPool = useMemo(
    () => generateSlate(baseRef.current + 977, POOL, getState().mastery),
    [],
  );

  const deck = useMemo(
    () => pool.fixtures.concat(extraPool.fixtures),
    [pool, extraPool],
  );

  const fixture = deck[cursor % deck.length];

  const finish = useCallback(
    (reason: string) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;

      const rows = rowsRef.current;
      const flags = rows.map(r => r.correct);
      const chain = longestChain(flags);
      const bonus = chainBonus(chain);
      const raw = rows.reduce((sum, r) => sum + r.points, 0);
      const total = rows.length;
      const correct = flags.filter(Boolean).length;
      const finalPoints = Math.round(raw * bonus);
      const accuracy = total > 0 ? correct / total : 0;

      const score: SlateScore = {
        rows,
        correct,
        total,
        chain,
        bonus,
        rawPoints: raw,
        points: finalPoints,
        xp: Math.round(finalPoints / 10),
        tokens: total > 0 && accuracy >= 0.8 ? 2 : 1,
        accuracy,
      };

      const pairs = playedRef.current.map(
        f => [f.home.club.id, f.away.club.id] as [number, number],
      );
      const applied = applySlateResult(score, pairs, 'challenge');

      onGameOver({
        mode: 'challenge',
        score,
        fixtures: playedRef.current,
        results: resultsRef.current,
        unlockedClubIds: applied.unlockedClubIds,
        tokensGained: applied.tokensGained,
        xpGained: applied.xpGained,
        usedFallback: pool.fallback,
        calls: total,
        endReason: reason,
      });
    },
    [onGameOver, pool.fallback],
  );

  const onExpire = useCallback(() => {
    finish('TIME');
  }, [finish]);

  const clock = useCountdown(CHALLENGE_DURATION_S, onExpire);

  const start = useCallback(() => {
    setStarted(true);
    clock.start();
  }, [clock]);

  const call = useCallback(
    (outcome: Outcome) => {
      if (!started || endedRef.current) {
        return;
      }
      const rng = rngRef.current;
      const actual = sampleOutcome(rng, fixture);
      const goals = scorelineFor(rng, actual);
      const correct = actual === outcome;
      const odds = oddsValue(fixture.odds, outcome);
      const gained = correct
        ? Math.round(CHALLENGE_BASE_POINTS * odds)
        : 0;

      const pick: Pick = {
        outcome,
        confidence: 'LOW',
        insightUsed: false,
      };
      rowsRef.current = rowsRef.current.concat([
        {
          fixtureId: fixture.id,
          picked: pick.outcome as Outcome,
          actual,
          correct,
          odds,
          confidence: 'LOW',
          points: gained,
          homeGoals: goals[0],
          awayGoals: goals[1],
        },
      ]);
      resultsRef.current = resultsRef.current.concat([
        {
          fixtureId: fixture.id,
          outcome: actual,
          homeGoals: goals[0],
          awayGoals: goals[1],
        },
      ]);
      playedRef.current = playedRef.current.concat([fixture]);

      setPoints(p => p + gained);
      setCursor(c => c + 1);

      if (correct) {
        setStreak(s => s + 1);
        clock.add(CHALLENGE_CORRECT_BONUS_S);
      } else {
        setStreak(0);
        clock.add(-CHALLENGE_WRONG_PENALTY_S);
        const nextStrikes = strikes + 1;
        setStrikes(nextStrikes);
        if (nextStrikes >= CHALLENGE_MAX_STRIKES) {
          clock.stop();
          finish('STRIKES');
        }
      }
    },
    [started, fixture, clock, strikes, finish],
  );

  const strikeText = useMemo(() => {
    let out = '';
    for (let i = 0; i < CHALLENGE_MAX_STRIKES; i++) {
      out += i < strikes ? 'X' : '-';
      if (i < CHALLENGE_MAX_STRIKES - 1) {
        out += ' ';
      }
    }
    return out;
  }, [strikes]);

  const low = clock.remaining <= 15;

  return (
    <AppShell variant="hub" blobTop={HEADER_TOTAL} blobColor="rgba(255,176,32,0.10)">
      <ScreenHeader
        title="CHALLENGE"
        leftWidth={56}
        rightWidth={110}
        leftSlot={
          <IconRoundButton
            icon={assets.iconHome}
            onPress={onMenu}
            accessibilityLabel="HOME"
          />
        }
        centerSlot={
          <View style={styles.center}>
            <Text
              style={[
                styles.clock,
                low ? { color: theme.colors.accent.danger } : null,
              ]}>
              {formatClock(clock.remaining)}
            </Text>
            <Text style={styles.strikes}>{strikeText}</Text>
          </View>
        }
        rightSlot={
          <View style={styles.streakPill}>
            <Flame size={16} strokeWidth={1.5} color="#FFB020" />
            <Text style={styles.streakText}>{'STREAK ' + streak}</Text>
          </View>
        }
      />

      <View style={styles.barWrap}>
        <TimerBar
          remaining={clock.remaining}
          total={CHALLENGE_DURATION_S}
          width={CONTENT_W}
        />
      </View>

      <View style={styles.board}>
        <View style={started ? null : styles.dimmed}>
          <FixtureCard
            fixture={fixture}
            insight={null}
            tokens={0}
            onInsight={() => {}}
            homeHint={homeHint}
            compact
          />
          <View style={styles.pickerWrap}>
            <OutcomePicker
              odds={fixture.odds}
              prob={fixture.prob}
              value={null}
              onChange={call}
              format={oddsFormat}
              pickWidth={PICK_W}
              gap={PICK_GAP}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.scoreLine}>
          {'SESSION POINTS  ' + formatPoints(points)}
        </Text>
        {started ? (
          <Text style={styles.hint} numberOfLines={1}>
            CALL EVERY FIXTURE · RIGHT +3s · WRONG -5s
          </Text>
        ) : (
          <>
            <Text style={styles.hint} numberOfLines={1}>
              90 SECONDS · 3 STRIKES · NO BUDGET
            </Text>
            <PrimaryButton
              label="START SESSION"
              Icon={Play}
              onPress={start}
              width={CONTENT_W}
              height={56}
            />
          </>
        )}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  clock: {
    color: theme.colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  strikes: {
    marginTop: 2,
    color: theme.colors.accent.danger,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  streakPill: {
    height: 34,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 17,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.28)',
  },
  streakText: {
    color: theme.colors.accent.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  barWrap: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 6,
  },
  board: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PADDING,
  },
  dimmed: {
    opacity: 0.45,
  },
  pickerWrap: {
    width: BOARD_CONTENT_W,
    alignSelf: 'center',
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  scoreLine: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});
