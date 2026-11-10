/**
 * OROBET ARENA — navigation is a state machine, not a navigation library.
 * Loader -> Menu -> Game -> Result -> Menu, plus the hub screens that are
 * one tap from Menu or Result.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, View } from 'react-native';
import type { GameResult } from './src/game/result';
import { hydrate } from './src/game/store';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import DailyModeScreen from './src/screens/DailyModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'challenge'
  | 'progress'
  | 'collection'
  | 'daily'
  | 'settings';

function ScreenFade({
  screenKey,
  children,
}: {
  screenKey: string;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(18);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenKey, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.fill, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [gameMode, setGameMode] = useState<'arena' | 'daily'>('arena');
  const [runId, setRunId] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    hydrate();
  }, []);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startArena = useCallback(() => {
    setGameMode('arena');
    setRunId(n => n + 1);
    setScreen('game');
  }, []);

  const startDaily = useCallback(() => {
    setGameMode('daily');
    setRunId(n => n + 1);
    setScreen('game');
  }, []);

  const startChallenge = useCallback(() => {
    setRunId(n => n + 1);
    setScreen('challenge');
  }, []);

  const onGameOver = useCallback((payload: GameResult) => {
    setResult(payload);
    setScreen('result');
  }, []);

  const playAgain = useCallback(() => {
    if (result && result.mode === 'challenge') {
      startChallenge();
      return;
    }
    startArena();
  }, [result, startChallenge, startArena]);

  // System Back returns to the previous screen; on Menu it closes the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  let body: React.ReactNode = null;
  let key: string = screen;

  if (screen === 'loader') {
    body = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        onPlay={startArena}
        onChallenge={startChallenge}
        onDaily={() => setScreen('daily')}
        onProgress={() => setScreen('progress')}
        onCollection={() => setScreen('collection')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'game') {
    key = 'game-' + runId;
    body = (
      <GameScreen
        key={key}
        mode={gameMode}
        onGameOver={onGameOver}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'challenge') {
    key = 'challenge-' + runId;
    body = (
      <ChallengeScreen key={key} onGameOver={onGameOver} onMenu={goMenu} />
    );
  } else if (screen === 'result' && result) {
    body = (
      <ResultScreen
        result={result}
        onAgain={playAgain}
        onMenu={goMenu}
        onProgress={() => setScreen('progress')}
        onCollection={() => setScreen('collection')}
      />
    );
  } else if (screen === 'progress') {
    body = <ProgressScreen onMenu={goMenu} />;
  } else if (screen === 'collection') {
    body = <CollectionScreen onMenu={goMenu} />;
  } else if (screen === 'daily') {
    body = <DailyModeScreen onStart={startDaily} onMenu={goMenu} />;
  } else if (screen === 'settings') {
    body = <SettingsScreen onMenu={goMenu} />;
  } else {
    body = (
      <MenuScreen
        onPlay={startArena}
        onChallenge={startChallenge}
        onDaily={() => setScreen('daily')}
        onProgress={() => setScreen('progress')}
        onCollection={() => setScreen('collection')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return (
    <View style={styles.fill}>
      <ScreenFade screenKey={key}>{body}</ScreenFade>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#09090C',
  },
});
