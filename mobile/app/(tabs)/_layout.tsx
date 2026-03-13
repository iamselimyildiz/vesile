import React, { useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/Theme";
import { useMode } from "@/lib/mode-store";
import * as Haptics from "expo-haptics";

const DOUBLE_TAP_DELAY = 350; // ms

export default function TabLayout() {
  const { mode, setMode } = useMode();
  const lastTapRef = useRef<number>(0);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const [toastText, setToastText] = useState("");
  const [toastMode, setToastMode] = useState<"aday" | "refakatci">("aday");

  const activeColor = mode === "refakatci" ? colors.refakatci : colors.gold;

  const showToast = (text: string, newMode: "aday" | "refakatci") => {
    setToastText(text);
    setToastMode(newMode);
    // Reset opacity first in case animation is mid-run
    toastOpacity.stopAnimation(() => {
      toastOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleProfilTabPress = (e: any) => {
    const now = Date.now();
    const delta = now - lastTapRef.current;

    if (delta < DOUBLE_TAP_DELAY && delta > 0) {
      // ── ÇİFT TIKLAMA → mod değiştir ──
      e.preventDefault();
      const newMode: "aday" | "refakatci" =
        mode === "aday" ? "refakatci" : "aday";
      setMode(newMode);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showToast(
        newMode === "refakatci" ? "🛡️ Refakatçi modu aktif" : "💛 Aday modu aktif",
        newMode
      );
      lastTapRef.current = 0;
    } else {
      // ── TEK TIKLAMA → normal navigasyon ──
      lastTapRef.current = now;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: colors.night + "60",
          tabBarStyle: {
            backgroundColor: colors.cream,
            borderTopColor: colors.night + "08",
            borderTopWidth: 1,
            height: 85,
            paddingTop: 8,
            paddingBottom: 28,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.sans,
            fontSize: 11,
          },
        }}
        initialRouteName="egitim"
      >
        <Tabs.Screen
          name="kesfet"
          options={{
            title: mode === "refakatci" ? "Emanetim" : "Keşfet",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={
                  mode === "refakatci" ? "shield-checkmark" : "search-outline"
                }
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="egitim"
          options={{
            title: "Eğitim",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="adaylar"
          options={{
            title: mode === "refakatci" ? "Gözlem" : "Adaylar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={
                  mode === "refakatci" ? "eye-outline" : "chatbubbles-outline"
                }
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
          listeners={{
            tabPress: handleProfilTabPress,
          }}
        />
      </Tabs>

      {/* ── Mod Değişim Toast ── */}
      <Animated.View
        style={[
          toastStyles.toast,
          {
            opacity: toastOpacity,
            backgroundColor:
              toastMode === "refakatci" ? colors.refakatci : colors.aday,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={toastStyles.text}>{toastText}</Text>
      </Animated.View>
    </View>
  );
}

const toastStyles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 96,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: "#fff",
    letterSpacing: 0.2,
  },
});
