/**
 * Single source of truth for every screen. One module-level store behind
 * useGameStore, so progression survives screen changes and re-renders.
 *
 * persist()/hydrate() are the persistence seam. The RN dependency allowlist
 * forbids adding a native storage module, so the default backend is this
 * in-memory singleton; a real backend can be wired into the two functions
 * below without touching any screen.
 */
import {
  HISTORY_LENGTH,
  STARTING_POINTS,
  STARTING_TOKENS,
} from '../constants/config';
import { CLUBS } from './clubs';
import { dayKey } from './rng';
import { SlateScore } from './scoring';

export type OddsFormat = 'decimal' | 'percent';

export type Settings = {
  slateSize: number;
  oddsFormat: OddsFormat;
  reducedMotion: boolean;
  homeHint: boolean;
};

export type ModeKey = 'arena' | 'challenge' | 'daily';

export type ModeStat = {
  plays: number;
  points: number;
  correct: number;
  total: number;
};

export type GameState = {
  points: number;
  xp: number;
  tokens: number;
  slatesPlayed: number;
  correctPicks: number;
  totalPicks: number;
  bestChain: number;
  mastery: Record<number, number>;
  history: number[];
  modeStats: Record<ModeKey, ModeStat>;
  dailyLastPlayed: string | null;
  dailyStreak: number;
  dailyDots: number[];
  settings: Settings;
};

function emptyMode(): ModeStat {
  return { plays: 0, points: 0, correct: 0, total: 0 };
}

export function initialState(): GameState {
  const mastery: Record<number, number> = {};
  for (let i = 0; i < CLUBS.length; i++) {
    mastery[CLUBS[i].id] = 0;
  }
  return {
    points: STARTING_POINTS,
    xp: 0,
    tokens: STARTING_TOKENS,
    slatesPlayed: 0,
    correctPicks: 0,
    totalPicks: 0,
    bestChain: 0,
    mastery,
    history: [],
    modeStats: {
      arena: emptyMode(),
      challenge: emptyMode(),
      daily: emptyMode(),
    },
    dailyLastPlayed: null,
    dailyStreak: 0,
    dailyDots: [0, 0, 0, 0, 0, 0, 0],
    settings: {
      slateSize: 5,
      oddsFormat: 'decimal',
      reducedMotion: false,
      homeHint: true,
    },
  };
}

let state: GameState = initialState();
const listeners = new Set<() => void>();

/** Persistence seam — in-memory singleton backend (see the header note). */
let backup: GameState | null = null;

export function persist(): void {
  backup = state;
}

export function hydrate(): void {
  if (backup) {
    state = backup;
  }
}

export function getState(): GameState {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: GameState): void {
  state = next;
  persist();
  listeners.forEach(l => l());
}

export function setSettings(patch: Partial<Settings>): void {
  commit({ ...state, settings: { ...state.settings, ...patch } });
}

export function spendToken(): boolean {
  if (state.tokens <= 0) {
    return false;
  }
  commit({ ...state, tokens: state.tokens - 1 });
  return true;
}

export type AppliedResult = {
  unlockedClubIds: number[];
  tokensGained: number;
  xpGained: number;
};

/** Writes one finished slate into the store and reports what it unlocked. */
export function applySlateResult(
  score: SlateScore,
  clubIdsByFixture: Array<[number, number]>,
  mode: ModeKey,
): AppliedResult {
  const mastery: Record<number, number> = { ...state.mastery };
  const unlocked: number[] = [];

  for (let i = 0; i < score.rows.length; i++) {
    if (!score.rows[i].correct) {
      continue;
    }
    const pair = clubIdsByFixture[i];
    if (!pair) {
      continue;
    }
    for (let k = 0; k < pair.length; k++) {
      const id = pair[k];
      const before = mastery[id] || 0;
      mastery[id] = before + 1;
      if (before < 3 && mastery[id] >= 3) {
        unlocked.push(id);
      }
    }
  }

  const history = state.history.concat([score.accuracy]).slice(-HISTORY_LENGTH);
  const prevMode = state.modeStats[mode];

  commit({
    ...state,
    points: state.points + score.points,
    xp: state.xp + score.xp,
    tokens: state.tokens + score.tokens,
    slatesPlayed: state.slatesPlayed + 1,
    correctPicks: state.correctPicks + score.correct,
    totalPicks: state.totalPicks + score.total,
    bestChain: Math.max(state.bestChain, score.chain),
    mastery,
    history,
    modeStats: {
      ...state.modeStats,
      [mode]: {
        plays: prevMode.plays + 1,
        points: prevMode.points + score.points,
        correct: prevMode.correct + score.correct,
        total: prevMode.total + score.total,
      },
    },
  });

  return {
    unlockedClubIds: unlocked,
    tokensGained: score.tokens,
    xpGained: score.xp,
  };
}

export function markDailyPlayed(scored: boolean): void {
  const dots = state.dailyDots.slice(1).concat([scored ? 2 : 1]);
  commit({
    ...state,
    dailyLastPlayed: dayKey(),
    dailyStreak: scored ? state.dailyStreak + 1 : 0,
    dailyDots: dots,
  });
}

export function dailyAvailable(): boolean {
  return state.dailyLastPlayed !== dayKey();
}

export function resetProgress(): void {
  const fresh = initialState();
  fresh.settings = state.settings;
  commit(fresh);
}

export function lifetimeAccuracy(s: GameState): number {
  return s.totalPicks > 0 ? s.correctPicks / s.totalPicks : 0;
}
