import { Link } from "react-router";
import { 
  ArrowRight, Building2, Home, ShieldCheck, Zap, Sparkles, 
  MapPin, Users, HeartHandshake, CheckCircle2, Phone, MessageSquare
} from "lucide-react";
import { SYRIAN_CATEGORY_ICONS } from "../lib/constants";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-800 md:pb-12">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex min-h-11 items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-700">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-medium text-stone-500">عن منصة لقطة</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="space-y-4 rounded-xl bg-stone-900 p-6 text-white sm:p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>المنصة العقارية الأكثر شمولية وموثوقية</span>
          </div>
          <h1 className="text-2xl font-bold leading-10 md:text-4xl">
            نُعيد ابتكار تجربة البحث العقاري
          </h1>
          <p className="max-w-2xl text-sm leading-8 text-stone-200 md:text-base">
            تأسست منصة <span className="font-bold text-white">لقطة (LAQTA)</span> لتكون الوجهة الرقمية الأولى لكل من يبحث عن شراء، بيع، أو استئجار عقار (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع) بكل سهولة وأمان.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">دقة وموثوقية الإعلانات</h3>
            <p className="text-sm leading-7 text-stone-600">
              تدقيق تفاصيل العقارات وسندات الملكية (طابو أخضر، حكم محكمة، كاتب عدل) لمنع أي تضليل وضمان حقوق جميع الأطراف.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">تغطية لكافة المحافظات</h3>
            <p className="text-sm leading-7 text-stone-600">
              نربط بين أصحاب العقارات والمهتمين مباشرة عبر منصة موثوقة ومصممة لتسهيل البحث والشراء والإيجار بكل وضوح.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">تواصل فوري عبر واتساب</h3>
            <p className="text-sm leading-7 text-stone-600">
              ربط مباشر بين المشترين والمعلنين بنقرة واحدة عبر واتساب والاتصال الهاتفي لتقليل الوسطاء غير المعتمدين وتسريع الصفقات.
            </p>
          </div>
        </div>

        {/* 8 Core Categories Overview */}
        <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
          <h2 className="text-lg font-bold text-stone-900 md:text-xl">
            الأقسام العقارية الثمانية في لقطة
          </h2>
          <p className="text-sm leading-7 text-stone-600">
            صممنا المنصة لتغطي كافة الاحتياجات السكنية، التجارية، الاستثمارية، والصناعية:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { icon: SYRIAN_CATEGORY_ICONS.houses, label: "بيوت وشقق", desc: "شقق سكنية، بيوت عربية، دوبلكس" },
              { icon: SYRIAN_CATEGORY_ICONS.buildings, label: "بنايات وأبراج", desc: "عمارات سكنية وتجارية واستثمارية" },
              { icon: SYRIAN_CATEGORY_ICONS.farms, label: "مزارع واستراحات", desc: "بساتين، مسابح واستراحات ريفية" },
              { icon: SYRIAN_CATEGORY_ICONS.lands, label: "أراضي ومقاسم", desc: "مقاسم عمار وتنظيم وأراضي زراعية" },
              { icon: SYRIAN_CATEGORY_ICONS.shops, label: "محلات وتجاري", desc: "محلات، صالات عرض، حقوق فروغ" },
              { icon: SYRIAN_CATEGORY_ICONS.villas, label: "فلل وقصور", desc: "فلل مودرن ومستقلة وقصور فخمة" },
              { icon: SYRIAN_CATEGORY_ICONS.factories, label: "مصانع ومستودعات", desc: "منشآت صناعية، هناغر ومستودعات" },
              { icon: SYRIAN_CATEGORY_ICONS.other, label: "أخرى ومتنوعة", desc: "شاليهات مصايف، مكاتب وسكن شباب" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
                <div className="flex items-center gap-2 text-brand-600">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="block text-sm font-bold text-stone-900">{item.label}</span>
                </div>
                <span className="block text-sm leading-6 text-stone-600">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="flex flex-col items-center justify-between gap-5 rounded-xl bg-stone-900 p-5 text-white md:flex-row md:p-7">
          <div className="space-y-1 text-center md:text-right">
            <h3 className="text-lg font-bold">هل ترغب بنشر إعلانك أو طلب خدمة خاصة؟</h3>
            <p className="text-sm leading-7 text-stone-200">فريق إدارة لقطة يسعده استقبال استفساراتكم ومساعدتكم على مدار الساعة.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/place-ad"
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 md:flex-none"
            >
              <span>أضف إعلانك الآن</span>
            </Link>
            <a
              href="https://wa.me/963934888055"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 md:flex-none"
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
