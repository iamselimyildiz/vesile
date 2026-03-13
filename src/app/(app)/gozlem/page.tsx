"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { mockChatRooms, mockProfiles, currentUser } from "@/lib/mock-data";
import { ChatRoom, Message } from "@/lib/types";

export default function GozlemPage() {
  // In refakatci mode, show rooms where the user is refakatci
  const rooms = mockChatRooms
    .filter((r) => r.refakatci_id === currentUser.id || r.aday1_id === currentUser.id || r.aday2_id === currentUser.id)
    .map((room) => ({
      ...room,
      aday1: mockProfiles.find((p) => p.id === room.aday1_id),
      aday2: mockProfiles.find((p) => p.id === room.aday2_id),
      refakatci: room.refakatci_id ? mockProfiles.find((p) => p.id === room.refakatci_id) : undefined,
    }));

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  if (selectedRoom) {
    const resolved = rooms.find((r) => r.id === selectedRoom.id);
    return (
      <>
        <Header title="Gözlem" />
        <main className="max-w-lg mx-auto px-5 py-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedRoom(null)}
            className="flex items-center gap-1 text-sm text-night/50 font-sans mb-4 hover:text-night transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Geri
          </button>

          {/* Room header */}
          <div className="bg-refakatci/5 border border-refakatci/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-refakatci" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-sans font-semibold text-refakatci uppercase tracking-wider">
                Salt Okunur Gözlem
              </span>
            </div>
            <p className="text-xs text-night/50 font-sans">
              Gözlemci olarak mesaj yazamazsınız. Sadece sohbeti izleyebilirsiniz.
            </p>
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {resolved?.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} currentUserId={currentUser.id} isObserver />
            ))}
            {(!resolved?.messages || resolved.messages.length === 0) && (
              <div className="text-center py-8">
                <p className="text-sm text-night/30 font-sans">
                  Henüz mesaj yok
                </p>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Gözlem" />
      <main className="max-w-lg mx-auto px-5 py-6">
        <p className="text-sm text-night/50 font-sans mb-6">
          Refakat ettiğiniz adayların sohbet odalarını buradan izleyebilirsiniz.
        </p>

        <div className="space-y-3">
          {rooms.map((room) => {
            const otherPerson =
              room.aday1_id === currentUser.id ? room.aday2 : room.aday1;
            const lastMessage = room.messages[room.messages.length - 1];
            const isWaiting = room.status === "waiting_refakatci";

            return (
              <button
                key={room.id}
                onClick={() => !isWaiting && setSelectedRoom(room)}
                disabled={isWaiting}
                className="w-full bg-white rounded-xl border border-night/5 p-4 flex items-center gap-4 text-left transition-colors hover:border-refakatci/20 disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-refakatci/10 flex items-center justify-center flex-shrink-0">
                  {room.status === "active" ? (
                    <svg className="w-5 h-5 text-refakatci" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-night/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-semibold text-night text-[15px] truncate">
                      {room.aday1?.full_name} & {room.aday2?.full_name}
                    </h4>
                  </div>
                  {isWaiting ? (
                    <p className="text-xs text-refakatci font-sans font-medium">
                      Refakatçi bekleniyor...
                    </p>
                  ) : lastMessage ? (
                    <p className="text-xs text-night/40 font-sans truncate">
                      {lastMessage.sender_name}: {lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-xs text-night/30 font-sans">
                      Henüz mesaj yok
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
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
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-refakatci/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-refakatci/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-night/30 font-sans text-sm">
              İzlenecek sohbet odası yok
            </p>
          </div>
        )}
      </main>
    </>
  );
}

function MessageBubble({
  message,
  currentUserId,
  isObserver,
}: {
  message: Message;
  currentUserId: string;
  isObserver?: boolean;
}) {
  if (message.is_system) {
    return (
      <div className="text-center py-2">
        <span className="text-xs text-night/30 font-sans bg-cream-dark px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const time = new Date(message.created_at).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-sans font-semibold text-night/60">
          {message.sender_name}
        </span>
        <span className="text-[10px] text-night/25 font-sans">{time}</span>
      </div>
      <div className="bg-white rounded-xl border border-night/5 p-3">
        <p className="text-sm text-night/70 font-sans">{message.content}</p>
      </div>
    </div>
  );
}
