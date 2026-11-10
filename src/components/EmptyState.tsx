/**
 * Themed empty state — never a blank area (rule 8.2).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  title: string;
  hint?: string;
};

function EmptyStateBase({ Icon, title, hint }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Icon size={26} strokeWidth={1.5} color={theme.colors.text.muted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    color: theme.colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export const EmptyState = React.memo(EmptyStateBase);
