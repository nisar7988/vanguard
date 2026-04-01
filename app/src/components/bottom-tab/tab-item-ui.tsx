import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/constants/theme";
import { useTabAnimation } from "./useTabAnimation";

export function TabItem({
  config,
  isFocused,
  onPress,
  onLongPress,
}: {
  config: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    activeIcon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
  };
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { iconStyle, labelStyle } = useTabAnimation(isFocused);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        minHeight: 52,
      }}
      activeOpacity={0.7}
    >
      {isFocused && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 8,
            right: 8,
            borderRadius: 14,
            backgroundColor: "rgba(249,115,22,0.10)",
          }}
        />
      )}

      <Animated.View style={iconStyle}>
        <Ionicons
          name={isFocused ? config.activeIcon : config.icon}
          size={22}
          color={isFocused ? COLORS.primary : COLORS.textSecondary}
        />
      </Animated.View>

      <Animated.Text
        style={[
          {
            fontSize: 11,
            fontWeight: "700",
            color: COLORS.primary,
          },
          labelStyle,
        ]}
      >
        {config.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}
