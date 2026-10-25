import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Building2, Wrench, Sun, Droplets, Wind, Paintbrush, Search, ClipboardList,
  Hammer, Zap, Home as HomeIcon, MapPin, Store, Factory, Landmark, Trees,
  LayoutGrid, MessageSquare
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useNavigate } from "react-router";
import PropertyCard from "../components/properties/PropertyCard";
import { fetchVerifiedListings } from "../lib/listings";
import { maintenanceServices } from "../data/servicesData";
import { SYRIAN_CITIES } from "../lib/constants";

const categoryPhotos: Record<string, { src: string; alt: string }> = {
  houses: {
    src: "/images/editorial/home-exterior.jpg",
    alt: "منزل معاصر بواجهة بيضاء وحديقة وأشجار",
  },
  buildings: {
    src: "/images/editorial/apartment-building.jpg",
    alt: "مبنى سكني متعدد الطوابق بشرفات على شارع حضري",
  },
  farms: {
    src: "/images/editorial/farm.jpg",
    alt: "منزل ريفي تحيط به الحقول والأشجار",
  },
  lands: {
    src: "/images/editorial/land.jpg",
    alt: "حقول زراعية وقطع أراضٍ من منظور جوي",
  },
  shops: {
    src: "/images/editorial/shop.jpg",
    alt: "مدخل محل تجاري في شارع محلي",
  },
  villas: {
    src: "/images/editorial/villa.jpg",
    alt: "فيلا سكنية مع فناء ومسبح",
  },
  factories: {
    src: "/images/editorial/factory.jpg",
    alt: "مبنى صناعي بواجهة معدنية",
  },
  other: {
    src: "/images/editorial/chalet.jpg",
    alt: "شاليه خشبي وسط طبيعة جبلية",
  },
};

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const {
    data: recentProperties = [],
    isError: listingsError,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ["verified-listings", 4],
    queryFn: () => fetchVerifiedListings(4),
  });

  // 8 Exact Syrian Real Estate Categories (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع، أخرى)
  const syrianCategories = [
    { 
      id: 'houses', 
      label: 'بيوت', 
      sublabel: 'شقق سكنية وبيوت عربية ودوبلكس',
      icon: HomeIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      link: '/properties?category=houses' 
    },
    { 
      id: 'buildings', 
      label: 'بنايات', 
      sublabel: 'أبنية سكنية وعمارات استثمارية',
      icon: Building2,
      iconColor: 'text-slate-800',
      iconBg: 'bg-slate-100',
      link: '/properties?category=buildings' 
    },
    { 
      id: 'farms', 
      label: 'مزارع', 
      sublabel: 'بساتين زيتون واستراحات ريفية',
      icon: Trees,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50',
      link: '/properties?category=farms' 
    },
    { 
      id: 'lands', 
      label: 'أراضي', 
      sublabel: 'مقاسم سكنية وأراض زراعية',
      icon: MapPin,
      iconColor: 'text-stone-700',
      iconBg: 'bg-stone-100',
      link: '/properties?category=lands' 
    },
    { 
      id: 'shops', 
      label: 'محلات', 
      sublabel: 'محلات وفروغ وصالات تجارية',
      icon: Store,
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-50',
      link: '/properties?category=shops' 
    },
    { 
      id: 'villas', 
      label: 'فلل', 
      sublabel: 'فلل مستقلة وبيوت ريفية',
      icon: Landmark,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      link: '/properties?category=villas' 
    },
    { 
      id: 'factories', 
      label: 'مصانع', 
      sublabel: 'هناغر ومستودعات ومنشآت صناعية',
      icon: Factory,
      iconColor: 'text-orange-700',
      iconBg: 'bg-orange-50',
      link: '/properties?category=factories' 
    },
    { 
      id: 'other', 
      label: 'أخرى', 
      sublabel: 'شاليهات، استوديوهات وسكن طلاب',
      icon: LayoutGrid,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      link: '/properties?category=other' 
    },
  ];

  const handleSearchClick = () => {
    navigate('/properties');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] pb-24 md:pb-0">
      
      {/* Search Header with Notification Bell */}
      <div className="bg-white sticky top-0 z-40 shadow-xs border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <div className="flex-1 relative flex items-center cursor-pointer" onClick={handleSearchClick}>
            <div className="absolute left-3.5 text-brand-600">
              <Search className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
            </div>
            <div className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl py-2.5 pl-10 pr-4 text-xs md:text-sm font-medium text-slate-400 transition-colors">
              ابحث عن عقارات، مناطق، وأحياء تناسب احتياجك...
            </div>
          </div>

        </div>

        <div className="pt-2.5 pb-0.5 max-w-7xl mx-auto" />

      </div>

      <div className="mx-auto w-full max-w-7xl px-3 py-5 md:px-8 md:py-8">
        <section className="mb-10 border-b border-stone-200 pb-7 md:mb-12 md:pb-8">
          <motion.div
            className="relative isolate grid min-h-44 grid-cols-[1fr_0.9fr] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm sm:min-h-52 sm:grid-cols-2"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          >
            <div className="relative z-10 flex flex-col items-start justify-center p-4 sm:p-6">
              <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                عقارات تناسب مختلف الاحتياجات
              </span>
              <h2 className="text-base font-bold leading-snug text-stone-900 sm:text-xl">خياراتك العقارية تبدأ من هنا</h2>
              <p className="mt-1.5 hidden max-w-sm text-xs leading-6 text-stone-600 sm:block">
                بيوت وأراضٍ وعقارات متنوعة، تصفحها واختر ما يناسب خطوتك القادمة.
              </p>
              <Link
                to="/properties"
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-md bg-brand-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-brand-700 sm:mt-4 sm:min-h-10 sm:px-4 sm:text-sm"
              >
                اكتشف العقارات
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>

            <div className="relative min-h-44 overflow-hidden bg-stone-100 sm:min-h-52" aria-hidden="true">
              <motion.div
                className="absolute inset-y-3 right-[5%] w-[57%] overflow-hidden rounded-lg shadow-md sm:inset-y-4"
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={reduceMotion ? undefined : { scale: 1.025 }}
              >
                <img src={categoryPhotos.other.src} alt="" className="h-full w-full object-cover" />
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-[5%] top-7 w-[34%] overflow-hidden rounded-lg border-2 border-white shadow-lg sm:bottom-5 sm:left-[8%] sm:top-9"
                animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              >
                <img src={categoryPhotos.farms.src} alt="" className="h-full w-full object-cover" />
              </motion.div>
              <motion.div
                className="absolute left-[30%] top-3 h-14 w-14 overflow-hidden rounded-lg border-2 border-white shadow-md sm:left-[31%] sm:top-4 sm:h-[4.5rem] sm:w-[4.5rem]"
                animate={reduceMotion ? undefined : { rotate: [0, 3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              >
                <img src={categoryPhotos.lands.src} alt="" className="h-full w-full object-cover" />
              </motion.div>
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md border border-white/70 bg-white/90 px-2 py-1 text-[10px] font-bold text-stone-700 shadow-sm backdrop-blur-sm sm:bottom-4 sm:right-4 sm:text-xs">
                <Building2 className="h-3 w-3 text-brand-600" />
                بيوت · أراضٍ · استثمار
              </div>
            </div>
          </motion.div>

          <motion.section
            className="relative mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 text-stone-900 shadow-sm sm:mt-5 sm:p-5"
            dir="rtl"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            aria-labelledby="client-request-promo-title"
          >
            <span className="absolute inset-y-0 right-0 w-1 bg-stone-300" aria-hidden="true" />
            <div className="relative flex flex-col gap-4 pe-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-600">خدمة البحث من فريق لقطة</p>
                  <h2 id="client-request-promo-title" className="mt-0.5 text-sm font-bold leading-6 text-stone-900 sm:text-base">لم تجد العقار المناسب؟ أرسل لنا طلبك</h2>
                  <p className="mt-1 text-xs leading-5 text-stone-600">أخبرنا بما تبحث عنه، وفريقنا يتابع معك مباشرة.</p>
                </div>
              </div>
              <Link
                to="/client-requests"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-stone-900 px-5 text-sm font-bold text-white transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md sm:self-auto"
              >
                أضف طلب البحث
                <ArrowLeft className="h-4 w-4 text-white" />
              </Link>
            </div>
          </motion.section>

          <div className="mt-5 flex flex-col gap-2 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-xs font-bold text-stone-600">تصفح حسب المحافظة</span>
            <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
              {SYRIAN_CITIES.slice(0, 8).map((city) => (
                <Link key={city} to={`/properties?city=${encodeURIComponent(city)}`} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 transition-colors hover:border-brand-300 hover:text-brand-700">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" /> {city}
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Real Estate Categories (8 Explicit Categories) */}
        <section className="mb-14 space-y-5">
          <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <p className="mb-1 text-xs font-bold text-brand-700">اختر ما تبحث عنه</p>
              <h2 className="text-xl font-bold text-stone-900 md:text-2xl">أقسام العقارات</h2>
            </div>

            <Link 
              to="/properties" 
              className="flex min-h-10 shrink-0 items-center gap-1 text-xs font-bold text-brand-700 transition-colors hover:text-brand-900"
            >
              <span>تصفح الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
            {syrianCategories.map((cat) => {
              const IconComp = cat.icon;
              const photo = categoryPhotos[cat.id];
              return (
                <Link 
                  key={cat.id} 
                  to={cat.link} 
                  className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-stone-200 bg-white transition-colors hover:border-stone-400"
                >
                  <span className={`relative block aspect-[4/3] w-full overflow-hidden ${photo ? "bg-stone-200" : cat.iconBg + " " + cat.iconColor}`}>
                    {photo ? (
                      <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                    ) : (
                      <IconComp className="absolute inset-0 m-auto h-8 w-8" strokeWidth={1.5} />
                    )}
                  </span>
                  <div className="flex min-h-16 min-w-0 items-center justify-between gap-2 px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-stone-900 group-hover:text-brand-700">{cat.label}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-stone-500">{cat.sublabel}</span>
                    </span>
                    <ArrowLeft className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:-translate-x-1 group-hover:text-brand-600" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Maintenance & Services Section */}
        <section className="mb-10 space-y-4 border-t border-stone-200 pt-7">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">خدمات الصيانة والتشطيبات</h2>
              <p className="text-xs text-slate-600 mt-0.5">خدمات متخصصة لصيانة وتطوير العقارات</p>
            </div>
            <Link 
              to="/services" 
              className="flex min-h-10 items-center gap-1 text-xs font-bold text-brand-700 transition-colors hover:text-brand-900"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-2.5">
            {maintenanceServices.slice(0, 8).map((service) => {
              const icons: Record<string, React.ComponentType<any>> = {
                "Zap": Zap, "Sun": Sun, "Droplets": Droplets, "Wind": Wind,
                "Paintbrush": Paintbrush, "Hammer": Hammer, "Wrench": Wrench
              };
              const Icon = icons[service.iconName] || Wrench;
              
              return (
                <Link 
                  key={service.id}
                  to={`/services?service=${service.id}`}
                  className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-md p-2.5 text-center transition-colors hover:bg-stone-100 group"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${service.bg} ${service.color} md:h-14 md:w-14`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">
                    {service.shortName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-10 border-t border-stone-200 pt-7">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">أحدث الإعلانات العقارية</h2>
              <p className="text-xs text-slate-500">صور ومعلومات أضافها أصحاب الإعلانات</p>
            </div>
            <Link to="/properties" className="text-sm text-brand-500 font-bold hover:text-brand-600 transition-colors flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {recentProperties.length === 0 && (
            <div className="flex flex-col items-start gap-3 border-y border-stone-200 py-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-600">
                {listingsError ? "تعذر تحميل الإعلانات. تحقق من الاتصال ثم أعد المحاولة." : "لا توجد إعلانات جديدة لعرضها الآن."}
              </p>
              {listingsError ? (
                <button onClick={() => void refetchListings()} className="min-h-10 text-sm font-bold text-brand-700 hover:text-brand-900">إعادة المحاولة</button>
              ) : (
                <Link to="/place-ad" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">
                  أضف أول إعلان <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </section>

        <section className="flex items-center justify-between gap-4 border-t border-stone-200 py-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-brand-700" />
            <span className="text-sm font-bold text-stone-900">تحتاج مساعدة؟</span>
          </div>
          <Link to="/contact" className="text-sm font-bold text-brand-700 hover:text-brand-900">تواصل معنا</Link>
        </section>
      </div>
    </div>
  );
}
