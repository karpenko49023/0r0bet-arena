import { STARTING_TOKENS } from '../src/constants/config';
import { generateSlate, insightText } from '../src/game/slate';
import { getState, resetProgress, spendToken } from '../src/game/store';

describe('scout insight tokens', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('starts with two tokens', () => {
    expect(STARTING_TOKENS).toBe(2);
    expect(getState().tokens).toBe(2);
  });

  it('costs one token per reveal', () => {
    spendToken();
    expect(getState().tokens).toBe(1);
  });

  it('cannot be spent when the player has none', () => {
    spendToken();
    spendToken();
    expect(spendToken()).toBe(false);
  });

  it('describes the hidden modifier without arrow glyphs', () => {
    const slate = generateSlate(888, 5, {});
    slate.fixtures.forEach(f => {
      const text = insightText(f);
      expect(text.length).toBeGreaterThan(0);
      expect(/[‹›▶▸→←]/.test(text)).toBe(false);
    });
  });
});
