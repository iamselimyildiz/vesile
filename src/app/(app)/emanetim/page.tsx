"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import {
  mockGuardianRelations,
  mockProfiles,
  karneCategories,
  mockKarneAnalysis,
} from "@/lib/mock-data";
import { currentUser } from "@/lib/mock-data";
import { KarneResponse } from "@/lib/types";

export default function EmanetimPage() {
  const relations = mockGuardianRelations.filter(
    (g) => g.refakatci_id === currentUser.id
  );

  const [selectedRelation, setSelectedRelation] = useState(
    relations[0] || null
  );
  const [activeCategory, setActiveCategory] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<typeof mockKarneAnalysis | null>(null);

  const aday = selectedRelation
    ? mockProfiles.find((p) => p.id === selectedRelation.aday_id)
    : null;

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setAnalyzing(true);
    // Simulate Claude API analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysis(mockKarneAnalysis);
      setSubmitted(true);
    }, 2000);
  };

  const totalQuestions = karneCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );
  const answeredQuestions = Object.keys(responses).filter(
    (k) => responses[k]?.trim()
  ).length;

  if (relations.length === 0) {
    return (
      <>
        <Header title="Emanetim" />
        <main className="max-w-lg mx-auto px-5 py-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-refakatci/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-refakatci" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-bold text-night mb-2">
              Henüz emanetiniz yok
            </h3>
            <p className="text-sm text-night/50 font-sans">
              Refakat ettiğiniz bir aday bulunmuyor. Bir aday sizi refakatçi olarak davet ettiğinde burada görünecektir.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Emanetim" />
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Aday info */}
        {aday && (
          <div className="bg-white rounded-xl border border-night/5 p-4 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-refakatci/10 flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-lg font-bold text-refakatci">
                {aday.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-night">
                {aday.full_name}
              </h3>
              <p className="text-xs text-night/40 font-sans">
                {aday.city} &middot; {aday.age} yaş &middot; {aday.profession}
              </p>
              <p className="text-xs text-refakatci font-sans font-medium mt-0.5">
                {selectedRelation?.relation} olarak refakat ediyorsunuz
              </p>
            </div>
          </div>
        )}

        {!submitted ? (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-semibold text-refakatci uppercase tracking-wider">
                  360° Karne
                </span>
                <span className="text-xs font-sans text-night/40">
                  {answeredQuestions}/{totalQuestions} soru
                </span>
              </div>
              <div className="w-full h-1.5 bg-night/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-refakatci rounded-full transition-all duration-500"
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {karneCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-colors ${
                    activeCategory === i
                      ? "bg-refakatci text-white"
                      : "bg-cream-dark text-night/50"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <p className="text-sm text-night/50 font-sans">
                {karneCategories[activeCategory].description}
              </p>
              {karneCategories[activeCategory].questions.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-night/5 p-4">
                  <label className="text-sm font-sans font-medium text-night block mb-2">
                    {q.question}
                  </label>
                  <textarea
                    value={responses[q.id] || ""}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    placeholder="Cevabınızı buraya yazın..."
                    className="w-full bg-cream-dark rounded-lg p-3 text-sm font-sans text-night/70 resize-none focus:outline-none focus:ring-2 focus:ring-refakatci/30 min-h-[80px]"
                    rows={3}
                  />
                </div>
              ))}
            </div>

            {/* Navigation & Submit */}
            <div className="flex gap-3 mt-6">
              {activeCategory > 0 && (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setActiveCategory((p) => p - 1)}
                >
                  Geri
                </Button>
              )}
              {activeCategory < karneCategories.length - 1 ? (
                <Button
                  className="flex-1 !bg-refakatci hover:!bg-refakatci-dark"
                  onClick={() => setActiveCategory((p) => p + 1)}
                >
                  Sonraki
                </Button>
              ) : (
                <Button
                  className="flex-1 !bg-refakatci hover:!bg-refakatci-dark"
                  onClick={handleSubmit}
                  disabled={answeredQuestions < totalQuestions || analyzing}
                >
                  {analyzing ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analiz ediliyor...
                    </span>
                  ) : (
                    "Karneyi Gönder"
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Analysis Results */
          analysis && (
            <div className="space-y-6">
              <div className="bg-refakatci/5 border border-refakatci/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-refakatci" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                  <span className="text-sm font-sans font-semibold text-refakatci">
                    Refakatçi Gözüyle Portre (AI Analiz)
                  </span>
                </div>
                <p className="text-sm text-night/70 font-sans leading-relaxed">
                  {analysis.ozet_portre}
                </p>
              </div>

              {/* Radar scores */}
              <div className="bg-white rounded-xl border border-night/5 p-5">
                <h4 className="text-xs font-sans font-semibold text-gold uppercase tracking-wider mb-4">
                  Karakter Analizi
                </h4>
                <div className="space-y-3">
                  {Object.entries(analysis.boyutlar).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      durustukluk: "Dürüstlük",
                      sorumluluk: "Sorumluluk",
                      empati: "Empati",
                      dini_hassasiyet: "Dini Hassasiyet",
                      sosyal_uyum: "Sosyal Uyum",
                    };
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-sans text-night">
                            {labels[key] || key}
                          </span>
                          <span className="text-sm font-sans font-semibold text-night">
                            {val.puan}/10
                          </span>
                        </div>
                        <div className="w-full h-2 bg-night/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-refakatci rounded-full transition-all duration-700"
                            style={{ width: `${val.puan * 10}%` }}
                          />
                        </div>
                        <p className="text-xs text-night/40 font-sans mt-0.5">
                          {val.gerekce}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Attention areas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-night/5 p-4">
                  <h4 className="text-xs font-sans font-semibold text-aday uppercase tracking-wider mb-2">
                    Güçlü Yönler
                  </h4>
                  <ul className="space-y-1">
                    {analysis.guclu_yonler.map((g, i) => (
                      <li key={i} className="text-xs text-night/60 font-sans flex items-start gap-1">
                        <span className="text-aday mt-0.5">+</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-night/5 p-4">
                  <h4 className="text-xs font-sans font-semibold text-refakatci uppercase tracking-wider mb-2">
                    Dikkat Alanları
                  </h4>
                  <ul className="space-y-1">
                    {analysis.dikkat_alanlari.map((d, i) => (
                      <li key={i} className="text-xs text-night/60 font-sans flex items-start gap-1">
                        <span className="text-refakatci mt-0.5">!</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setSubmitted(false);
                  setAnalysis(null);
                }}
              >
                Karneyi Düzenle
              </Button>
            </div>
          )
        )}
      </main>
    </>
  );
}
