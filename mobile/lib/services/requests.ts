import { supabase } from "../supabase";
import type { MatchRequest, RequestStatus } from "../types";

export async function getMyRequests(userId: string): Promise<{
  sent: MatchRequest[];
  received: MatchRequest[];
}> {
  const [sentRes, receivedRes] = await Promise.all([
    supabase
      .from("match_requests")
      .select("*, receiver:profiles!receiver_id(*)")
      .eq("sender_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("match_requests")
      .select("*, sender:profiles!sender_id(*)")
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (sentRes.error) throw sentRes.error;
  if (receivedRes.error) throw receivedRes.error;

  return {
    sent: (sentRes.data as MatchRequest[]) || [],
    received: (receivedRes.data as MatchRequest[]) || [],
  };
}

export async function sendRequest(
  senderId: string,
  receiverId: string
): Promise<MatchRequest> {
  const { data, error } = await supabase
    .from("match_requests")
    .insert({ sender_id: senderId, receiver_id: receiverId })
    .select()
    .single();

  if (error) throw error;
  return data as MatchRequest;
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus
): Promise<MatchRequest> {
  const { data, error } = await supabase
    .from("match_requests")
    .update({ status })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as MatchRequest;
}

export async function getSentProfileIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("match_requests")
    .select("receiver_id")
    .eq("sender_id", userId);

  if (error) throw error;
  return (data || []).map((r) => r.receiver_id);
}
