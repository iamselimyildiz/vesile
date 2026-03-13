import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors, fonts } from "@/constants/Theme";
import {
  mockProfiles,
  currentUser,
  mockChatRooms,
  resolveChatRoom,
} from "@/lib/mock-data";
import { loadRequests, getAllRequests, updateRequestStatus } from "@/lib/requests-store";
import Header from "@/components/ui/Header";
import { useMode } from "@/lib/mode-store";
import type { ChatRoom, Message } from "@/lib/types";

// ─── Status Labels ──────────────────────────────────────────────
const statusLabels: Record<
  string,
  { text: string; color: string; bg: string }
> = {
  pending: { text: "Beklemede", color: colors.gold, bg: colors.gold + "15" },
  accepted: {
    text: "Onaylandı",
    color: colors.green,
    bg: colors.green + "15",
  },
  rejected: {
    text: "Reddedildi",
    color: colors.red,
    bg: colors.red + "15",
  },
};

const roomStatusLabels: Record<
  string,
  { text: string; color: string; bg: string }
> = {
  active: { text: "Aktif", color: colors.green, bg: colors.green + "15" },
  waiting_refakatci: {
    text: "Bekliyor",
    color: colors.gold,
    bg: colors.gold + "15",
  },
  closed: {
    text: "Kapalı",
    color: colors.muted,
    bg: colors.muted + "15",
  },
};

type AdayTab = "sohbet" | "sent" | "received";
type GozlemTab = "rooms";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

// ─── Gözlem View (Refakatçi Mode) ──────────────────────────────
function GozlemView() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Get rooms where current user is refakatci
  const myRooms = mockChatRooms
    .filter((r) => r.refakatci_id === currentUser.id)
    .map(resolveChatRoom);

  if (selectedRoom) {
    const resolved = resolveChatRoom(selectedRoom);
    return (
      <View style={styles.screen}>
        <Header title="Gözlem" />
        <View style={gozlemStyles.roomHeader}>
          <TouchableOpacity
            style={gozlemStyles.backBtn}
            onPress={() => setSelectedRoom(null)}
          >
            <Ionicons name="chevron-back" size={20} color={colors.night} />
          </TouchableOpacity>
          <View style={gozlemStyles.roomInfo}>
            <Text style={gozlemStyles.roomTitle}>
              {resolved.aday1?.full_name} & {resolved.aday2?.full_name}
            </Text>
            <Text style={gozlemStyles.roomSubtitle}>
              Salt okunur gözlem
            </Text>
          </View>
          <View
            style={[
              gozlemStyles.statusDot,
              {
                backgroundColor:
                  roomStatusLabels[resolved.status]?.color || colors.muted,
              },
            ]}
          />
        </View>

        {/* Read-only warning */}
        <View style={gozlemStyles.readOnlyBanner}>
          <Ionicons name="eye-outline" size={16} color={colors.refakatci} />
          <Text style={gozlemStyles.readOnlyText}>
            SALT OKUNUR GÖZLEM — Mesaj gönderemezsiniz
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={gozlemStyles.messagesContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
          }
        >
          {resolved.messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={40}
                color={colors.muted}
              />
              <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
              <Text style={styles.emptyDesc}>
                Adaylar henüz sohbete başlamadı
              </Text>
            </View>
          ) : (
            resolved.messages.map((msg) => (
              <GozlemMessageBubble
                key={msg.id}
                message={msg}
                aday1Name={resolved.aday1?.full_name || ""}
                aday2Name={resolved.aday2?.full_name || ""}
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Gözlem" />
      <ScrollView 
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
        }
      >
        {myRooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="eye-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Gözlem odası yok</Text>
            <Text style={styles.emptyDesc}>
              Refakatçi olarak atandığınız sohbet odaları burada görünecek
            </Text>
          </View>
        ) : (
          myRooms.map((room) => {
            const status = roomStatusLabels[room.status];
            const lastMsg =
              room.messages.length > 0
                ? room.messages[room.messages.length - 1]
                : null;
            return (
              <TouchableOpacity
                key={room.id}
                style={gozlemStyles.roomCard}
                onPress={() => setSelectedRoom(room)}
              >
                <View style={gozlemStyles.roomCardHeader}>
                  <View style={gozlemStyles.roomAvatarGroup}>
                    <View style={gozlemStyles.roomAvatar}>
                      <Text style={gozlemStyles.roomAvatarText}>
                        {getInitials(room.aday1?.full_name || "")}
                      </Text>
                    </View>
                    <View
                      style={[
                        gozlemStyles.roomAvatar,
                        gozlemStyles.roomAvatarOverlap,
                      ]}
                    >
                      <Text style={gozlemStyles.roomAvatarText}>
                        {getInitials(room.aday2?.full_name || "")}
                      </Text>
                    </View>
                  </View>
                  <View style={gozlemStyles.roomCardInfo}>
                    <Text style={gozlemStyles.roomCardName}>
                      {room.aday1?.full_name} & {room.aday2?.full_name}
                    </Text>
                    {lastMsg && (
                      <Text
                        style={gozlemStyles.roomCardPreview}
                        numberOfLines={1}
                      >
                        {lastMsg.sender_name}: {lastMsg.content}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: status.color }]}
                    >
                      {status.text}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function GozlemMessageBubble({
  message,
  aday1Name,
  aday2Name,
}: {
  message: Message;
  aday1Name: string;
  aday2Name: string;
}) {
  if (message.is_system) {
    return (
      <View style={gozlemStyles.systemMsg}>
        <Text style={gozlemStyles.systemMsgText}>{message.content}</Text>
      </View>
    );
  }

  const time = new Date(message.created_at);
  const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;

  return (
    <View style={gozlemStyles.msgBubble}>
      <View style={gozlemStyles.msgHeader}>
        <Text style={gozlemStyles.msgSender}>{message.sender_name}</Text>
        <Text style={gozlemStyles.msgTime}>{timeStr}</Text>
      </View>
      <Text style={gozlemStyles.msgContent}>{message.content}</Text>
    </View>
  );
}

// ─── Sohbet View (Aday Mode - Chat) ────────────────────────────
function SohbetList({
  onOpenRoom,
}: {
  onOpenRoom: (room: ChatRoom) => void;
}) {
  const myRooms = mockChatRooms
    .filter(
      (r) => r.aday1_id === currentUser.id || r.aday2_id === currentUser.id
    )
    .map(resolveChatRoom);

  if (myRooms.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="chatbubbles-outline"
          size={48}
          color={colors.muted}
        />
        <Text style={styles.emptyTitle}>Henüz sohbet yok</Text>
        <Text style={styles.emptyDesc}>
          Kabul edilen taleplerin sohbet odaları burada görünecek
        </Text>
      </View>
    );
  }

  return (
    <>
      {myRooms.map((room) => {
        const otherProfile =
          room.aday1_id === currentUser.id ? room.aday2 : room.aday1;
        const status = roomStatusLabels[room.status];
        const lastMsg =
          room.messages.length > 0
            ? room.messages[room.messages.length - 1]
            : null;

        return (
          <TouchableOpacity
            key={room.id}
            style={sohbetStyles.roomCard}
            onPress={() => onOpenRoom(room)}
          >
            <View style={sohbetStyles.roomHeader}>
              <View style={sohbetStyles.roomAvatar}>
                <Text style={sohbetStyles.roomAvatarText}>
                  {getInitials(otherProfile?.full_name || "")}
                </Text>
              </View>
              <View style={sohbetStyles.roomInfo}>
                <Text style={sohbetStyles.roomName}>
                  {otherProfile?.full_name}
                </Text>
                {room.refakatci && (
                  <View style={sohbetStyles.refBadge}>
                    <Ionicons
                      name="shield-checkmark"
                      size={12}
                      color={colors.refakatci}
                    />
                    <Text style={sohbetStyles.refBadgeText}>
                      {room.refakatci.full_name}
                    </Text>
                  </View>
                )}
                {lastMsg && (
                  <Text
                    style={sohbetStyles.lastMessage}
                    numberOfLines={1}
                  >
                    {lastMsg.sender_name}: {lastMsg.content}
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: status.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

function ChatRoomView({
  room,
  onBack,
}: {
  room: ChatRoom;
  onBack: () => void;
}) {
  const resolved = resolveChatRoom(room);
  const [messages, setMessages] = useState(resolved.messages);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const otherProfile =
    resolved.aday1_id === currentUser.id
      ? resolved.aday2
      : resolved.aday1;

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (resolved.status !== "active") return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      room_id: resolved.id,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name.split(" ")[0],
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    setTimeout(
      () => scrollRef.current?.scrollToEnd({ animated: true }),
      100
    );
  };

  const handleLeave = () => {
    Alert.alert(
      "Görüşmeden Ayrıl",
      "Bu görüşmeden ayrılmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Ayrıl",
          style: "destructive",
          onPress: onBack,
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Chat Header */}
      <View style={sohbetStyles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={sohbetStyles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.night} />
        </TouchableOpacity>
        <View style={sohbetStyles.chatHeaderInfo}>
          <Text style={sohbetStyles.chatHeaderName}>
            {otherProfile?.full_name}
          </Text>
          {resolved.refakatci && (
            <View style={sohbetStyles.refBadgeSmall}>
              <Ionicons
                name="shield-checkmark"
                size={10}
                color={colors.refakatci}
              />
              <Text style={sohbetStyles.refBadgeSmallText}>
                {resolved.refakatci.full_name}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleLeave}>
          <Ionicons
            name="exit-outline"
            size={22}
            color={colors.red}
          />
        </TouchableOpacity>
      </View>

      {/* Lock notice for waiting rooms */}
      {resolved.status === "waiting_refakatci" && (
        <View style={sohbetStyles.lockNotice}>
          <Ionicons name="lock-closed" size={16} color={colors.gold} />
          <Text style={sohbetStyles.lockText}>
            Refakatçi katılana kadar sohbet kilitlidir
          </Text>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={sohbetStyles.messagesContainer}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {messages.map((msg) => {
          if (msg.is_system) {
            return (
              <View key={msg.id} style={sohbetStyles.systemMsg}>
                <Text style={sohbetStyles.systemMsgText}>
                  {msg.content}
                </Text>
              </View>
            );
          }

          const isMine = msg.sender_id === currentUser.id;
          const time = new Date(msg.created_at);
          const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;

          return (
            <View
              key={msg.id}
              style={[
                sohbetStyles.msgBubble,
                isMine
                  ? sohbetStyles.msgBubbleMine
                  : sohbetStyles.msgBubbleOther,
              ]}
            >
              {!isMine && (
                <Text style={sohbetStyles.msgSender}>
                  {msg.sender_name}
                </Text>
              )}
              <Text
                style={[
                  sohbetStyles.msgText,
                  isMine && sohbetStyles.msgTextMine,
                ]}
              >
                {msg.content}
              </Text>
              <Text
                style={[
                  sohbetStyles.msgTime,
                  isMine && sohbetStyles.msgTimeMine,
                ]}
              >
                {timeStr}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      {resolved.status === "active" && (
        <View style={sohbetStyles.inputBar}>
          <TextInput
            style={sohbetStyles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor={colors.muted}
            multiline
          />
          <TouchableOpacity
            style={[
              sohbetStyles.sendBtn,
              !inputText.trim() && sohbetStyles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {resolved.status === "closed" && (
        <View style={sohbetStyles.closedNotice}>
          <Text style={sohbetStyles.closedText}>
            Bu sohbet odası kapatılmıştır
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function AdaylarScreen() {
  const { mode } = useMode();
  const [tab, setTab] = useState<AdayTab>("sohbet");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedChatRoom, setSelectedChatRoom] =
    useState<ChatRoom | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadRequests().then(() => setRefreshKey((k) => k + 1));
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRequests().then(() => setRefreshKey((k) => k + 1));
    setRefreshing(false);
  }, []);

  // Refakatçi mode → Gözlem
  if (mode === "refakatci") {
    return <GozlemView />;
  }

  // If a chat room is selected, show the chat
  if (selectedChatRoom) {
    return (
      <ChatRoomView
        room={selectedChatRoom}
        onBack={() => setSelectedChatRoom(null)}
      />
    );
  }

  const allRequests = getAllRequests();
  const sentRequests = allRequests.filter(
    (r) => r.sender_id === currentUser.id
  );
  const receivedRequests = allRequests.filter(
    (r) => r.receiver_id === currentUser.id
  );

  const getProfile = (id: string) =>
    mockProfiles.find((p) => p.id === id);

  return (
    <View style={styles.screen}>
      <Header title="Adaylar" />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === "sohbet" && styles.tabActive]}
          onPress={() => setTab("sohbet")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "sohbet" && styles.tabTextActive,
            ]}
          >
            Sohbet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "sent" && styles.tabActive]}
          onPress={() => setTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "sent" && styles.tabTextActive,
            ]}
          >
            Gönderilen ({sentRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "received" && styles.tabActive]}
          onPress={() => setTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "received" && styles.tabTextActive,
            ]}
          >
            Gelen ({receivedRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
        }
      >
        {tab === "sohbet" ? (
          <SohbetList
            onOpenRoom={(room) => setSelectedChatRoom(room)}
          />
        ) : (
          <>
            {(() => {
              const activeList =
                tab === "sent" ? sentRequests : receivedRequests;

              if (activeList.length === 0) {
                return (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="chatbubbles-outline"
                      size={48}
                      color={colors.muted}
                    />
                    <Text style={styles.emptyTitle}>
                      {tab === "sent"
                        ? "Henüz talep göndermediniz"
                        : "Henüz talep almadınız"}
                    </Text>
                    <Text style={styles.emptyDesc}>
                      {tab === "sent"
                        ? "Keşfet sayfasından adaylara tanışma talebi gönderebilirsiniz"
                        : "Adaylardan gelen talepler burada görünecek"}
                    </Text>
                  </View>
                );
              }

              return activeList.map((req) => {
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
                        <Text style={styles.requestName}>
                          {otherProfile.full_name}
                        </Text>
                        <Text style={styles.requestMeta}>
                          {otherProfile.age} · {otherProfile.city} ·{" "}
                          {otherProfile.profession}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: status.color },
                          ]}
                        >
                          {status.text}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.requestFooter}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={colors.muted}
                      />
                      <Text style={styles.dateText}>{dateStr}</Text>
                    </View>

                    {/* Action buttons for received requests */}
                    {tab === "received" &&
                      req.status === "pending" && (
                        <View style={styles.actionRow}>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            onPress={() => {
                              Alert.alert(
                                "Talebi Reddet",
                                `${otherProfile.full_name} adayının talebini reddetmek istiyor musunuz?`,
                                [
                                  { text: "İptal", style: "cancel" },
                                  {
                                    text: "Reddet",
                                    style: "destructive",
                                    onPress: async () => {
                                      await updateRequestStatus(req.id, "rejected");
                                      setRefreshKey((k) => k + 1);
                                    },
                                  },
                                ]
                              );
                            }}
                          >
                            <Ionicons
                              name="close"
                              size={18}
                              color={colors.red}
                            />
                            <Text
                              style={[
                                styles.actionText,
                                { color: colors.red },
                              ]}
                            >
                              Reddet
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => {
                              Alert.alert(
                                "Talebi Onayla",
                                `${otherProfile.full_name} adayının talebini onaylamak istiyor musunuz?`,
                                [
                                  { text: "İptal", style: "cancel" },
                                  {
                                    text: "Onayla",
                                    onPress: async () => {
                                      await updateRequestStatus(req.id, "accepted");
                                      setRefreshKey((k) => k + 1);
                                    },
                                  },
                                ]
                              );
                            }}
                          >
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color={colors.green}
                            />
                            <Text
                              style={[
                                styles.actionText,
                                { color: colors.green },
                              ]}
                            >
                              Onayla
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                  </View>
                );
              });
            })()}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Gözlem Styles ──────────────────────────────────────────────
const gozlemStyles = StyleSheet.create({
  roomCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  roomCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomAvatarGroup: {
    flexDirection: "row",
    marginRight: 12,
  },
  roomAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.refakatci + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  roomAvatarOverlap: {
    marginLeft: -10,
    borderWidth: 2,
    borderColor: colors.white,
  },
  roomAvatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.refakatci,
  },
  roomCardInfo: {
    flex: 1,
  },
  roomCardName: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.night,
  },
  roomCardPreview: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    marginTop: 2,
  },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.night + "08",
    backgroundColor: colors.cream,
  },
  backBtn: {
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.night,
  },
  roomSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.refakatci,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  readOnlyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.refakatci + "10",
    padding: 10,
    gap: 8,
    justifyContent: "center",
  },
  readOnlyText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.refakatci,
    letterSpacing: 0.5,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  systemMsg: {
    alignSelf: "center",
    backgroundColor: colors.night + "08",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  systemMsgText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    textAlign: "center",
  },
  msgBubble: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.night + "08",
    maxWidth: "90%",
  },
  msgHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  msgSender: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.refakatci,
  },
  msgTime: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.muted,
  },
  msgContent: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night,
    lineHeight: 20,
  },
});

// ─── Sohbet Styles ──────────────────────────────────────────────
const sohbetStyles = StyleSheet.create({
  roomCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.aday + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roomAvatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.aday,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.night,
  },
  refBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  refBadgeText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.refakatci,
  },
  lastMessage: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    marginTop: 2,
  },
  // Chat view
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.night + "08",
    backgroundColor: colors.cream,
    paddingTop: 56,
  },
  backBtn: {
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.night,
  },
  refBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  refBadgeSmallText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.refakatci,
  },
  lockNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "10",
    padding: 12,
    gap: 8,
    justifyContent: "center",
  },
  lockText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.gold,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 16,
  },
  systemMsg: {
    alignSelf: "center",
    backgroundColor: colors.night + "08",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  systemMsgText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    textAlign: "center",
  },
  msgBubble: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  msgBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: colors.aday,
  },
  msgBubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  msgSender: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.aday,
    marginBottom: 2,
  },
  msgText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night,
    lineHeight: 20,
  },
  msgTextMine: {
    color: colors.white,
  },
  msgTime: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
    textAlign: "right",
  },
  msgTimeMine: {
    color: colors.white + "80",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.night + "08",
    backgroundColor: colors.cream,
    gap: 8,
    paddingBottom: 30,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.night + "10",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.aday,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: colors.muted + "40",
  },
  closedNotice: {
    padding: 16,
    alignItems: "center",
    backgroundColor: colors.night + "05",
    borderTopWidth: 1,
    borderTopColor: colors.night + "08",
  },
  closedText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.muted,
  },
});

// ─── Main Styles ────────────────────────────────────────────────
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
    fontSize: 12,
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
