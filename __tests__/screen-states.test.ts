import { readFileSync } from 'fs';
import { join } from 'path';
import {
  fallbackSlate,
  generateSlate,
  isSlateInteresting,
  isSlateSolvable,
} from '../src/game/slate';
import { verdictFor } from '../src/game/scoring';

function screen(name: string): string {
  return readFileSync(
    join(__dirname, '..', 'src', 'screens', name + '.tsx'),
    'utf8',
  );
}

describe('loading, empty, error and completion states', () => {
  it('has a loading state on the splash', () => {
    expect(screen('LoaderScreen')).toContain('LOADING ARENA');
  });

  it('shows a themed empty state instead of a blank area', () => {
    expect(screen('ProgressScreen')).toContain('NO HISTORY YET');
    expect(screen('CollectionScreen')).toContain('NO CLUBS SCOUTED YET');
    expect(screen('MenuScreen')).toContain('NO SLATES PLAYED YET');
  });

  it('has an error fallback for the generator', () => {
    const fallback = fallbackSlate(5);
    expect(fallback.fallback).toBe(true);
    expect(isSlateSolvable(fallback.fixtures)).toBe(true);
    expect(screen('GameScreen')).toContain('USING BACKUP FIXTURES');
  });

  it('completes with a verdict in the words of this game', () => {
    expect(verdictFor(5, 5).title).toContain('PERFECT SLATE');
    expect(verdictFor(0, 5).title).toContain('SHUT OUT');
    expect(verdictFor(0, 5).title.toLowerCase()).not.toContain('game over');
  });

  it('always produces a usable slate', () => {
    for (let seed = 1; seed < 40; seed++) {
      const slate = generateSlate(seed * 13, 5, {});
      expect(slate.fixtures).toHaveLength(5);
      expect(isSlateInteresting(slate.fixtures)).toBe(true);
    }
  });
});
