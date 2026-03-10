import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors, fonts } from "@/constants/Theme";
import { mockProfiles, currentUser } from "@/lib/mock-data";
import { loadRequests, getAllRequests } from "@/lib/requests-store";
import Header from "@/components/ui/Header";

type Tab = "sent" | "received";

const statusLabels: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: "Beklemede", color: colors.gold, bg: colors.gold + "15" },
  accepted: { text: "Onaylandı", color: colors.green, bg: colors.green + "15" },
  rejected: { text: "Reddedildi", color: colors.red, bg: colors.red + "15" },
};

export default function AdaylarScreen() {
  const [tab, setTab] = useState<Tab>("sent");
  const [refreshKey, setRefreshKey] = useState(0);

  // Reload requests every time this tab gains focus
  useFocusEffect(
    useCallback(() => {
      loadRequests().then(() => setRefreshKey((k) => k + 1));
    }, [])
  );

  const allRequests = getAllRequests();
  const sentRequests = allRequests.filter((r) => r.sender_id === currentUser.id);
  const receivedRequests = allRequests.filter((r) => r.receiver_id === currentUser.id);
  const activeList = tab === "sent" ? sentRequests : receivedRequests;

  const getProfile = (id: string) => mockProfiles.find((p) => p.id === id);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <View style={styles.screen}>
      <Header title="Adaylar" />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === "sent" && styles.tabActive]}
          onPress={() => setTab("sent")}
        >
          <Text style={[styles.tabText, tab === "sent" && styles.tabTextActive]}>
            Gönderilen ({sentRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "received" && styles.tabActive]}
          onPress={() => setTab("received")}
        >
          <Text style={[styles.tabText, tab === "received" && styles.tabTextActive]}>
            Gelen ({receivedRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {activeList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>
              {tab === "sent" ? "Henüz talep göndermediniz" : "Henüz talep almadınız"}
            </Text>
            <Text style={styles.emptyDesc}>
              {tab === "sent"
                ? "Keşfet sayfasından adaylara tanışma talebi gönderebilirsiniz"
                : "Adaylardan gelen talepler burada görünecek"}
            </Text>
          </View>
        ) : (
          activeList.map((req) => {
            const otherProfile = getProfile(
              tab === "sent" ? req.receiver_id : req.sender_id
            );
            if (!otherProfile) return null;

            const status = statusLabels[req.status];
            const date = new Date(req.created_at);
            const dateStr = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

            return (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(otherProfile.full_name)}
                    </Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{otherProfile.full_name}</Text>
                    <Text style={styles.requestMeta}>
                      {otherProfile.age} · {otherProfile.city} · {otherProfile.profession}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.text}
                    </Text>
                  </View>
                </View>

                <View style={styles.requestFooter}>
                  <Ionicons name="calendar-outline" size={14} color={colors.muted} />
                  <Text style={styles.dateText}>{dateStr}</Text>
                </View>

                {/* Action buttons for received requests */}
                {tab === "received" && req.status === "pending" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.rejectBtn}>
                      <Ionicons name="close" size={18} color={colors.red} />
                      <Text style={[styles.actionText, { color: colors.red }]}>Reddet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <Ionicons name="checkmark" size={18} color={colors.green} />
                      <Text style={[styles.actionText, { color: colors.green }]}>Onayla</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.creamDark,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.night,
  },
  tabText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night + "60",
  },
  tabTextActive: {
    color: colors.cream,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.night,
    marginTop: 12,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.night + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.night,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.night,
  },
  requestMeta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  requestFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.night + "06",
    gap: 6,
  },
  dateText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.red + "10",
    gap: 6,
  },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.green + "10",
    gap: 6,
  },
  actionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
});
