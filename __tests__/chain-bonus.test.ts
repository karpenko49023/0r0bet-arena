import { chainBonus, longestChain } from '../src/game/scoring';

describe('chain bonus for consecutive correct picks', () => {
  it('finds the longest run', () => {
    expect(longestChain([true, true, false, true, true, true])).toBe(3);
    expect(longestChain([false, false])).toBe(0);
    expect(longestChain([true, true, true, true, true])).toBe(5);
  });

  it('scales 3 / 4 / 5 in a row to 1.25 / 1.5 / 2', () => {
    expect(chainBonus(2)).toBe(1);
    expect(chainBonus(3)).toBe(1.25);
    expect(chainBonus(4)).toBe(1.5);
    expect(chainBonus(5)).toBe(2);
  });

  it('never shrinks the payout', () => {
    for (let i = 0; i <= 6; i++) {
      expect(chainBonus(i)).toBeGreaterThanOrEqual(1);
    }
  });
});
