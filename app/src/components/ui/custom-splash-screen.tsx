import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';
import Constants from 'expo-constants';

export function CustomSplashScreen({
  isAppReady,
  onAnimationComplete,
}: {
  isAppReady: boolean;
  onAnimationComplete: () => void;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const version = Constants.expoConfig?.version || '1.0.0';

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
      <View style={styles.content}>
        <Animated.Image
          source={require('../../../assets/images/icon.png')}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.versionText}>v{version}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background, 
    zIndex: 9999,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
