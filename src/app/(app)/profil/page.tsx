"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { currentUser } from "@/lib/mock-data";
import { getCompletedLevel } from "@/lib/education-store";

export default function ProfilPage() {
  const [profile, setProfile] = useState(currentUser);
  const [editing, setEditing] = useState(false);
  const [educationLevel, setEducationLevel] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEducationLevel(getCompletedLevel());
  }, []);

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = () => {
    setEditing(false);
    // In production: save to Supabase
  };

  return (
    <>
      <Header title="Profil" />
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Profile header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-night/5 flex items-center justify-center mb-4">
            <span className="font-serif text-3xl font-bold text-night/30">
              {initials}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-night">
            {profile.full_name}
          </h2>
          <p className="text-sm text-night/40 font-sans mt-1">
            {profile.city} &middot; {profile.age} yaş &middot; {profile.profession}
          </p>
          {mounted && educationLevel > 0 && (
            <div className="mt-3">
              <Badge level={educationLevel} />
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl border border-night/5 p-5 mb-4">
          <label className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
            Niyet
          </label>
          {editing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full mt-2 bg-cream-dark rounded-lg p-3 text-sm font-sans text-night/70 resize-none focus:outline-none focus:ring-2 focus:ring-gold/30"
              rows={3}
            />
          ) : (
            <p className="mt-2 text-[15px] text-night/70 font-sans italic leading-relaxed">
              &ldquo;{profile.bio}&rdquo;
            </p>
          )}
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-night/5 p-5 mb-4">
          <label className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
            Kişisel Bilgiler
          </label>
          <div className="mt-3 space-y-3">
            {[
              { label: "Ad Soyad", key: "full_name" as const, value: profile.full_name },
              { label: "Yaş", key: "age" as const, value: String(profile.age) },
              { label: "Şehir", key: "city" as const, value: profile.city },
              { label: "Meslek", key: "profession" as const, value: profile.profession },
            ].map((field) => (
              <div key={field.key} className="flex items-center justify-between">
                <span className="text-sm text-night/40 font-sans">{field.label}</span>
                {editing ? (
                  <input
                    type={field.key === "age" ? "number" : "text"}
                    value={field.value}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        [field.key]: field.key === "age" ? Number(e.target.value) : e.target.value,
                      })
                    }
                    className="text-right bg-cream-dark rounded-lg px-3 py-1.5 text-sm font-sans text-night focus:outline-none focus:ring-2 focus:ring-gold/30 w-40"
                  />
                ) : (
                  <span className="text-sm font-sans text-night font-medium">
                    {field.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Religious info */}
        <div className="bg-white rounded-xl border border-night/5 p-5 mb-6">
          <label className="text-xs font-sans font-semibold text-gold uppercase tracking-wider">
            Dini Bilgiler
          </label>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-night/40 font-sans">Mezhep</span>
              {editing ? (
                <select
                  value={profile.mezhep}
                  onChange={(e) =>
                    setProfile({ ...profile, mezhep: e.target.value as typeof profile.mezhep })
                  }
                  className="bg-cream-dark rounded-lg px-3 py-1.5 text-sm font-sans text-night focus:outline-none focus:ring-2 focus:ring-gold/30"
                >
                  <option value="hanefi">Hanefî</option>
                  <option value="shafii">Şâfiî</option>
                  <option value="maliki">Mâlikî</option>
                  <option value="hanbeli">Hanbelî</option>
                </select>
              ) : (
                <span className="text-sm font-sans text-night font-medium capitalize">
                  {profile.mezhep}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-night/40 font-sans">Namaz</span>
              <span className="text-sm font-sans text-night font-medium">
                {profile.namaz_regularity}
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex gap-3">
          {editing ? (
            <>
              <Button variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
                İptal
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                Kaydet
              </Button>
            </>
          ) : (
            <Button variant="secondary" className="w-full" onClick={() => setEditing(true)}>
              Profili Düzenle
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
