import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, fonts } from "@/constants/Theme";
import { mockEducationLevels } from "@/lib/mock-data";
import {
  loadProgress,
  getCompletedLevel,
  isLevelUnlocked,
  completeLevel,
  getLevelProgress,
  loadWatchedVideos,
  getWatchedVideos,
  isVideoUnlocked,
  markVideoWatched,
} from "@/lib/education-store";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import VideoPlayer from "@/components/ui/VideoPlayer";

type ScreenView = "roadmap" | "detail" | "quiz" | "done";

export default function EgitimScreen() {
  const [view, setView] = useState<ScreenView>("roadmap");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [completedMax, setCompletedMax] = useState(0);
  const [ready, setReady] = useState(false);

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  // Video player state
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [watchedRefresh, setWatchedRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    await loadProgress();
    await loadWatchedVideos();
    setCompletedMax(getCompletedLevel());
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  useEffect(() => {
    refresh().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  const level = selectedLevel ? mockEducationLevels.find((l) => l.id === selectedLevel) : null;

  // --- Roadmap View ---
  if (view === "roadmap") {
    return (
      <View style={styles.screen}>
        <Header title="Eğitim" />
        <ScrollView 
          contentContainerStyle={styles.roadmapContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
          }
        >
          <Text style={styles.roadmapSubtitle}>
            Her seviyeyi tamamlayarak ilerleyin
          </Text>
          {mockEducationLevels.map((lvl, idx) => {
            const unlocked = isLevelUnlocked(lvl.id);
            const completed = getCompletedLevel() >= lvl.id;
            const progress = getLevelProgress(lvl.id);
            const isLast = idx === mockEducationLevels.length - 1;
            const isGate = lvl.id === 3;

            return (
              <View key={lvl.id} style={styles.nodeRow}>
                {/* Vertical line */}
                {!isLast && (
                  <View
                    style={[
                      styles.line,
                      { backgroundColor: completed ? colors.gold : colors.night + "15" },
                    ]}
                  />
                )}
                {/* Circle */}
                <TouchableOpacity
                  onPress={() => {
                    if (unlocked) {
                      setSelectedLevel(lvl.id);
                      setView("detail");
                    } else {
                      Alert.alert("Kilitli", "Önceki seviyeyi tamamlamanız gerekiyor.");
                    }
                  }}
                  style={[
                    styles.circle,
                    completed && styles.circleCompleted,
                    !unlocked && styles.circleLocked,
                    isGate && unlocked && !completed && styles.circleGate,
                  ]}
                >
                  {completed ? (
                    <Ionicons name="checkmark" size={20} color={colors.cream} />
                  ) : !unlocked ? (
                    <Ionicons name="lock-closed" size={16} color={colors.muted} />
                  ) : isGate ? (
                    <Ionicons name="shield-checkmark" size={18} color={colors.gold} />
                  ) : (
                    <Text style={styles.circleNum}>{lvl.id}</Text>
                  )}
                </TouchableOpacity>
                {/* Info */}
                <View style={styles.nodeInfo}>
                  <Text style={[styles.nodeTitle, !unlocked && styles.nodeLocked]}>
                    {lvl.title}
                  </Text>
                  <Text style={[styles.nodeDesc, !unlocked && styles.nodeLocked]}>
                    {lvl.description}
                  </Text>
                  {unlocked && !completed && (
                    <Text style={styles.nodeCount}>
                      {lvl.contents.length} video · {lvl.quiz.length} soru
                    </Text>
                  )}
                  {isGate && (
                    <View style={styles.gateBadge}>
                      <Ionicons name="shield-checkmark" size={12} color={colors.gold} />
                      <Text style={styles.gateBadgeText}>Gate Seviyesi</Text>
                    </View>
                  )}
                  {progress?.quizScore !== undefined && (
                    <Text style={styles.scoreText}>
                      Skor: %{progress.quizScore}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // --- Level Detail View ---
  if (view === "detail" && level) {
    const completed = getCompletedLevel() >= level.id;
    const watched = getWatchedVideos(level.id);
    const allVideosWatched = level.contents.every((c) => watched.includes(c.id));

    return (
      <View style={styles.screen}>
        <Header title={level.title} />
        <ScrollView 
          contentContainerStyle={styles.detailContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.gold]} />
          }
        >
          {/* Back button */}
          <TouchableOpacity onPress={() => setView("roadmap")} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.night} />
            <Text style={styles.backText}>Geri</Text>
          </TouchableOpacity>

          <Text style={styles.detailTitle}>{level.title}</Text>
          <Text style={styles.detailDesc}>{level.description}</Text>

          {/* Videolar */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Ionicons name="play-circle-outline" size={16} color={colors.gold} />
              <Text style={styles.sectionLabel}>Videolar</Text>
            </View>
            {level.contents.map((content, idx) => {
              const unlocked = isVideoUnlocked(level.id, idx, level.contents);
              const isWatched = watched.includes(content.id);

              return (
                <TouchableOpacity
                  key={content.id}
                  style={[styles.linkCard, !unlocked && styles.linkCardLocked]}
                  onPress={() => {
                    if (!unlocked) {
                      Alert.alert("Kilitli", "Önce önceki videoyu izlemeniz gerekiyor.");
                      return;
                    }
                    setPlayingVideoUrl(content.url);
                    setPlayingVideoId(content.id);
                  }}
                  activeOpacity={unlocked ? 0.7 : 1}
                >
                  {!unlocked ? (
                    <Ionicons name="lock-closed" size={18} color={colors.muted} />
                  ) : isWatched ? (
                    <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                  ) : (
                    <Ionicons name="play-circle" size={18} color="#FF0000" />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.linkCardTitle, !unlocked && styles.linkCardTitleLocked]}>
                      {content.title}
                    </Text>
                    {!unlocked && (
                      <Text style={styles.lockedHint}>Önceki videoyu izleyin</Text>
                    )}
                  </View>
                  {unlocked && !isWatched && (
                    <Ionicons name="play" size={14} color={colors.gold} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quiz button - only when all videos watched */}
          {!completed && allVideosWatched && (
            <Button
              title="Sınava Başla"
              variant="gold"
              onPress={() => {
                setCurrentQ(0);
                setAnswers(new Array(level.quiz.length).fill(null));
                setConfirmed(false);
                setScore(0);
                setView("quiz");
              }}
              style={{ marginTop: 16, marginBottom: 40 }}
            />
          )}
          {!completed && !allVideosWatched && (
            <View style={styles.watchAllBanner}>
              <Ionicons name="information-circle-outline" size={18} color={colors.gold} />
              <Text style={styles.watchAllText}>
                Sınava başlamak için tüm videoları izleyin
              </Text>
            </View>
          )}
          {completed && (
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={24} color={colors.green} />
              <Text style={styles.completedText}>Bu seviye tamamlandı</Text>
            </View>
          )}
        </ScrollView>

        {/* Video Player Modal */}
        {playingVideoUrl && (
          <VideoPlayer
            videoUrl={playingVideoUrl}
            visible={!!playingVideoUrl}
            onComplete={async () => {
              if (playingVideoId && level) {
                await markVideoWatched(level.id, playingVideoId);
                setWatchedRefresh((n) => n + 1);
              }
            }}
            onClose={() => {
              setPlayingVideoUrl(null);
              setPlayingVideoId(null);
            }}
          />
        )}
      </View>
    );
  }

  // --- Quiz View ---
  if (view === "quiz" && level) {
    const quiz = level.quiz;
    const q = quiz[currentQ];
    const selected = answers[currentQ];
    const isCorrect = selected === q.correctIndex;
    const isLastQ = currentQ === quiz.length - 1;

    return (
      <View style={styles.screen}>
        <Header title={`Sınav - ${level.title}`} />
        <ScrollView contentContainerStyle={styles.quizContainer}>
          {/* Progress */}
          <View style={styles.quizProgress}>
            <Text style={styles.quizProgressText}>
              Soru {currentQ + 1} / {quiz.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentQ + 1) / quiz.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          <Text style={styles.quizQuestion}>{q.question}</Text>

          {q.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const showResult = confirmed;
            let optStyle = styles.optionBase;
            if (showResult && idx === q.correctIndex) optStyle = styles.optionCorrect;
            else if (showResult && isSelected && !isCorrect) optStyle = styles.optionWrong;
            else if (isSelected) optStyle = styles.optionSelected;

            return (
              <TouchableOpacity
                key={idx}
                disabled={confirmed}
                onPress={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQ] = idx;
                  setAnswers(newAnswers);
                }}
                style={[styles.optionBtn, optStyle]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && !showResult && styles.optionTextSelected,
                    showResult && idx === q.correctIndex && styles.optionTextCorrect,
                    showResult && isSelected && !isCorrect && styles.optionTextWrong,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Kopya - always visible */}
          {(q.hint || q.source) && (
            <View style={styles.kopyaBox}>
              <View style={styles.kopyaHeader}>
                <Ionicons name="book-outline" size={14} color={colors.gold} />
                <Text style={styles.kopyaLabel}>KOPYA</Text>
              </View>
              {q.hint && (
                <Text style={styles.kopyaHintText}>"{q.hint}"</Text>
              )}
              {q.source && (
                <Text style={styles.kopyaSourceText}>— {q.source}</Text>
              )}
            </View>
          )}

          {/* Confirm / Next */}
          {!confirmed && selected !== null && (
            <Button
              title="Cevabı Onayla"
              variant="primary"
              onPress={() => {
                const correct = selected === q.correctIndex;
                const newScore = correct ? score + 1 : score;
                setConfirmed(true);
                if (correct) {
                  setScore((s) => s + 1);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } else {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
                setTimeout(async () => {
                  if (isLastQ) {
                    const actualScore = Math.round((newScore / quiz.length) * 100);
                    await completeLevel(level.id, actualScore);
                    await refresh();
                    setView("done");
                  } else {
                    setCurrentQ((c) => c + 1);
                    setConfirmed(false);
                  }
                }, 1500);
              }}
              style={{ marginTop: 20 }}
            />
          )}
          {confirmed && (
            <View style={styles.feedbackBox}>
              {isCorrect ? (
                <View style={styles.feedbackRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.green} />
                  <Text style={[styles.feedbackText, { color: colors.green }]}>Doğru!</Text>
                </View>
              ) : (
                <View style={styles.feedbackRow}>
                  <Ionicons name="close-circle" size={20} color={colors.red} />
                  <Text style={[styles.feedbackText, { color: colors.red }]}>
                    Yanlış. Doğru cevap: {q.options[q.correctIndex]}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // --- Done View ---
  if (view === "done" && level) {
    const progress = getLevelProgress(level.id);
    const pct = progress?.quizScore ?? 0;
    const isGate = level.id === 3;

    return (
      <View style={styles.screen}>
        <Header title="Tamamlandı" />
        <View style={styles.doneContainer}>
          <View style={styles.doneCircle}>
            <Ionicons name="trophy" size={48} color={colors.gold} />
          </View>
          <Text style={styles.doneTitle}>Tebrikler!</Text>
          <Text style={styles.doneSubtitle}>
            {level.title} seviyesini tamamladınız
          </Text>
          <Text style={styles.doneScore}>Skor: %{pct}</Text>
          {isGate && (
            <View style={styles.gateUnlocked}>
              <Ionicons name="shield-checkmark" size={20} color={colors.gold} />
              <Text style={styles.gateUnlockedText}>
                Gate seviyesi tamamlandı! Artık adaylarla iletişime geçebilirsiniz.
              </Text>
            </View>
          )}
          <Button
            title="Devam Et"
            variant="gold"
            onPress={() => {
              setSelectedLevel(null);
              setView("roadmap");
            }}
            style={{ marginTop: 24, width: "100%" }}
          />
        </View>
      </View>
    );
  }

  return null;
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  // Roadmap
  roadmapContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  roadmapSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "70",
    marginBottom: 24,
  },
  nodeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    position: "relative",
  },
  line: {
    position: "absolute",
    left: 20,
    top: 44,
    width: 2,
    height: 60,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.creamDark,
    borderWidth: 2,
    borderColor: colors.night + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  circleCompleted: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  circleLocked: {
    backgroundColor: colors.creamDark,
    borderColor: colors.night + "10",
  },
  circleGate: {
    borderColor: colors.gold,
    backgroundColor: colors.cream,
  },
  circleNum: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.night,
  },
  nodeInfo: {
    flex: 1,
    paddingTop: 4,
  },
  nodeTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.night,
    marginBottom: 2,
  },
  nodeDesc: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
  },
  nodeLocked: {
    color: colors.muted,
  },
  gateBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: colors.gold + "15",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  gateBadgeText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.gold,
    marginLeft: 4,
  },
  nodeCount: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.gold,
    marginTop: 3,
  },
  scoreText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.gold,
    marginTop: 4,
  },

  // Detail
  detailContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.night,
    marginLeft: 6,
  },
  detailTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.night,
    marginBottom: 6,
  },
  detailDesc: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night + "70",
    marginBottom: 20,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.gold,
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.night + "08",
    gap: 10,
  },
  linkCardTitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.night,
    flex: 1,
  },
  linkCardLocked: {
    opacity: 0.5,
  },
  linkCardTitleLocked: {
    color: colors.muted,
  },
  lockedHint: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  watchAllBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "10",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 40,
  },
  watchAllText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.gold,
    marginLeft: 8,
    flex: 1,
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.green + "15",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 40,
  },
  completedText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.green,
    marginLeft: 8,
  },

  // Quiz
  quizContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  quizProgress: {
    marginBottom: 20,
  },
  quizProgressText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "70",
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.night + "10",
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
  quizQuestion: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.night,
    marginBottom: 20,
    lineHeight: 28,
  },
  optionBtn: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  optionBase: {
    backgroundColor: colors.white,
    borderColor: colors.night + "12",
  },
  optionSelected: {
    backgroundColor: colors.night + "08",
    borderColor: colors.night + "30",
  },
  optionCorrect: {
    backgroundColor: colors.green + "12",
    borderColor: colors.green,
  },
  optionWrong: {
    backgroundColor: colors.red + "12",
    borderColor: colors.red,
  },
  optionText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.night,
  },
  optionTextSelected: {
    fontFamily: fonts.sansMedium,
  },
  optionTextCorrect: {
    color: colors.green,
    fontFamily: fonts.sansMedium,
  },
  optionTextWrong: {
    color: colors.red,
  },
  kopyaBox: {
    backgroundColor: colors.gold + "10",
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  kopyaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  kopyaLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.gold,
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  kopyaHintText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.night + "CC",
    fontStyle: "italic",
    lineHeight: 20,
  },
  kopyaSourceText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.gold,
    marginTop: 4,
  },
  feedbackBox: {
    marginTop: 12,
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    marginLeft: 6,
  },

  // Done
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  doneCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gold + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  doneTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.night,
    marginBottom: 8,
  },
  doneSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.night + "70",
    textAlign: "center",
    marginBottom: 8,
  },
  doneScore: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.gold,
    marginBottom: 8,
  },
  gateUnlocked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold + "12",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  gateUnlockedText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.gold,
    marginLeft: 8,
    flex: 1,
  },
});
