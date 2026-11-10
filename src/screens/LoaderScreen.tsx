/**
 * Splash. Holds for EXACTLY LOADER_DURATION_MS (8000) and leaves on the timer
 * only — no tap-to-skip, no animation callback navigation, no PLAY button and
 * no stat chips. A brand card with a far darker overlay than the Menu.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { AppShell } from '../components/AppShell';
import { LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';

const BAR_W = 180;

type Props = { onDone: () => void };

export default function LoaderScreen({ onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(16)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 380,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 380,
        delay: 260,
        useNativeDriver: true,
      }),
    ]).start();

    // width is a layout property -> native driver must stay false
    Animated.timing(progress, {
      toValue: BAR_W,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    }).start();

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 300,
      delay: LOADER_DURATION_MS - 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      doneRef.current();
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [cardScale, cardOpacity, titleOpacity, titleY, progress, screenOpacity]);

  return (
    <AppShell
      variant="loader"
      blobColor="rgba(23,224,140,0.10)"
      blobTop={150}
      gridOpacity={0.035}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.root, { opacity: screenOpacity }]}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            alignItems: 'center',
          }}>
          <Text style={styles.title}>OROBET ARENA</Text>
          <Text style={styles.subtitle}>READ THE FORM · CALL THE RESULT</Text>
        </Animated.View>

        <View style={styles.barBlock}>
          <View style={styles.track}>
            <Animated.View
              pointerEvents="none"
              style={[styles.fillWrap, { width: progress }]}>
              <LinearGradient
                colors={['#17E08C', '#FFB020']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING ARENA...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 180,
    height: 180,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F24',
    borderWidth: 1,
    borderColor: 'rgba(23,224,140,0.22)',
    shadowColor: '#17E08C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 34,
  },
  logo: {
    width: 148,
    height: 148,
  },
  title: {
    color: '#F5F6F8',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: theme.colors.text.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
  },
  barBlock: {
    marginTop: 44,
    alignItems: 'center',
  },
  track: {
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#1F1F24',
    overflow: 'hidden',
  },
  fillWrap: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    width: BAR_W,
    height: 3,
  },
  loading: {
    marginTop: 10,
    color: theme.colors.text.muted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
  },
});
