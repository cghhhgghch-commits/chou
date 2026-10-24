import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Clock3, Loader2, MapPin, RefreshCw, X } from "lucide-react";
import { getWhatsAppUrl } from "../../lib/constants";
import { supabase } from "../../lib/supabase";

interface ClientRequest {
  id: string;
  title: string;
  city: string;
  area: string | null;
  bedrooms: number | null;
  budget: number;
  currency: "SYP" | "USD";
  phone: string;
  created_at: string;
}

const formatBudget = (budget: number, currency: ClientRequest["currency"]) =>
  `${new Intl.NumberFormat("ar-SY").format(budget)} ${currency === "SYP" ? "ل.س" : "$"}`;

export default function AdminClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("client_requests")
      .select("id,title,city,area,bedrooms,budget,currency,phone,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (queryError) {
      console.error("Failed to load pending client requests:", queryError);
      setError("تعذر تحميل الطلبات. تأكد من تطبيق سياسات قاعدة البيانات وتسجيل الدخول بحساب المدير.");
    } else {
      setRequests((data ?? []) as ClientRequest[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const moderateRequest = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    setError("");
    setNotice("");
    const { data, error: updateError } = await supabase
      .from("client_requests")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error(`Failed to ${status} client request:`, updateError);
      setError("تعذرت معالجة الطلب. تحقق من صلاحية المدير ثم حاول مرة أخرى.");
    } else if (!data) {
      setError("لم يعد الطلب معلقًا؛ حدّث القائمة للتحقق من حالته.");
    } else {
      setRequests((current) => current.filter((request) => request.id !== id));
      setNotice(status === "approved" ? "تمت الموافقة على الطلب ونشره." : "تم رفض الطلب.");
    }
    setProcessingId(null);
  };

  return (
    <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6" dir="rtl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-black text-stone-900">طلبات العملاء المعلقة</h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-stone-600">يتواصل فريق لقطة مع صاحب الطلب، وتُعرض تفاصيل البحث للزوار دون بيانات التواصل.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> تحديث
        </button>
      </div>

      {error && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="mb-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5 shrink-0" />{notice}</div>}

      {loading ? (
        <div className="flex min-h-36 items-center justify-center gap-2 text-sm font-bold text-stone-500" role="status"><Loader2 className="h-5 w-5 animate-spin" />جارٍ تحميل الطلبات...</div>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" />
          <p className="mt-2 text-sm font-bold text-stone-800">لا توجد طلبات بانتظار المراجعة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const whatsappMessage = `مرحباً، معك فريق لقطة. نتابع معك طلب ${request.title} في ${request.area ? `${request.area}، ` : ""}${request.city}.`;
            const contactUrl = getWhatsAppUrl(whatsappMessage, request.phone);

            return (
              <article key={request.id} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white">مطلوب</span>
                      <h3 className="font-black text-stone-900">{request.title}</h3>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-600">
                      <MapPin className="h-4 w-4 text-brand-600" />{request.area ? `${request.area}، ` : ""}{request.city}
                      {request.bedrooms !== null && <span> · {request.bedrooms} غرف</span>}
                    </p>
                    <p className="mt-1 text-sm font-bold text-stone-800">الميزانية: {formatBudget(request.budget, request.currency)} · {request.phone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50">
                      متابعة مع العميل
                    </a>
                    <button type="button" onClick={() => void moderateRequest(request.id, "approved")} disabled={processingId === request.id} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
                      {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} موافقة
                    </button>
                    <button type="button" onClick={() => void moderateRequest(request.id, "rejected")} disabled={processingId === request.id} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60">
                      <X className="h-4 w-4" /> رفض
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
