/**
 * Fictional match simulation: the outcome is sampled from the fixture's own
 * (pHome, pDraw, pAway) with the slate seed, then dressed with a plausible
 * scoreline. Same seed -> same result.
 */
import { Outcome } from './odds';
import { Fixture } from './slate';
import { Rng, mulberry32, randInt } from './rng';

export type MatchResult = {
  fixtureId: number;
  outcome: Outcome;
  homeGoals: number;
  awayGoals: number;
};

export function sampleOutcome(rng: Rng, f: Fixture): Outcome {
  const roll = rng();
  if (roll < f.prob.home) {
    return 'HOME';
  }
  if (roll < f.prob.home + f.prob.draw) {
    return 'DRAW';
  }
  return 'AWAY';
}

export function scorelineFor(rng: Rng, outcome: Outcome): [number, number] {
  if (outcome === 'DRAW') {
    const g = randInt(rng, 0, 3);
    return [g, g];
  }
  const winner = randInt(rng, 1, 4);
  const loser = randInt(rng, 0, Math.max(0, winner - 1));
  return outcome === 'HOME' ? [winner, loser] : [loser, winner];
}

export function resolveSlate(seed: number, fixtures: Fixture[]): MatchResult[] {
  const rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  return fixtures.map(f => {
    const outcome = sampleOutcome(rng, f);
    const goals = scorelineFor(rng, outcome);
    return {
      fixtureId: f.id,
      outcome,
      homeGoals: goals[0],
      awayGoals: goals[1],
    };
  });
}

export function scoreText(r: MatchResult): string {
  return r.homeGoals + ' - ' + r.awayGoals;
}
