/**
 * Home hub — M3 Bento grid. One tap from here to every other screen.
 * No ScrollView: the grid is sized from the viewport.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import {
  CalendarDays,
  Coins,
  Flame,
  Layers,
  Play,
  Settings as SettingsIcon,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react-native';
import { assets, crestFor } from '../assets';
import { AppShell } from '../components/AppShell';
import { BentoTile } from '../components/BentoTile';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatCard } from '../components/StatCard';
import {
  CONTENT_W,
  HALF_TILE_W,
  HEADER_TOTAL,
  H_PADDING,
  SCREEN_H,
  TILE_GAP,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { formatPoints } from '../game/odds';
import { tierIndexFor, tierNameFor } from '../game/progression';
import { dailyAvailable } from '../game/store';
import { useGameStore } from '../hooks/useGameStore';
import { timeToMidnight } from '../hooks/useCountdown';

const ROW_STAT_H = 88;
const ROW_MODE_H = 96;
const ROW_HUB_H = 96;
const ROW_SETTINGS_H = 56;

const FIXED =
  HEADER_TOTAL +
  ROW_STAT_H +
  ROW_MODE_H +
  ROW_HUB_H +
  ROW_SETTINGS_H +
  TILE_GAP * 4 +
  16;

const PLAY_H = Math.max(140, Math.min(180, SCREEN_H - FIXED));

type Props = {
  onPlay: () => void;
  onChallenge: () => void;
  onDaily: () => void;
  onProgress: () => void;
  onCollection: () => void;
  onSettings: () => void;
};

function useStagger(index: number) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 260,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, [anim, index]);
  return {
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  };
}

function Row({ index, children }: { index: number; children: React.ReactNode }) {
  const style = useStagger(index);
  return (
    <Animated.View pointerEvents="box-none" style={style}>
      {children}
    </Animated.View>
  );
}

export default function MenuScreen({
  onPlay,
  onChallenge,
  onDaily,
  onProgress,
  onCollection,
  onSettings,
}: Props) {
  const points = useGameStore(s => s.points);
  const xp = useGameStore(s => s.xp);
  const slatesPlayed = useGameStore(s => s.slatesPlayed);
  const correctPicks = useGameStore(s => s.correctPicks);
  const totalPicks = useGameStore(s => s.totalPicks);
  const bestChain = useGameStore(s => s.bestChain);
  const slateSize = useGameStore(s => s.settings.slateSize);
  const mastery = useGameStore(s => s.mastery);

  const accuracy =
    totalPicks > 0 ? Math.round((correctPicks / totalPicks) * 100) : 0;
  const unlockedCount = Object.keys(mastery).filter(
    k => mastery[Number(k)] >= 3,
  ).length;
  const tier = tierNameFor(xp);
  const tierNo = tierIndexFor(xp) + 1;
  const budget = Math.ceil(slateSize * 1.4);
  const hasHistory = slatesPlayed > 0;

  return (
    <AppShell variant="menu" blobTop={HEADER_TOTAL + 40}>
      <ScreenHeader
        title="OROBET ARENA"
        leftWidth={170}
        rightWidth={120}
        leftSlot={
          <View style={styles.brand}>
            <Image source={assets.logo} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.brandText} numberOfLines={1}>
              OROBET ARENA
            </Text>
          </View>
        }
        centerSlot={<View />}
        rightSlot={
          <View style={styles.pointsPill}>
            <Coins size={16} strokeWidth={1.5} color="#17E08C" />
            <Text style={styles.pointsValue} numberOfLines={1}>
              {formatPoints(points)}
            </Text>
          </View>
        }
      />

      <View style={styles.grid}>
        <Row index={0}>
          <View style={[styles.playTile, { height: PLAY_H }]}>
            <Image
              source={assets.buttonRect}
              style={styles.playBacking}
              resizeMode="stretch"
            />
            <View style={styles.crestStack} pointerEvents="none">
              <Image source={crestFor(1)} style={styles.crest} resizeMode="contain" />
              <Image source={crestFor(3)} style={[styles.crest, styles.crestOverlap]} resizeMode="contain" />
              <Image source={crestFor(5)} style={[styles.crest, styles.crestOverlap]} resizeMode="contain" />
            </View>

            <View style={styles.playText}>
              <Text style={styles.tierLabel} numberOfLines={1}>
                {tier + ' · TIER ' + tierNo}
              </Text>
              <Text style={styles.playHeadline}>TODAY&apos;S SLATE</Text>
              <Text style={styles.playSub} numberOfLines={1}>
                {slateSize + ' MATCHES · ' + budget + ' CONFIDENCE'}
              </Text>
            </View>

            <PrimaryButton
              label="PLAY NOW"
              Icon={Play}
              onPress={onPlay}
              width={CONTENT_W - 28}
              height={56}
            />
          </View>
        </Row>

        <Row index={1}>
          {hasHistory ? (
            <View style={[styles.rowPair, { height: ROW_STAT_H }]}>
              <View style={styles.slot}>
                <StatCard
                  Icon={Target}
                  value={accuracy + '%'}
                  label="ACCURACY"
                  valueColor="#17E08C"
                />
              </View>
              <View style={styles.slot}>
                <StatCard
                  Icon={Flame}
                  value={String(bestChain)}
                  label="BEST CHAIN"
                  valueColor="#FFB020"
                />
              </View>
            </View>
          ) : (
            <View style={[styles.wideNote, { height: ROW_STAT_H }]}>
              <Text style={styles.wideNoteText}>
                NO SLATES PLAYED YET
              </Text>
              <Text style={styles.wideNoteHint}>
                TAP PLAY NOW TO OPEN YOUR FIRST ARENA
              </Text>
            </View>
          )}
        </Row>

        <Row index={2}>
          <View style={[styles.rowPair, { height: ROW_MODE_H }]}>
            <BentoTile
              Icon={Zap}
              label="CHALLENGE"
              sub="90 SECONDS"
              width={HALF_TILE_W}
              height={ROW_MODE_H}
              accent="#FFB020"
              onPress={onChallenge}
            />
            <BentoTile
              Icon={CalendarDays}
              label="DAILY MODE"
              sub={
                dailyAvailable()
                  ? 'SLATE READY'
                  : 'NEXT IN ' + timeToMidnight().slice(0, 5)
              }
              width={HALF_TILE_W}
              height={ROW_MODE_H}
              accent="#17E08C"
              onPress={onDaily}
            />
          </View>
        </Row>

        <Row index={3}>
          <View style={[styles.rowPair, { height: ROW_HUB_H }]}>
            <BentoTile
              Icon={TrendingUp}
              label="PROGRESS"
              sub={tier + ' · ' + formatPoints(xp) + ' XP'}
              width={HALF_TILE_W}
              height={ROW_HUB_H}
              accent="#17E08C"
              onPress={onProgress}
            />
            <BentoTile
              Icon={Layers}
              label="COLLECTION"
              sub={unlockedCount + ' / 10 CLUBS'}
              width={HALF_TILE_W}
              height={ROW_HUB_H}
              accent="#FFB020"
              onPress={onCollection}
            />
          </View>
        </Row>

        <Row index={4}>
          <BentoTile
            Icon={SettingsIcon}
            label="SETTINGS"
            width={CONTENT_W}
            height={ROW_SETTINGS_H}
            accent="#A0A3AE"
            trailing="OPEN"
            onPress={onSettings}
          />
        </Row>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 26,
    height: 26,
  },
  brandText: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  pointsPill: {
    height: 40,
    minWidth: 92,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(23,224,140,0.28)',
  },
  pointsValue: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  grid: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    gap: TILE_GAP,
  },
  playTile: {
    width: CONTENT_W,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  playBacking: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.18,
  },
  crestStack: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  crest: {
    width: 48,
    height: 48,
  },
  crestOverlap: {
    marginLeft: -18,
  },
  playText: {
    marginBottom: 12,
  },
  tierLabel: {
    color: theme.colors.accent.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  playHeadline: {
    marginTop: 4,
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  playSub: {
    marginTop: 3,
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  rowPair: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  slot: {
    flex: 1,
    justifyContent: 'center',
  },
  wideNote: {
    width: CONTENT_W,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  wideNoteText: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  wideNoteHint: {
    marginTop: 6,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
