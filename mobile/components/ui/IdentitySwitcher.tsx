import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/Theme";
import { useMode } from "@/lib/mode-store";

export default function IdentitySwitcher() {
  const { mode, setMode } = useMode();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.pill,
          styles.leftPill,
          mode === "refakatci" && styles.activeRefakatci,
        ]}
        onPress={() => setMode("refakatci")}
      >
        <Text
          style={[
            styles.label,
            mode === "refakatci" ? styles.labelActiveLight : styles.labelMuted,
          ]}
        >
          Refakatçi
        </Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[
          styles.pill,
          styles.rightPill,
          mode === "aday" && styles.activeAday,
        ]}
        onPress={() => setMode("aday")}
      >
        <Text
          style={[
            styles.label,
            mode === "aday" ? styles.labelActiveLight : styles.labelMuted,
          ]}
        >
          Aday
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.night + "10",
    backgroundColor: colors.creamDark,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leftPill: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightPill: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  activeRefakatci: {
    backgroundColor: colors.refakatci,
  },
  activeAday: {
    backgroundColor: colors.aday,
  },
  divider: {
    width: 1,
    backgroundColor: colors.night + "10",
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  labelMuted: {
    color: colors.night + "40",
  },
  labelActiveLight: {
    color: colors.white,
  },
});

