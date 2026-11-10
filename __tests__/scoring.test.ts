import { perPickPoints, scoreSlate } from '../src/game/scoring';
import type { Pick } from '../src/game/scoring';
import { generateSlate } from '../src/game/slate';
import { resolveSlate } from '../src/game/simulate';

describe('earning virtual points for accurate predictions', () => {
  it('pays 100 x odds x confidence for a correct pick', () => {
    expect(perPickPoints(true, 1.85, 'MED')).toBe(370);
  });

  it('pays nothing for a wrong pick', () => {
    expect(perPickPoints(false, 9.2, 'HIGH')).toBe(0);
  });

  it('never produces negative points for a whole slate', () => {
    const slate = generateSlate(555, 5, {});
    const results = resolveSlate(slate.seed, slate.fixtures);
    const picks: Pick[] = slate.fixtures.map(() => ({
      outcome: null,
      confidence: 'LOW',
      insightUsed: false,
    }));
    const score = scoreSlate(slate.fixtures, picks, results);
    expect(score.points).toBeGreaterThanOrEqual(0);
    expect(score.total).toBe(5);
    expect(score.correct).toBeLessThanOrEqual(5);
  });

  it('derives xp from the slate points', () => {
    const slate = generateSlate(556, 3, {});
    const results = resolveSlate(slate.seed, slate.fixtures);
    const picks: Pick[] = slate.fixtures.map(f => ({
      outcome: f.favourite,
      confidence: 'HIGH',
      insightUsed: false,
    }));
    const score = scoreSlate(slate.fixtures, picks, results);
    expect(score.xp).toBe(Math.round(score.points / 10));
  });
});
