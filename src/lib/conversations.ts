import { supabase } from "./supabase";

export async function ensureConversation({
  participants,
  listingId,
  listingTitle,
  listingImage,
}: {
  participants: string[];
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
}) {
  const { data: existingRows, error } = await supabase
    .from("conversations")
    .select("*")
    .contains("participants", participants);

  if (error) throw error;

  const existing = existingRows?.find((row) => {
    const sameParticipants =
      Array.isArray(row.participants) &&
      row.participants.length === participants.length &&
      participants.every((uid) => row.participants.includes(uid));

    const sameListing = !listingId || (row.listing_id && row.listing_id === listingId) || !row.listing_id;
    return sameParticipants && sameListing;
  });

  if (existing) return existing.id;

  const { data, error: insertError } = await supabase
    .from("conversations")
    .insert({
      participants,
      listing_id: listingId || null,
      listing_title: listingTitle || "إعلان",
      listing_image: listingImage || "",
      last_message: "",
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return data.id;
}

export async function sendConversationMessage({
  conversationId,
  senderId,
  senderName,
  text,
}: {
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
}) {
  if (!text.trim()) return null;

  const { data: msgData, error: messageError } = await supabase
    .from("conversation_messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: senderName,
      text: text.trim(),
    })
    .select()
    .single();

  if (messageError) throw messageError;

  await supabase
    .from("conversations")
    .update({
      last_message: text.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return msgData.id;
}

export async function getConversationTitle(conversationId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("listing_title")
    .eq("id", conversationId)
    .single();

  if (error || !data) return "محادثة";
  return data.listing_title || "محادثة";
}
