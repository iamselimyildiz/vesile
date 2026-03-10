"use client";

import { Mezhep } from "@/lib/types";
import Button from "@/components/ui/Button";

export interface Filters {
  city: string;
  mezhep: string;
  ageMin: number;
  ageMax: number;
}

export const defaultFilters: Filters = {
  city: "",
  mezhep: "",
  ageMin: 18,
  ageMax: 60,
};

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClose: () => void;
  onReset: () => void;
  cities: string[];
}

const mezhepLabels: Record<string, string> = {
  hanefi: "Hanefî",
  shafii: "Şâfiî",
  maliki: "Mâlikî",
  hanbeli: "Hanbelî",
};

export default function FilterPanel({
  filters,
  onChange,
  onClose,
  onReset,
  cities,
}: FilterPanelProps) {
  const update = (key: keyof Filters, value: string | number) => {
    onChange({ ...filters, [key]: value });
  };

  const activeCount = [
    filters.city !== "",
    filters.mezhep !== "",
    filters.ageMin > 18 || filters.ageMax < 60,
  ].filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-night/20 z-[60] animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 top-0 z-[60] flex items-end animate-[slideUp_300ms_ease-out]">
        <div className="max-w-lg w-full mx-auto bg-cream rounded-t-2xl border border-night/5 shadow-xl flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-night/10" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 pt-2 flex-shrink-0">
            <h3 className="font-serif text-lg font-bold text-night">Filtrele</h3>
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs font-sans text-gold hover:text-gold-dark transition-colors"
              >
                Temizle ({activeCount})
              </button>
            )}
          </div>

          <div className="px-5 pb-8 space-y-5 overflow-y-auto flex-1">
            {/* City */}
            <div>
              <label className="text-xs font-sans font-semibold text-night/40 uppercase tracking-wider block mb-2">
                Şehir
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => update("city", "")}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-sans transition-colors ${
                    filters.city === ""
                      ? "bg-night text-cream"
                      : "bg-cream-dark text-night/50 hover:text-night"
                  }`}
                >
                  Tümü
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => update("city", filters.city === city ? "" : city)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-sans transition-colors ${
                      filters.city === city
                        ? "bg-night text-cream"
                        : "bg-cream-dark text-night/50 hover:text-night"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Mezhep */}
            <div>
              <label className="text-xs font-sans font-semibold text-night/40 uppercase tracking-wider block mb-2">
                Mezhep
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => update("mezhep", "")}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-sans transition-colors ${
                    filters.mezhep === ""
                      ? "bg-night text-cream"
                      : "bg-cream-dark text-night/50 hover:text-night"
                  }`}
                >
                  Tümü
                </button>
                {(Object.keys(mezhepLabels) as Mezhep[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => update("mezhep", filters.mezhep === m ? "" : m)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-sans transition-colors ${
                      filters.mezhep === m
                        ? "bg-night text-cream"
                        : "bg-cream-dark text-night/50 hover:text-night"
                    }`}
                  >
                    {mezhepLabels[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Age range */}
            <div>
              <label className="text-xs font-sans font-semibold text-night/40 uppercase tracking-wider block mb-2">
                Yaş Aralığı
                <span className="ml-2 text-night/60 normal-case tracking-normal">
                  {filters.ageMin} — {filters.ageMax}
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={18}
                  max={60}
                  value={filters.ageMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= filters.ageMax) update("ageMin", val);
                  }}
                  className="flex-1 accent-gold h-1.5"
                />
                <input
                  type="range"
                  min={18}
                  max={60}
                  value={filters.ageMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= filters.ageMin) update("ageMax", val);
                  }}
                  className="flex-1 accent-gold h-1.5"
                />
              </div>
            </div>

            {/* Apply */}
            <Button className="w-full" onClick={onClose}>
              Uygula
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
