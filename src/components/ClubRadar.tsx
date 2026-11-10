/**
 * 4-axis radar (ATT / DEF / FORM / MOMENTUM) for the club detail overlay.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { theme } from '../constants/theme';
import type { Club } from '../game/clubs';

type Props = { club: Club; size?: number };

const AXES = ['ATT', 'DEF', 'FORM', 'MOM'];

function ClubRadarBase({ club, size = 180 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 22;

  const values = [
    club.att / 100,
    club.def / 100,
    club.form / 100,
    (club.momentum + 5) / 10,
  ];

  const pts = values
    .map((v, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 2;
      const d = r * Math.max(0.1, Math.min(1, v));
      return (cx + d * Math.cos(angle)).toFixed(1) +
        ',' +
        (cy + d * Math.sin(angle)).toFixed(1);
    })
    .join(' ');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r * 0.6}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={1}
          fill="none"
        />
        {AXES.map((_, i) => {
          const angle = -Math.PI / 2 + (i * Math.PI) / 2;
          return (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={1}
            />
          );
        })}
        <Polygon
          points={pts}
          fill={club.tint + '33'}
          stroke={club.tint}
          strokeWidth={2}
        />
      </Svg>
      {AXES.map((label, i) => {
        const angle = -Math.PI / 2 + (i * Math.PI) / 2;
        const lx = cx + (r + 12) * Math.cos(angle) - 18;
        const ly = cy + (r + 12) * Math.sin(angle) - 7;
        return (
          <Text key={label} style={[styles.axis, { left: lx, top: ly }]}>
            {label}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  axis: {
    position: 'absolute',
    width: 36,
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export const ClubRadar = React.memo(ClubRadarBase);
