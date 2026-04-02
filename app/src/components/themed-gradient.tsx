import React from "react";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { GRADIENTS } from "@/src/constants/theme";

interface ThemedGradientProps extends Partial<LinearGradientProps> {
  type?: keyof typeof GRADIENTS;
  disabled?: boolean;
}

export const ThemedGradient = ({
  type = "primary",
  disabled = false,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  ...props
}: ThemedGradientProps) => {
  const gradientColors =
    colors || (disabled ? GRADIENTS.disabled : GRADIENTS[type]);

  return (
    <LinearGradient colors={gradientColors} start={start} end={end} {...props}>
      {children}
    </LinearGradient>
  );
};
