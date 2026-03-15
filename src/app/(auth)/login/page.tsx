"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/kesfet");
    }
  };

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
        Evlilik Rehberi & Eslesme Platformu
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#1A2A40",
              marginBottom: 6,
              fontFamily: "var(--font-inter)",
            }}
          >
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #E0DDD5",
              borderRadius: 8,
              fontSize: 15,
              backgroundColor: "#fff",
              fontFamily: "var(--font-inter)",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="ornek@email.com"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              color: "#1A2A40",
              marginBottom: 6,
              fontFamily: "var(--font-inter)",
            }}
          >
            Sifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #E0DDD5",
              borderRadius: 8,
              fontSize: 15,
              backgroundColor: "#fff",
              fontFamily: "var(--font-inter)",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="********"
          />
        </div>

        {error && (
          <p
            style={{
              color: "#BF4646",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
              fontFamily: "var(--font-inter)",
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
          {loading ? "Giris yapiliyor..." : "Giris Yap"}
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
        Hesabiniz yok mu?{" "}
        <a
          href="/register"
          style={{ color: "#C5A059", textDecoration: "none", fontWeight: 600 }}
        >
          Kayit Ol
        </a>
      </p>
    </div>
  );
}
