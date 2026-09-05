import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Loader2, Send, MessageSquareText, Paperclip, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  text?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
  created_at?: { seconds?: number };
}

export default function ChatThread() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversationTitle, setConversationTitle] = useState("المحادثة");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId || !user) return;

    const loadConversation = async () => {
      const { data: convoData } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (convoData) {
        setConversationTitle(convoData.listing_title || "المحادثة");
      }

      const { data: messagesData, error } = await supabase
        .from("conversation_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages((messagesData || []).map((item) => ({
          id: item.id,
          sender_id: item.sender_id,
          sender_name: item.sender_name,
          text: item.text,
          attachment_url: item.attachment_url,
          attachment_name: item.attachment_name,
          attachment_type: item.attachment_type,
          created_at: item.created_at,
        })));
      }

      setLoading(false);
    };

    loadConversation();
  }, [conversationId, user]);

  const sendMessage = async () => {
    if (!user || !conversationId || (!draft.trim() && !attachment) || sending) return;

    setSending(true);
    setError("");

    let attachmentUrl: string | null = null;
    if (attachment) {
      const extension = attachment.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${user.id}/conversations/${conversationId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-media")
        .upload(path, attachment, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(`تعذر رفع الملف: ${uploadError.message}`);
        setSending(false);
        return;
      }

      attachmentUrl = supabase.storage.from("listing-media").getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: user.user_metadata?.full_name || "مستخدم",
      text: draft.trim() || null,
      attachment_url: attachmentUrl,
      attachment_name: attachment?.name || null,
      attachment_type: attachment?.type || null,
    };

    const { data: insertedMessage, error: messageError } = await supabase
      .from("conversation_messages")
      .insert(payload)
      .select()
      .single();

    if (messageError) {
      setError(`تعذر إرسال الرسالة: ${messageError.message}`);
      setSending(false);
      return;
    }

    setMessages((current) => [...current, insertedMessage]);
    await supabase.from("conversations").update({
      last_message: draft.trim() || `مرفق: ${attachment?.name}`,
      updated_at: new Date().toISOString(),
    }).eq("id", conversationId);
    setDraft("");
    setAttachment(null);
    setSending(false);
  };

  const handleAttachment = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("حجم الملف يجب أن يكون 10 ميغابايت أو أقل.");
      return;
    }
    setError("");
    setAttachment(file);
  };

  const sortedMessages = useMemo(() => messages, [messages]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">يجب تسجيل الدخول لعرض المحادثة.</p>
          <Link to="/login" className="mt-4 inline-block bg-brand-500 text-white rounded-xl px-4 py-2 text-xs font-bold">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-5 pb-24 md:pb-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
          <ArrowLeft className="w-4 h-4" />
          رجوع
        </button>
        <h1 className="text-lg font-black text-slate-900">{conversationTitle}</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex items-center gap-2 text-xs font-bold text-slate-700">
          <MessageSquareText className="w-4 h-4 text-brand-600" />
          <span>محادثة مباشرة</span>
        </div>

        <div className="min-h-[420px] max-h-[520px] overflow-y-auto p-4 space-y-3 bg-slate-50/60">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              <span className="text-xs font-bold">جاري تحميل الرسائل...</span>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-bold">لا توجد رسائل بعد.</div>
          ) : (
            sortedMessages.map((message) => {
              const isMine = message.sender_id === user.id;
              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isMine ? "bg-brand-500 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
                    <div className="text-[10px] font-bold opacity-80 mb-1">{isMine ? "أنت" : message.sender_name}</div>
                    {message.text && <p className="text-xs leading-6 whitespace-pre-wrap">{message.text}</p>}
                    {message.attachment_url && (
                      <a
                        href={message.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-xs font-bold underline break-all"
                      >
                        {message.attachment_name || "فتح المرفق"}
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {error && <p className="px-3 pt-3 text-xs font-bold text-red-600">{error}</p>}
        {attachment && (
          <div className="flex items-center gap-2 px-3 pt-3 text-xs text-slate-600">
            <Paperclip className="h-4 w-4" />
            <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
            <button type="button" onClick={() => setAttachment(null)} aria-label="إزالة المرفق">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white">
          <label className="cursor-pointer rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" title="إرفاق ملف">
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(event) => handleAttachment(event.target.files?.[0])}
            />
          </label>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-brand-500"
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={sending}
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-xs font-black flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {sending ? "جارٍ الإرسال..." : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
