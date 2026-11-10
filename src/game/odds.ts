/**
 * Form -> power -> probabilities -> fictional arena coefficients.
 * No real money anywhere: these are display numbers for a point score.
 */
import { HOME_BONUS, MARGIN, ODDS_SLOPE } from '../constants/config';

export type Outcome = 'HOME' | 'DRAW' | 'AWAY';

export const OUTCOMES: Outcome[] = ['HOME', 'DRAW', 'AWAY'];

export type Ratings = {
  att: number;
  def: number;
  form: number;
  momentum: number;
};

export type Probabilities = { home: number; draw: number; away: number };
export type Odds = { home: number; draw: number; away: number };

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function power(r: Ratings, isHome: boolean): number {
  return (
    0.4 * r.form +
    0.3 * r.att +
    0.2 * r.def +
    2 * r.momentum +
    (isHome ? HOME_BONUS : 0)
  );
}

export function probabilities(home: Ratings, away: Ratings): Probabilities {
  const d = power(home, true) - power(away, false);
  const pHome = clamp(0.33 + d * ODDS_SLOPE, 0.1, 0.74);
  const pAway = clamp(0.33 - d * ODDS_SLOPE, 0.1, 0.74);
  const pDraw = Math.max(0.14, 1 - pHome - pAway);
  const sum = pHome + pDraw + pAway;
  return { home: pHome / sum, draw: pDraw / sum, away: pAway / sum };
}

export function oddsFromProb(p: number): number {
  return Math.round((1 / p) * MARGIN * 100) / 100;
}

export function oddsFor(p: Probabilities): Odds {
  return {
    home: oddsFromProb(p.home),
    draw: oddsFromProb(p.draw),
    away: oddsFromProb(p.away),
  };
}

export function favourite(p: Probabilities): Outcome {
  if (p.home >= p.draw && p.home >= p.away) {
    return 'HOME';
  }
  return p.away >= p.draw ? 'AWAY' : 'DRAW';
}

export function probFor(p: Probabilities, outcome: Outcome): number {
  if (outcome === 'HOME') {
    return p.home;
  }
  return outcome === 'AWAY' ? p.away : p.draw;
}

export function oddsValue(o: Odds, outcome: Outcome): number {
  if (outcome === 'HOME') {
    return o.home;
  }
  return outcome === 'AWAY' ? o.away : o.draw;
}

/** Settings "ODDS DISPLAY": decimal coefficient or implied percent. */
export function formatOdds(
  value: number,
  prob: number,
  format: 'decimal' | 'percent',
): string {
  if (format === 'percent') {
    return Math.round(prob * 100) + '%';
  }
  return value.toFixed(2);
}

/** 1240 -> "1,240" (thousands separator, no Intl dependency). */
export function formatPoints(value: number): string {
  const n = Math.round(value);
  const sign = n < 0 ? '-' : '';
  const digits = Math.abs(n).toString();
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    const fromEnd = digits.length - i;
    out += digits[i];
    if (fromEnd > 1 && fromEnd % 3 === 1) {
      out += ',';
    }
  }
  return sign + out;
}
