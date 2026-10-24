import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, MapPin, Search, X } from "lucide-react";
import { SYRIAN_CATEGORIES, SYRIAN_GOVERNORATES, getWhatsAppUrl } from "../../lib/constants";
import { supabase } from "../../lib/supabase";

interface ClientRequestFormProps {
  onClose: () => void;
}

const normalizeSyrianPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("00963")) return digits.slice(2);
  if (digits.startsWith("963")) return digits;
  if (digits.startsWith("0")) return `963${digits.slice(1)}`;
  if (digits.startsWith("9")) return `963${digits}`;
  return "";
};

const formatPhoneForMessage = (phone: string) => `+${phone}`;

export default function ClientRequestForm({ onClose }: ClientRequestFormProps) {
  const [title, setTitle] = useState("شقة");
  const [city, setCity] = useState("دمشق");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState<"SYP" | "USD">("SYP");
  const [phone, setPhone] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedPhone = normalizeSyrianPhone(phone);
    const numericBudget = Number(budget);
    const numericBedrooms = bedrooms ? Number(bedrooms) : null;

    if (!/^9639\d{8}$/.test(normalizedPhone)) {
      setError("أدخل رقم موبايل سوري صحيحًا، مثل 09xxxxxxxx أو +9639xxxxxxxx.");
      return;
    }
    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError("أدخل ميزانية صحيحة أكبر من صفر.");
      return;
    }
    if (numericBedrooms !== null && (!Number.isInteger(numericBedrooms) || numericBedrooms < 0 || numericBedrooms > 30)) {
      setError("أدخل عدد غرف صحيحًا.");
      return;
    }
    if (!contactConsent) {
      setError("يرجى تأكيد موافقتك على تواصل فريق لقطة معك بشأن الطلب.");
      return;
    }

    const requestMessage = [
      "طلب عقار جديد من لقطة",
      `نوع العقار: ${title}`,
      `المحافظة: ${city}`,
      `المنطقة: ${area.trim() || "غير محددة"}`,
      `عدد الغرف: ${numericBedrooms ?? "غير محدد"}`,
      `الميزانية: ${numericBudget.toLocaleString("en-US")} ${currency === "SYP" ? "ل.س" : "دولار أمريكي"}`,
      `رقم العميل: ${formatPhoneForMessage(normalizedPhone)}`,
    ].join("\n");
    const targetWhatsAppUrl = getWhatsAppUrl(requestMessage);

    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    setSubmitting(true);

    try {
      const { error: insertError } = await supabase.from("client_requests").insert({
        title,
        city,
        area: area.trim(),
        bedrooms: numericBedrooms,
        budget: numericBudget,
        currency,
        phone: normalizedPhone,
        status: "pending",
      });

      if (insertError) throw insertError;

      setWhatsappUrl(targetWhatsAppUrl);
      setSent(true);
      if (whatsappWindow) {
        whatsappWindow.location.href = targetWhatsAppUrl;
      }
    } catch (submitError) {
      whatsappWindow?.close();
      console.error("Failed to submit client request:", submitError);
      const errorCode = typeof submitError === "object" && submitError !== null && "code" in submitError
        ? submitError.code
        : null;
      setError(errorCode === "PGRST205" || errorCode === "42P01"
        ? "خدمة استقبال الطلبات غير متاحة حاليًا. حاول إرسال طلبك لاحقًا."
        : "تعذر حفظ الطلب الآن. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <section className="flex min-h-dvh flex-col items-center justify-center bg-white px-5 py-8 text-center sm:min-h-0 sm:rounded-xl sm:border sm:border-emerald-200 sm:p-8 sm:shadow-xl" dir="rtl" aria-live="polite">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-black text-stone-900">تم إرسال طلبك</h2>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          وصل طلبك إلى فريق لقطة للمراجعة. سيتواصل معك فريقنا لمتابعته، ولن يظهر رقمك للزوار.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            فتح واتساب
          </a>
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-stone-300 px-5 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50">
            تم
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-dvh bg-white px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:min-h-0 sm:rounded-xl sm:border sm:border-stone-200 sm:p-7 sm:shadow-xl" dir="rtl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Search className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-stone-900">أعلن عن العقار الذي تبحث عنه</h2>
            <p className="mt-1 text-sm leading-6 text-stone-500">يتابع فريق لقطة طلبك معك مباشرة. لا نتبادل بيانات التواصل مع عملاء آخرين.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100" aria-label="إغلاق النموذج">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={submitRequest} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            نوع العقار
            <select value={title} onChange={(event) => setTitle(event.target.value)} required className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
              {SYRIAN_CATEGORIES.map((category) => <option key={category.id} value={category.label}>{category.label}</option>)}
            </select>
          </label>

          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            المحافظة
            <select value={city} onChange={(event) => setCity(event.target.value)} required className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
              {SYRIAN_GOVERNORATES.map((governorate) => <option key={governorate.id} value={governorate.name}>{governorate.name}</option>)}
            </select>
          </label>

          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-600" />المنطقة أو الحي</span>
            <input value={area} onChange={(event) => setArea(event.target.value)} maxLength={100} placeholder="مثال: المزة، حلب الجديدة" className="min-h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          </label>

          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            عدد الغرف <span className="font-normal text-stone-500">(اختياري)</span>
            <input type="number" min="0" max="30" step="1" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} placeholder="غير محدد" className="min-h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          </label>

          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            الميزانية
            <input type="number" min="1" step="any" value={budget} onChange={(event) => setBudget(event.target.value)} required placeholder="أدخل المبلغ" className="min-h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          </label>

          <label className="space-y-1.5 text-sm font-bold text-stone-800">
            العملة
            <select value={currency} onChange={(event) => setCurrency(event.target.value as "SYP" | "USD")} className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
              <option value="SYP">ليرة سورية</option>
              <option value="USD">دولار أمريكي</option>
            </select>
          </label>
        </div>

        <label className="block space-y-1.5 text-sm font-bold text-stone-800">
          رقم الموبايل السوري للتواصل
          <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required maxLength={20} placeholder="09xxxxxxxx أو +9639xxxxxxxx" className="min-h-12 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </label>

        <label className="flex items-start gap-2.5 rounded-xl bg-stone-50 p-3 text-xs leading-6 text-stone-600">
          <input type="checkbox" checked={contactConsent} onChange={(event) => setContactConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-brand-600" />
          <span>أوافق على استخدام بياناتي ليتواصل معي فريق لقطة بشأن الطلب. لا يظهر رقم هاتفي للزوار.</span>
        </label>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />جارٍ حفظ الطلب...</> : "إرسال الطلب عبر واتساب"}
        </button>
      </form>
    </section>
  );
}
