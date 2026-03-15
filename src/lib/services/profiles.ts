import { supabase } from "../supabase";
import type { Profile, Gender, Mezhep } from "../types";

interface ProfileFilters {
  gender?: Gender;
  city?: string;
  mezhep?: Mezhep;
  minAge?: number;
  maxAge?: number;
  excludeId?: string;
  maritalStatus?: string;
}

export async function getProfiles(filters?: ProfileFilters): Promise<Profile[]> {
  let query = supabase.from("profiles").select("*");

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }
  if (filters?.city) {
    query = query.eq("city", filters.city);
  }
  if (filters?.mezhep) {
    query = query.eq("mezhep", filters.mezhep);
  }
  if (filters?.minAge) {
    query = query.gte("age", filters.minAge);
  }
  if (filters?.maxAge) {
    query = query.lte("age", filters.maxAge);
  }
  if (filters?.excludeId) {
    query = query.neq("id", filters.excludeId);
  }
  if (filters?.maritalStatus) {
    query = query.eq("marital_status", filters.maritalStatus);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Profile[]) || [];
}

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function updateProfile(
  id: string,
  updates: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}
