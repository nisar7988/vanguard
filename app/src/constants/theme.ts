export const COLORS = {
  primary: "#F97316", // Orange-500
  primaryLight: "#FB923C", // Orange-400
  primaryDark: "#EA580C", // Orange-600
  background: "#000000", // Black
  card: "#1E293B", // Slate-800
  cardDark: "#0F172A", // Slate-900
  border: "#334155", // Slate-700
  text: "#F8FAFC", // Slate-50 (White-ish)
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8", // Slate-400
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  slate50: "#0F172A", // Inverted for dark mode
  slate100: "#1E293B",
  slate200: "#334155",
  slate400: "#94A3B8",
  slate900: "#F8FAFC",
  link: "#F97316",
  white: "#FFFFFF",
  glass: "rgba(15, 23, 42, 0.7)", // Dark glass
  overlay: "rgba(0, 0, 0, 0.6)",
} as const;

export const GRADIENTS = {
  primary: ["#ff7a18", "#ff3d00"] as const,
  disabled: ["#444444", "#666666"] as const,
  glass: ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"] as const,
} as const;

export const SHADOWS = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  premium: {
    shadowColor: "#F97316", // Orange glow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export type ColorType = keyof typeof COLORS;
