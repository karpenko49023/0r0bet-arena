/**
 * Lifetime record: tier ladder, bento stats, the last-10 accuracy sparkline
 * and a per-mode breakdown. Zero-value tiles are not rendered.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Eye,
  Flame,
  History,
  Layers,
  Target,
  TrendingUp,
} from 'lucide-react-native';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { EmptyState } from '../components/EmptyState';
import { IconRoundButton } from '../components/IconRoundButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { Sparkline } from '../components/Sparkline';
import { StatCard } from '../components/StatCard';
import {
  CONTENT_W,
  HALF_TILE_W,
  HEADER_TOTAL,
  H_PADDING,
  TILE_GAP,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { formatPoints } from '../game/odds';
import {
  nextTierName,
  tierIndexFor,
  tierNameFor,
  xpIntoTier,
  xpToNextTier,
} from '../game/progression';
import { TIER_XP_STEP } from '../constants/config';
import { useGameStore } from '../hooks/useGameStore';

type Props = { onMenu: () => void };

const MODE_ROWS: Array<{ key: 'arena' | 'challenge' | 'daily'; label: string }> = [
  { key: 'arena', label: 'ARENA' },
  { key: 'challenge', label: 'CHALLENGE' },
  { key: 'daily', label: 'DAILY' },
];

export default function ProgressScreen({ onMenu }: Props) {
  const xp = useGameStore(s => s.xp);
  const points = useGameStore(s => s.points);
  const tokens = useGameStore(s => s.tokens);
  const slatesPlayed = useGameStore(s => s.slatesPlayed);
  const correctPicks = useGameStore(s => s.correctPicks);
  const totalPicks = useGameStore(s => s.totalPicks);
  const bestChain = useGameStore(s => s.bestChain);
  const history = useGameStore(s => s.history);
  const modeStats = useGameStore(s => s.modeStats);

  const tier = tierNameFor(xp);
  const next = nextTierName(xp);
  const toNext = xpToNextTier(xp);
  const into = xpIntoTier(xp);
  const ratio = Math.max(0.02, Math.min(1, into / TIER_XP_STEP));
  const accuracy =
    totalPicks > 0 ? Math.round((correctPicks / totalPicks) * 100) : 0;
  const empty = slatesPlayed === 0;

  return (
    <AppShell variant="hub" blobTop={HEADER_TOTAL + 30}>
      <ScreenHeader
        title="PROGRESS"
        subtitle={'TIER ' + (tierIndexFor(xp) + 1) + ' · ' + tier}
        leftWidth={56}
        rightWidth={86}
        leftSlot={
          <IconRoundButton
            icon={assets.iconHome}
            onPress={onMenu}
            accessibilityLabel="HOME"
          />
        }
        rightSlot={
          <View style={styles.tierChip}>
            <Text style={styles.tierChipText} numberOfLines={1}>
              {formatPoints(points)}
            </Text>
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.tierCard}>
          <View style={styles.tierTop}>
            <Text style={styles.tierName}>{tier}</Text>
            <Text style={styles.tierXp}>{formatPoints(xp) + ' XP'}</Text>
          </View>
          <View style={styles.track}>
            <LinearGradient
              colors={['#17E08C', '#FFB020']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: (CONTENT_W - 28) * ratio, height: 8 }}
            />
          </View>
          <Text style={styles.tierHint}>
            {toNext > 0
              ? formatPoints(toNext) + ' XP TO ' + next
              : 'TOP TIER REACHED · ORACLE'}
          </Text>
        </View>

        {empty ? (
          <EmptyState
            Icon={History}
            title="NO HISTORY YET"
            hint="PLAY A SLATE TO BUILD YOUR RECORD"
          />
        ) : (
          <>
            <View style={styles.grid}>
              <View style={styles.slot}>
                <StatCard
                  Icon={Layers}
                  value={String(slatesPlayed)}
                  label="SLATES"
                  valueColor="#17E08C"
                />
              </View>
              <View style={styles.slot}>
                <StatCard
                  Icon={Target}
                  value={accuracy + '%'}
                  label="ACCURACY"
                  valueColor="#FFB020"
                />
              </View>
            </View>
            <View style={styles.grid}>
              <View style={styles.slot}>
                <StatCard
                  Icon={Flame}
                  value={bestChain > 0 ? String(bestChain) : ''}
                  label="BEST CHAIN"
                  valueColor="#FF5A6E"
                />
              </View>
              <View style={styles.slot}>
                <StatCard
                  Icon={Eye}
                  value={tokens > 0 ? String(tokens) : ''}
                  label="INSIGHTS"
                  valueColor="#4FC3F7"
                />
              </View>
            </View>

            <Sparkline values={history} width={CONTENT_W} height={82} />

            <View style={styles.modeBlock}>
              {MODE_ROWS.map(row => {
                const stat = modeStats[row.key];
                const acc =
                  stat.total > 0
                    ? Math.round((stat.correct / stat.total) * 100)
                    : 0;
                return (
                  <View key={row.key} style={styles.modeRow}>
                    <TrendingUp
                      size={14}
                      strokeWidth={1.5}
                      color={theme.colors.text.muted}
                    />
                    <Text style={styles.modeLabel}>{row.label}</Text>
                    <Text style={styles.modeValue}>
                      {formatPoints(stat.points)}
                    </Text>
                    <Text style={styles.modeAcc}>{acc + '%'}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onMenu} width={CONTENT_W} height={48} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: H_PADDING,
    gap: TILE_GAP,
  },
  tierChip: {
    height: 32,
    minWidth: 70,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(23,224,140,0.28)',
  },
  tierChipText: {
    color: theme.colors.accent.primary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  tierCard: {
    width: CONTENT_W,
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  tierTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tierName: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  tierXp: {
    color: theme.colors.accent.primary,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  track: {
    width: CONTENT_W - 28,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#232329',
    overflow: 'hidden',
  },
  tierHint: {
    marginTop: 8,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  grid: {
    flexDirection: 'row',
    gap: TILE_GAP,
  },
  slot: {
    width: HALF_TILE_W,
    justifyContent: 'center',
  },
  modeBlock: {
    gap: 6,
  },
  modeRow: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(24,24,28,0.8)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  modeLabel: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  modeValue: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  modeAcc: {
    width: 44,
    textAlign: 'right',
    color: theme.colors.accent.primary,
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
  },
});
