/**
 * Selector hook over the single store. Components subscribe to ONE value, not
 * to the whole state (react-state-minimize).
 */
import { useSyncExternalStore } from 'react';
import { GameState, getState, subscribe } from '../game/store';

export function useGameStore<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getState()),
  );
}

export function usePoints(): number {
  return useGameStore(s => s.points);
}

export function useTokens(): number {
  return useGameStore(s => s.tokens);
}

export function useReducedMotion(): boolean {
  return useGameStore(s => s.settings.reducedMotion);
}

export function useOddsFormat(): 'decimal' | 'percent' {
  return useGameStore(s => s.settings.oddsFormat);
}

export function useHomeHint(): boolean {
  return useGameStore(s => s.settings.homeHint);
}
