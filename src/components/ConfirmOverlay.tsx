/**
 * LEAVE ARENA / RESET PROGRESS confirmation. Every button is captioned by
 * meaning and does something (rule 3.6 / 4.1).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CONTENT_W, SCREEN_H, SCREEN_W } from '../constants/layout';
import { theme } from '../constants/theme';
import { SecondaryButton } from './SecondaryButton';

type Props = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

const BTN_W = Math.floor((CONTENT_W - 40 - 12) / 2);

function ConfirmOverlayBase({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.row}>
          <SecondaryButton
            label={cancelLabel}
            onPress={onCancel}
            width={BTN_W}
            height={48}
          />
          <SecondaryButton
            label={confirmLabel}
            onPress={onConfirm}
            width={BTN_W}
            height={48}
            tone={danger ? 'danger' : 'neutral'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,9,12,0.88)',
    paddingHorizontal: 16,
  },
  card: {
    width: CONTENT_W,
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.accent,
    borderWidth: 1,
    borderColor: theme.colors.ui.divider,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  body: {
    marginTop: 10,
    marginBottom: 18,
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});

export const ConfirmOverlay = React.memo(ConfirmOverlayBase);
