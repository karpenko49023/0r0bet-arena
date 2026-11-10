/**
 * Scoring: per-pick payout, chain bonus for consecutive correct reads,
 * XP and insight tokens. Fictional arena points only.
 */
import {
  BASE_POINTS,
  CONFIDENCE_MULTIPLIER,
  ConfLevel,
} from '../constants/config';
import { Outcome, oddsValue } from './odds';
import { Fixture } from './slate';
import { MatchResult } from './simulate';

export type Pick = {
  outcome: Outcome | null;
  confidence: ConfLevel;
  insightUsed: boolean;
};

export type PickOutcomeRow = {
  fixtureId: number;
  picked: Outcome;
  actual: Outcome;
  correct: boolean;
  points: number;
  odds: number;
  confidence: ConfLevel;
  homeGoals: number;
  awayGoals: number;
};

export type SlateScore = {
  rows: PickOutcomeRow[];
  correct: number;
  total: number;
  chain: number;
  bonus: number;
  rawPoints: number;
  points: number;
  xp: number;
  tokens: number;
  accuracy: number;
};

export function effectivePick(pick: Pick, f: Fixture): Outcome {
  return pick.outcome ? pick.outcome : f.favourite;
}

export function perPickPoints(
  correct: boolean,
  odds: number,
  confidence: ConfLevel,
): number {
  if (!correct) {
    return 0;
  }
  return Math.round(BASE_POINTS * odds * CONFIDENCE_MULTIPLIER[confidence]);
}

export function longestChain(flags: boolean[]): number {
  let best = 0;
  let run = 0;
  for (let i = 0; i < flags.length; i++) {
    if (flags[i]) {
      run += 1;
      if (run > best) {
        best = run;
      }
    } else {
      run = 0;
    }
  }
  return best;
}

export function chainBonus(chain: number): number {
  if (chain >= 5) {
    return 2;
  }
  if (chain === 4) {
    return 1.5;
  }
  if (chain === 3) {
    return 1.25;
  }
  return 1;
}

export function scoreSlate(
  fixtures: Fixture[],
  picks: Pick[],
  results: MatchResult[],
): SlateScore {
  const rows: PickOutcomeRow[] = [];
  const flags: boolean[] = [];

  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    const pick = picks[i];
    const res = results[i];
    const picked = effectivePick(pick, f);
    const correct = picked === res.outcome;
    const odds = oddsValue(f.odds, picked);
    flags.push(correct);
    rows.push({
      fixtureId: f.id,
      picked,
      actual: res.outcome,
      correct,
      odds,
      confidence: pick.confidence,
      points: perPickPoints(correct, odds, pick.confidence),
      homeGoals: res.homeGoals,
      awayGoals: res.awayGoals,
    });
  }

  const correct = flags.filter(Boolean).length;
  const total = fixtures.length;
  const chain = longestChain(flags);
  const bonus = chainBonus(chain);
  const rawPoints = rows.reduce((sum, r) => sum + r.points, 0);
  const points = Math.round(rawPoints * bonus);
  const accuracy = total > 0 ? correct / total : 0;

  return {
    rows,
    correct,
    total,
    chain,
    bonus,
    rawPoints,
    points,
    xp: Math.round(points / 10),
    tokens: 1 + (accuracy >= 0.8 ? 1 : 0),
    accuracy,
  };
}

export type Verdict = { title: string; color: string };

const GREEN = '#17E08C';
const AMBER = '#FFB020';
const RED = '#FF5A6E';

/** Result wording in the game's own words — never "You win" / "Game over". */
export function verdictFor(correct: number, total: number): Verdict {
  const ratio = total > 0 ? correct / total : 0;
  const head = correct + '/' + total + ' ';
  if (ratio === 1) {
    return { title: head + 'PERFECT SLATE', color: GREEN };
  }
  if (ratio >= 0.75) {
    return { title: head + 'SHARP READ', color: GREEN };
  }
  if (ratio >= 0.5) {
    return { title: head + 'EDGE FOUND', color: AMBER };
  }
  if (ratio >= 0.34) {
    return { title: head + 'COLD STREAK', color: AMBER };
  }
  if (correct > 0) {
    return { title: head + 'OFF THE PACE', color: RED };
  }
  return { title: head + 'SHUT OUT', color: RED };
}

export function challengeVerdict(calls: number): Verdict {
  if (calls >= 12) {
    return { title: 'ARENA SWEEP · ' + calls + ' CALLS', color: GREEN };
  }
  if (calls >= 6) {
    return { title: 'SESSION OVER · ' + calls + ' CALLS', color: AMBER };
  }
  return { title: 'WHISTLE BLOWN · ' + calls + ' CALLS', color: RED };
}
