import { useEffect, useRef, useState } from "react";
import { BadgeCheck, BedDouble, Building2, Loader2, MapPin, Search, Wallet } from "lucide-react";
import ClientRequestForm from "../components/requests/ClientRequestForm";
import { getWhatsAppUrl } from "../lib/constants";
import { supabase } from "../lib/supabase";

interface ClientRequest {
  id: string;
  title: string;
  city: string;
  area: string | null;
  bedrooms: number | null;
  budget: number;
  currency: "SYP" | "USD";
  created_at: string;
}

const formatBudget = (budget: number, currency: ClientRequest["currency"]) =>
  `${new Intl.NumberFormat("ar-SY").format(budget)} ${currency === "SYP" ? "ل.س" : "$"}`;

export default function ClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const formDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = formDialogRef.current;
    if (!dialog) return;

    if (showForm && !dialog.open) dialog.showModal();
    if (!showForm && dialog.open) dialog.close();
  }, [showForm]);

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      setLoading(true);
      setError("");
      const { data, error: queryError } = await supabase
        .from("approved_client_requests")
        .select("id,title,city,area,bedrooms,budget,currency,created_at")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (queryError) {
        console.error("Failed to load approved client requests:", queryError);
        setError(queryError.code === "PGRST205" || queryError.code === "42P01"
          ? "خدمة طلبات العملاء غير متاحة حاليًا. نعمل على تفعيلها قريبًا."
          : "تعذر تحميل الطلبات الآن. حاول تحديث الصفحة.");
      } else {
        setRequests((data ?? []) as ClientRequest[]);
      }
      setLoading(false);
    };

    void loadRequests();
    return () => { active = false; };
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 pb-24 text-stone-900 md:pb-12">
      <section className="border-b border-amber-200 bg-gradient-to-bl from-amber-50 via-orange-50 to-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-stone-700">
              <Search className="h-4 w-4 text-brand-600" /> خدمة البحث عن عقار
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">نبحث عن العقار المناسب لك</h1>
            <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
              أرسل احتياجك إلى فريق لقطة، وسيتابع معك مختصونا لإيجاد الخيار المناسب. جميع المتابعة تتم عبر الشركة.
            </p>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-900/10 transition hover:-translate-y-0.5 hover:bg-brand-700">
            <Search className="h-4 w-4" />
            أرسل مواصفات طلبك
          </button>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:py-10">
        {showForm && (
          <dialog
            ref={formDialogRef}
            onClose={() => setShowForm(false)}
            aria-label="نموذج طلب عقار"
            className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-white p-0 backdrop:bg-stone-950/50 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[min(100%-2rem,44rem)] sm:overflow-y-auto sm:rounded-xl sm:bg-transparent"
          >
            <ClientRequestForm onClose={() => setShowForm(false)} />
          </dialog>
        )}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-bold text-stone-600" role="status">
            <Loader2 className="h-5 w-5 animate-spin text-brand-600" /> جارٍ تحميل الطلبات المعتمدة...
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">{error}</div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-amber-300 bg-white px-5 py-12 text-center">
            <Search className="mx-auto h-10 w-10 text-amber-600" />
            <h2 className="mt-4 text-lg font-black">لا توجد طلبات منشورة حاليًا</h2>
            <p className="mt-2 text-sm text-stone-500">أرسل طلبك إلى فريق لقطة، وسيتواصل معك لمساعدتك.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((request) => {
              const contactMessage = `مرحباً فريق لقطة، لدي عقار قد يناسب أحد الطلبات المنشورة لديكم: ${request.title} في ${request.area ? `${request.area}، ` : ""}${request.city}. أرجو المتابعة معي.`;
              const contactUrl = getWhatsAppUrl(contactMessage);

              return (
                <article key={request.id} className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3 border-b border-amber-100 px-5 py-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
                        <Search className="h-3.5 w-3.5" /> طلب عميل
                      </span>
                      <h2 className="mt-3 text-xl font-black text-stone-900">{request.title}</h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="space-y-3 px-5 py-4 text-sm">
                    <p className="flex items-center gap-2 text-stone-700">
                      <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
                      {request.area ? `${request.area}، ` : ""}{request.city}
                    </p>
                    {request.bedrooms !== null && (
                      <p className="flex items-center gap-2 text-stone-700">
                        <BedDouble className="h-4 w-4 shrink-0 text-brand-600" />
                        {request.bedrooms} غرف
                      </p>
                    )}
                    <p className="flex items-center gap-2 font-black text-stone-900">
                      <Wallet className="h-4 w-4 shrink-0 text-amber-700" />
                      الميزانية: {formatBudget(request.budget, request.currency)}
                    </p>
                  </div>

                  <div className="px-5 pb-5">
                    <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 transition hover:border-brand-500 hover:text-brand-700">
                      <BadgeCheck className="h-4 w-4" />
                      لدي عقار يناسب هذا الطلب
                    </a>
                    <p className="mt-2 text-center text-xs leading-5 text-stone-500">يتولى فريق لقطة التنسيق والتواصل مع العميل.</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
