/**
 * Last-10 accuracy polyline. Renders null when there is nothing to plot,
 * so the screen never shows an empty chart frame (rule 8.3).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { theme } from '../constants/theme';

type Props = {
  values: number[];
  width: number;
  height?: number;
};

function SparklineBase({ values, width, height = 90 }: Props) {
  if (values.length < 2) {
    return null;
  }

  const pad = 8;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;

  const points = values
    .map((v, i) => {
      const x = pad + step * i;
      const y = pad + innerH * (1 - Math.max(0, Math.min(1, v)));
      return x.toFixed(1) + ',' + y.toFixed(1);
    })
    .join(' ');

  return (
    <View style={[styles.root, { width, height }]}>
      <Svg width={width} height={height}>
        <Line
          x1={pad}
          y1={height - pad}
          x2={width - pad}
          y2={height - pad}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
        <Line
          x1={pad}
          y1={pad + innerH / 2}
          x2={width - pad}
          y2={pad + innerH / 2}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
        <Polyline
          points={points}
          fill="none"
          stroke={theme.colors.accent.primary}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {values.map((v, i) => (
          <Circle
            key={i}
            cx={pad + step * i}
            cy={pad + innerH * (1 - Math.max(0, Math.min(1, v)))}
            r={3}
            fill={theme.colors.accent.primary}
          />
        ))}
      </Svg>
      <Text style={styles.caption}>LAST {values.length} SLATES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
  },
  caption: {
    position: 'absolute',
    right: 4,
    top: 0,
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});

export const Sparkline = React.memo(SparklineBase);
