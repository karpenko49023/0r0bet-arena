/**
 * OROBET ARENA — tuning constants.
 * Rule #13 / CLAUDE-game-common 2.1: LOADER_DURATION_MS is EXACTLY 8000 ms.
 */

export const LOADER_DURATION_MS = 8000;

export const SLATE_SIZE_DEFAULT = 5;
export const DAILY_SLATE_SIZE = 3;

export const CONFIDENCE_BUDGET = 7;
export const DAILY_CONFIDENCE_BUDGET = 4;

export type ConfLevel = 'LOW' | 'MED' | 'HIGH';

export const CONFIDENCE_LEVELS: ConfLevel[] = ['LOW', 'MED', 'HIGH'];

export const CONFIDENCE_COST: Record<ConfLevel, number> = {
  LOW: 1,
  MED: 2,
  HIGH: 3,
};

export const CONFIDENCE_MULTIPLIER: Record<ConfLevel, number> = {
  LOW: 1,
  MED: 2,
  HIGH: 3,
};

export const BASE_POINTS = 100;
export const HOME_BONUS = 6;
export const ODDS_SLOPE = 0.011;
export const MARGIN = 0.92;

export const REVEAL_STEP_MS = 420;
export const REVEAL_STEP_MS_REDUCED = 120;

export const CHALLENGE_DURATION_S = 90;
export const CHALLENGE_CORRECT_BONUS_S = 3;
export const CHALLENGE_WRONG_PENALTY_S = 5;
export const CHALLENGE_MAX_STRIKES = 3;
export const CHALLENGE_BASE_POINTS = 80;

export const STARTING_POINTS = 0;
export const STARTING_TOKENS = 2;

export const TIER_XP_STEP = 500;
export const MASTERY_PER_STAR = 3;
export const MAX_STARS = 3;

export const MAX_GEN_ATTEMPTS = 20;
export const HISTORY_LENGTH = 10;

/** budget scales with the slate size: ceil(size * 1.4) */
export function budgetForSlate(size: number): number {
  return Math.ceil(size * 1.4);
}
