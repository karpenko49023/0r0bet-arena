/**
 * The club collection. Unlocked clubs show mastery; locked ones say how to
 * unlock them. Tapping an unlocked card opens the indicator radar.
 */
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { Layers } from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { ClubCard } from '../components/ClubCard';
import { ClubRadar } from '../components/ClubRadar';
import { EmptyState } from '../components/EmptyState';
import { IconRoundButton } from '../components/IconRoundButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import {
  COLLECTION_CARD_W,
  CONTENT_W,
  HEADER_TOTAL,
  H_PADDING,
  SCREEN_H,
  SCREEN_W,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { CLUBS, Club } from '../game/clubs';
import { isUnlocked, masteryToNextStar, starText } from '../game/progression';
import { useGameStore } from '../hooks/useGameStore';

type Props = { onMenu: () => void };

const CARD_H = 168;

export default function CollectionScreen({ onMenu }: Props) {
  const mastery = useGameStore(s => s.mastery);
  const [selected, setSelected] = useState<Club | null>(null);

  const unlockedCount = CLUBS.filter(c => isUnlocked(mastery[c.id] || 0)).length;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Club>) => {
      const m = mastery[item.id] || 0;
      const locked = !isUnlocked(m);
      return (
        <ClubCard
          club={item}
          mastery={m}
          locked={locked}
          width={COLLECTION_CARD_W}
          height={CARD_H}
          onPress={() => setSelected(item)}
        />
      );
    },
    [mastery],
  );

  const keyExtractor = useCallback((item: Club) => String(item.id), []);

  return (
    <AppShell variant="hub" blobTop={HEADER_TOTAL + 20} blobColor="rgba(255,176,32,0.09)">
      <ScreenHeader
        title="COLLECTION"
        subtitle={unlockedCount + ' / ' + CLUBS.length + ' CLUBS SCOUTED'}
        leftWidth={56}
        rightWidth={70}
        leftSlot={
          <IconRoundButton
            icon={assets.iconHome}
            onPress={onMenu}
            accessibilityLabel="HOME"
          />
        }
        rightSlot={
          <View style={styles.countChip}>
            <Text style={styles.countText}>
              {unlockedCount + ' / ' + CLUBS.length}
            </Text>
          </View>
        }
      />

      {unlockedCount === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            Icon={Layers}
            title="NO CLUBS SCOUTED YET"
            hint="PLAY A SLATE TO START YOUR COLLECTION — THREE CORRECT CALLS ON A CLUB UNLOCKS ITS CARD"
          />
        </View>
      ) : null}

      <FlatList
        data={CLUBS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews={false}
      />

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onMenu} width={CONTENT_W} height={48} />
      </View>

      {selected ? (
        <View style={styles.overlay}>
          <View style={styles.detailCard}>
            <Text style={styles.detailName}>{selected.name}</Text>
            <Text style={[styles.detailStars, { color: selected.tint }]}>
              {starText(mastery[selected.id] || 0)}
            </Text>
            <ClubRadar club={selected} size={170} />
            <Text style={styles.detailLine}>
              {'PREDICTED CORRECTLY ' +
                (mastery[selected.id] || 0) +
                ' TIMES'}
            </Text>
            <Text style={styles.detailHint}>
              {masteryToNextStar(mastery[selected.id] || 0) > 0
                ? masteryToNextStar(mastery[selected.id] || 0) +
                  ' MORE CORRECT CALLS FOR THE NEXT STAR'
                : 'FULLY MASTERED · LOWEST INDICATOR NOISE'}
            </Text>
            <SecondaryButton
              label="CLOSE"
              onPress={() => setSelected(null)}
              width={CONTENT_W - 40}
              height={48}
            />
          </View>
        </View>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  countChip: {
    height: 32,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.28)',
  },
  countText: {
    color: theme.colors.accent.secondary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  emptyWrap: {
    paddingHorizontal: H_PADDING,
  },
  list: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 12,
    gap: 12,
  },
  column: {
    gap: 12,
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
    paddingTop: 8,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,9,12,0.9)',
    paddingHorizontal: H_PADDING,
  },
  detailCard: {
    width: CONTENT_W,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.accent,
    borderWidth: 1,
    borderColor: theme.colors.ui.divider,
  },
  detailName: {
    color: theme.colors.text.primary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  detailStars: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 16,
    letterSpacing: 3,
  },
  detailLine: {
    marginTop: 12,
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  detailHint: {
    marginTop: 6,
    marginBottom: 16,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
    lineHeight: 15,
  },
});
