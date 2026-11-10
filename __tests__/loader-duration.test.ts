import { readFileSync } from 'fs';
import { join } from 'path';
import { LOADER_DURATION_MS } from '../src/constants/config';

describe('splash screen contract', () => {
  it('holds for exactly 8000 ms', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
  });

  it('leaves on the timer and has no tap-to-skip path', () => {
    const src = readFileSync(
      join(__dirname, '..', 'src', 'screens', 'LoaderScreen.tsx'),
      'utf8',
    );
    expect(src).toContain('setTimeout');
    expect(src).toContain('LOADER_DURATION_MS');
    expect(src).not.toContain('onPress');
    expect(src).not.toContain('Pressable');
  });
});
