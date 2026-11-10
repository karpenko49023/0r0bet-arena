/**
 * Four options with a real, persisted effect on gameplay, display or motion,
 * plus a guarded reset. No audio controls — the app has no sound.
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Gauge,
  Home,
  Layers,
  Percent,
  Trash2,
} from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { ConfirmOverlay } from '../components/ConfirmOverlay';
import { IconRoundButton } from '../components/IconRoundButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { SegmentedRow, SwitchRow } from '../components/SettingRow';
import { CONTENT_W, HEADER_TOTAL, H_PADDING } from '../constants/layout';
import { theme } from '../constants/theme';
import { resetProgress, setSettings } from '../game/store';
import { useGameStore } from '../hooks/useGameStore';

type Props = { onMenu: () => void };

export default function SettingsScreen({ onMenu }: Props) {
  const slateSize = useGameStore(s => s.settings.slateSize);
  const oddsFormat = useGameStore(s => s.settings.oddsFormat);
  const reducedMotion = useGameStore(s => s.settings.reducedMotion);
  const homeHint = useGameStore(s => s.settings.homeHint);
  const [confirm, setConfirm] = useState(false);

  return (
    <AppShell variant="hub" blobTop={HEADER_TOTAL + 40} blobColor="rgba(23,224,140,0.08)">
      <ScreenHeader
        title="SETTINGS"
        subtitle="EVERY OPTION CHANGES THE GAME"
        leftWidth={56}
        rightWidth={56}
        leftSlot={
          <IconRoundButton
            icon={assets.iconHome}
            onPress={onMenu}
            accessibilityLabel="HOME"
          />
        }
      />

      <View style={styles.body}>
        <SegmentedRow
          Icon={Layers}
          label="SLATE SIZE"
          hint="FIXTURES PER ARENA SLATE"
          width={CONTENT_W}
          options={['3', '5']}
          value={String(slateSize)}
          onChange={v => setSettings({ slateSize: Number(v) })}
        />

        <SegmentedRow
          Icon={Percent}
          label="ODDS DISPLAY"
          hint="COEFFICIENT OR IMPLIED CHANCE"
          width={CONTENT_W}
          options={['DEC', 'PCT']}
          value={oddsFormat === 'decimal' ? 'DEC' : 'PCT'}
          onChange={v =>
            setSettings({ oddsFormat: v === 'DEC' ? 'decimal' : 'percent' })
          }
        />

        <SwitchRow
          Icon={Gauge}
          label="REDUCED MOTION"
          hint="FASTER REVEAL, COUNTERS SNAP"
          width={CONTENT_W}
          value={reducedMotion}
          onChange={v => setSettings({ reducedMotion: v })}
        />

        <SwitchRow
          Icon={Home}
          label="HOME ADVANTAGE HINT"
          hint="SHOW THE HOME +6 TAG ON CARDS"
          width={CONTENT_W}
          value={homeHint}
          onChange={v => setSettings({ homeHint: v })}
        />

        <View style={styles.dangerBlock}>
          <Text style={styles.dangerHint} numberOfLines={2}>
            RESET WIPES POINTS, XP, MASTERY, STREAKS AND INSIGHT TOKENS
          </Text>
          <SecondaryButton
            label="RESET PROGRESS"
            Icon={Trash2}
            onPress={() => setConfirm(true)}
            width={CONTENT_W}
            height={48}
            tone="danger"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onMenu} width={CONTENT_W} height={48} />
      </View>

      {confirm ? (
        <ConfirmOverlay
          title="RESET PROGRESS?"
          body="This clears every arena point, XP, club mastery, daily streak and insight token. Your settings stay as they are."
          confirmLabel="RESET"
          cancelLabel="KEEP IT"
          danger
          onConfirm={() => {
            resetProgress();
            setConfirm(false);
          }}
          onCancel={() => setConfirm(false)}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    gap: 10,
  },
  dangerBlock: {
    marginTop: 10,
    gap: 10,
    alignItems: 'center',
  },
  dangerHint: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
  },
});
