/**
 * Daily briefing — a preview of today's seeded 3-fixture slate, the streak
 * calendar and one attempt per day. Never a dead end: MENU is always live.
 */
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Play } from 'lucide-react-native';
import { assets, crestFor } from '../assets';
import { AppShell } from '../components/AppShell';
import { IconRoundButton } from '../components/IconRoundButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { DAILY_SLATE_SIZE } from '../constants/config';
import {
  CONTENT_W,
  HEADER_TOTAL,
  H_PADDING,
} from '../constants/layout';
import { theme } from '../constants/theme';
import { formatOdds } from '../game/odds';
import { daySeed } from '../game/rng';
import { generateSlate } from '../game/slate';
import { dailyAvailable, getState } from '../game/store';
import { timeToMidnight } from '../hooks/useCountdown';
import { useGameStore } from '../hooks/useGameStore';

type Props = {
  onStart: () => void;
  onMenu: () => void;
};

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export default function DailyModeScreen({ onStart, onMenu }: Props) {
  const oddsFormat = useGameStore(s => s.settings.oddsFormat);
  const dots = useGameStore(s => s.dailyDots);
  const streak = useGameStore(s => s.dailyStreak);
  const available = useGameStore(s => s.dailyLastPlayed) !== null
    ? dailyAvailable()
    : true;

  const slate = useMemo(
    () => generateSlate(daySeed(), DAILY_SLATE_SIZE, getState().mastery),
    [],
  );

  const now = new Date();
  const dateLabel =
    'TODAY · ' + String(now.getDate()).padStart(2, '0') + ' ' + MONTHS[now.getMonth()];

  return (
    <AppShell variant="hub" blobTop={HEADER_TOTAL + 20}>
      <ScreenHeader
        title="DAILY MODE"
        subtitle={dateLabel}
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
          <View style={styles.streakChip}>
            <CalendarDays size={14} strokeWidth={1.5} color="#17E08C" />
            <Text style={styles.streakText}>{String(streak)}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>TODAY&apos;S BRIEFING</Text>

        <View style={styles.fixtures}>
          {slate.fixtures.map(f => (
            <View key={f.id} style={styles.fixtureRow}>
              <Image
                source={crestFor(f.home.club.crest)}
                style={styles.crest}
                resizeMode="contain"
              />
              <Text style={styles.fixtureText} numberOfLines={1}>
                {f.home.club.short + '  v  ' + f.away.club.short}
              </Text>
              <Image
                source={crestFor(f.away.club.crest)}
                style={styles.crest}
                resizeMode="contain"
              />
              <Text style={styles.coef}>
                {formatOdds(f.odds.home, f.prob.home, oddsFormat)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>STREAK CALENDAR</Text>
        <View style={styles.calendar}>
          {dots.map((dot, i) => (
            <View key={i} style={styles.dayCol}>
              <View
                style={[
                  styles.dot,
                  dot === 2
                    ? styles.dotHit
                    : dot === 1
                    ? styles.dotMiss
                    : null,
                ]}
              />
              <Text style={styles.dayLetter}>{DAY_LETTERS[i]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.countdown}>
          {'NEXT SLATE IN ' + timeToMidnight()}
        </Text>
      </View>

      <View style={styles.footer}>
        {available ? (
          <>
            <Text style={styles.hint} numberOfLines={1}>
              {DAILY_SLATE_SIZE + ' FIXTURES · 4 CONFIDENCE · ONE ATTEMPT'}
            </Text>
            <PrimaryButton
              label="START DAILY"
              Icon={Play}
              onPress={onStart}
              width={CONTENT_W}
              height={56}
            />
          </>
        ) : (
          <View style={styles.playedCard}>
            <Text style={styles.playedTitle}>TODAY&apos;S SLATE IS LOGGED</Text>
            <Text style={styles.playedHint}>
              COME BACK TOMORROW FOR A NEW BRIEFING
            </Text>
          </View>
        )}
        <SecondaryButton label="MENU" onPress={onMenu} width={CONTENT_W} height={48} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  streakChip: {
    height: 32,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: 'rgba(23,224,140,0.28)',
  },
  streakText: {
    color: theme.colors.accent.primary,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  fixtures: {
    gap: 8,
  },
  fixtureRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  crest: {
    width: 30,
    height: 30,
  },
  fixtureText: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  coef: {
    width: 52,
    textAlign: 'right',
    color: theme.colors.accent.primary,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2A2A33',
  },
  dotHit: {
    backgroundColor: '#17E08C',
  },
  dotMiss: {
    backgroundColor: '#FFB020',
  },
  dayLetter: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  countdown: {
    marginTop: 14,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 20,
    gap: 10,
    alignItems: 'center',
  },
  hint: {
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  playedCard: {
    width: CONTENT_W,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  playedTitle: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  playedHint: {
    marginTop: 4,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
