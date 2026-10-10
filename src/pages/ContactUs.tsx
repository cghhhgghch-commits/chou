import { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowRight, Phone, Mail, MessageSquare, MapPin, 
  Send, CheckCircle2, Clock, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { APP_CONFIG, getWhatsAppUrl } from "../lib/constants";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openExternalLink = async (url: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url });
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to open external link:", error);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Send directly to WhatsApp
    const subjectLabel = subject === "ad" ? "طلب نشر/تعديل إعلان عقاري" : subject === "service" ? "طلب خدمة صيانة" : "استفسار عام أو اقتراح";
    const waText = `🇸🇾 *رسالة تواصل جديدة عبر موقع لقطة*\n👤 *الاسم:* ${name}\n📞 *الهاتف:* ${phone || "غير محدد"}\n📌 *الموضوع:* ${subjectLabel}\n💬 *الرسالة:*\n${message}`;
    
    void openExternalLink(getWhatsAppUrl(waText));
    setSent(true);
  };

  const faqs = [
    {
      q: "كيف يمكنني نشر إعلان عقاري على تطبيق لقطة؟",
      a: "يمكنك الضغط على زر 'أضف إعلان' في الشريط العلوي أو السفلي، وتعبئة تفاصيل العقار (السعر، المساحة، نوع الطابو، الصور) ثم الضغط على نشر وسيتم رفعه ومشاركته مباشرة عبر واتساب الإدارة للاعتماد الفوري."
    },
    {
      q: "هل نشر الإعلانات على لقطة مجاني؟",
      a: "نعم، نشر الإعلانات الأساسية مجاني تماماً لجميع المالكين والوسطاء العقاريين في كافة المحافظات السورية."
    },
    {
      q: "كيف أتأكد من صحة وسندات ملكية العقار المعروض؟",
      a: "يوفر لقطة تصنيفاً واضحاً لسند الملكية (طابو أخضر 2400 سهم، حكم محكمة مبرم، وكالة كاتب عدل، طابو زراعي). ننصح دائماً بمعاينة العقار ومطابقة السندات في السجل العقاري الرسمي قبل دفع أي مبالغ."
    },
    {
      q: "كيف أطلب خدمة صيانة أو تشطيب لمنزلي؟",
      a: "توجه إلى قسم 'خدمات الصيانة' واختر نوع الخدمة (كهرباء، طاقة شمسية، تكييف، دهان، بلاط، حدادة، نجارة، نقل عفش...)، وحدد موعدك وسيتواصل معك الفني المعتمد فوراً."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-800 md:pb-12">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex min-h-11 items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-700">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-medium text-stone-500">مركز المساعدة والتواصل</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
          <h1 className="text-2xl font-bold leading-10 text-stone-900 md:text-3xl">
            تواصل معنا ومركز الدعم الفني
          </h1>
          <p className="text-sm leading-8 text-stone-700">
            فريق خدمة العملاء متواجد على مدار الساعة للرد على استفساراتكم ومساعدتكم في نشر الإعلانات وطلب خدمات الصيانة.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => void openExternalLink(getWhatsAppUrl("مرحباً، أود الاستفسار عن منصة لقطة"))}
            className="flex min-h-48 flex-col justify-between rounded-xl bg-green-800 p-5 text-right text-white transition-colors hover:bg-green-900"
          >
            <div className="space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-black text-base">مراسلة واتساب فورية</h3>
              <p className="text-sm leading-7 text-green-100">استجابة سريعة وتواصل مباشر مع فريق الإدارة.</p>
            </div>
            <span className="mt-4 flex min-h-11 items-center gap-1 text-sm font-bold">
              <span>تحدث معنا الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => void openExternalLink(`tel:${APP_CONFIG.adminPhone}`)}
            className="flex min-h-48 flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 text-right transition-colors hover:bg-stone-50"
          >
            <div className="space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">اتصال هاتفي مباشر</h3>
              <p className="text-sm text-stone-600" dir="ltr">{APP_CONFIG.adminPhone}</p>
            </div>
            <span className="mt-4 flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700">
              <span>اتصل الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => void openExternalLink(`mailto:${APP_CONFIG.supportEmail}`)}
            className="flex min-h-48 flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 text-right transition-colors hover:bg-stone-50"
          >
            <div className="space-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">البريد الإلكتروني</h3>
              <p className="text-sm text-stone-600" dir="ltr">{APP_CONFIG.supportEmail}</p>
            </div>
            <span className="mt-4 flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700">
              <span>أرسل إيميل</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </button>
        </div>

        {/* Message Form & FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Form */}
          <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <h2 className="text-base font-bold text-stone-900">أرسل لنا استفساراً أو اقتراحاً</h2>
            
            {sent ? (
              <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-5 text-center text-green-900">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-700" />
                <h3 className="text-base font-bold">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-sm">سيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
                <button
                  onClick={() => setSent(false)}
                  className="min-h-11 mt-2 text-sm font-bold text-green-800 underline"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-800">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد العلي"
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm font-medium text-stone-900 outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-800">رقم الهاتف / واتساب</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+963 9xx xxx xxx"
                    dir="ltr"
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm font-medium text-stone-900 outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-800">الموضوع</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm font-medium text-stone-900 outline-none focus:border-brand-500 focus:bg-white"
                  >
                    <option value="general">استفسار عام</option>
                    <option value="ad">طلب نشر أو تعديل إعلان عقاري</option>
                    <option value="service">طلب صيانة أو تشطيب</option>
                    <option value="complaint">شكوى أو ملاحظة</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-stone-800">تفاصيل الرسالة *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب استفسارك بالتفصيل..."
                    className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm font-medium text-stone-900 outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة عبر واتساب</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-2 text-base font-bold text-stone-900">
              <HelpCircle className="h-5 w-5 text-brand-700" />
              <h2>الأسئلة الشائعة</h2>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="overflow-hidden rounded-lg border border-stone-200">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex min-h-12 w-full items-center justify-between gap-2 p-3.5 text-right text-sm font-bold text-stone-900 transition-colors hover:bg-stone-50"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
