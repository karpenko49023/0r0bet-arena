/**
 * Static 1px pitch-line decor. Purely visual, never interactive.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { SCREEN_H, SCREEN_W } from '../constants/layout';

type Props = { opacity?: number };

const ROWS = 14;
const COLS = 8;

function PitchGridBase({ opacity = 0.03 }: Props) {
  const stroke = 'rgba(255,255,255,1)';
  const rowStep = SCREEN_H / ROWS;
  const colStep = SCREEN_W / COLS;

  const lines: React.ReactNode[] = [];
  for (let i = 1; i < ROWS; i++) {
    lines.push(
      <Line
        key={'h' + i}
        x1={0}
        y1={rowStep * i}
        x2={SCREEN_W}
        y2={rowStep * i}
        stroke={stroke}
        strokeWidth={1}
      />,
    );
  }
  for (let i = 1; i < COLS; i++) {
    lines.push(
      <Line
        key={'v' + i}
        x1={colStep * i}
        y1={0}
        x2={colStep * i}
        y2={SCREEN_H}
        stroke={stroke}
        strokeWidth={1}
      />,
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      <Svg width={SCREEN_W} height={SCREEN_H}>
        {lines}
        <Circle
          cx={SCREEN_W / 2}
          cy={SCREEN_H / 2}
          r={SCREEN_W * 0.22}
          stroke={stroke}
          strokeWidth={1}
          fill="none"
        />
        <Rect
          x={SCREEN_W * 0.2}
          y={SCREEN_H * 0.06}
          width={SCREEN_W * 0.6}
          height={SCREEN_H * 0.12}
          stroke={stroke}
          strokeWidth={1}
          fill="none"
        />
        <Rect
          x={SCREEN_W * 0.2}
          y={SCREEN_H * 0.82}
          width={SCREEN_W * 0.6}
          height={SCREEN_H * 0.12}
          stroke={stroke}
          strokeWidth={1}
          fill="none"
        />
      </Svg>
    </View>
  );
}

export const PitchGrid = React.memo(PitchGridBase);
