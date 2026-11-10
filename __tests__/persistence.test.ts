import {
  applySlateResult,
  getState,
  hydrate,
  resetProgress,
  spendToken,
} from '../src/game/store';
import { scoreSlate } from '../src/game/scoring';
import type { Pick } from '../src/game/scoring';
import { generateSlate } from '../src/game/slate';
import { resolveSlate } from '../src/game/simulate';

describe('offline-first local persistence', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('survives navigating away and back through the single store', () => {
    const slate = generateSlate(2026, 5, {});
    const results = resolveSlate(slate.seed, slate.fixtures);
    const picks: Pick[] = slate.fixtures.map(f => ({
      outcome: f.favourite,
      confidence: 'MED',
      insightUsed: false,
    }));
    const score = scoreSlate(slate.fixtures, picks, results);
    const pairs = slate.fixtures.map(
      f => [f.home.club.id, f.away.club.id] as [number, number],
    );
    applySlateResult(score, pairs, 'arena');

    const after = getState().points;
    hydrate();
    expect(getState().points).toBe(after);
    expect(getState().slatesPlayed).toBe(1);
  });

  it('tracks lifetime picks', () => {
    const slate = generateSlate(11, 3, {});
    const results = resolveSlate(slate.seed, slate.fixtures);
    const picks: Pick[] = slate.fixtures.map(() => ({
      outcome: null,
      confidence: 'LOW',
      insightUsed: false,
    }));
    const score = scoreSlate(slate.fixtures, picks, results);
    applySlateResult(score, [], 'arena');
    expect(getState().totalPicks).toBe(3);
  });

  it('spends insight tokens down to zero and no further', () => {
    expect(getState().tokens).toBe(2);
    expect(spendToken()).toBe(true);
    expect(spendToken()).toBe(true);
    expect(spendToken()).toBe(false);
    expect(getState().tokens).toBe(0);
  });
});
