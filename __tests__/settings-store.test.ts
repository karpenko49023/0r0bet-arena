import { getState, resetProgress, setSettings } from '../src/game/store';
import { budgetForSlate } from '../src/constants/config';

describe('settings have a real effect', () => {
  beforeEach(() => {
    resetProgress();
    setSettings({
      slateSize: 5,
      oddsFormat: 'decimal',
      reducedMotion: false,
      homeHint: true,
    });
  });

  it('persists the slate size and scales the budget with it', () => {
    setSettings({ slateSize: 3 });
    expect(getState().settings.slateSize).toBe(3);
    expect(budgetForSlate(3)).toBe(5);
    expect(budgetForSlate(5)).toBe(7);
  });

  it('switches the odds display', () => {
    setSettings({ oddsFormat: 'percent' });
    expect(getState().settings.oddsFormat).toBe('percent');
  });

  it('toggles reduced motion and the home hint', () => {
    setSettings({ reducedMotion: true, homeHint: false });
    expect(getState().settings.reducedMotion).toBe(true);
    expect(getState().settings.homeHint).toBe(false);
  });

  it('keeps settings across a progress reset', () => {
    setSettings({ oddsFormat: 'percent' });
    resetProgress();
    expect(getState().settings.oddsFormat).toBe('percent');
  });
});
