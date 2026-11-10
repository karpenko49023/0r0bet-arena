/**
 * Collection grid card: unlocked shows crest, mastery stars and two mini bars;
 * locked dims the crest and names the way to unlock it.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { crestFor } from '../assets';
import { theme } from '../constants/theme';
import type { Club } from '../game/clubs';
import { starText } from '../game/progression';
import { PressScale } from './PressScale';

type Props = {
  club: Club;
  mastery: number;
  locked: boolean;
  width: number;
  height: number;
  onPress: () => void;
};

function MiniBar({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <View style={styles.miniRow}>
      <Text style={styles.miniLabel}>{label}</Text>
      <View style={styles.miniTrack}>
        <View
          style={[
            styles.miniFill,
            { flex: Math.max(4, value), backgroundColor: tint },
          ]}
        />
        <View style={{ flex: Math.max(1, 100 - value) }} />
      </View>
    </View>
  );
}

function ClubCardBase({
  club,
  mastery,
  locked,
  width,
  height,
  onPress,
}: Props) {
  return (
    <PressScale
      onPress={onPress}
      disabled={locked}
      accessibilityLabel={club.name}
      scaleTo={0.97}
      style={[
        styles.press,
        { width, height },
        locked ? styles.pressLocked : null,
      ]}>
      <View style={styles.inner}>
        <View
          style={[
            styles.crestRing,
            {
              borderColor: locked ? 'rgba(255,255,255,0.10)' : club.tint,
              backgroundColor: locked ? 'transparent' : club.tint + '14',
            },
          ]}>
          <Image
            source={crestFor(club.crest)}
            style={[styles.crest, locked ? styles.crestLocked : null]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {club.name}
        </Text>

        {locked ? (
          <Text style={styles.lockHint} numberOfLines={2}>
            SCOUT THIS CLUB TO UNLOCK
          </Text>
        ) : (
          <>
            <Text style={[styles.stars, { color: club.tint }]}>
              {starText(mastery)}
            </Text>
            <MiniBar label="ATT" value={club.att} tint={club.tint} />
            <MiniBar label="DEF" value={club.def} tint="#6B6E79" />
          </>
        )}
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 18,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  pressLocked: {
    backgroundColor: 'rgba(24,24,28,0.6)',
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inner: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  crestRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crest: {
    width: 56,
    height: 56,
  },
  crestLocked: {
    opacity: 0.18,
  },
  name: {
    marginTop: 8,
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  stars: {
    marginTop: 4,
    marginBottom: 6,
    fontSize: 13,
    letterSpacing: 2,
  },
  lockHint: {
    marginTop: 8,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 14,
  },
  miniRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  miniLabel: {
    width: 26,
    color: theme.colors.text.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  miniTrack: {
    flex: 1,
    height: 4,
    flexDirection: 'row',
    borderRadius: 2,
    backgroundColor: '#232329',
    overflow: 'hidden',
  },
  miniFill: {
    height: 4,
    borderRadius: 2,
  },
});

export const ClubCard = React.memo(ClubCardBase);
