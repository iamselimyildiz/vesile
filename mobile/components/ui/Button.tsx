import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, fonts } from "@/constants/Theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "gold" | "ghost";
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.night, text: colors.cream },
  secondary: { bg: colors.creamDark, text: colors.night, border: colors.night + "15" },
  gold: { bg: colors.gold, text: colors.cream },
  ghost: { bg: "transparent", text: colors.night },
};

export default function Button({ title, onPress, variant = "primary", disabled, style }: ButtonProps) {
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : undefined,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: v.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});
