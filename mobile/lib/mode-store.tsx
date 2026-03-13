import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserMode } from "./types";

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(MODE_KEY)
      .then((stored) => {
        if (stored === "aday" || stored === "refakatci") {
          setModeState(stored);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(MODE_KEY, newMode).catch(() => {});
  };

  if (!hydrated) {
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

