import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Loader2, Send, MessageSquareText } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at?: { seconds?: number };
}

export default function ChatThread() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversationTitle, setConversationTitle] = useState("المحادثة");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
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
          created_at: item.created_at,
        })));
      }

      setLoading(false);
    };

    loadConversation();
  }, [conversationId, user]);

  const sendMessage = async () => {
    if (!user || !conversationId || !draft.trim()) return;

    const payload = {
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: user.user_metadata?.full_name || "مستخدم",
      text: draft.trim(),
    };

    await supabase.from("conversation_messages").insert(payload);
    await supabase.from("conversations").update({
      last_message: draft.trim(),
      updated_at: new Date().toISOString(),
    }).eq("id", conversationId);
    setDraft("");
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
              const isMine = message.sender_id === user.uid;
              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isMine ? "bg-brand-500 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
                    <div className="text-[10px] font-bold opacity-80 mb-1">{isMine ? "أنت" : message.sender_name}</div>
                    <p className="text-xs leading-6 whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-brand-500"
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
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-xs font-black flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
