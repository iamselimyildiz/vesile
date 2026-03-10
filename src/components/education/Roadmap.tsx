"use client";

import { useState, useEffect } from "react";
import { mockEducationLevels } from "@/lib/mock-data";
import { isLevelUnlocked, getLevelProgress, getCompletedLevel } from "@/lib/education-store";
import LevelNode from "./LevelNode";
import LevelDetail from "./LevelDetail";

export default function Roadmap() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [completedLevel, setCompletedLevel] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompletedLevel(getCompletedLevel());
  }, []);

  const handleLevelComplete = () => {
    setCompletedLevel(getCompletedLevel());
    setSelectedLevel(null);
  };

  if (selectedLevel !== null) {
    const level = mockEducationLevels.find((l) => l.id === selectedLevel);
    if (level) {
      return (
        <LevelDetail
          level={level}
          onBack={() => setSelectedLevel(null)}
          onComplete={handleLevelComplete}
        />
      );
    }
  }

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl font-bold text-night mb-2">
          Evlilik Eğitimi
        </h2>
        <p className="text-night/50 text-sm">
          Seviyeleri tamamlayarak eşleşme özelliklerinin kilidini açın
        </p>
      </div>

      {/* Gate info */}
      {mounted && completedLevel < 3 && (
        <div className="mb-8 bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-sm text-night/70">
            <span className="text-gold font-semibold">3. Seviyeyi</span> tamamladığınızda
            aday eşleşme ve mesajlaşma özellikleri aktif olur
          </p>
        </div>
      )}

      {mounted && completedLevel >= 3 && (
        <div className="mb-8 bg-gold/10 border border-gold/30 rounded-xl p-4 text-center">
          <p className="text-sm text-gold font-semibold">
            Eşleşme özellikleri aktif! Adayları keşfetmeye başlayabilirsiniz.
          </p>
        </div>
      )}

      {/* Roadmap */}
      <div className="relative max-w-xs mx-auto">
        {/* Vertical line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-night/10" />

        <div className="space-y-0">
          {mockEducationLevels.map((level) => {
            const unlocked = mounted ? isLevelUnlocked(level.id) : level.id === 1;
            const progress = mounted ? getLevelProgress(level.id) : undefined;
            const isGate = level.id === 3;

            return (
              <LevelNode
                key={level.id}
                level={level}
                unlocked={unlocked}
                completed={progress?.completed ?? false}
                isGate={isGate}
                onClick={() => unlocked && setSelectedLevel(level.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
