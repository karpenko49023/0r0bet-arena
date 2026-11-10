import {
  TIERS,
  nextTierName,
  tierIndexFor,
  tierNameFor,
  xpIntoTier,
  xpToNextTier,
} from '../src/game/progression';

describe('progress stats', () => {
  it('names the five tiers', () => {
    expect(TIERS).toEqual([
      'ROOKIE',
      'ANALYST',
      'SCOUT',
      'STRATEGIST',
      'ORACLE',
    ]);
  });

  it('moves up one tier every 500 xp', () => {
    expect(tierIndexFor(0)).toBe(0);
    expect(tierNameFor(500)).toBe('ANALYST');
    expect(tierNameFor(1000)).toBe('SCOUT');
    expect(tierNameFor(2400)).toBe('ORACLE');
  });

  it('reports the xp left to the next tier', () => {
    expect(xpToNextTier(240)).toBe(260);
    expect(nextTierName(240)).toBe('ANALYST');
    expect(xpIntoTier(740)).toBe(240);
  });

  it('caps at the top tier', () => {
    expect(xpToNextTier(9999)).toBe(0);
    expect(tierNameFor(9999)).toBe('ORACLE');
  });
});
