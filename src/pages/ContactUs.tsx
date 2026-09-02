import { useState } from "react";
import { Link } from "react-router";
import { 
  ArrowRight, Phone, Mail, MessageSquare, MapPin, 
  Send, CheckCircle2, Clock, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";
import { APP_CONFIG, getWhatsAppUrl } from "../lib/constants";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Send directly to WhatsApp
    const subjectLabel = subject === "ad" ? "طلب نشر/تعديل إعلان عقاري" : subject === "service" ? "طلب خدمة صيانة" : "استفسار عام أو اقتراح";
    const waText = `🇸🇾 *رسالة تواصل جديدة عبر موقع لقطة*\n👤 *الاسم:* ${name}\n📞 *الهاتف:* ${phone || "غير محدد"}\n📌 *الموضوع:* ${subjectLabel}\n💬 *الرسالة:*\n${message}`;
    
    window.open(getWhatsAppUrl(waText), "_blank");
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
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-800">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 max-w-4xl h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-700 hover:text-brand-600 font-bold text-sm">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-bold text-slate-400">مركز المساعدة والتواصل</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            تواصل معنا ومركز الدعم الفني
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            فريق خدمة العملاء متواجد على مدار الساعة للرد على استفساراتكم ومساعدتكم في نشر الإعلانات وطلب خدمات الصيانة.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={getWhatsAppUrl("مرحباً، أود الاستفسار عن منصة لقطة")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-3xl shadow-sm transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base">مراسلة واتساب فورية</h3>
              <p className="text-xs text-emerald-100">استجابة سريعة وتواصل مباشر مع فريق الإدارة.</p>
            </div>
            <span className="text-xs font-extrabold mt-4 flex items-center gap-1">
              <span>تحدث معنا الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </a>

          <a
            href={`tel:${APP_CONFIG.adminPhone}`}
            className="bg-white hover:bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">اتصال هاتفي مباشر</h3>
              <p className="text-xs text-slate-500" dir="ltr">{APP_CONFIG.adminPhone}</p>
            </div>
            <span className="text-xs font-bold text-brand-600 mt-4 flex items-center gap-1">
              <span>اتصل الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </a>

          <a
            href={`mailto:${APP_CONFIG.supportEmail}`}
            className="bg-white hover:bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">البريد الإلكتروني</h3>
              <p className="text-xs text-slate-500" dir="ltr">{APP_CONFIG.supportEmail}</p>
            </div>
            <span className="text-xs font-bold text-brand-600 mt-4 flex items-center gap-1">
              <span>أرسل إيميل</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </a>
        </div>

        {/* Message Form & FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Form */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-black text-slate-900 text-base">أرسل لنا استفساراً أو اقتراحاً</h2>
            
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm">تم إرسال رسالتك بنجاح!</h3>
                <p className="text-xs">سيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-bold text-emerald-700 underline"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد العلي"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف / واتساب</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+963 9xx xxx xxx"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الموضوع</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:border-brand-500 focus:bg-white"
                  >
                    <option value="general">استفسار عام</option>
                    <option value="ad">طلب نشر أو تعديل إعلان عقاري</option>
                    <option value="service">طلب صيانة أو تشطيب</option>
                    <option value="complaint">شكوى أو ملاحظة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الرسالة *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب استفسارك بالتفصيل..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة عبر واتساب</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              <h2>الأسئلة الشائعة</h2>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-right font-bold text-xs text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
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
