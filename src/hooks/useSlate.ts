/**
 * Owns one arena/daily slate: the fixtures, the picks, the confidence budget
 * and the insight reveals.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  BASE_POINTS,
  CONFIDENCE_COST,
  CONFIDENCE_MULTIPLIER,
  ConfLevel,
  DAILY_CONFIDENCE_BUDGET,
  DAILY_SLATE_SIZE,
  budgetForSlate,
} from '../constants/config';
import { Outcome, oddsValue } from '../game/odds';
import { daySeed } from '../game/rng';
import { Pick } from '../game/scoring';
import { Slate, generateSlate, insightText } from '../game/slate';
import { getState, spendToken } from '../game/store';

export type SlateMode = 'arena' | 'daily';

function emptyPicks(n: number): Pick[] {
  const out: Pick[] = [];
  for (let i = 0; i < n; i++) {
    out.push({ outcome: null, confidence: 'LOW', insightUsed: false });
  }
  return out;
}

export type UseSlate = {
  slate: Slate;
  picks: Pick[];
  index: number;
  budget: number;
  budgetLeft: number;
  potential: number;
  pickedCount: number;
  setIndex: (i: number) => void;
  choose: (outcome: Outcome) => void;
  setConfidence: (level: ConfLevel) => void;
  useInsight: () => void;
  insightFor: (i: number) => string | null;
  next: () => void;
};

export function useSlate(mode: SlateMode): UseSlate {
  const size =
    mode === 'daily' ? DAILY_SLATE_SIZE : getState().settings.slateSize;
  const budget =
    mode === 'daily' ? DAILY_CONFIDENCE_BUDGET : budgetForSlate(size);

  const slate = useMemo<Slate>(() => {
    const base =
      mode === 'daily'
        ? daySeed()
        : Math.floor(Date.now() / 1000) + getState().slatesPlayed * 31;
    return generateSlate(base, size, getState().mastery);
  }, [mode, size]);

  const [picks, setPicks] = useState<Pick[]>(() => emptyPicks(size));
  const [index, setIndexState] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, string>>({});

  const spent = picks.reduce(
    (sum, p) => sum + (p.outcome ? CONFIDENCE_COST[p.confidence] : 0),
    0,
  );
  const budgetLeft = Math.max(0, budget - spent);
  const pickedCount = picks.filter(p => p.outcome !== null).length;

  const potential = useMemo(() => {
    let total = 0;
    for (let i = 0; i < slate.fixtures.length; i++) {
      const p = picks[i];
      if (!p || !p.outcome) {
        continue;
      }
      const odds = oddsValue(slate.fixtures[i].odds, p.outcome);
      total += Math.round(
        BASE_POINTS * odds * CONFIDENCE_MULTIPLIER[p.confidence],
      );
    }
    return total;
  }, [picks, slate]);

  const setIndex = useCallback(
    (i: number) => {
      setIndexState(Math.max(0, Math.min(slate.fixtures.length - 1, i)));
    },
    [slate.fixtures.length],
  );

  const choose = useCallback(
    (outcome: Outcome) => {
      setPicks(prev =>
        prev.map((p, i) =>
          i === index
            ? { ...p, outcome: p.outcome === outcome ? null : outcome }
            : p,
        ),
      );
    },
    [index],
  );

  const setConfidence = useCallback(
    (level: ConfLevel) => {
      setPicks(prev => {
        const current = prev[index];
        const others = prev.reduce(
          (sum, p, i) =>
            i === index || !p.outcome ? sum : sum + CONFIDENCE_COST[p.confidence],
          0,
        );
        if (others + CONFIDENCE_COST[level] > budget) {
          return prev;
        }
        const outcome = current.outcome;
        return prev.map((p, i) =>
          i === index
            ? {
                ...p,
                confidence: level,
                outcome: outcome,
              }
            : p,
        );
      });
    },
    [index, budget],
  );

  const useInsight = useCallback(() => {
    const fixture = slate.fixtures[index];
    if (!fixture || revealed[index] !== undefined) {
      return;
    }
    if (!spendToken()) {
      return;
    }
    const text = insightText(fixture);
    setRevealed(prev => ({ ...prev, [index]: text }));
    setPicks(prev =>
      prev.map((p, i) => (i === index ? { ...p, insightUsed: true } : p)),
    );
  }, [index, revealed, slate.fixtures]);

  const insightFor = useCallback(
    (i: number) => (revealed[i] === undefined ? null : revealed[i]),
    [revealed],
  );

  const next = useCallback(() => {
    setIndexState(prev => (prev + 1) % slate.fixtures.length);
  }, [slate.fixtures.length]);

  return {
    slate,
    picks,
    index,
    budget,
    budgetLeft,
    potential,
    pickedCount,
    setIndex,
    choose,
    setConfidence,
    useInsight,
    insightFor,
    next,
  };
}
