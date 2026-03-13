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
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const progress = getLevelProgress(level.id);
  const alreadyCompleted = progress?.completed ?? false;

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

      {/* Mektuplar */}
      {level.contents.filter((c) => c.type === "letter").length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">Mektuplar</span>
          </div>
          <div className="space-y-2">
            {level.contents
              .filter((c) => c.type === "letter")
              .map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-night/5 rounded-xl px-4 py-3 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                >
                  <svg className="w-4 h-4 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-sans text-night flex-1">{c.title}</span>
                  <svg className="w-3.5 h-3.5 text-night/30 group-hover:text-gold transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Videolar */}
      {level.contents.filter((c) => c.type === "video").length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">Videolar</span>
          </div>
          <div className="space-y-2">
            {level.contents
              .filter((c) => c.type === "video")
              .map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-night/5 rounded-xl px-4 py-3 hover:border-red-200 hover:bg-red-50/30 transition-all group"
                >
                  <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="text-sm font-sans text-night flex-1">{c.title}</span>
                  <svg className="w-3.5 h-3.5 text-night/30 group-hover:text-red-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Sınav butonu */}
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowQuiz(true)}>
          Sınava Başla →
        </Button>
      </div>
    </div>
  );
}
