import { Link } from "react-router";
import { 
  ArrowRight, Building2, Home, ShieldCheck, Zap, Sparkles, 
  MapPin, Users, HeartHandshake, CheckCircle2, Phone, MessageSquare
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-800">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 max-w-4xl h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-700 hover:text-brand-600 font-bold text-sm">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-bold text-slate-400">عن منصة لقطة</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white p-8 md:p-12 shadow-lg space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-300 border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>المنصة العقارية الأكثر شمولية وموثوقية</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            نُعيد ابتكار تجربة البحث العقاري
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            تأسست منصة <span className="font-bold text-white">لقطة (LAQTA)</span> لتكون الوجهة الرقمية الأولى لكل من يبحث عن شراء، بيع، أو استئجار عقار (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع) بكل سهولة وأمان.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">دقة وموثوقية الإعلانات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تدقيق تفاصيل العقارات وسندات الملكية (طابو أخضر، حكم محكمة، كاتب عدل) لمنع أي تضليل وضمان حقوق جميع الأطراف.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">تغطية لكافة المحافظات</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              نربط بين أصحاب العقارات والمهتمين مباشرة عبر منصة موثوقة ومصممة لتسهيل البحث والشراء والإيجار بكل وضوح.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">تواصل فوري عبر واتساب</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ربط مباشر بين المشترين والمعلنين بنقرة واحدة عبر واتساب والاتصال الهاتفي لتقليل الوسطاء غير المعتمدين وتسريع الصفقات.
            </p>
          </div>
        </div>

        {/* 8 Core Categories Overview */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            الأقسام العقارية الثمانية في لقطة
          </h2>
          <p className="text-xs text-slate-500">
            صممنا المنصة لتغطي كافة الاحتياجات السكنية، التجارية، الاستثمارية، والصناعية:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: "🏠 بيوت وشقق", desc: "شقق سكنية، بيوت عربية، دوبلكس" },
              { label: "🏢 بنايات وأبراج", desc: "عمارات سكنية وتجارية واستثمارية" },
              { label: "🌾 مزارع واستراحات", desc: "بساتين، مسابح واستراحات ريفية" },
              { label: "🗺️ أراضي ومقاسم", desc: "مقاسم عمار وتنظيم وأراضي زراعية" },
              { label: "🏬 محلات وتجاري", desc: "محلات، صالات عرض، حقوق فروغ" },
              { label: "🏰 فلل وقصور", desc: "فلل مودرن ومستقلة وقصور فخمة" },
              { label: "🏭 مصانع ومستودعات", desc: "منشآت صناعية، هناغر ومستودعات" },
              { label: "✨ أخرى ومتنوعة", desc: "شاليهات مصايف، مكاتب وسكن شباب" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <span className="font-black text-xs text-slate-900 block">{item.label}</span>
                <span className="text-[11px] text-slate-500 leading-tight block">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-right">
            <h3 className="text-lg font-bold">هل ترغب بنشر إعلانك أو طلب خدمة خاصة؟</h3>
            <p className="text-xs text-slate-300">فريق إدارة لقطة يسعده استقبال استفساراتكم ومساعدتكم على مدار الساعة.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/place-ad"
              className="flex-1 md:flex-none bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>أضف إعلانك الآن</span>
            </Link>
            <a
              href="https://wa.me/971585193270"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واتساب الإدارة</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
