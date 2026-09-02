import { useState } from "react";
import { X, Send, PhoneCall, ShieldCheck, CheckCircle2, MapPin, Calendar, Clock, AlertTriangle } from "lucide-react";
import { ServiceCategory } from "../../data/servicesData";
import { getWhatsAppUrl } from "../../lib/constants";

interface ServiceBookingModalProps {
  service: ServiceCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceBookingModal({ service, isOpen, onClose }: ServiceBookingModalProps) {
  const [selectedSubService, setSelectedSubService] = useState<string>("");
  const [city, setCity] = useState("حلب");
  const [area, setArea] = useState("");
  const [urgency, setUrgency] = useState("normal"); // 'normal' | 'quote'
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen || !service) return null;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const urgencyText = 
      urgency === 'quote' ? '📋 طلب معاينة وتسعير' : '🗓️ موعد محدد';

    const message = `🛠️ *طلب خدمة صيانة جديدة عبر منصة لقطة*
-----------------------------
📌 *نوع الخدمة:* ${service.name}
🔧 *الخدمة الفرعية:* ${selectedSubService || 'صيانة عامة'}
🚨 *درجة الأولوية:* ${urgencyText}
📍 *الموقع:* ${city} ${area ? `- ${area}` : ''}
${phone ? `📞 *رقم الهاتف للتواصل:* ${phone}` : ''}
${notes ? `📝 *تفاصيل العطل/الملاحظات:* ${notes}` : ''}
-----------------------------
أرجو تزويدي بأقرب موعد أو تكلفة المعاينة. شكراً لكم!`;

    window.open(getWhatsAppUrl(message), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${service.bg} ${service.color} border border-white/20 shadow-sm`}>
              <span className="font-bold text-lg">🛠️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">{service.name}</h3>
                {service.badge && (
                  <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">خدمات صيانة معتمدة مع ضمان 30 يوماً</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendWhatsApp} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700">ضمان معتمد</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200 px-1">
              <Clock className="w-4 h-4 text-brand-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700">استجابة سريعة</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700">فنيون محترفون</span>
            </div>
          </div>

          {/* Sub Services Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              اختر الخدمة المطلوبة بدقة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.popularServices.map((sub, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedSubService(sub)}
                  className={`text-right p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedSubService === sub
                      ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              درجة الاستعجال:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  urgency === 'normal'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold ring-1 ring-brand-400'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className={`w-4 h-4 mb-1 ${urgency === 'normal' ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold">موعد محدد</span>
                <span className="text-[9px] text-slate-500">حسب وقتك</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('quote')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  urgency === 'quote'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-400'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className={`w-4 h-4 mb-1 ${urgency === 'quote' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold">طلب تسعيرة</span>
                <span className="text-[9px] text-slate-500">معاينة مجانية</span>
              </button>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                المحافظة:
              </label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-brand-500"
              >
                {[
                  "حلب",
                  "ريف حلب",
                  "منبج",
                  "أعزاز",
                  "الباب",
                  "عفرين",
                  "جرابلس",
                  "السفيرة",
                  "الدانا",
                  "عين العرب"
                ].map((governorate) => (
                  <option key={governorate} value={governorate}>{governorate}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المنطقة / الحي:
              </label>
              <input 
                type="text"
                placeholder="مثال: المزة، أوتستراد..."
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم للتواصل (اختياري):
            </label>
            <input 
              type="tel"
              placeholder="09XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-brand-500"
            />
          </div>

          {/* Details / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تفاصيل المشكلة أو الطلب:
            </label>
            <textarea 
              rows={2}
              placeholder="اكتب تفاصيل إضافية لمساعدة الفني في تحضير الأدوات المناسبة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all text-sm"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الطلب وحجز موعد عبر واتساب</span>
            </button>

            <a
              href="tel:+971585193270"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>أو الاتصال المباشر بخدمة العملاء والدعم الفني</span>
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}
