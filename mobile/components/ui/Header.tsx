import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/Theme";

interface HeaderProps {
  title: string;
  showFilter?: boolean;
  filterCount?: number;
  onFilterPress?: () => void;
}

export default function Header({ title, showFilter, filterCount = 0, onFilterPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <Text style={styles.title}>{title}</Text>
        {showFilter && (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.night + "80"} />
            {filterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{filterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.night + "08",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 52,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.night,
  },
  filterBtn: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: colors.gold,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.cream,
    fontSize: 10,
    fontFamily: fonts.sansBold,
  },
});
