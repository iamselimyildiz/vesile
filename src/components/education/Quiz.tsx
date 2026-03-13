"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";
import Button from "@/components/ui/Button";

interface QuizProps {
  questions: QuizQuestion[];
  levelId: number;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function Quiz({ questions, levelId, onComplete, onBack }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentQ];
  const isCorrect = selected === question.correctIndex;
  const isLast = currentQ === questions.length - 1;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (isCorrect ? 0 : 0); // score already updated
      onComplete(Math.round((finalScore / questions.length) * 100));
      return;
    }
    setCurrentQ((prev) => prev + 1);
    setSelected(null);
    setConfirmed(false);
  };

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
        Derse Dön
      </button>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
            Anlama Testi
          </span>
          <span className="text-sm text-night/40 font-sans">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="font-serif text-xl font-semibold text-night mb-6 leading-snug">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, i) => {
          let style = "bg-white border-night/10 text-night/70 hover:border-night/20";

          if (confirmed) {
            if (i === question.correctIndex) {
              style = "bg-green-50 border-green-300 text-green-800";
            } else if (i === selected && !isCorrect) {
              style = "bg-red-50 border-red-300 text-red-800";
            } else {
              style = "bg-white border-night/5 text-night/30";
            }
          } else if (i === selected) {
            style = "bg-gold/10 border-gold text-night";
          }

          return (
            <button
              key={i}
              onClick={() => !confirmed && setSelected(i)}
              disabled={confirmed}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-sans text-[15px] ${style}`}
            >
              <span className="font-semibold mr-2 text-sm opacity-50">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div className="mb-6 space-y-2">
          <div
            className={`p-4 rounded-xl text-sm font-sans ${
              isCorrect
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {isCorrect ? "Doğru cevap!" : `Yanlış. Doğru cevap: ${question.options[question.correctIndex]}`}
          </div>
          {question.hint && (
            <div className="bg-gold/8 border-l-4 border-gold rounded-r-xl p-4">
              <p className="text-sm font-sans text-night/70 italic">
                💡 &ldquo;{question.hint}&rdquo;
              </p>
              {question.source && (
                <p className="text-xs font-sans font-semibold text-gold mt-1">— {question.source}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end">
        {!confirmed ? (
          <Button
            onClick={handleConfirm}
            disabled={selected === null}
          >
            Cevapla
          </Button>
        ) : (
          <Button variant="gold" onClick={handleNext}>
            {isLast ? "Tamamla" : "Sonraki Soru"}
          </Button>
        )}
      </div>
    </div>
  );
}
