"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { mockRequests, mockProfiles, mockChatRooms, currentUser } from "@/lib/mock-data";
import { RequestStatus } from "@/lib/types";

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Beklemede", color: "text-night", bg: "bg-night/10" },
  accepted: { label: "Onaylandı", color: "text-gold", bg: "bg-gold/10" },
  rejected: { label: "Reddedildi", color: "text-muted", bg: "bg-muted/10" },
};

export default function AdaylarPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sent" | "received" | "chats">("chats");

  const requests = mockRequests.map((r) => ({
    ...r,
    receiver: mockProfiles.find((p) => p.id === r.receiver_id),
    sender: mockProfiles.find((p) => p.id === r.sender_id),
  }));

  const myRooms = mockChatRooms
    .filter((r) => r.aday1_id === currentUser.id || r.aday2_id === currentUser.id)
    .map((room) => ({
      ...room,
      aday1: mockProfiles.find((p) => p.id === room.aday1_id),
      aday2: mockProfiles.find((p) => p.id === room.aday2_id),
      refakatci: room.refakatci_id
        ? mockProfiles.find((p) => p.id === room.refakatci_id)
        : undefined,
    }));

  return (
    <>
      <Header title="Adaylar" />
      <main className="max-w-lg mx-auto px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["chats", "sent", "received"] as const).map((tab) => {
            const labels = { sent: "Gönderilen", received: "Gelen", chats: "Sohbetler" };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-sans font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-night text-cream"
                    : "bg-cream-dark text-night/50"
                }`}
              >
                {labels[tab]}
                {tab === "chats" && myRooms.length > 0 && (
                  <span className="ml-1.5 bg-aday text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {myRooms.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Chats tab */}
        {activeTab === "chats" && (
          <div className="space-y-3">
            {myRooms.map((room) => {
              const otherPerson =
                room.aday1_id === currentUser.id ? room.aday2 : room.aday1;
              const lastMsg = room.messages[room.messages.length - 1];
              const isWaiting = room.status === "waiting_refakatci";

              if (!otherPerson) return null;

              const initials = otherPerson.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <button
                  key={room.id}
                  onClick={() => router.push("/sohbet")}
                  className="w-full bg-white rounded-xl border border-night/5 p-4 flex items-center gap-4 text-left transition-colors hover:border-aday/20"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isWaiting ? "bg-gold/10" : "bg-aday/10"
                  }`}>
                    <span className={`font-serif text-sm font-bold ${
                      isWaiting ? "text-gold" : "text-aday"
                    }`}>
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-night text-[15px] truncate">
                      {otherPerson.full_name}
                    </h4>
                    {isWaiting ? (
                      <p className="text-xs text-gold font-sans font-medium">
                        Refakatçi bekleniyor...
                      </p>
                    ) : lastMsg ? (
                      <p className="text-xs text-night/40 font-sans truncate">
                        {lastMsg.is_system ? lastMsg.content : `${lastMsg.sender_name}: ${lastMsg.content}`}
                      </p>
                    ) : (
                      <p className="text-xs text-night/30 font-sans">Henüz mesaj yok</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {room.refakatci && (
                      <span className="text-[9px] font-sans text-refakatci bg-refakatci/10 px-1.5 py-0.5 rounded-full">
                        {room.refakatci.full_name.split(" ")[0]}
                      </span>
                    )}
                    <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                      room.status === "active"
                        ? "bg-aday/10 text-aday"
                        : room.status === "waiting_refakatci"
                          ? "bg-gold/10 text-gold"
                          : "bg-muted/10 text-muted"
                    }`}>
                      {room.status === "active" ? "Aktif" : room.status === "waiting_refakatci" ? "Bekliyor" : "Kapalı"}
                    </span>
                  </div>
                </button>
              );
            })}
            {myRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-night/30 font-sans text-sm">
                  Henüz aktif sohbetiniz yok
                </p>
              </div>
            )}
          </div>
        )}

        {/* Request lists */}
        {(activeTab === "sent" || activeTab === "received") && (
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
                  <div className="w-12 h-12 rounded-full bg-night/5 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-sm font-bold text-night/30">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-night text-[15px] truncate">
                      {person.full_name}
                    </h4>
                    <p className="text-xs text-night/40 font-sans">
                      {person.city} &middot; {person.age} yaş
                    </p>
                  </div>
                  <span
                    className={`text-xs font-sans font-medium px-3 py-1 rounded-full ${status.bg} ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-night/30 font-sans">
                  {activeTab === "sent"
                    ? "Henüz istek göndermediniz"
                    : "Henüz istek almadınız"}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
