import { useEffect, useState } from "react";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";

interface ConversationItem {
  id: string;
  listing_title: string;
  last_message: string;
  updated_at?: { seconds?: number };
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .contains("participants", [user.id])
        .order("updated_at", { ascending: false });

      if (error) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const next = (data || []).map((item) => ({
        id: item.id,
        listing_title: item.listing_title || "محادثة",
        last_message: item.last_message || "بدء المحادثة",
        updated_at: item.updated_at,
      }));

      setConversations(next);
      setLoading(false);
    };

    fetchConversations();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-8 pb-24 md:pb-8">
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">تحتاج إلى تسجيل الدخول</h2>
          <p className="text-slate-500 mb-6">لرؤية محادثاتك ومتابعة الرسائل</p>
          <Link to="/login" className="btn-primary">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">الرسائل</h1>
      </div>

      {loading ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">صندوق الرسائل فارغ</h2>
          <p className="text-slate-500 mb-6">عندما تقوم بالتواصل مع المعلنين، ستظهر رسائلك هنا</p>
          <Link to="/properties" className="btn-primary">تصفح العقارات</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => navigate(`/messages/${conversation.id}`)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-xs transition hover:border-brand-200 hover:bg-brand-50/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{conversation.listing_title}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{conversation.last_message}</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
