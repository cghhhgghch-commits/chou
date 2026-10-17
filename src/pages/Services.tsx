import { useState, useMemo } from "react";
import { 
  Zap, Sun, Droplets, Wind, Paintbrush, Grid, Hammer, Wrench, 
  ShieldCheck, Sparkles, Truck, Building2, Home, Search, ArrowRight,
  CheckCircle2, MessageSquare
} from "lucide-react";
import { maintenanceServices, ServiceCategory } from "../data/servicesData";
import ServiceBookingModal from "../components/services/ServiceBookingModal";
import FadeContent from "../components/ui/FadeContent";
import SegmentedControl from "../components/ui/SegmentedControl";

const maintenancePhotos = [
  {
    src: "/images/editorial/home-electrician.jpg",
    alt: "يدان تصلحان مقبسًا كهربائيًا منزليًا باستخدام كماشة",
    title: "كهرباء منزلية",
  },
  {
    src: "/images/editorial/home-plumbing.jpg",
    alt: "سباك يرتدي زي العمل ويصلح وصلة أنبوب داخل المنزل",
    title: "تمديدات وصيانة مياه",
  },
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceCategory | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

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
    setBookingOpen(true);
  };

  const serviceTabs = [
    { id: "all", label: `كل الخدمات · ${maintenanceServices.length}`, icon: Wrench },
    { id: "finishing", label: "تشطيب وديكور", icon: Paintbrush },
    { id: "tech", label: "طاقة وتكييف", icon: Sun },
    { id: "home", label: "منزل ونقل", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24 md:pb-12">
      <main className="container mx-auto max-w-6xl space-y-8 px-4 py-6 md:py-8">
        <FadeContent className="flex flex-col gap-5 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between" trigger="mount" stagger={0}>
          <div>
            <p className="mb-2 text-xs font-bold text-brand-700">دليل الخدمات</p>
            <h1 className="text-2xl font-bold leading-tight text-stone-900 md:text-3xl">الصيانة والتشطيبات</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
              ابحث عن نوع العمل، ثم أرسل تفاصيله وموقعك عبر نموذج الطلب.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-600">
              <Wrench className="h-4 w-4 text-brand-700" /> {maintenanceServices.length} مجالات
            </span>
            <a
              href="https://wa.me/963934888055?text=مرحباً، أريد الاستفسار عن خدمات الصيانة في تطبيق لقطة"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 border-s border-stone-300 ps-4 text-sm font-bold text-stone-800 transition-colors hover:text-brand-700"
            >
              <MessageSquare className="h-4 w-4" /> واتساب
            </a>
          </div>
        </FadeContent>

        <section aria-label="صور لأعمال صيانة منزلية" className="grid grid-cols-2 gap-3 md:gap-4">
          {maintenancePhotos.map((photo) => (
            <figure key={photo.src} className="min-w-0 overflow-hidden rounded-md border border-stone-200 bg-white">
              <img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <figcaption className="px-3 py-2">
                <span className="text-xs font-bold text-stone-800">{photo.title}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <section id="service-list" className="space-y-4 scroll-mt-28">
          <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold text-brand-700">دليل الخدمات</p>
              <h2 className="text-xl font-bold text-stone-900 md:text-2xl">ما العمل الذي تحتاجه؟</h2>
            </div>
            <span className="text-xs text-stone-500" aria-live="polite">{filteredServices.length} خدمات متاحة</span>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input 
              type="text"
              placeholder="ابحث عن خدمة أو نوع عمل"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-12 w-full rounded-md border border-stone-300 bg-white py-3 pe-11 ps-4 text-sm font-medium text-stone-900 outline-none transition-colors focus:border-brand-500"
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

          <div className="hide-scrollbar overflow-x-auto">
            <SegmentedControl
              label="تصفية الخدمات حسب المجال"
              options={serviceTabs}
              value={selectedTab}
              onChange={setSelectedTab}
            />
          </div>
        </div>
        </section>

        <FadeContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {filteredServices.map((service) => {
            const Icon = getIcon(service.iconName);
            return (
              <article
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-stone-400"
              >
                <header className="flex items-start gap-3 border-b border-stone-200 p-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${service.bg} ${service.color}`}>
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-stone-900 transition-colors group-hover:text-brand-700">{service.shortName}</h3>
                    <span className="text-xs font-medium text-stone-500">{service.startingPrice}</span>
                  </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  <p className="line-clamp-3 text-sm leading-6 text-stone-600">{service.description}</p>
                  <div className="space-y-1.5">
                    <span className="block text-xs font-bold text-stone-800">أعمال متاحة</span>
                    {service.popularServices.slice(0, 2).map((sub) => (
                      <p key={sub} className="flex items-start gap-2 text-xs leading-5 text-stone-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                        <span>{sub}</span>
                      </p>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenBooking(service)}
                    className="flex min-h-11 w-full items-center justify-between gap-2 border-t border-stone-200 pt-3 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
                  >
                    <span>تفاصيل الخدمة وطلبها</span>
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              </article>
            );
          })}
        </FadeContent>

        {filteredServices.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-stone-100 text-stone-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">لم نجد خدمة مطابقة</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-stone-600">
              جرّب كلمات أخرى أو أعد ضبط البحث والتصنيف.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedTab("all"); }}
              className="btn-outline text-xs"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}

        <FadeContent className="grid gap-5 border-t border-stone-200 pt-7 sm:grid-cols-3" stagger={0.08}>
          <div><span className="text-xs font-bold text-brand-700">01</span><h3 className="mt-1 text-sm font-bold text-stone-900">اختر المجال</h3><p className="mt-1 text-xs leading-5 text-stone-600">حدد الخدمة الأقرب للعمل الذي تحتاجه.</p></div>
          <div><span className="text-xs font-bold text-brand-700">02</span><h3 className="mt-1 text-sm font-bold text-stone-900">أضف التفاصيل</h3><p className="mt-1 text-xs leading-5 text-stone-600">اختر العمل، واكتب موقعك وشرحًا مختصرًا.</p></div>
          <div><span className="text-xs font-bold text-brand-700">03</span><h3 className="mt-1 text-sm font-bold text-stone-900">أرسل الطلب</h3><p className="mt-1 text-xs leading-5 text-stone-600">راجع المعلومات ثم أرسلها عبر واتساب.</p></div>
        </FadeContent>
      </main>

      {/* Booking Modal */}
      <ServiceBookingModal 
        service={selectedServiceForModal}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

    </div>
  );
}
