"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMode } from "@/lib/mode-store";

const SearchIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const ShieldIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const BookIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ChatIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

const EyeIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon = (active: boolean) => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

interface Tab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  activeColor?: string;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { mode } = useMode();

  const adayTabs: Tab[] = [
    { href: "/kesfet", label: "Keşfet", icon: SearchIcon },
    { href: "/egitim", label: "Eğitim", icon: BookIcon },
    { href: "/adaylar", label: "Adaylar", icon: ChatIcon },
    { href: "/profil", label: "Profil", icon: ProfileIcon },
  ];

  const refakatciTabs: Tab[] = [
    { href: "/emanetim", label: "Emanetim", icon: ShieldIcon, activeColor: "text-refakatci" },
    { href: "/egitim", label: "Eğitim", icon: BookIcon },
    { href: "/gozlem", label: "Gözlem", icon: EyeIcon, activeColor: "text-refakatci" },
    { href: "/profil", label: "Profil", icon: ProfileIcon },
  ];

  const tabs = mode === "refakatci" ? refakatciTabs : adayTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-night/5 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const activeColor = tab.activeColor || "text-gold";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors duration-200 ${
                active ? activeColor : "text-night/40 hover:text-night/60"
              }`}
            >
              {tab.icon(active)}
              <span className={`text-[11px] font-sans ${active ? "font-semibold" : "font-normal"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
