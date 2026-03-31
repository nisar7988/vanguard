import { useColorScheme } from 'react-native';
import { COLORS } from '@/src/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof COLORS
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Note: Vanguard is consistently light mode as requested by the user.
    return COLORS[colorName];
  }
}
