/**
 * The press-feedback pattern for this stack:
 * Pressable is the PARENT, the Animated.View scaling on transform is the CHILD.
 * Never the other way round — an Animated wrapper around a Pressable eats the
 * tap on Android release builds.
 */
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { HIT_SLOP } from '../constants/layout';
import { theme } from '../constants/theme';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  /** MUST carry an explicit width and height. */
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleTo?: number;
  accessibilityLabel: string;
};

function PressScaleBase({
  onPress,
  children,
  style,
  innerStyle,
  disabled,
  scaleTo = 0.96,
  accessibilityLabel,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTo,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, scaleTo]);

  const handleOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      style={style}
      onPress={onPress}
      onPressIn={handleIn}
      onPressOut={handleOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          { flex: 1, transform: [{ scale }] },
          innerStyle,
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export const PressScale = React.memo(PressScaleBase);
