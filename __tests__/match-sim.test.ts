import { generateSlate } from '../src/game/slate';
import { resolveSlate, scoreText } from '../src/game/simulate';

describe('fictional match simulation', () => {
  it('is deterministic for the same seed', () => {
    const slate = generateSlate(31337, 5, {});
    const a = resolveSlate(slate.seed, slate.fixtures);
    const b = resolveSlate(slate.seed, slate.fixtures);
    expect(a).toEqual(b);
  });

  it('produces a scoreline consistent with the outcome', () => {
    const slate = generateSlate(4242, 5, {});
    const results = resolveSlate(slate.seed, slate.fixtures);
    results.forEach(r => {
      if (r.outcome === 'HOME') {
        expect(r.homeGoals).toBeGreaterThan(r.awayGoals);
      } else if (r.outcome === 'AWAY') {
        expect(r.awayGoals).toBeGreaterThan(r.homeGoals);
      } else {
        expect(r.homeGoals).toBe(r.awayGoals);
      }
    });
  });

  it('renders a readable score string', () => {
    expect(
      scoreText({ fixtureId: 0, outcome: 'HOME', homeGoals: 2, awayGoals: 1 }),
    ).toBe('2 - 1');
  });
});
