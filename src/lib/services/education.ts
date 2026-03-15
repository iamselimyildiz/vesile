import { supabase } from "../supabase";

interface EducationProgress {
  level: number;
  completed: boolean;
  quiz_score: number | null;
  completed_at: string | null;
}

export async function getProgress(
  userId: string
): Promise<EducationProgress[]> {
  const { data, error } = await supabase
    .from("education_progress")
    .select("level, completed, quiz_score, completed_at")
    .eq("user_id", userId)
    .order("level", { ascending: true });

  if (error) throw error;
  return (data as EducationProgress[]) || [];
}

export async function getCompletedLevel(userId: string): Promise<number> {
  const progress = await getProgress(userId);
  let maxCompleted = 0;
  for (const p of progress) {
    if (p.completed && p.level > maxCompleted) {
      maxCompleted = p.level;
    }
  }
  return maxCompleted;
}

export async function isLevelUnlocked(
  userId: string,
  level: number
): Promise<boolean> {
  if (level <= 1) return true;
  const completedLevel = await getCompletedLevel(userId);
  return completedLevel >= level - 1;
}

export async function completeLevel(
  userId: string,
  level: number,
  quizScore: number
): Promise<void> {
  const { error } = await supabase.from("education_progress").upsert(
    {
      user_id: userId,
      level,
      completed: true,
      quiz_score: quizScore,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,level" }
  );

  if (error) throw error;

  // Update profile education_level
  const completedLevel = await getCompletedLevel(userId);
  await supabase
    .from("profiles")
    .update({ education_level: Math.max(completedLevel, level) })
    .eq("id", userId);
}

export async function hasCompletedGate(userId: string): Promise<boolean> {
  const completedLevel = await getCompletedLevel(userId);
  return completedLevel >= 3;
}
