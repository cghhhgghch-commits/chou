import { useEffect, useState } from "react";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import Skeleton from "../components/ui/Skeleton";

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
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">تحتاج إلى تسجيل الدخول</h2>
          <p className="mb-6 text-sm text-stone-600">لرؤية محادثاتك ومتابعة الرسائل</p>
          <Link to="/login" className="btn-primary inline-flex min-h-11 items-center">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <p className="text-xs font-bold text-brand-700">حسابي</p>
          <h1 className="text-2xl font-bold text-stone-900">الرسائل</h1>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex min-h-16 items-center gap-3 rounded-xl border border-stone-200 bg-white p-4">
              <Skeleton shape="circle" width={44} height={44} />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">صندوق الرسائل فارغ</h2>
          <p className="mb-6 text-sm text-stone-600">عندما تقوم بالتواصل مع المعلنين، ستظهر رسائلك هنا</p>
          <Link to="/properties" className="btn-primary inline-flex min-h-11 items-center">تصفح العقارات</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => navigate(`/messages/${conversation.id}`)}
              className="flex min-h-16 w-full items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4 text-right transition-colors hover:border-brand-300 hover:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{conversation.listing_title}</div>
                  <div className="mt-1 text-sm text-stone-600">{conversation.last_message}</div>
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
