import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

export function CustomSplashScreen({
  isAppReady,
  onAnimationComplete,
}: {
  isAppReady: boolean;
  onAnimationComplete: () => void;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isAppReady) {
      scale.value = withDelay(
        200,
        withTiming(15, {
          duration: 1200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      );
      opacity.value = withDelay(
        400,
        withTiming(0, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }, (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    }
  }, [isAppReady]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, containerStyle]} pointerEvents="none">
      <Animated.Image
        source={require('../../../assets/images/icon.png')}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background, 
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
