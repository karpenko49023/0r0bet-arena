/**
 * Challenge countdown bar. Width is animated with useNativeDriver:false —
 * width is a layout property and must never run on the native driver.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type Props = {
  remaining: number;
  total: number;
  width: number;
};

function colorFor(ratio: number): string {
  if (ratio > 0.5) {
    return '#17E08C';
  }
  return ratio > 0.2 ? '#FFB020' : '#FF5A6E';
}

function TimerBarBase({ remaining, total, width }: Props) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const w = useRef(new Animated.Value(width * ratio)).current;

  useEffect(() => {
    Animated.timing(w, {
      toValue: width * ratio,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [w, ratio, width]);

  return (
    <View style={[styles.track, { width }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          { width: w, backgroundColor: colorFor(ratio) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1F1F24',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});

export const TimerBar = React.memo(TimerBarBase);
