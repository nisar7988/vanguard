import { COLORS, SHADOWS } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemedGradient } from "./themed-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: Record<string, { icon: IconName; activeIcon: IconName; label: string }> = {
  dashboard: {
    icon: "grid-outline",
    activeIcon: "grid",
    label: "Home",
  },
  logs: {
    icon: "document-text-outline",
    activeIcon: "document-text",
    label: "Logs",
  },
};

function TabItem({
  route,
  isFocused,
  onPress,
  onLongPress,
}: {
  route: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const config = TAB_CONFIG[route];
  if (!config) return null;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 7,
      }),
      Animated.timing(glowAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(labelAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const iconColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.primary],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.tabItem}
      accessibilityRole="button"
      accessibilityLabel={config.label}
    >
      {/* Active pill background */}
      {isFocused && (
        <Animated.View style={styles.activePill} />
      )}

      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: "center" }}>
        <Animated.Text style={{ fontSize: 0, color: iconColor }}>
          {/* Used to drive icon color via interpolation */}
        </Animated.Text>
        <Ionicons
          name={isFocused ? config.activeIcon : config.icon}
          size={22}
          color={isFocused ? COLORS.primary : COLORS.textSecondary}
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.tabLabel,
          {
            opacity: labelAnim,
            color: COLORS.primary,
            transform: [
              {
                translateY: labelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 0],
                }),
              },
            ],
          },
        ]}
      >
        {config.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Only show tabs that are in our config (visible tabs)
  const visibleRoutes = state.routes.filter((r) => TAB_CONFIG[r.name]);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.container}>
        {/* Orange gradient accent line at top of bar */}
        <ThemedGradient 
          style={styles.topAccent} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
        />

        <View style={styles.tabRow}>
          {visibleRoutes.map((route) => {
            const isFocused = state.routes[state.index]?.name === route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TabItem
                key={route.key}
                route={route.name}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOWS.medium,
    ...(Platform.OS === "android" ? { elevation: 12 } : {}),
  },
  topAccent: {
    height: 2,
    opacity: 0.8,
  },
  tabRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 3,
    minHeight: 52,
    position: "relative",
  },

  activePill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 8,
    right: 8,
    borderRadius: 14,
    backgroundColor: "rgba(249,115,22,0.10)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.20)",
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
