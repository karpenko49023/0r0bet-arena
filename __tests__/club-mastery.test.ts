import { applySlateResult, getState, resetProgress } from '../src/game/store';
import { scoreSlate } from '../src/game/scoring';
import type { Pick } from '../src/game/scoring';
import { generateSlate } from '../src/game/slate';
import type { MatchResult } from '../src/game/simulate';
import { starsFor } from '../src/game/progression';

function allCorrect(seed: number, size: number) {
  const slate = generateSlate(seed, size, {});
  const picks: Pick[] = slate.fixtures.map(f => ({
    outcome: f.favourite,
    confidence: 'LOW',
    insightUsed: false,
  }));
  const results: MatchResult[] = slate.fixtures.map(f => ({
    fixtureId: f.id,
    outcome: f.favourite,
    homeGoals: 1,
    awayGoals: 0,
  }));
  const score = scoreSlate(slate.fixtures, picks, results);
  const pairs = slate.fixtures.map(
    f => [f.home.club.id, f.away.club.id] as [number, number],
  );
  return { slate, score, pairs };
}

describe('club mastery progression', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('adds one mastery per correct call to both clubs', () => {
    const run = allCorrect(321, 3);
    applySlateResult(run.score, run.pairs, 'arena');
    const first = run.slate.fixtures[0].home.club.id;
    expect(getState().mastery[first]).toBe(1);
  });

  it('unlocks a club at three correct calls', () => {
    const run = allCorrect(321, 3);
    applySlateResult(run.score, run.pairs, 'arena');
    applySlateResult(run.score, run.pairs, 'arena');
    const applied = applySlateResult(run.score, run.pairs, 'arena');

    expect(applied.unlockedClubIds.length).toBeGreaterThan(0);
    expect(
      starsFor(getState().mastery[run.slate.fixtures[0].home.club.id]),
    ).toBe(1);
  });

  it('still builds a full slate when every club is mastered', () => {
    const mastered: Record<number, number> = {};
    for (let id = 1; id <= 10; id++) {
      mastered[id] = 9;
    }
    const slate = generateSlate(777, 3, mastered);
    expect(slate.fixtures).toHaveLength(3);
  });
});
