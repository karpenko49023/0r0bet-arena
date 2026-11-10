import {
  CONFIDENCE_BUDGET,
  CONFIDENCE_COST,
  CONFIDENCE_MULTIPLIER,
  budgetForSlate,
} from '../src/constants/config';
import { perPickPoints } from '../src/game/scoring';

function spend(levels: Array<'LOW' | 'MED' | 'HIGH'>): number {
  return levels.reduce((sum, l) => sum + CONFIDENCE_COST[l], 0);
}

describe('confidence budget staking', () => {
  it('costs 1 / 2 / 3 out of a budget of 7', () => {
    expect(CONFIDENCE_COST).toEqual({ LOW: 1, MED: 2, HIGH: 3 });
    expect(CONFIDENCE_BUDGET).toBe(7);
    expect(budgetForSlate(5)).toBe(7);
  });

  it('forces a trade-off between high and low confidence', () => {
    expect(spend(['HIGH', 'HIGH'])).toBeLessThanOrEqual(CONFIDENCE_BUDGET);
    expect(spend(['HIGH', 'HIGH', 'HIGH'])).toBeGreaterThan(CONFIDENCE_BUDGET);
    expect(spend(['HIGH', 'MED', 'LOW', 'LOW'])).toBeLessThanOrEqual(
      CONFIDENCE_BUDGET,
    );
  });

  it('multiplies the payout by the confidence level', () => {
    expect(CONFIDENCE_MULTIPLIER.HIGH).toBe(3);
    expect(perPickPoints(true, 2, 'HIGH')).toBe(
      perPickPoints(true, 2, 'LOW') * 3,
    );
  });

  it('fits five LOW picks inside the budget', () => {
    expect(spend(['LOW', 'LOW', 'LOW', 'LOW', 'LOW'])).toBeLessThanOrEqual(
      CONFIDENCE_BUDGET,
    );
  });
});
