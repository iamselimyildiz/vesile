import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/Theme";
import { currentUser } from "@/lib/mock-data";
import { loadProgress, getCompletedLevel } from "@/lib/education-store";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";

export default function ProfilScreen() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ ...currentUser });
  const [educationLevel, setEducationLevel] = useState(0);

  useEffect(() => {
    loadProgress().then(() => {
      setEducationLevel(getCompletedLevel());
    });
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleSave = () => {
    setEditing(false);
    Alert.alert("Kaydedildi", "Profil bilgileriniz güncellendi.");
  };

  const mezLabel: Record<string, string> = {
    hanefi: "Hanefî",
    shafii: "Şâfiî",
    maliki: "Mâlikî",
    hanbeli: "Hanbelî",
  };

  return (
    <View style={styles.screen}>
      <Header title="Profil" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Avatar & Name */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(profile.full_name)}</Text>
            </View>
            {!editing && (
              <>
                <Text style={styles.nameText}>{profile.full_name}</Text>
                <Text style={styles.metaText}>
                  {profile.age} · {profile.city} · {profile.profession}
                </Text>
              </>
            )}
          </View>

          {/* Education Level Badge */}
          <View style={styles.educationBadge}>
            <Ionicons name="school-outline" size={18} color={colors.gold} />
            <View style={styles.educationInfo}>
              <Text style={styles.educationTitle}>Eğitim Seviyesi</Text>
              <Text style={styles.educationValue}>
                {educationLevel === 0
                  ? "Henüz başlamadı"
                  : `Seviye ${educationLevel} / 5 tamamlandı`}
              </Text>
            </View>
            {educationLevel >= 3 && (
              <View style={styles.gateIcon}>
                <Ionicons name="shield-checkmark" size={18} color={colors.green} />
              </View>
            )}
          </View>

          {/* Profile Info */}
          {editing ? (
            <View style={styles.editSection}>
              <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                value={profile.full_name}
                onChangeText={(v) => setProfile({ ...profile, full_name: v })}
                placeholder="Ad Soyad"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Yaş</Text>
              <TextInput
                style={styles.input}
                value={String(profile.age)}
                onChangeText={(v) => setProfile({ ...profile, age: parseInt(v) || 0 })}
                keyboardType="number-pad"
                placeholder="Yaş"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Şehir</Text>
              <TextInput
                style={styles.input}
                value={profile.city}
                onChangeText={(v) => setProfile({ ...profile, city: v })}
                placeholder="Şehir"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Meslek</Text>
              <TextInput
                style={styles.input}
                value={profile.profession}
                onChangeText={(v) => setProfile({ ...profile, profession: v })}
                placeholder="Meslek"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.sectionTitle}>Hakkımda</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.bio}
                onChangeText={(v) => setProfile({ ...profile, bio: v })}
                multiline
                numberOfLines={4}
                placeholder="Kendiniz hakkında birkaç cümle..."
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.sectionTitle}>Dini Bilgiler</Text>

              <Text style={styles.inputLabel}>Mezhep</Text>
              <View style={styles.chipRow}>
                {(["hanefi", "shafii", "maliki", "hanbeli"] as const).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.mezChip,
                      profile.mezhep === m && styles.mezChipActive,
                    ]}
                    onPress={() => setProfile({ ...profile, mezhep: m })}
                  >
                    <Text
                      style={[
                        styles.mezChipText,
                        profile.mezhep === m && styles.mezChipTextActive,
                      ]}
                    >
                      {mezLabel[m]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Namaz Düzeni</Text>
              <TextInput
                style={styles.input}
                value={profile.namaz_regularity}
                onChangeText={(v) => setProfile({ ...profile, namaz_regularity: v })}
                placeholder="Namaz düzeniniz"
                placeholderTextColor={colors.muted}
              />

              <View style={styles.editActions}>
                <Button
                  title="İptal"
                  variant="secondary"
                  onPress={() => {
                    setProfile({ ...currentUser });
                    setEditing(false);
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Kaydet"
                  variant="gold"
                  onPress={handleSave}
                  style={{ flex: 1, marginLeft: 10 }}
                />
              </View>
            </View>
          ) : (
            <View>
              {/* View mode info cards */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                <InfoRow icon="person-outline" label="Ad Soyad" value={profile.full_name} />
                <InfoRow icon="calendar-outline" label="Yaş" value={String(profile.age)} />
                <InfoRow icon="location-outline" label="Şehir" value={profile.city} />
                <InfoRow icon="briefcase-outline" label="Meslek" value={profile.profession} />
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Hakkımda</Text>
                <Text style={styles.bioText}>{profile.bio}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Dini Bilgiler</Text>
                <InfoRow
                  icon="book-outline"
                  label="Mezhep"
                  value={mezLabel[profile.mezhep] || profile.mezhep}
                />
                <InfoRow
                  icon="time-outline"
                  label="Namaz"
                  value={profile.namaz_regularity}
                />
              </View>

              <Button
                title="Profili Düzenle"
                variant="primary"
                onPress={() => setEditing(true)}
                style={{ marginTop: 8 }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.row}>
      <Ionicons name={icon} size={18} color={colors.gold} />
      <View style={infoStyles.content}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.night + "06",
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
  },
  value: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.night,
    marginTop: 1,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.night + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 28,
    color: colors.night,
  },
  nameText: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.night,
  },
  metaText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "70",
    marginTop: 4,
  },
  educationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "10",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  educationInfo: {
    flex: 1,
  },
  educationTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.gold,
  },
  educationValue: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.gold + "CC",
    marginTop: 1,
  },
  gateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.green + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  sectionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.night,
    marginBottom: 10,
    marginTop: 4,
  },
  bioText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "CC",
    lineHeight: 22,
  },

  // Edit mode
  editSection: {
    marginTop: 4,
  },
  inputLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night + "80",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.night,
    borderWidth: 1,
    borderColor: colors.night + "10",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mezChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.night + "10",
  },
  mezChipActive: {
    backgroundColor: colors.gold + "15",
    borderColor: colors.gold,
  },
  mezChipText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "80",
  },
  mezChipTextActive: {
    color: colors.gold,
    fontFamily: fonts.sansMedium,
  },
  editActions: {
    flexDirection: "row",
    marginTop: 24,
    marginBottom: 20,
  },
});
