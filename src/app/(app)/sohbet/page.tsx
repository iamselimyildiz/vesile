"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { mockChatRooms, mockProfiles, currentUser } from "@/lib/mock-data";
import { Message, ChatRoom } from "@/lib/types";

export default function SohbetPage() {
  const [rooms, setRooms] = useState(() =>
    mockChatRooms.map((room) => ({
      ...room,
      aday1: mockProfiles.find((p) => p.id === room.aday1_id),
      aday2: mockProfiles.find((p) => p.id === room.aday2_id),
      refakatci: room.refakatci_id
        ? mockProfiles.find((p) => p.id === room.refakatci_id)
        : undefined,
    }))
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedRoom?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !selectedRoomId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      room_id: selectedRoomId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name.split(" ")[0],
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId
          ? { ...room, messages: [...room.messages, newMessage] }
          : room
      )
    );
    setInput("");
  };

  const handleLeave = () => {
    if (!selectedRoomId) return;
    const leaveMsg: Message = {
      id: `msg-leave-${Date.now()}`,
      room_id: selectedRoomId,
      sender_id: "system",
      sender_name: "Sistem",
      content: `${currentUser.full_name.split(" ")[0]} görüşmeden ayrıldı.`,
      is_system: true,
      created_at: new Date().toISOString(),
    };
    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId
          ? { ...room, status: "closed" as const, messages: [...room.messages, leaveMsg] }
          : room
      )
    );
    setSelectedRoomId(null);
  };

  // Chat view
  if (selectedRoom) {
    const otherPerson =
      selectedRoom.aday1_id === currentUser.id
        ? selectedRoom.aday2
        : selectedRoom.aday1;
    const isLocked = selectedRoom.status === "waiting_refakatci";
    const isClosed = selectedRoom.status === "closed";

    return (
      <>
        <Header title={otherPerson?.full_name || "Sohbet"} />
        <main className="max-w-lg mx-auto flex flex-col" style={{ height: "calc(100dvh - 120px)" }}>
          {/* Room info bar */}
          <div className="px-5 py-2 border-b border-night/5 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setSelectedRoomId(null)}
              className="flex items-center gap-1 text-sm text-night/50 font-sans hover:text-night transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Geri
            </button>
            <div className="flex items-center gap-2">
              {selectedRoom.refakatci && (
                <span className="text-[10px] font-sans text-refakatci bg-refakatci/10 px-2 py-0.5 rounded-full">
                  Refakatçi: {selectedRoom.refakatci.full_name.split(" ")[0]}
                </span>
              )}
              <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                selectedRoom.status === "active"
                  ? "bg-aday/10 text-aday"
                  : selectedRoom.status === "waiting_refakatci"
                    ? "bg-gold/10 text-gold"
                    : "bg-muted/10 text-muted"
              }`}>
                {selectedRoom.status === "active" ? "Aktif" : selectedRoom.status === "waiting_refakatci" ? "Bekliyor" : "Kapalı"}
              </span>
            </div>
          </div>

          {/* Lock notice */}
          {isLocked && (
            <div className="px-5 py-4 bg-gold/10 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-sm text-night/70 font-sans">
                  Refakatçi odaya katılmadan sohbet başlatılamaz.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {selectedRoom.messages.map((msg) => {
              if (msg.is_system) {
                return (
                  <div key={msg.id} className="text-center py-2">
                    <span className="text-xs text-night/30 font-sans bg-cream-dark px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              const isMine = msg.sender_id === currentUser.id;
              const time = new Date(msg.created_at).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-sans text-night/40">
                      {msg.sender_name}
                    </span>
                    <span className="text-[9px] text-night/20 font-sans">{time}</span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "bg-aday text-white rounded-tr-sm"
                        : "bg-white border border-night/5 text-night/70 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm font-sans">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          {!isLocked && !isClosed ? (
            <div className="px-5 py-3 border-t border-night/5 flex-shrink-0 bg-cream">
              <div className="flex gap-2">
                <button
                  onClick={handleLeave}
                  className="p-2.5 text-refakatci hover:bg-refakatci/10 rounded-lg transition-colors flex-shrink-0"
                  title="Görüşmeden Ayrıl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 bg-cream-dark rounded-xl px-4 py-2.5 text-sm font-sans text-night focus:outline-none focus:ring-2 focus:ring-aday/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2.5 bg-aday text-white rounded-xl hover:bg-aday-dark transition-colors disabled:opacity-30 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          ) : isClosed ? (
            <div className="px-5 py-4 border-t border-night/5 bg-cream-dark text-center">
              <p className="text-sm text-night/40 font-sans">Bu sohbet odası kapatılmıştır.</p>
            </div>
          ) : null}
        </main>
      </>
    );
  }

  // Room list view
  const myRooms = rooms.filter(
    (r) => r.aday1_id === currentUser.id || r.aday2_id === currentUser.id
  );

  return (
    <>
      <Header title="Sohbetler" />
      <main className="max-w-lg mx-auto px-5 py-6">
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
                onClick={() => setSelectedRoomId(room.id)}
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
                <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  room.status === "active"
                    ? "bg-aday/10 text-aday"
                    : room.status === "waiting_refakatci"
                      ? "bg-gold/10 text-gold"
                      : "bg-muted/10 text-muted"
                }`}>
                  {room.status === "active" ? "Aktif" : room.status === "waiting_refakatci" ? "Bekliyor" : "Kapalı"}
                </span>
              </button>
            );
          })}
        </div>

        {myRooms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-night/30 font-sans text-sm">
              Henüz aktif sohbet odanız yok
            </p>
          </div>
        )}
      </main>
    </>
  );
}
