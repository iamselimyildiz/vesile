"use client";

import { useState } from "react";
import { EducationLevel } from "@/lib/types";
import { completeLevel, getLevelProgress } from "@/lib/education-store";
import Button from "@/components/ui/Button";
import Quiz from "./Quiz";

interface LevelDetailProps {
  level: EducationLevel;
  onBack: () => void;
  onComplete: () => void;
}

export default function LevelDetail({ level, onBack, onComplete }: LevelDetailProps) {
  const [currentContent, setCurrentContent] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const progress = getLevelProgress(level.id);
  const alreadyCompleted = progress?.completed ?? false;

  const content = level.contents[currentContent];

  if (showQuiz) {
    return (
      <Quiz
        questions={level.quiz}
        levelId={level.id}
        onComplete={(score) => {
          completeLevel(level.id, score);
          setQuizCompleted(true);
          setShowQuiz(false);
        }}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  if (quizCompleted) {
    return (
      <div className="px-6 py-8">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gold/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-night mb-2">
            Tebrikler!
          </h2>
          <p className="text-night/50 mb-2">
            <span className="font-semibold text-night">{level.title}</span> seviyesini tamamladınız
          </p>
          {level.id === 3 && (
            <div className="mt-6 bg-gold/10 border border-gold/20 rounded-xl p-4">
              <p className="text-sm text-gold font-semibold">
                Eşleşme özellikleri aktif oldu! Artık adaylarla iletişim kurabilirsiniz.
              </p>
            </div>
          )}
          <Button className="mt-8" onClick={onComplete}>
            Devam Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-night/50 hover:text-night text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Geri
      </button>

      {/* Level header */}
      <div className="mb-8">
        <span className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
          {level.id}. Seviye
        </span>
        <h2 className="font-serif text-2xl font-bold text-night mt-1">
          {level.title}
        </h2>
        {alreadyCompleted && (
          <p className="text-sm text-gold mt-1">Bu seviye tamamlanmış</p>
        )}
      </div>

      {/* Content tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {level.contents.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCurrentContent(i)}
            className={`px-4 py-2 rounded-lg text-sm font-sans whitespace-nowrap transition-colors ${
              i === currentContent
                ? "bg-night text-cream"
                : "bg-cream-dark text-night/50 hover:text-night"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Content body */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-night/5 mb-8">
        <h3 className="font-serif text-lg font-semibold text-night mb-4">
          {content.title}
        </h3>
        <div className="text-night/70 text-[15px] leading-relaxed whitespace-pre-line font-sans">
          {content.body}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          disabled={currentContent === 0}
          onClick={() => setCurrentContent((prev) => prev - 1)}
        >
          Önceki
        </Button>

        {currentContent < level.contents.length - 1 ? (
          <Button onClick={() => setCurrentContent((prev) => prev + 1)}>
            Sonraki
          </Button>
        ) : (
          <Button variant="gold" onClick={() => setShowQuiz(true)}>
            Teste Başla
          </Button>
        )}
      </div>
    </div>
  );
}
