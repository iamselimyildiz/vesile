"use client";

// Simple client-side state management for education progress
// Will be replaced with Supabase in production

const STORAGE_KEY = "vesile_education_progress";

export interface LevelProgress {
  level: number;
  completed: boolean;
  quizScore?: number;
  completedAt?: string;
}

export function getProgress(): LevelProgress[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function getLevelProgress(level: number): LevelProgress | undefined {
  return getProgress().find((p) => p.level === level);
}

export function getCompletedLevel(): number {
  const progress = getProgress();
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

export function completeLevel(level: number, quizScore: number): void {
  const progress = getProgress();
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function hasCompletedGate(): boolean {
  return getCompletedLevel() >= 3;
}
