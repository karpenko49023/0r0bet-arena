/**
 * Tiers, club mastery, unlocks and the daily streak.
 */
import { MASTERY_PER_STAR, MAX_STARS, TIER_XP_STEP } from '../constants/config';

export const TIERS = ['ROOKIE', 'ANALYST', 'SCOUT', 'STRATEGIST', 'ORACLE'];

export function tierIndexFor(xp: number): number {
  return Math.min(TIERS.length - 1, Math.floor(xp / TIER_XP_STEP));
}

export function tierNameFor(xp: number): string {
  return TIERS[tierIndexFor(xp)];
}

export function xpIntoTier(xp: number): number {
  const idx = tierIndexFor(xp);
  if (idx === TIERS.length - 1) {
    return TIER_XP_STEP;
  }
  return xp - idx * TIER_XP_STEP;
}

export function xpToNextTier(xp: number): number {
  const idx = tierIndexFor(xp);
  if (idx === TIERS.length - 1) {
    return 0;
  }
  return (idx + 1) * TIER_XP_STEP - xp;
}

export function nextTierName(xp: number): string {
  const idx = tierIndexFor(xp);
  return idx === TIERS.length - 1 ? TIERS[idx] : TIERS[idx + 1];
}

export function starsFor(mastery: number): number {
  return Math.min(MAX_STARS, Math.floor(mastery / MASTERY_PER_STAR));
}

export function isUnlocked(mastery: number): boolean {
  return starsFor(mastery) >= 1;
}

/** "★★☆" — the star glyph is on the allowed list (rule 11.1). */
export function starText(mastery: number): string {
  const filled = starsFor(mastery);
  let out = '';
  for (let i = 0; i < MAX_STARS; i++) {
    out += i < filled ? '★' : '☆';
  }
  return out;
}

export function masteryToNextStar(mastery: number): number {
  const stars = starsFor(mastery);
  if (stars >= MAX_STARS) {
    return 0;
  }
  return (stars + 1) * MASTERY_PER_STAR - mastery;
}
