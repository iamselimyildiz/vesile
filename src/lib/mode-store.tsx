"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserMode } from "./types";

const MODE_KEY = "vesile_user_mode";

interface ModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  isRefakatci: boolean;
  isAday: boolean;
}

const ModeContext = createContext<ModeContextType>({
  mode: "aday",
  setMode: () => {},
  isRefakatci: false,
  isAday: true,
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>("aday");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(MODE_KEY) as UserMode | null;
    if (stored === "aday" || stored === "refakatci") {
      setModeState(stored);
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_KEY, newMode);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        isRefakatci: mode === "refakatci",
        isAday: mode === "aday",
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
