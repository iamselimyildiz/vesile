"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockRequests, mockProfiles } from "@/lib/mock-data";
import { RequestStatus } from "@/lib/types";

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Beklemede", color: "text-night", bg: "bg-night/10" },
  accepted: { label: "Onaylandı", color: "text-gold", bg: "bg-gold/10" },
  rejected: { label: "Reddedildi", color: "text-muted", bg: "bg-muted/10" },
};

export default function AdaylarPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  const requests = mockRequests.map((r) => ({
    ...r,
    receiver: mockProfiles.find((p) => p.id === r.receiver_id),
    sender: mockProfiles.find((p) => p.id === r.sender_id),
  }));

  return (
    <>
      <Header title="Adaylar" />
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors ${
              activeTab === "sent"
                ? "bg-night text-cream"
                : "bg-cream-dark text-night/50"
            }`}
          >
            Gönderilen
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors ${
              activeTab === "received"
                ? "bg-night text-cream"
                : "bg-cream-dark text-night/50"
            }`}
          >
            Gelen
          </button>
        </div>

        {/* Request list */}
        <div className="space-y-3">
          {requests.map((request) => {
            const person = activeTab === "sent" ? request.receiver : request.sender;
            const status = statusConfig[request.status as RequestStatus];
            if (!person) return null;

            const initials = person.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={request.id}
                className="bg-white rounded-xl border border-night/5 p-4 flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-night/5 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-sm font-bold text-night/30">
                    {initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-night text-[15px] truncate">
                    {person.full_name}
                  </h4>
                  <p className="text-xs text-night/40 font-sans">
                    {person.city} &middot; {person.age} yaş
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`text-xs font-sans font-medium px-3 py-1 rounded-full ${status.bg} ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-16">
            <p className="text-night/30 font-sans">
              {activeTab === "sent"
                ? "Henüz istek göndermediniz"
                : "Henüz istek almadınız"}
            </p>
          </div>
        )}
      </main>
    </>
  );
}
