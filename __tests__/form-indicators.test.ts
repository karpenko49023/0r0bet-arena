import { power, probabilities, oddsFor, favourite } from '../src/game/odds';

const strong = { att: 85, def: 80, form: 85, momentum: 4 };
const weak = { att: 50, def: 50, form: 45, momentum: -3 };

describe('form indicators drive the comparison', () => {
  it('ranks the stronger ratings higher', () => {
    expect(power(strong, false)).toBeGreaterThan(power(weak, false));
  });

  it('gives the home side a bonus', () => {
    expect(power(strong, true)).toBeGreaterThan(power(strong, false));
  });

  it('turns a form edge into a higher probability', () => {
    const p = probabilities(strong, weak);
    expect(p.home).toBeGreaterThan(p.away);
    expect(favourite(p)).toBe('HOME');
  });

  it('normalises the three probabilities to 1', () => {
    const p = probabilities(strong, weak);
    expect(p.home + p.draw + p.away).toBeCloseTo(1, 6);
  });

  it('prices the favourite shorter than the outsider', () => {
    const p = probabilities(strong, weak);
    const o = oddsFor(p);
    expect(o.home).toBeLessThan(o.away);
  });
});
