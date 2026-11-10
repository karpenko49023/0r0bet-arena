/**
 * Interval countdown driven by refs, not by stale state closures.
 * The interval always stops when the screen unmounts (rule 5.6 / 12.3).
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export type Countdown = {
  remaining: number;
  running: boolean;
  start: () => void;
  stop: () => void;
  add: (seconds: number) => void;
};

export function useCountdown(
  total: number,
  onExpire: () => void,
): Countdown {
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(total);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
  }, [clear]);

  const start = useCallback(() => {
    if (timerRef.current !== null) {
      return;
    }
    expiredRef.current = false;
    setRunning(true);
    timerRef.current = setInterval(() => {
      const next = Math.max(0, remainingRef.current - 1);
      remainingRef.current = next;
      setRemaining(next);
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clear();
        setRunning(false);
        onExpireRef.current();
      }
    }, 1000);
  }, [clear]);

  const add = useCallback((seconds: number) => {
    const next = Math.max(0, remainingRef.current + seconds);
    remainingRef.current = next;
    setRemaining(next);
  }, []);

  useEffect(() => clear, [clear]);

  return { remaining, running, start, stop, add };
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return String(m).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
}

/** Seconds left until the next local midnight, as HH:MM:SS. */
export function timeToMidnight(now: Date = new Date()): string {
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
  );
  const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return (
    String(h).padStart(2, '0') +
    ':' +
    String(m).padStart(2, '0') +
    ':' +
    String(s).padStart(2, '0')
  );
}
