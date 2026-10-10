import { useState, useMemo } from "react";
import { Link } from "react-router";
import { 
  Zap, Sun, Droplets, Wind, Paintbrush, Grid, Hammer, Wrench, 
  ShieldCheck, Sparkles, Truck, Building2, Home, Search, ArrowRight, 
  PhoneCall, Clock, CheckCircle2, Star, BadgeCheck, MessageSquare
} from "lucide-react";
import { maintenanceServices, ServiceCategory } from "../data/servicesData";
import ServiceBookingModal from "../components/services/ServiceBookingModal";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceCategory | null>(null);

  // Icon mapper helper
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return Zap;
      case "Sun": return Sun;
      case "Droplets": return Droplets;
      case "Wind": return Wind;
      case "Paintbrush": return Paintbrush;
      case "Grid": return Grid;
      case "Hammer": return Hammer;
      case "Wrench": return Wrench;
      case "ShieldCheck": return ShieldCheck;
      case "Sparkles": return Sparkles;
      case "Truck": return Truck;
      case "Building2": return Building2;
      default: return Wrench;
    }
  };

  const filteredServices = useMemo(() => {
    return maintenanceServices.filter(service => {
      // Tab filter
      if (selectedTab === "finishing" && !["painting", "tiling", "blacksmith", "carpentry"].includes(service.id)) return false;
      if (selectedTab === "tech" && !["solar", "ac"].includes(service.id)) return false;
      if (selectedTab === "home" && !["cleaning", "moving", "contracting"].includes(service.id)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesShort = service.shortName.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesSubs = service.popularServices.some(s => s.toLowerCase().includes(query));
        return matchesName || matchesShort || matchesDesc || matchesSubs;
      }

      return true;
    });
  }, [selectedTab, searchQuery]);

  const handleOpenBooking = (service: ServiceCategory) => {
    setSelectedServiceForModal(service);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 md:pb-12">
      
      {/* Top Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex h-11 w-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold leading-tight text-stone-900">خدمات الصيانة والتشطيبات</h1>
            <p className="text-xs text-stone-600">فنيون معتمدون • ضمان 30 يوماً • استجابة فورية</p>
          </div>
        </div>

        <a 
          href="https://wa.me/963934888055?text=مرحباً، أريد الاستفسار عن خدمات الصيانة في تطبيق لقطة"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-bold text-green-900 transition-colors hover:bg-green-100"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">واتساب مباشر</span>
        </a>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-6 space-y-6">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-900 p-6 text-white md:p-10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <BadgeCheck className="h-4 w-4 text-green-300" />
              <span>خدمات معتمدة ومكفولة 100%</span>
            </div>
            <h2 className="text-2xl font-bold leading-10 text-white md:text-3xl">
              صيانة منزلك وعقارك أصبحت أسهل بضغطة زر واحدة
            </h2>
            <p className="text-sm leading-7 text-stone-200 md:text-base">
              اختر الخدمة، وحدد موعدك، واستقبل نخبة الفنيين والمهندسين المعتمدين مع ضمان شامل على جميع الأعمال.
            </p>

            {/* Quick Guarantees */}
            <div className="grid max-w-lg grid-cols-1 gap-3 border-t border-white/15 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-300" />
                <span className="text-xs font-bold text-stone-100">ضمان 30 يوماً</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 shrink-0 text-amber-300" />
                <span className="text-xs font-bold text-stone-100">استجابة حسب التوفر</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 shrink-0 text-amber-300" />
                <span className="text-xs font-bold text-stone-100">تقييم 4.9/5</span>
              </div>
            </div>
          </div>

          {/* Decorative background visual icon */}
          <div className="pointer-events-none absolute bottom-4 left-6 hidden opacity-[0.08] md:block">
            <Wrench className="h-48 w-48 text-white" />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="ابحث عن خدمة (مثلاً: تكييف، طاقة شمسية، دهان، كهرباء، بلاط...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pe-11 ps-4 text-sm font-medium text-stone-900 outline-none transition-colors focus:border-brand-500 focus:bg-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {[
              { id: "all", label: "جميع الخدمات (11)", icon: Wrench },
              { id: "finishing", label: "تشطيب وديكور", icon: Paintbrush },
              { id: "tech", label: "طاقة وتكييف وأمان", icon: Sun },
              { id: "home", label: "خدمات منزلية ونقل", icon: Home },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex min-h-11 items-center rounded-lg px-4 text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedTab === tab.id
                    ? "bg-brand-500 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <tab.icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => {
            const Icon = getIcon(service.iconName);
            return (
              <div 
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-sm"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 border-b border-stone-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${service.bg} ${service.color}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                        {service.shortName}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {service.startingPrice}
                      </span>
                    </div>
                  </div>

                  {service.badge && (
                    <span className="bg-brand-50 text-brand-600 border border-brand-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Sub Services */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-800 block">أبرز الأعمال المتوفرة:</span>
                    <div className="space-y-1">
                      {service.popularServices.slice(0, 3).map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.features.map((feat, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-1 rounded-md border border-slate-200/60">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenBooking(service)}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                  >
                    <span>طلب الخدمة وحجز موعد</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">لم نجد أي خدمة مطابقة لبحثك</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              يمكنك التواصل مباشرة مع فريق الدعم الفني لطلب أي خدمة صيانة مخصصة.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedTab("all"); }}
              className="btn-outline text-xs"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}

        {/* Why Choose Laqta Maintenance */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">لماذا تختار خدمات الصيانة عبر "لقطة"؟</h3>
            <p className="text-xs text-slate-500">نحن لا نوفر مجرد فنيين، بل نضمن لك راحة البال وجودة العمل بأعلى المعايير.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">ضمان كتابي 30 يوماً</h4>
              <p className="text-xs text-slate-600">أي ملاحظة أو تكرار للعطل يتم إعادة صيانته مجاناً خلال فترة الضمان.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">فنيون مفحوصون ومعتمدون</h4>
              <p className="text-xs text-slate-600">تدقيق خلفيات وخبرات جميع الفنيين والمهندسين لضمان الأمان والكفاءة.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">تسعير شفاف ومعلن</h4>
              <p className="text-xs text-slate-600">كشف وتحديد التكلفة مسبقاً وبدون أي رسوم خفية أو مبالغ فيها.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">التزام دقيق بالمواعيد</h4>
              <p className="text-xs text-slate-600">نحترم وقتك، ونلتزم بالحضور في الموعد المحدد الذي تم الاتفاق عليه.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <ServiceBookingModal 
        service={selectedServiceForModal}
        isOpen={Boolean(selectedServiceForModal)}
        onClose={() => setSelectedServiceForModal(null)}
      />

    </div>
  );
}
