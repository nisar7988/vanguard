import { ThemedGradient } from "./themed-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const GradientButton = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  icon,
}: GradientButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || isLoading}
      style={style}
      className="w-full rounded-2xl overflow-hidden"
    >
      <ThemedGradient
        disabled={disabled || isLoading}
        className="py-4 flex-row items-center justify-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon && <Text className="mr-2">{icon}</Text>}
            <Text className="text-white font-semibold text-base">{title}</Text>
          </>
        )}
      </ThemedGradient>
    </TouchableOpacity>
  );
};
