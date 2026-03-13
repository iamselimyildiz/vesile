import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "vesile_education_progress";
const WATCHED_VIDEOS_KEY = "vesile_watched_videos";

export interface LevelProgress {
  level: number;
  completed: boolean;
  quizScore?: number;
  completedAt?: string;
}

// Cache progress in memory to avoid async reads on every render
let cachedProgress: LevelProgress[] = [];

export async function loadProgress(): Promise<LevelProgress[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    cachedProgress = stored ? (JSON.parse(stored) as LevelProgress[]) : [];
    return cachedProgress;
  } catch {
    cachedProgress = [];
    return [];
  }
}

export function getProgressSync(): LevelProgress[] {
  return cachedProgress ?? [];
}

export function getLevelProgress(level: number): LevelProgress | undefined {
  return getProgressSync().find((p) => p.level === level);
}

export function getCompletedLevel(): number {
  const progress = getProgressSync();
  let maxCompleted = 0;
  for (const p of progress) {
    if (p.completed && p.level > maxCompleted) {
      maxCompleted = p.level;
    }
  }
  return maxCompleted;
}

export function isLevelUnlocked(level: number): boolean {
  if (level === 1) return true;
  return getCompletedLevel() >= level - 1;
}

export async function completeLevel(level: number, quizScore: number): Promise<void> {
  const progress = getProgressSync().slice();
  const existing = progress.findIndex((p) => p.level === level);
  const entry: LevelProgress = {
    level,
    completed: true,
    quizScore,
    completedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    progress[existing] = entry;
  } else {
    progress.push(entry);
  }

  cachedProgress = progress;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function hasCompletedGate(): boolean {
  return getCompletedLevel() >= 3;
}

// --- Video watch tracking ---
let cachedWatchedVideos: Record<number, string[]> = {};

export async function loadWatchedVideos(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(WATCHED_VIDEOS_KEY);
    cachedWatchedVideos = stored ? JSON.parse(stored) : {};
  } catch {
    cachedWatchedVideos = {};
  }
}

export function getWatchedVideos(levelId: number): string[] {
  return cachedWatchedVideos[levelId] || [];
}

export function isVideoUnlocked(levelId: number, videoIndex: number, contents: { id: string }[]): boolean {
  if (videoIndex === 0) return true;
  const watched = getWatchedVideos(levelId);
  const prevVideo = contents[videoIndex - 1];
  return prevVideo ? watched.includes(prevVideo.id) : false;
}

export async function markVideoWatched(levelId: number, contentId: string): Promise<void> {
  const current = { ...cachedWatchedVideos };
  if (!current[levelId]) current[levelId] = [];
  if (!current[levelId].includes(contentId)) {
    current[levelId] = [...current[levelId], contentId];
  }
  cachedWatchedVideos = current;
  await AsyncStorage.setItem(WATCHED_VIDEOS_KEY, JSON.stringify(current));
}
