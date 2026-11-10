/**
 * Reveal sequencing for the LIVE overlay. Driven by refs so the timer callback
 * never reads a stale closure, and the busy flag is always reset on completion.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useReveal(
  count: number,
  stepMs: number,
  onDone: () => void,
): { shown: number; running: boolean; start: () => void } {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const shownRef = useRef(0);
  const doneRef = useRef(onDone);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const start = useCallback(() => {
    if (timerRef.current !== null) {
      return;
    }
    shownRef.current = 0;
    setShown(0);
    setRunning(true);
    timerRef.current = setInterval(() => {
      if (!aliveRef.current) {
        return;
      }
      const next = shownRef.current + 1;
      shownRef.current = next;
      setShown(next);
      if (next >= count) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRunning(false);
        const finish = doneRef.current;
        setTimeout(() => {
          if (aliveRef.current) {
            finish();
          }
        }, Math.max(260, stepMs));
      }
    }, Math.max(60, stepMs));
  }, [count, stepMs]);

  return { shown, running, start };
}
