"use client";

import { EducationLevel } from "@/lib/types";

interface LevelNodeProps {
  level: EducationLevel;
  unlocked: boolean;
  completed: boolean;
  isGate: boolean;
  onClick: () => void;
}

export default function LevelNode({
  level,
  unlocked,
  completed,
  isGate,
  onClick,
}: LevelNodeProps) {
  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      className="relative flex items-start gap-5 w-full text-left py-5 group"
    >
      {/* Node circle */}
      <div
        className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          completed
            ? "bg-gold border-gold text-cream"
            : unlocked
            ? "bg-cream border-gold text-gold hover:bg-gold/10"
            : "bg-cream-dark border-night/10 text-night/30"
        }`}
      >
        {completed ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : !unlocked ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="font-serif font-bold text-sm">{level.id}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2">
          <h3
            className={`font-serif font-semibold text-base ${
              unlocked ? "text-night" : "text-night/30"
            }`}
          >
            {level.title}
          </h3>
          {isGate && !completed && (
            <span className="text-[10px] font-sans font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Gate
            </span>
          )}
        </div>
        <p
          className={`text-sm mt-0.5 ${
            unlocked ? "text-night/50" : "text-night/20"
          }`}
        >
          {level.description}
        </p>
        {completed && (
          <p className="text-xs text-gold mt-1 font-medium">Tamamlandı</p>
        )}
        {unlocked && !completed && (
          <p className="text-xs text-gold/70 mt-1 group-hover:text-gold transition-colors">
            {level.contents.length} ders &middot; {level.quiz.length} soru
          </p>
        )}
      </div>
    </button>
  );
}
