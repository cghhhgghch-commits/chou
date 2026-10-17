import { useEffect, useState } from "react";
import { X, Send, PhoneCall, MapPin, Calendar, Clock, Wrench, Zap, Sun, Droplets, Wind, Paintbrush, Grid, Hammer, Sparkles, Truck, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ServiceCategory } from "../../data/servicesData";
import { getWhatsAppUrl, SYRIAN_GOVERNORATES } from "../../lib/constants";
import { serviceRequestSchema } from "../../lib/validation";
import Dialog from "../ui/Dialog";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Zap,
  Sun,
  Droplets,
  Wind,
  Paintbrush,
  Grid,
  Hammer,
  Wrench,
  Sparkles,
  Truck,
  Building2,
};

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
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSelectedSubService("");
    setCity("حلب");
    setArea("");
    setUrgency("normal");
    setNotes("");
    setPhone("");
    setRequestError("");
  }, [isOpen, service?.id]);

  if (!service) return null;

  const ServiceIcon = SERVICE_ICONS[service.iconName] || Wrench;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = serviceRequestSchema.safeParse({ phone, notes });
    if (!validation.success) {
      setRequestError(validation.error.issues[0]?.message || "تحقق من التفاصيل وحاول مجدداً.");
      return;
    }
    setRequestError("");

    const validatedPhone = validation.data.phone;
    const validatedNotes = validation.data.notes;

    const urgencyText = 
      urgency === 'quote' ? '📋 طلب معاينة وتسعير' : '🗓️ موعد محدد';

    const message = `🛠️ *طلب خدمة صيانة جديدة عبر منصة لقطة*
-----------------------------
📌 *نوع الخدمة:* ${service.name}
🔧 *الخدمة الفرعية:* ${selectedSubService || 'صيانة عامة'}
🚨 *درجة الأولوية:* ${urgencyText}
📍 *الموقع:* ${city} ${area ? `- ${area}` : ''}
${validatedPhone ? `📞 *رقم الهاتف للتواصل:* ${validatedPhone}` : ''}
${validatedNotes ? `📝 *تفاصيل العطل/الملاحظات:* ${validatedNotes}` : ''}
-----------------------------
أرجو تزويدي بأقرب موعد أو تكلفة المعاينة. شكراً لكم!`;

    window.open(getWhatsAppUrl(message), '_blank');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
      title={service.name}
      description="اختر تفاصيل طلب الخدمة ثم أرسله عبر واتساب."
      contentClassName="flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-lg border border-stone-200 bg-white shadow-lg sm:max-h-[92dvh] sm:rounded-lg"
    >
        
        {/* Modal Header */}
        <div className="relative flex items-center justify-between border-b border-stone-200 bg-white p-4 text-stone-900 sm:p-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${service.bg} ${service.color}`}>
              <ServiceIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">{service.name}</h3>
              </div>
              <p className="text-xs text-stone-600">اختر تفاصيل الطلب قبل إرساله عبر واتساب</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            aria-label="إغلاق نافذة طلب الخدمة"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendWhatsApp} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          
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
                  className={`min-h-11 text-right p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSubService === sub
                      ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-bold shadow-xs'
                      : 'border-stone-300 hover:border-stone-400 text-stone-700 bg-white'
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
                  className={`flex min-h-20 flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-colors ${
                  urgency === 'normal'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold ring-1 ring-brand-400'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Calendar className={`w-4 h-4 mb-1 ${urgency === 'normal' ? 'text-brand-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold">موعد محدد</span>
                <span className="text-[9px] text-slate-500">حسب وقتك</span>
              </button>

              <button
                type="button"
                onClick={() => setUrgency('quote')}
                  className={`flex min-h-20 flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-colors ${
                  urgency === 'quote'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-400'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Clock className={`w-4 h-4 mb-1 ${urgency === 'quote' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold">طلب تسعيرة</span>
                <span className="text-[9px] text-slate-500">التكلفة بعد مراجعة التفاصيل</span>
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
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-brand-500"
              >
                {SYRIAN_GOVERNORATES.map((governorate) => (
                  <option key={governorate.id} value={governorate.name}>{governorate.name}</option>
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
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-brand-500"
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
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-brand-500"
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
              className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm font-medium text-stone-900 outline-none focus:border-brand-500"
            />
          </div>

          {requestError && <p role="alert" className="text-sm font-medium text-brand-700">{requestError}</p>}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الطلب وحجز موعد عبر واتساب</span>
            </button>

            <a
              href="tel:+963934888055"
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>أو الاتصال المباشر بخدمة العملاء والدعم الفني</span>
            </a>
          </div>

        </form>
    </Dialog>
  );
}
