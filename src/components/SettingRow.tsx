/**
 * A settings row with a segmented control or a switch. Every option here has
 * a real, persisted effect on gameplay, display or motion.
 */
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { PressScale } from './PressScale';

type BaseProps = {
  Icon: LucideIcon;
  label: string;
  hint: string;
  width: number;
};

export function SegmentedRow({
  Icon,
  label,
  hint,
  width,
  options,
  value,
  onChange,
}: BaseProps & {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const segW = 54;
  const segH = 40;
  return (
    <View style={[styles.row, { width }]}>
      <View style={styles.iconPad}>
        <Icon size={18} strokeWidth={1.5} color={theme.colors.accent.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      </View>
      <View style={styles.segments}>
        {options.map(opt => {
          const active = opt === value;
          return (
            <PressScale
              key={opt}
              onPress={() => onChange(opt)}
              accessibilityLabel={label + ' ' + opt}
              scaleTo={0.94}
              style={[
                styles.segment,
                { width: segW, height: segH },
                active ? styles.segmentActive : null,
              ]}>
              <View style={styles.segmentInner}>
                <Text
                  style={[
                    styles.segmentText,
                    active ? styles.segmentTextActive : null,
                  ]}
                  numberOfLines={1}>
                  {opt}
                </Text>
              </View>
            </PressScale>
          );
        })}
      </View>
    </View>
  );
}

export function SwitchRow({
  Icon,
  label,
  hint,
  width,
  value,
  onChange,
}: BaseProps & { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={[styles.row, { width }]}>
      <View style={styles.iconPad}>
        <Icon size={18} strokeWidth={1.5} color={theme.colors.accent.primary} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#2A2A33', true: 'rgba(23,224,140,0.45)' }}
        thumbColor={value ? '#17E08C' : '#6B6E79'}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  iconPad: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23,224,140,0.12)',
  },
  texts: {
    flex: 1,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  hint: {
    marginTop: 2,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  segments: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    borderRadius: 10,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  segmentActive: {
    backgroundColor: 'rgba(23,224,140,0.14)',
    borderColor: theme.colors.accent.primary,
  },
  segmentInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  segmentTextActive: {
    color: theme.colors.accent.primary,
  },
});
