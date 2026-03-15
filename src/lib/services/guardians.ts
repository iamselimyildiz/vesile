import { supabase } from "../supabase";
import type { GuardianRelation, KarneResponse, KarneAnalysis } from "../types";

export async function getMyEmanets(
  refakatciId: string
): Promise<GuardianRelation[]> {
  const { data, error } = await supabase
    .from("guardian_relations")
    .select("*, aday:profiles!aday_id(*)")
    .eq("refakatci_id", refakatciId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GuardianRelation[]) || [];
}

export async function getMyGuardians(
  adayId: string
): Promise<GuardianRelation[]> {
  const { data, error } = await supabase
    .from("guardian_relations")
    .select("*, refakatci:profiles!refakatci_id(*)")
    .eq("aday_id", adayId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GuardianRelation[]) || [];
}

export async function submitKarne(
  relationId: string,
  responses: KarneResponse[]
): Promise<void> {
  const { error } = await supabase
    .from("guardian_relations")
    .update({ karne_responses: responses })
    .eq("id", relationId);

  if (error) throw error;
}

export async function saveKarneAnalysis(
  relationId: string,
  analysis: KarneAnalysis
): Promise<void> {
  const { error } = await supabase
    .from("guardian_relations")
    .update({ karne_analysis: analysis })
    .eq("id", relationId);

  if (error) throw error;
}

export async function getKarneAnalysis(
  relationId: string
): Promise<KarneAnalysis | null> {
  const { data, error } = await supabase
    .from("guardian_relations")
    .select("karne_analysis")
    .eq("id", relationId)
    .single();

  if (error) return null;
  return data?.karne_analysis as KarneAnalysis | null;
}
