import { generateSlate, isSlateSolvable } from '../src/game/slate';
import { effectivePick } from '../src/game/scoring';
import type { Pick } from '../src/game/scoring';

describe('building a forecast from team cards', () => {
  it('generates a solvable slate of the requested size', () => {
    const slate = generateSlate(1234, 5, {});
    expect(slate.fixtures).toHaveLength(5);
    expect(isSlateSolvable(slate.fixtures)).toBe(true);
  });

  it('never repeats a club inside one slate', () => {
    const slate = generateSlate(99, 5, {});
    const ids: number[] = [];
    slate.fixtures.forEach(f => {
      ids.push(f.home.club.id, f.away.club.id);
    });
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('falls back to the favourite for an untouched fixture', () => {
    const slate = generateSlate(7, 3, {});
    const empty: Pick = { outcome: null, confidence: 'LOW', insightUsed: false };
    expect(effectivePick(empty, slate.fixtures[0])).toBe(
      slate.fixtures[0].favourite,
    );
  });

  it('keeps an explicit pick', () => {
    const slate = generateSlate(7, 3, {});
    const pick: Pick = { outcome: 'DRAW', confidence: 'MED', insightUsed: false };
    expect(effectivePick(pick, slate.fixtures[0])).toBe('DRAW');
  });
});
