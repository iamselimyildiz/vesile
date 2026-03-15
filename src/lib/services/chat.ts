import { supabase } from "../supabase";
import type { ChatRoom, Message } from "../types";

export async function getMyChatRooms(userId: string): Promise<ChatRoom[]> {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `*,
      aday1:profiles!aday1_id(*),
      aday2:profiles!aday2_id(*),
      refakatci:profiles!refakatci_id(*),
      messages(*)
    `
    )
    .or(`aday1_id.eq.${userId},aday2_id.eq.${userId},refakatci_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Sort messages by created_at within each room
  return ((data as ChatRoom[]) || []).map((room) => ({
    ...room,
    messages: (room.messages || []).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  }));
}

export async function getChatRoom(roomId: string): Promise<ChatRoom | null> {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `*,
      aday1:profiles!aday1_id(*),
      aday2:profiles!aday2_id(*),
      refakatci:profiles!refakatci_id(*),
      messages(*)
    `
    )
    .eq("id", roomId)
    .single();

  if (error) return null;

  const room = data as ChatRoom;
  room.messages = (room.messages || []).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return room;
}

export async function sendMessage(
  roomId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      sender_id: senderId,
      sender_name: senderName,
      content,
      is_system: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function sendSystemMessage(
  roomId: string,
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      sender_id: "system",
      sender_name: "Sistem",
      content,
      is_system: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function leaveRoom(
  roomId: string,
  userId: string,
  userName: string
): Promise<void> {
  // Send system message
  await sendSystemMessage(roomId, `${userName} gorusmeden ayrildi.`);

  // Close the room
  const { error } = await supabase
    .from("chat_rooms")
    .update({ status: "closed" })
    .eq("id", roomId);

  if (error) throw error;
}

export async function joinRoomAsRefakatci(
  roomId: string,
  refakatciId: string
): Promise<void> {
  const { error } = await supabase
    .from("chat_rooms")
    .update({ refakatci_id: refakatciId, status: "active" })
    .eq("id", roomId);

  if (error) throw error;
}
