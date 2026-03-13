import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/Theme";
import {
  mockProfiles,
  currentUser,
  mockGuardianRelations,
  mockKarneAnalysis,
  karneCategories,
} from "@/lib/mock-data";
import * as Haptics from "expo-haptics";
import { loadProgress, hasCompletedGate } from "@/lib/education-store";
import {
  loadRequests,
  addRequest,
  getSentProfileIds,
} from "@/lib/requests-store";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import { useMode } from "@/lib/mode-store";
import type { KarneAnalysis } from "@/lib/types";

type Mezhep = "" | "hanefi" | "shafii" | "maliki" | "hanbeli";

interface Filters {
  city: string;
  mezhep: Mezhep;
  ageMin: number;
  ageMax: number;
}

const defaultFilters: Filters = {
  city: "",
  mezhep: "",
  ageMin: 18,
  ageMax: 60,
};

const CITIES = ["İstanbul", "Ankara", "Bursa", "Konya", "İzmir"];
const MEZHEPS: { label: string; value: Mezhep }[] = [
  { label: "Hanefî", value: "hanefi" },
  { label: "Şâfiî", value: "shafii" },
  { label: "Mâlikî", value: "maliki" },
  { label: "Hanbelî", value: "hanbeli" },
];

// Fıkıh Penceresi data
interface FikhEntry {
  text: string;
  source: string;
}

const fikhContent: Record<string, FikhEntry[][]> = {
  hanefi: [
    [
      {
        text: "Hanefî mezhebine göre evlilik görüşmesinde adayın yüzüne ve ellerine bakmak caizdir.",
        source: "el-Hidâye, Kitâbu'n-Nikâh",
      },
      {
        text: "Mehir belirlenmeden kıyılan nikâh sahihtir; mehr-i misil gerekir.",
        source: "Fetâvâ-yı Hindiyye, II/304",
      },
    ],
    [
      {
        text: "Akıl baliğ kadın kendi başına nikâhlanabilir ancak velinin izni müstehaptır.",
        source: "el-Mebsût, V/10",
      },
      {
        text: "Nikâhta en az iki erkek veya bir erkek iki kadın şahit bulunmalıdır.",
        source: "el-Hidâye, Kitâbu'n-Nikâh",
      },
    ],
  ],
  shafii: [
    [
      {
        text: "Şâfiî mezhebine göre nikâhta velinin izni şarttır.",
        source: "el-Ümm, V/13",
      },
      {
        text: "Evlenme teklifinde kadının yüzüne bakmak caizdir.",
        source: "Minhâcu't-Tâlibîn, III/176",
      },
    ],
  ],
  maliki: [
    [
      {
        text: "Mâlikî mezhebine göre velinin izni nikâhın sıhhat şartıdır.",
        source: "el-Müdevvene, II/95",
      },
    ],
  ],
  hanbeli: [
    [
      {
        text: "Hanbelî mezhebine göre mehrin belirlenmesi müstehaptır.",
        source: "el-Muğnî, VII/69",
      },
    ],
  ],
};

function getFikhForMezhep(mezhep: string): FikhEntry[] {
  const sets = fikhContent[mezhep] || fikhContent["hanefi"];
  const idx = Math.floor(Math.random() * sets.length);
  return sets[idx];
}

// ─── Emanetim (Refakatçi mode) ──────────────────────────────────
function EmanetimView() {
  const myRelations = mockGuardianRelations.filter(
    (r) => r.refakatci_id === currentUser.id
  );
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<KarneAnalysis | null>(null);

  // ── Akıllı Klavye Yönetimi ──
  const scrollViewRef = useRef<ScrollView>(null);
  const questionSectionY = useRef<number>(0);
  const questionYPositions = useRef<Record<string, number>>({});

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  if (myRelations.length === 0) {
    return (
      <View style={styles.screen}>
        <Header title="Emanetim" />
        <View style={styles.emptyState}>
          <Ionicons name="shield-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>Emanetiniz yok</Text>
          <Text style={styles.emptyDesc}>
            Henüz bir adaya refakatçi olarak atanmadınız
          </Text>
        </View>
      </View>
    );
  }

  const relation = myRelations[0];
  const adayProfile = mockProfiles.find((p) => p.id === relation.aday_id);
  if (!adayProfile) return null;

  const totalQuestions = karneCategories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );
  const answeredCount = Object.values(answers).filter(
    (a) => a.trim().length > 0
  ).length;
  const progress = totalQuestions > 0 ? answeredCount / totalQuestions : 0;
  const activeCat = karneCategories[activeCatIdx];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      Alert.alert(
        "Eksik Cevaplar",
        `Lütfen tüm ${totalQuestions} soruyu cevaplayın. (${answeredCount}/${totalQuestions} cevaplandı)`
      );
      return;
    }
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(mockKarneAnalysis as KarneAnalysis);
      setAnalyzing(false);
    }, 2000);
  };

  const boyutLabels: Record<string, string> = {
    durustukluk: "Dürüstlük",
    sorumluluk: "Sorumluluk",
    empati: "Empati",
    dini_hassasiyet: "Dini Hassasiyet",
    sosyal_uyum: "Sosyal Uyum",
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Header title="Emanetim" />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={emanetStyles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
        }
      >
        {/* Aday Info Card */}
        <View style={emanetStyles.adayCard}>
          <View style={emanetStyles.adayAvatar}>
            <Text style={emanetStyles.adayAvatarText}>
              {getInitials(adayProfile.full_name)}
            </Text>
          </View>
          <View style={emanetStyles.adayInfo}>
            <Text style={emanetStyles.adayName}>
              {adayProfile.full_name}
            </Text>
            <Text style={emanetStyles.adayMeta}>
              {adayProfile.age} · {adayProfile.city} ·{" "}
              {adayProfile.profession}
            </Text>
            <Text style={emanetStyles.adayRelation}>
              İlişki: {relation.relation}
            </Text>
          </View>
        </View>

        {analysis ? (
          // ─── Analysis Results ──────────────────────────
          <View>
            <Text style={emanetStyles.sectionTitle}>
              AI Karakter Analizi
            </Text>

            {/* Boyut bars */}
            {Object.entries(analysis.boyutlar).map(([key, val]) => (
              <View key={key} style={emanetStyles.boyutRow}>
                <View style={emanetStyles.boyutHeader}>
                  <Text style={emanetStyles.boyutLabel}>
                    {boyutLabels[key] || key}
                  </Text>
                  <Text style={emanetStyles.boyutPuan}>
                    {val.puan}/10
                  </Text>
                </View>
                <View style={emanetStyles.barBg}>
                  <View
                    style={[
                      emanetStyles.barFill,
                      { width: `${val.puan * 10}%` },
                    ]}
                  />
                </View>
                <Text style={emanetStyles.boyutGerekce}>
                  {val.gerekce}
                </Text>
              </View>
            ))}

            {/* Özet Portre */}
            <View style={emanetStyles.analysisCard}>
              <Text style={emanetStyles.analysisTitle}>
                Özet Portre
              </Text>
              <Text style={emanetStyles.analysisText}>
                {analysis.ozet_portre}
              </Text>
            </View>

            {/* Güçlü Yönler */}
            <View style={emanetStyles.analysisCard}>
              <Text style={emanetStyles.analysisTitle}>
                Güçlü Yönler
              </Text>
              {analysis.guclu_yonler.map((item, i) => (
                <View key={i} style={emanetStyles.listItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.green}
                  />
                  <Text style={emanetStyles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Dikkat Alanları */}
            <View style={emanetStyles.analysisCard}>
              <Text style={emanetStyles.analysisTitle}>
                Dikkat Alanları
              </Text>
              {analysis.dikkat_alanlari.map((item, i) => (
                <View key={i} style={emanetStyles.listItem}>
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={colors.gold}
                  />
                  <Text style={emanetStyles.listItemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          // ─── Karne Form ────────────────────────────────
          <View>
            <Text style={emanetStyles.sectionTitle}>
              360° Karne Formu
            </Text>

            {/* Progress */}
            <View style={emanetStyles.progressRow}>
              <View style={emanetStyles.progressBarBg}>
                <View
                  style={[
                    emanetStyles.progressBarFill,
                    { width: `${progress * 100}%` },
                  ]}
                />
              </View>
              <Text style={emanetStyles.progressText}>
                {answeredCount}/{totalQuestions} soru
              </Text>
            </View>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={emanetStyles.catTabScroll}
              contentContainerStyle={emanetStyles.catTabRow}
            >
              {karneCategories.map((cat, idx) => {
                const catAnswered = cat.questions.filter(
                  (q) => answers[q.id]?.trim()
                ).length;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      emanetStyles.catTab,
                      activeCatIdx === idx && emanetStyles.catTabActive,
                    ]}
                    onPress={() => {
                      Keyboard.dismiss();
                      setActiveCatIdx(idx);
                      setTimeout(
                        () =>
                          scrollViewRef.current?.scrollTo({
                            y: 0,
                            animated: true,
                          }),
                        80
                      );
                    }}
                  >
                    <Text
                      style={[
                        emanetStyles.catTabText,
                        activeCatIdx === idx &&
                          emanetStyles.catTabTextActive,
                      ]}
                    >
                      {cat.title}
                    </Text>
                    <Text
                      style={[
                        emanetStyles.catTabCount,
                        activeCatIdx === idx &&
                          emanetStyles.catTabCountActive,
                      ]}
                    >
                      {catAnswered}/{cat.questions.length}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Questions */}
            <View
              style={emanetStyles.questionSection}
              onLayout={(e) => {
                questionSectionY.current = e.nativeEvent.layout.y;
              }}
            >
              <Text style={emanetStyles.catDescription}>
                {activeCat.description}
              </Text>
              {activeCat.questions.map((q, qIdx) => (
                <View
                  key={q.id}
                  style={emanetStyles.questionCard}
                  onLayout={(e) => {
                    questionYPositions.current[q.id] =
                      e.nativeEvent.layout.y;
                  }}
                >
                  <Text style={emanetStyles.questionNumber}>
                    Soru {qIdx + 1}
                  </Text>
                  <Text style={emanetStyles.questionText}>
                    {q.question}
                  </Text>
                  <TextInput
                    style={emanetStyles.answerInput}
                    value={answers[q.id] || ""}
                    onChangeText={(v) =>
                      setAnswers({ ...answers, [q.id]: v })
                    }
                    placeholder="Cevabınızı buraya yazın..."
                    placeholderTextColor={colors.muted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    onFocus={() => {
                      // Klavye açıldıktan sonra soruya kaydır
                      setTimeout(() => {
                        const absY =
                          questionSectionY.current +
                          (questionYPositions.current[q.id] ?? 0);
                        scrollViewRef.current?.scrollTo({
                          y: Math.max(0, absY - 80),
                          animated: true,
                        });
                      }, 180);
                    }}
                  />
                </View>
              ))}
            </View>

            {/* Nav */}
            <View style={emanetStyles.navRow}>
              {activeCatIdx > 0 && (
                <TouchableOpacity
                  style={emanetStyles.navBtn}
                  onPress={() => setActiveCatIdx(activeCatIdx - 1)}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={colors.night}
                  />
                  <Text style={emanetStyles.navBtnText}>Önceki</Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              {activeCatIdx < karneCategories.length - 1 ? (
                <TouchableOpacity
                  style={emanetStyles.navBtn}
                  onPress={() => setActiveCatIdx(activeCatIdx + 1)}
                >
                  <Text style={emanetStyles.navBtnText}>Sonraki</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.night}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    emanetStyles.navBtn,
                    emanetStyles.submitBtn,
                  ]}
                  onPress={handleSubmit}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name="sparkles"
                        size={16}
                        color={colors.white}
                      />
                      <Text style={emanetStyles.submitBtnText}>
                        AI Analiz
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Keşfet (Aday mode) ────────────────────────────────────────
export default function KesfetScreen() {
  const { mode } = useMode();

  // If refakatci mode, show Emanetim
  if (mode === "refakatci") {
    return <EmanetimView />;
  }

  // If married, show Keşfet Kapalı
  if (currentUser.marital_status === "evli") {
    return (
      <View style={styles.screen}>
        <Header title="Keşfet" />
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>Keşfet Kapalı</Text>
          <Text style={styles.emptyDesc}>
            Evli kullanıcılar için keşfet sayfası kullanılamaz
          </Text>
        </View>
      </View>
    );
  }

  return <KesfetContent />;
}

function KesfetContent() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilter, setShowFilter] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>(defaultFilters);
  const [gateCompleted, setGateCompleted] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await loadProgress();
    setGateCompleted(hasCompletedGate());
    await loadRequests();
    setSentIds(getSentProfileIds());
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const candidates = useMemo(() => {
    return mockProfiles
      .filter((p) => p.gender !== currentUser.gender)
      .filter((p) => p.marital_status === "bekar")
      .filter((p) => !sentIds.has(p.id))
      .filter((p) => {
        if (filters.city && p.city !== filters.city) return false;
        if (filters.mezhep && p.mezhep !== filters.mezhep) return false;
        if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
        return true;
      });
  }, [filters, sentIds]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.mezhep) count++;
    if (filters.ageMin !== 18 || filters.ageMax !== 60) count++;
    return count;
  }, [filters]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Keşfet"
        showFilter
        filterCount={activeFilterCount}
        onFilterPress={() => {
          setTempFilters(filters);
          setShowFilter(true);
        }}
      />

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <View style={styles.chipRow}>
          {filters.city !== "" && (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setFilters({ ...filters, city: "" })}
            >
              <Text style={styles.chipText}>{filters.city}</Text>
              <Ionicons name="close" size={14} color={colors.gold} />
            </TouchableOpacity>
          )}
          {filters.mezhep !== "" && (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setFilters({ ...filters, mezhep: "" })}
            >
              <Text style={styles.chipText}>
                {MEZHEPS.find((m) => m.value === filters.mezhep)?.label}
              </Text>
              <Ionicons name="close" size={14} color={colors.gold} />
            </TouchableOpacity>
          )}
          {(filters.ageMin !== 18 || filters.ageMax !== 60) && (
            <TouchableOpacity
              style={styles.chip}
              onPress={() =>
                setFilters({ ...filters, ageMin: 18, ageMax: 60 })
              }
            >
              <Text style={styles.chipText}>
                {filters.ageMin}-{filters.ageMax} yaş
              </Text>
              <Ionicons name="close" size={14} color={colors.gold} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Gate warning */}
      {!gateCompleted && (
        <View style={styles.gateBanner}>
          <Ionicons name="shield-checkmark" size={18} color={colors.gold} />
          <Text style={styles.gateText}>
            Eğitim seviye 3'ü tamamlayarak mesajlaşma özelliğini açın
          </Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
        }
      >
        {candidates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>Aday bulunamadı</Text>
            <Text style={styles.emptyDesc}>
              Filtreleri değiştirerek tekrar deneyin
            </Text>
            <Button
              title="Filtreleri Temizle"
              variant="secondary"
              onPress={() => setFilters(defaultFilters)}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          candidates.map((profile) => {
            const fikh = getFikhForMezhep(profile.mezhep);
            const isSaved = savedIds.has(profile.id);

            return (
              <View key={profile.id} style={styles.card}>
                {/* Profile Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(profile.full_name)}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>
                      {profile.full_name}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {profile.age} · {profile.city} ·{" "}
                      {profile.profession}
                    </Text>
                    <View style={styles.mezTag}>
                      <Text style={styles.mezTagText}>
                        {MEZHEPS.find((m) => m.value === profile.mezhep)
                          ?.label || profile.mezhep}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bio */}
                <Text style={styles.cardBio}>{profile.bio}</Text>

                {/* Fıkıh Penceresi */}
                <View style={styles.fikhBox}>
                  <View style={styles.fikhHeader}>
                    <Ionicons name="book" size={14} color={colors.gold} />
                    <Text style={styles.fikhTitle}>Fıkıh Penceresi</Text>
                  </View>
                  {fikh.map((entry, i) => (
                    <View key={i} style={styles.fikhEntry}>
                      <Text style={styles.fikhText}>
                        "{entry.text}"
                      </Text>
                      <Text style={styles.fikhSource}>
                        {entry.source}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => {
                      const newSet = new Set(savedIds);
                      if (isSaved) newSet.delete(profile.id);
                      else newSet.add(profile.id);
                      setSavedIds(newSet);
                    }}
                  >
                    <Ionicons
                      name={isSaved ? "bookmark" : "bookmark-outline"}
                      size={20}
                      color={colors.gold}
                    />
                  </TouchableOpacity>
                  <Button
                    title={
                      gateCompleted
                        ? "Tanışma Talebi"
                        : "Seviye 3 Gerekli"
                    }
                    variant={gateCompleted ? "gold" : "secondary"}
                    disabled={!gateCompleted}
                    onPress={async () => {
                      if (gateCompleted) {
                        await addRequest(profile.id);
                        setSentIds(getSentProfileIds());
                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success
                        );
                      }
                    }}
                    style={{ flex: 1, marginLeft: 12 }}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilter} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filtrele</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <Ionicons name="close" size={24} color={colors.night} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* City */}
              <Text style={styles.filterLabel}>Şehir</Text>
              <View style={styles.filterChipRow}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.filterChip,
                      tempFilters.city === city &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        city:
                          tempFilters.city === city ? "" : city,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        tempFilters.city === city &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mezhep */}
              <Text style={styles.filterLabel}>Mezhep</Text>
              <View style={styles.filterChipRow}>
                {MEZHEPS.map((m) => (
                  <TouchableOpacity
                    key={m.value}
                    style={[
                      styles.filterChip,
                      tempFilters.mezhep === m.value &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        mezhep:
                          tempFilters.mezhep === m.value
                            ? ""
                            : (m.value as Mezhep),
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        tempFilters.mezhep === m.value &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Age Range */}
              <Text style={styles.filterLabel}>
                Yaş Aralığı: {tempFilters.ageMin} -{" "}
                {tempFilters.ageMax}
              </Text>
              <View style={styles.ageRow}>
                <View style={styles.ageInputBox}>
                  <Text style={styles.ageInputLabel}>Min</Text>
                  <View style={styles.ageControls}>
                    <TouchableOpacity
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          ageMin: Math.max(
                            18,
                            tempFilters.ageMin - 1
                          ),
                        })
                      }
                      style={styles.ageBtn}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={colors.night}
                      />
                    </TouchableOpacity>
                    <Text style={styles.ageValue}>
                      {tempFilters.ageMin}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          ageMin: Math.min(
                            tempFilters.ageMax,
                            tempFilters.ageMin + 1
                          ),
                        })
                      }
                      style={styles.ageBtn}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={colors.night}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.ageSeparator} />
                <View style={styles.ageInputBox}>
                  <Text style={styles.ageInputLabel}>Max</Text>
                  <View style={styles.ageControls}>
                    <TouchableOpacity
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          ageMax: Math.max(
                            tempFilters.ageMin,
                            tempFilters.ageMax - 1
                          ),
                        })
                      }
                      style={styles.ageBtn}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={colors.night}
                      />
                    </TouchableOpacity>
                    <Text style={styles.ageValue}>
                      {tempFilters.ageMax}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setTempFilters({
                          ...tempFilters,
                          ageMax: Math.min(
                            60,
                            tempFilters.ageMax + 1
                          ),
                        })
                      }
                      style={styles.ageBtn}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={colors.night}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Filter actions */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                onPress={() => setTempFilters(defaultFilters)}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>Temizle</Text>
              </TouchableOpacity>
              <Button
                title="Uygula"
                variant="gold"
                onPress={() => {
                  setFilters(tempFilters);
                  setShowFilter(false);
                }}
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Emanetim Styles ────────────────────────────────────────────
const emanetStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  adayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.refakatci + "10",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.refakatci + "20",
  },
  adayAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.refakatci + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  adayAvatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
    color: colors.refakatci,
  },
  adayInfo: {
    flex: 1,
  },
  adayName: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.night,
  },
  adayMeta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
    marginTop: 2,
  },
  adayRelation: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.refakatci,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.night,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.night + "10",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.refakatci,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.night + "60",
  },
  catTabScroll: {
    marginBottom: 14,
  },
  catTabRow: {
    gap: 8,
  },
  catTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.night + "10",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  catTabActive: {
    backgroundColor: colors.refakatci + "15",
    borderColor: colors.refakatci,
  },
  catTabText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
  },
  catTabTextActive: {
    color: colors.refakatci,
    fontFamily: fonts.sansMedium,
  },
  catTabCount: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.night + "40",
  },
  catTabCountActive: {
    color: colors.refakatci + "80",
  },
  questionSection: {
    marginBottom: 16,
  },
  catDescription: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
    marginBottom: 12,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  questionNumber: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.refakatci,
    marginBottom: 4,
  },
  questionText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
    lineHeight: 20,
    marginBottom: 10,
  },
  answerInput: {
    backgroundColor: colors.cream,
    borderRadius: 8,
    padding: 12,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.night + "08",
    textAlignVertical: "top",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.creamDark,
    gap: 4,
  },
  navBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night,
  },
  submitBtn: {
    backgroundColor: colors.refakatci,
  },
  submitBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.white,
  },
  // Analysis results
  boyutRow: {
    marginBottom: 16,
  },
  boyutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  boyutLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.night,
  },
  boyutPuan: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.refakatci,
  },
  barBg: {
    height: 8,
    backgroundColor: colors.night + "10",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  barFill: {
    height: 8,
    backgroundColor: colors.refakatci,
    borderRadius: 4,
  },
  boyutGerekce: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "70",
    fontStyle: "italic",
  },
  analysisCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  analysisTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 15,
    color: colors.night,
    marginBottom: 8,
  },
  analysisText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "CC",
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  listItemText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "CC",
    flex: 1,
  },
});

// ─── Keşfet Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "15",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.gold,
  },
  gateBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "10",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  gateText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.gold,
    flex: 1,
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
  },
  emptyDesc: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 24,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.night + "08",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.night + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.night,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.night,
  },
  cardMeta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
    marginTop: 2,
  },
  mezTag: {
    backgroundColor: colors.gold + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  mezTagText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.gold,
  },
  cardBio: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "CC",
    lineHeight: 20,
    marginTop: 12,
  },

  // Fıkıh Box
  fikhBox: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  fikhHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  fikhTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.gold,
  },
  fikhEntry: {
    marginBottom: 8,
  },
  fikhText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "CC",
    fontStyle: "italic",
    lineHeight: 19,
  },
  fikhSource: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.gold,
    fontStyle: "italic",
    marginTop: 2,
  },

  // Card actions
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.gold + "12",
    alignItems: "center",
    justifyContent: "center",
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  filterPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.night,
  },
  filterLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.night,
    marginBottom: 10,
    marginTop: 16,
  },
  filterChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.creamDark,
    borderWidth: 1,
    borderColor: colors.night + "10",
  },
  filterChipActive: {
    backgroundColor: colors.gold + "15",
    borderColor: colors.gold,
  },
  filterChipText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "80",
  },
  filterChipTextActive: {
    color: colors.gold,
    fontFamily: fonts.sansMedium,
  },
  ageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ageInputBox: {
    flex: 1,
    alignItems: "center",
  },
  ageInputLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.night + "60",
    marginBottom: 6,
  },
  ageControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.creamDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.night + "10",
  },
  ageValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.night,
    minWidth: 30,
    textAlign: "center",
  },
  ageSeparator: {
    width: 20,
    height: 2,
    backgroundColor: colors.night + "20",
    marginHorizontal: 8,
  },
  filterActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.night + "08",
  },
  clearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night + "60",
  },
});
