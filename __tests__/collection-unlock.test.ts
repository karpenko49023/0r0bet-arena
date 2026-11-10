import { CLUBS } from '../src/game/clubs';
import { isUnlocked, starText, starsFor } from '../src/game/progression';

describe('collection unlocks', () => {
  it('ships ten fictional clubs mapped onto five crests', () => {
    expect(CLUBS).toHaveLength(10);
    CLUBS.forEach(c => {
      expect(c.crest).toBeGreaterThanOrEqual(1);
      expect(c.crest).toBeLessThanOrEqual(5);
    });
  });

  it('keeps a club locked until three correct calls', () => {
    expect(isUnlocked(0)).toBe(false);
    expect(isUnlocked(2)).toBe(false);
    expect(isUnlocked(3)).toBe(true);
  });

  it('awards a star every three correct calls, capped at three', () => {
    expect(starsFor(3)).toBe(1);
    expect(starsFor(8)).toBe(2);
    expect(starsFor(99)).toBe(3);
  });

  it('renders stars with the allowed glyphs only', () => {
    const text = starText(6);
    expect(text).toHaveLength(3);
    expect(/^[\u2605\u2606]+$/.test(text)).toBe(true);
  });
});
