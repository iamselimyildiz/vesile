import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Profile } from "./types";
import type { User, Session } from "@supabase/supabase-js";
import * as Application from "expo-application";
import { Platform } from "react-native";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
    return data;
  };

  const getDeviceId = async (): Promise<string> => {
    if (Platform.OS === "android") {
      return Application.getAndroidId() || "unknown-android";
    }
    // iOS: Use installation ID (persists until app reinstall)
    const iosId = await Application.getIosIdForVendorAsync();
    return iosId || "unknown-ios";
  };

  const checkHardwareId = async (userId: string) => {
    const deviceId = await getDeviceId();
    const { data } = await supabase
      .from("profiles")
      .select("hardware_id")
      .eq("id", userId)
      .single();

    if (data?.hardware_id && data.hardware_id !== deviceId) {
      await supabase.auth.signOut();
      throw new Error("Bu hesap başka bir cihaza bağlıdır.");
    }

    if (!data?.hardware_id) {
      await supabase
        .from("profiles")
        .update({ hardware_id: deviceId })
        .eq("id", userId);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await checkHardwareId(user.id);
        } catch (e) {
          return { error: e as Error };
        }
      }
    }
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
