import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Clock3, Loader2, MapPin, RefreshCw, Trash2, X } from "lucide-react";
import { getWhatsAppUrl } from "../../lib/constants";
import { supabase } from "../../lib/supabase";
import Dialog from "../ui/Dialog";

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
  status: "pending" | "approved" | "rejected";
}

type RequestFilter = "all" | ClientRequest["status"];

const formatBudget = (budget: number, currency: ClientRequest["currency"]) =>
  `${new Intl.NumberFormat("ar-SY").format(budget)} ${currency === "SYP" ? "ل.س" : "$"}`;

export default function AdminClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<RequestFilter>("pending");
  const [requestToDelete, setRequestToDelete] = useState<ClientRequest | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("client_requests")
      .select("id,title,city,area,bedrooms,budget,currency,phone,created_at,status")
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Failed to load client requests:", queryError);
      setError("تعذر تحميل الطلبات. تأكد من تطبيق سياسات قاعدة البيانات وتسجيل الدخول بحساب المدير.");
    } else {
      setRequests((data ?? []) as ClientRequest[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const visibleRequests = filter === "all"
    ? requests
    : requests.filter((request) => request.status === filter);

  const moderateRequest = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    setError("");
    setNotice("");
    const { data, error: updateError } = await supabase
      .from("client_requests")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id,status")
      .maybeSingle();

    if (updateError) {
      console.error(`Failed to ${status} client request:`, updateError);
      setError("تعذرت معالجة الطلب. تحقق من صلاحية المدير ثم حاول مرة أخرى.");
    } else if (!data) {
      setError("لم يعد الطلب معلقًا؛ حدّث القائمة للتحقق من حالته.");
    } else {
      setRequests((current) => current.map((request) => request.id === id
        ? { ...request, status: data.status as ClientRequest["status"] }
        : request));
      setNotice(status === "approved" ? "تمت الموافقة على الطلب ونشره." : "تم رفض الطلب.");
    }
    setProcessingId(null);
  };

  const deleteRequest = async () => {
    if (!requestToDelete) return;

    const requestId = requestToDelete.id;
    setProcessingId(requestId);
    setError("");
    setNotice("");
    const { data, error: deleteError } = await supabase
      .from("client_requests")
      .delete()
      .eq("id", requestId)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error("Failed to delete client request:", deleteError);
      setError("تعذر حذف الطلب. تحقق من صلاحية المدير ثم حاول مرة أخرى.");
    } else if (!data) {
      setError("لم يعد الطلب موجودًا؛ حدّث القائمة للتحقق.");
    } else {
      setRequests((current) => current.filter((request) => request.id !== requestId));
      setNotice("تم حذف طلب العميل.");
      setRequestToDelete(null);
    }
    setProcessingId(null);
  };

  const filterOptions: { id: RequestFilter; label: string }[] = [
    { id: "pending", label: "معلقة" },
    { id: "approved", label: "منشورة" },
    { id: "rejected", label: "مرفوضة" },
    { id: "all", label: "الكل" },
  ];

  return (
    <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6" dir="rtl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-black text-stone-900">إدارة طلبات العملاء</h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-stone-600">راجع الطلبات وتابعها مع العميل أو احذفها من السجل.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> تحديث
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="تصفية طلبات العملاء">
        {filterOptions.map((option) => {
          const count = option.id === "all"
            ? requests.length
            : requests.filter((request) => request.status === option.id).length;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              aria-pressed={filter === option.id}
              className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors ${
                filter === option.id
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
              }`}
            >
              {option.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === option.id ? "bg-white/15 text-white" : "bg-stone-100 text-stone-600"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {error && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="mb-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-5 w-5 shrink-0" />{notice}</div>}

      {loading ? (
        <div className="flex min-h-36 items-center justify-center gap-2 text-sm font-bold text-stone-500" role="status"><Loader2 className="h-5 w-5 animate-spin" />جارٍ تحميل الطلبات...</div>
      ) : visibleRequests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-700" />
          <p className="mt-2 text-sm font-bold text-stone-800">
            {filter === "pending" ? "لا توجد طلبات بانتظار المراجعة" : "لا توجد طلبات في هذا التصنيف"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleRequests.map((request) => {
            const whatsappMessage = `مرحباً، معك فريق لقطة. نتابع معك طلب ${request.title} في ${request.area ? `${request.area}، ` : ""}${request.city}.`;
            const contactUrl = getWhatsAppUrl(whatsappMessage, request.phone);
            const isProcessing = processingId === request.id;
            const statusLabel = request.status === "pending"
              ? "قيد المراجعة"
              : request.status === "approved" ? "منشور" : "مرفوض";

            return (
              <article key={request.id} className={`rounded-2xl border p-4 ${
                request.status === "pending"
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-stone-200 bg-stone-50/70"
              }`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-white">مطلوب</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        request.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : request.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"
                      }`}>{statusLabel}</span>
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
                    {request.status === "pending" && (
                      <>
                        <button type="button" onClick={() => void moderateRequest(request.id, "approved")} disabled={isProcessing} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
                          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} موافقة
                        </button>
                        <button type="button" onClick={() => void moderateRequest(request.id, "rejected")} disabled={isProcessing} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-700 hover:border-stone-400 hover:bg-stone-50 disabled:opacity-60">
                          <X className="h-4 w-4" /> رفض
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setRequestToDelete(request)}
                      disabled={isProcessing}
                      aria-label={`حذف طلب ${request.title}`}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-700 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={requestToDelete !== null}
        onOpenChange={(open) => { if (!open && processingId === null) setRequestToDelete(null); }}
        title="تأكيد حذف طلب العميل"
        description="سيتم حذف الطلب نهائيًا من سجل طلبات العملاء."
        contentClassName="w-full max-w-md rounded-t-2xl border border-stone-200 bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
            <Trash2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-black text-stone-900">حذف طلب العميل؟</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              {requestToDelete
                ? `سيُحذف طلب «${requestToDelete.title}» نهائيًا. لا يمكن التراجع عن هذا الإجراء.`
                : "سيُحذف الطلب نهائيًا. لا يمكن التراجع عن هذا الإجراء."}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setRequestToDelete(null)}
            disabled={processingId !== null}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 px-4 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-60"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => void deleteRequest()}
            disabled={processingId !== null}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 text-sm font-bold text-white hover:bg-rose-800 disabled:opacity-60"
          >
            {processingId !== null ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            تأكيد الحذف
          </button>
        </div>
      </Dialog>
    </section>
  );
}
