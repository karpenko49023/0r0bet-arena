/**
 * The payload a finished round hands to the Result screen.
 */
import type { SlateScore } from './scoring';
import type { Fixture } from './slate';
import type { MatchResult } from './simulate';
import type { ModeKey } from './store';

export type GameResult = {
  mode: ModeKey;
  score: SlateScore;
  fixtures: Fixture[];
  results: MatchResult[];
  unlockedClubIds: number[];
  tokensGained: number;
  xpGained: number;
  usedFallback: boolean;
  /** challenge only: how many calls the player made before the whistle */
  calls?: number;
  endReason?: string;
};
