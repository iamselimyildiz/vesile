import AsyncStorage from "@react-native-async-storage/async-storage";
import { MatchRequest } from "./types";
import { currentUser, mockRequests } from "./mock-data";

const STORAGE_KEY = "vesile_sent_requests";

// Memory cache
let cachedRequests: MatchRequest[] | null = null;

export async function loadRequests(): Promise<MatchRequest[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    cachedRequests = stored ? JSON.parse(stored) : [];
    return cachedRequests;
  } catch {
    cachedRequests = [];
    return [];
  }
}

export function getRequestsSync(): MatchRequest[] {
  return cachedRequests ?? [];
}

export async function addRequest(receiverId: string): Promise<MatchRequest> {
  const requests = getRequestsSync().slice();
  const newRequest: MatchRequest = {
    id: `r_${Date.now()}`,
    sender_id: currentUser.id,
    receiver_id: receiverId,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  requests.push(newRequest);
  cachedRequests = requests;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return newRequest;
}

/**
 * Returns Set of profile IDs that already have a sent request
 * (both from mockRequests and runtime requests)
 */
export function getSentProfileIds(): Set<string> {
  const runtimeIds = getRequestsSync()
    .filter((r) => r.sender_id === currentUser.id)
    .map((r) => r.receiver_id);

  const mockIds = mockRequests
    .filter((r) => r.sender_id === currentUser.id)
    .map((r) => r.receiver_id);

  return new Set([...mockIds, ...runtimeIds]);
}

/**
 * All requests combined (mock + runtime) for display in Adaylar
 */
export function getAllRequests(): MatchRequest[] {
  return [...mockRequests, ...getRequestsSync()];
}
