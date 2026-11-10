/**
 * The full match card: two TeamCards, the VS divider and the insight slot.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Eye } from 'lucide-react-native';
import { assets } from '../assets';
import {
  BOARD_BORDER,
  BOARD_CONTENT_W,
  BOARD_MAX_W,
  BOARD_PAD,
} from '../constants/layout';
import { theme } from '../constants/theme';
import type { Fixture } from '../game/slate';
import { PressScale } from './PressScale';
import { TeamCard } from './TeamCard';

const VS_W = 40;
const COL_W = Math.floor((BOARD_CONTENT_W - VS_W) / 2);

type Props = {
  fixture: Fixture;
  insight: string | null;
  tokens: number;
  onInsight: () => void;
  homeHint: boolean;
  compact?: boolean;
};

function FixtureCardBase({
  fixture,
  insight,
  tokens,
  onInsight,
  homeHint,
  compact = false,
}: Props) {
  const canBuy = tokens > 0 && insight === null;

  return (
    <View style={styles.card}>
      <View style={styles.fixtureHeader}>
        <Text style={styles.meta} numberOfLines={1}>
          {'ARENA LEAGUE · ROUND ' + fixture.round}
        </Text>
        <Text style={styles.meta}>{fixture.kickoff}</Text>
      </View>

      <View style={styles.teamRow}>
        <TeamCard
          side={fixture.home}
          other={fixture.away.ratings}
          isHome
          width={COL_W}
          compact={compact}
          showHomeTag={homeHint}
        />
        <View style={styles.vsCol}>
          <View style={styles.vsLine} />
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsLine} />
        </View>
        <TeamCard
          side={fixture.away}
          other={fixture.home.ratings}
          isHome={false}
          width={COL_W}
          compact={compact}
          showHomeTag={homeHint}
        />
      </View>

      {insight !== null ? (
        <View style={styles.insightStrip}>
          <Text style={styles.insightText} numberOfLines={2}>
            {insight}
          </Text>
        </View>
      ) : (
        <PressScale
          onPress={onInsight}
          disabled={!canBuy}
          accessibilityLabel="SPEND 1 INSIGHT"
          scaleTo={0.97}
          style={[
            styles.insightButton,
            { opacity: canBuy ? 1 : 0.38 },
          ]}>
          <View style={styles.insightRow}>
            <View style={styles.insightPlate}>
              <Image source={assets.buttonRound} style={styles.plate} />
              <Eye size={18} strokeWidth={1.5} color="#FFB020" />
            </View>
            <Text style={styles.insightLabel}>SPEND 1 INSIGHT</Text>
            <Text style={styles.insightCount}>{tokens}</Text>
          </View>
        </PressScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: BOARD_MAX_W,
    padding: BOARD_PAD,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.divider,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 6,
  },
  fixtureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meta: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vsCol: {
    width: VS_W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 26,
  },
  vsLine: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  vsText: {
    color: theme.colors.text.muted,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginVertical: 6,
  },
  insightButton: {
    width: BOARD_CONTENT_W,
    height: 44,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,176,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.28)',
  },
  insightRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  insightPlate: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    position: 'absolute',
    width: 28,
    height: 28,
    opacity: 0.3,
    resizeMode: 'contain',
  },
  insightLabel: {
    flex: 1,
    color: theme.colors.accent.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 16,
  },
  insightCount: {
    color: theme.colors.accent.secondary,
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  insightStrip: {
    width: BOARD_CONTENT_W,
    minHeight: 44,
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,176,32,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.24)',
  },
  insightText: {
    color: theme.colors.accent.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 15,
  },
});

export const FixtureCard = React.memo(FixtureCardBase);
