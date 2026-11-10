import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { STARTING_POINTS } from '../src/constants/config';

function walk(dir: string, out: string[] = []): string[] {
  readdirSync(dir).forEach(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full);
    }
  });
  return out;
}

const SOURCES = walk(join(__dirname, '..', 'src')).concat([
  join(__dirname, '..', 'App.tsx'),
]);

describe('no real money and no network', () => {
  it('starts the player on fictional zero points', () => {
    expect(STARTING_POINTS).toBe(0);
  });

  it('contains no purchase, wager or cash-out path', () => {
    const banned = [
      'in-app-purchase',
      'InAppPurchase',
      'RNIap',
      'stripe',
      'paypal',
      'withdraw',
      'cashout',
      'RNIapIos',
      'billingClient',
    ];
    SOURCES.forEach(file => {
      const src = readFileSync(file, 'utf8');
      banned.forEach(word => {
        expect(src.includes(word)).toBe(false);
      });
    });
  });

  it('makes no network calls', () => {
    SOURCES.forEach(file => {
      const src = readFileSync(file, 'utf8');
      expect(/\bfetch\s*\(/.test(src)).toBe(false);
      expect(src.includes('XMLHttpRequest')).toBe(false);
      expect(src.includes('WebSocket')).toBe(false);
    });
  });

  it('ships no sound or music control', () => {
    SOURCES.forEach(file => {
      const src = readFileSync(file, 'utf8');
      expect(src.includes('Volume2')).toBe(false);
      expect(src.includes('react-native-sound')).toBe(false);
    });
  });
});
