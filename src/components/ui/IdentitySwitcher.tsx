"use client";

import { useMode } from "@/lib/mode-store";

export default function IdentitySwitcher() {
  const { mode, setMode } = useMode();

  return (
    <div className="flex rounded-xl overflow-hidden border border-night/10">
      <button
        onClick={() => setMode("refakatci")}
        className={`flex-1 py-3 px-4 text-sm font-sans font-medium transition-all duration-300 ${
          mode === "refakatci"
            ? "bg-refakatci text-white"
            : "bg-cream-dark text-night/40 hover:text-night/60"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>Refakatçi</span>
        </div>
      </button>
      <div className="w-px bg-night/10" />
      <button
        onClick={() => setMode("aday")}
        className={`flex-1 py-3 px-4 text-sm font-sans font-medium transition-all duration-300 ${
          mode === "aday"
            ? "bg-aday text-white"
            : "bg-cream-dark text-night/40 hover:text-night/60"
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span>Aday</span>
        </div>
      </button>
    </div>
  );
}
