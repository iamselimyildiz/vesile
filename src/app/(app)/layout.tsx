"use client";

import BottomNav from "@/components/layout/BottomNav";
import { ModeProvider } from "@/lib/mode-store";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeProvider>
      <div className="min-h-screen pb-20">
        {children}
        <BottomNav />
      </div>
    </ModeProvider>
  );
}
