import {
  CHALLENGE_CORRECT_BONUS_S,
  CHALLENGE_DURATION_S,
  CHALLENGE_MAX_STRIKES,
  CHALLENGE_WRONG_PENALTY_S,
} from '../src/constants/config';
import { chainBonus, longestChain } from '../src/game/scoring';

function runSession(calls: boolean[]) {
  let time = CHALLENGE_DURATION_S;
  let strikes = 0;
  let made = 0;
  for (const correct of calls) {
    if (time <= 0 || strikes >= CHALLENGE_MAX_STRIKES) {
      break;
    }
    made += 1;
    if (correct) {
      time += CHALLENGE_CORRECT_BONUS_S;
    } else {
      time -= CHALLENGE_WRONG_PENALTY_S;
      strikes += 1;
    }
  }
  return { time, strikes, made };
}

describe('challenge session', () => {
  it('starts at 90 seconds', () => {
    expect(CHALLENGE_DURATION_S).toBe(90);
  });

  it('adds time for a correct call and takes it for a wrong one', () => {
    const good = runSession([true]);
    expect(good.time).toBe(CHALLENGE_DURATION_S + CHALLENGE_CORRECT_BONUS_S);
    const bad = runSession([false]);
    expect(bad.time).toBe(CHALLENGE_DURATION_S - CHALLENGE_WRONG_PENALTY_S);
  });

  it('ends on the third strike', () => {
    const session = runSession([false, false, false, true, true]);
    expect(session.strikes).toBe(CHALLENGE_MAX_STRIKES);
    expect(session.made).toBe(3);
  });

  it('never kills a passive player inside 60 seconds', () => {
    expect(CHALLENGE_DURATION_S).toBeGreaterThan(60);
  });

  it('still applies the chain bonus to a session', () => {
    expect(chainBonus(longestChain([true, true, true, false]))).toBe(1.25);
  });
});
