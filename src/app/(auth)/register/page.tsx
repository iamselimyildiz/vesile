"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Gender, Mezhep } from "@/lib/types";

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"credentials" | "profile">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [mezhep, setMezhep] = useState<Mezhep>("hanefi");
  const [profession, setProfession] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep("profile");
      setLoading(false);
    }
  };

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Oturum bulunamadi. Lutfen tekrar giris yapin.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      age: parseInt(age),
      city,
      profession,
      gender,
      mezhep,
      bio: "",
      namaz_regularity: "5 vakit duzenli",
      education_level: 0,
      marital_status: "bekar",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/kesfet");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #E0DDD5",
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    fontFamily: "var(--font-inter)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: 13,
    color: "#1A2A40",
    marginBottom: 6,
    fontFamily: "var(--font-inter)",
  };

  if (step === "profile") {
    return (
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 28,
            color: "#1A2A40",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Profilini Olustur
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#666",
            textAlign: "center",
            marginBottom: 28,
            fontFamily: "var(--font-inter)",
          }}
        >
          Kendini kisaca tanit
        </p>

        <form onSubmit={handleProfile}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Ad Soyad</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={inputStyle}
              placeholder="Ahmet Yilmaz"
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Yas</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min={18}
                max={99}
                style={inputStyle}
                placeholder="25"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Sehir</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                style={inputStyle}
                placeholder="Istanbul"
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Meslek</label>
            <input
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
              style={inputStyle}
              placeholder="Muhendis"
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Cinsiyet</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                style={inputStyle}
              >
                <option value="male">Erkek</option>
                <option value="female">Kadin</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Mezhep</label>
              <select
                value={mezhep}
                onChange={(e) => setMezhep(e.target.value as Mezhep)}
                style={inputStyle}
              >
                <option value="hanefi">Hanefi</option>
                <option value="shafii">Safii</option>
                <option value="maliki">Maliki</option>
                <option value="hanbeli">Hanbeli</option>
              </select>
            </div>
          </div>

          {error && (
            <p
              style={{
                color: "#BF4646",
                fontSize: 13,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#C5A059",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Kaydediliyor..." : "Basla"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 32,
          color: "#1A2A40",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Vesile
      </h1>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 14,
          color: "#666",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Hayirli bir yuva icin ilk adim
      </p>

      <form onSubmit={handleCredentials}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="ornek@email.com"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Sifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
            placeholder="En az 6 karakter"
          />
        </div>

        {error && (
          <p
            style={{
              color: "#BF4646",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#C5A059",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Hesap olusturuluyor..." : "Kayit Ol"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 14,
          color: "#666",
          fontFamily: "var(--font-inter)",
        }}
      >
        Zaten hesabiniz var mi?{" "}
        <a
          href="/login"
          style={{ color: "#C5A059", textDecoration: "none", fontWeight: 600 }}
        >
          Giris Yap
        </a>
      </p>
    </div>
  );
}
