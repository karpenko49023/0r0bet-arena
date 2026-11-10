/**
 * Verdict ring — an SVG circle whose stroke sweeps to the accuracy.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  correct: number;
  total: number;
  color: string;
  size?: number;
  instant?: boolean;
};

function AccuracyRingBase({
  correct,
  total,
  color,
  size = 186,
  instant = false,
}: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const ratio = total > 0 ? correct / total : 0;
  const target = circumference * (1 - ratio);

  const offset = useRef(new Animated.Value(circumference)).current;

  useEffect(() => {
    Animated.timing(offset, {
      toValue: target,
      duration: instant ? 0 : 900,
      useNativeDriver: false,
    }).start();
  }, [offset, target, instant]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={offset}
          rotation={-90}
          origin={size / 2 + ', ' + size / 2}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.score, { color }]}>
          {correct + '/' + total}
        </Text>
        <Text style={styles.label}>CORRECT CALLS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 42,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
});

export const AccuracyRing = React.memo(AccuracyRingBase);
