import { DAILY_SLATE_SIZE } from '../src/constants/config';
import { dayKey, daySeed } from '../src/game/rng';
import { generateSlate } from '../src/game/slate';

describe('daily mode', () => {
  it('builds a three fixture slate', () => {
    const slate = generateSlate(daySeed(), DAILY_SLATE_SIZE, {});
    expect(slate.fixtures).toHaveLength(3);
  });

  it('is identical for the same day', () => {
    const a = generateSlate(daySeed(new Date(2026, 10, 10)), 3, {});
    const b = generateSlate(daySeed(new Date(2026, 10, 10)), 3, {});
    expect(a.seed).toBe(b.seed);
    expect(a.fixtures.map(f => f.home.club.id)).toEqual(
      b.fixtures.map(f => f.home.club.id),
    );
  });

  it('differs from one day to the next', () => {
    const a = generateSlate(daySeed(new Date(2026, 10, 10)), 3, {});
    const b = generateSlate(daySeed(new Date(2026, 10, 11)), 3, {});
    expect(a.seed).not.toBe(b.seed);
  });

  it('uses a stable day key', () => {
    expect(dayKey(new Date(2026, 10, 9))).toBe('2026-11-09');
  });
});
