/**
 * Slate generation: seeded, never hardcoded placement, verified before use,
 * with a FALLBACK slate as the last-resort guarantee (rules 6.1-6.4).
 */
import { MAX_GEN_ATTEMPTS } from '../constants/config';
import { CLUBS, Club, clubById } from './clubs';
import {
  Odds,
  Outcome,
  Probabilities,
  Ratings,
  favourite,
  oddsFor,
  probabilities,
} from './odds';
import { Rng, makeSeed, mulberry32, randInt, shuffle } from './rng';

export type SideView = {
  club: Club;
  ratings: Ratings;
};

export type Fixture = {
  id: number;
  home: SideView;
  away: SideView;
  prob: Probabilities;
  odds: Odds;
  favourite: Outcome;
  /** hidden ATT/DEF modifier, revealed by an Insight token (0 = none) */
  modifier: number;
  modifierSide: 'HOME' | 'AWAY';
  modifierStat: 'ATT' | 'DEF';
  kickoff: string;
  round: number;
};

export type Slate = {
  seed: number;
  fixtures: Fixture[];
  fallback: boolean;
};

const KICKOFFS = ['17:30', '18:15', '19:45', '20:00', '20:45'];

function noiseFor(mastery: number): number {
  const stars = Math.min(3, Math.floor(mastery / 3));
  return Math.max(2, 8 - stars * 2);
}

function jitter(rng: Rng, base: number, spread: number): number {
  const delta = randInt(rng, -spread, spread);
  return Math.max(10, Math.min(99, base + delta));
}

function ratingsFor(rng: Rng, club: Club, mastery: number): Ratings {
  const spread = noiseFor(mastery);
  return {
    att: jitter(rng, club.att, spread),
    def: jitter(rng, club.def, spread),
    form: jitter(rng, club.form, spread),
    momentum: Math.max(-5, Math.min(5, club.momentum + randInt(rng, -1, 1))),
  };
}

function buildFixture(
  rng: Rng,
  index: number,
  homeClub: Club,
  awayClub: Club,
  mastery: Record<number, number>,
): Fixture {
  const home: SideView = {
    club: homeClub,
    ratings: ratingsFor(rng, homeClub, mastery[homeClub.id] || 0),
  };
  const away: SideView = {
    club: awayClub,
    ratings: ratingsFor(rng, awayClub, mastery[awayClub.id] || 0),
  };

  const hasModifier = rng() < 0.4;
  const rolled = randInt(rng, -8, 8);
  const modifier = hasModifier ? (rolled === 0 ? -6 : rolled) : 0;
  const modifierSide: 'HOME' | 'AWAY' = rng() < 0.5 ? 'HOME' : 'AWAY';
  const modifierStat: 'ATT' | 'DEF' = rng() < 0.5 ? 'ATT' : 'DEF';

  if (modifier !== 0) {
    const target = modifierSide === 'HOME' ? home.ratings : away.ratings;
    if (modifierStat === 'ATT') {
      target.att = Math.max(10, Math.min(99, target.att + modifier));
    } else {
      target.def = Math.max(10, Math.min(99, target.def + modifier));
    }
  }

  const prob = probabilities(home.ratings, away.ratings);
  return {
    id: index,
    home,
    away,
    prob,
    odds: oddsFor(prob),
    favourite: favourite(prob),
    modifier,
    modifierSide,
    modifierStat,
    kickoff: KICKOFFS[index % KICKOFFS.length],
    round: 7,
  };
}

/**
 * A slate is usable when every fixture has sane probabilities, no club repeats
 * inside it, and at least one fixture has a readable favourite.
 */
export function isSlateSolvable(fixtures: Fixture[]): boolean {
  if (fixtures.length === 0) {
    return false;
  }
  const ids = new Set<number>();
  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    const sum = f.prob.home + f.prob.draw + f.prob.away;
    if (Math.abs(sum - 1) > 0.001) {
      return false;
    }
    if (f.prob.home < 0.05 || f.prob.away < 0.05 || f.prob.draw < 0.05) {
      return false;
    }
    if (f.home.club.id === f.away.club.id) {
      return false;
    }
    if (ids.has(f.home.club.id) || ids.has(f.away.club.id)) {
      return false;
    }
    ids.add(f.home.club.id);
    ids.add(f.away.club.id);
  }
  return fixtures.some(f => Math.abs(f.prob.home - f.prob.away) >= 0.08);
}

/**
 * On top of being solvable, a generated slate must be an actual decision:
 * at least one fixture close enough that the favourite is not a free pick.
 */
export function isSlateInteresting(fixtures: Fixture[]): boolean {
  return (
    isSlateSolvable(fixtures) &&
    fixtures.some(f => Math.abs(f.prob.home - f.prob.away) < 0.24)
  );
}

function tryGenerate(
  seed: number,
  size: number,
  mastery: Record<number, number>,
): Fixture[] {
  const rng = mulberry32(seed);
  const pool = shuffle(rng, CLUBS).slice(0, size * 2);
  const fixtures: Fixture[] = [];
  for (let i = 0; i < size; i++) {
    fixtures.push(buildFixture(rng, i, pool[i * 2], pool[i * 2 + 1], mastery));
  }
  return fixtures;
}

/** Fixed last-resort slate — a guarantee, never the game. */
export function fallbackSlate(size: number): Slate {
  const rng = mulberry32(424242);
  const pairs: Array<[number, number]> = [
    [1, 5],
    [9, 4],
    [7, 8],
    [3, 10],
    [2, 6],
  ];
  const fixtures: Fixture[] = [];
  for (let i = 0; i < size; i++) {
    const pair = pairs[i % pairs.length];
    fixtures.push(buildFixture(rng, i, clubById(pair[0]), clubById(pair[1]), {}));
  }
  return { seed: 424242, fixtures, fallback: true };
}

export function generateSlate(
  base: number,
  size: number,
  mastery: Record<number, number>,
): Slate {
  for (let attempt = 0; attempt < MAX_GEN_ATTEMPTS; attempt++) {
    const seed = makeSeed(base, attempt + 1);
    const fixtures = tryGenerate(seed, size, mastery);
    if (isSlateInteresting(fixtures)) {
      return { seed, fixtures, fallback: false };
    }
  }
  return fallbackSlate(size);
}

/** Human-readable text of the hidden modifier an Insight token reveals. */
export function insightText(f: Fixture): string {
  if (f.modifier === 0) {
    return 'NO HIDDEN FACTOR — BOTH SIDES AT FULL STRENGTH';
  }
  const side = f.modifierSide === 'HOME' ? 'HOME SIDE' : 'AWAY SIDE';
  const sign = f.modifier > 0 ? '+' : '';
  const reason =
    f.modifier > 0
      ? 'KEY STRIKER BACK FROM BAN'
      : '2 KEY PLAYERS RESTED';
  return side + ': ' + reason + ' (' + sign + f.modifier + ' ' + f.modifierStat + ')';
}
