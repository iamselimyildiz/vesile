"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import CandidateCard from "@/components/cards/CandidateCard";
import FilterPanel, { Filters, defaultFilters } from "@/components/cards/FilterPanel";
import { mockProfiles, currentUser } from "@/lib/mock-data";
import { hasCompletedGate } from "@/lib/education-store";

const mezhepLabels: Record<string, string> = {
  hanefi: "Hanefî",
  shafii: "Şâfiî",
  maliki: "Mâlikî",
  hanbeli: "Hanbelî",
};

export default function KesfetPage() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [gateCompleted, setGateCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    setMounted(true);
    setGateCompleted(hasCompletedGate());
  }, []);

  const baseCandidates = mockProfiles.filter(
    (p) => p.gender !== currentUser.gender && p.id !== currentUser.id
  );

  const cities = useMemo(
    () => [...new Set(baseCandidates.map((p) => p.city))].sort(),
    [baseCandidates]
  );

  const candidates = useMemo(() => {
    return baseCandidates.filter((p) => {
      if (filters.city && p.city !== filters.city) return false;
      if (filters.mezhep && p.mezhep !== filters.mezhep) return false;
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      return true;
    });
  }, [baseCandidates, filters]);

  const activeFilterCount = [
    filters.city !== "",
    filters.mezhep !== "",
    filters.ageMin > 18 || filters.ageMax < 60,
  ].filter(Boolean).length;

  const handleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRequest = (id: string) => {
    setRequested((prev) => new Set(prev).add(id));
  };

  return (
    <>
      <Header
        title="Keşfet"
        showFilter
        filterCount={activeFilterCount}
        onFilterClick={() => setShowFilter(true)}
      />
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Gate warning */}
        {mounted && !gateCompleted && (
          <div className="mb-6 bg-gold/10 border border-gold/20 rounded-xl p-4">
            <p className="text-sm text-night/70 font-sans">
              Profilleri inceleyebilir ve istek gönderebilirsiniz. Ancak{" "}
              <span className="font-semibold text-gold">3. Seviye eğitimi</span>{" "}
              tamamlamadan mesajlaşma başlatılamaz.
            </p>
            <a
              href="/egitim"
              className="inline-block mt-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
            >
              Eğitime Git →
            </a>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.city && (
              <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-sans font-medium px-2.5 py-1 rounded-full">
                {filters.city}
                <button onClick={() => setFilters({ ...filters, city: "" })} className="hover:text-gold-dark">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {filters.mezhep && (
              <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-sans font-medium px-2.5 py-1 rounded-full">
                {mezhepLabels[filters.mezhep] || filters.mezhep}
                <button onClick={() => setFilters({ ...filters, mezhep: "" })} className="hover:text-gold-dark">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
            {(filters.ageMin > 18 || filters.ageMax < 60) && (
              <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-sans font-medium px-2.5 py-1 rounded-full">
                {filters.ageMin}–{filters.ageMax} yaş
                <button onClick={() => setFilters({ ...filters, ageMin: 18, ageMax: 60 })} className="hover:text-gold-dark">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        <div className="space-y-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSave={handleSave}
              onRequest={handleRequest}
              saved={saved.has(candidate.id)}
              requested={requested.has(candidate.id)}
            />
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-night/30 font-sans">
              {activeFilterCount > 0
                ? "Filtrelere uygun aday bulunamadı"
                : "Henüz aday bulunmuyor"}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="mt-2 text-sm text-gold font-sans font-medium hover:text-gold-dark transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </main>

      {showFilter && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilter(false)}
          onReset={() => setFilters(defaultFilters)}
          cities={cities}
        />
      )}
    </>
  );
}
