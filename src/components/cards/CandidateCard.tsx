"use client";

import { Profile } from "@/lib/types";
import Button from "@/components/ui/Button";
import FikhBox from "./FikhBox";

interface CandidateCardProps {
  candidate: Profile;
  onSave: (id: string) => void;
  onRequest: (id: string) => void;
  saved?: boolean;
  requested?: boolean;
}

export default function CandidateCard({
  candidate,
  onSave,
  onRequest,
  saved = false,
  requested = false,
}: CandidateCardProps) {
  const initials = candidate.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-night/5 overflow-hidden">
      {/* Avatar area */}
      <div className="relative bg-gradient-to-b from-night/5 to-cream-dark h-52 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-night/10 flex items-center justify-center">
          <span className="font-serif text-3xl font-bold text-night/30">
            {initials}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="font-serif text-xl font-bold text-night">
            {candidate.full_name}
          </h3>
          <span className="text-night/40 text-sm font-sans">
            {candidate.age}
          </span>
        </div>
        <p className="text-sm text-night/40 font-sans mb-1">
          {candidate.city} &middot; {candidate.profession}
        </p>
        <p className="text-sm text-night/40 font-sans capitalize mb-4">
          {candidate.mezhep} &middot; {candidate.namaz_regularity}
        </p>

        {/* Bio / Niyet */}
        <p className="text-[15px] text-night/70 leading-relaxed font-sans mb-5 italic">
          &ldquo;{candidate.bio}&rdquo;
        </p>

        {/* Fıkıh Penceresi */}
        <div className="mb-5">
          <FikhBox candidate={candidate} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant={saved ? "gold" : "secondary"}
            className="flex-1"
            onClick={() => onSave(candidate.id)}
          >
            {saved ? "Kaydedildi" : "Kaydet"}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => onRequest(candidate.id)}
            disabled={requested}
          >
            {requested ? "İstek Gönderildi" : "İstek Gönder"}
          </Button>
        </div>
      </div>
    </div>
  );
}
