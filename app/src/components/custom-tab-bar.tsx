import React from "react";
import { View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabItem } from "./bottom-tab/tab-item-ui";
import { COLORS, SHADOWS } from "@/src/constants/theme";
import { ThemedGradient } from "./themed-gradient";

const TAB_CONFIG: Record<
  string,
  {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    activeIcon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
  }
> = {
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

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 8,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
          overflow: "hidden",
          ...SHADOWS.medium,
          ...(Platform.OS === "android" ? { elevation: 12 } : {}),
        }}
      >
        <ThemedGradient style={{ height: 2 }} />

        <View style={{ flexDirection: "row", padding: 12 }}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG[route.name];
            if (!config) return null;

            const isFocused = state.index === index;

            return (
              <TabItem
                key={route.key}
                config={config}
                isFocused={isFocused}
                onPress={() => {
                  if (!isFocused) navigation.navigate(route.name);
                }}
                onLongPress={() => {}}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
