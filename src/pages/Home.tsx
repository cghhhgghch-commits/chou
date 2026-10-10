import { useEffect, useState } from "react";
import { 
  ArrowLeft, Bell, Building2, Wrench, Sun, Droplets, Wind, Paintbrush, Search,
  Hammer, Zap, ShieldCheck, Home as HomeIcon, MapPin, Store, Sparkles,
  Factory, Landmark, Trees, Truck, MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import PropertyCard from "../components/properties/PropertyCard";
import Image from "../components/ui/Image";
import { supabase } from "../lib/supabase";
import { Property } from "../types";
import { maintenanceServices } from "../data/servicesData";
import { SYRIAN_CITIES } from "../lib/constants";
import { CATEGORY_IMAGES, FEATURED_CHALET_IMAGE, PROPERTY_IMAGE_FALLBACK } from "../config/images";

export default function Home() {
  const navigate = useNavigate();
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "active")
          .eq("is_verified", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;

        const fetchedProps: Property[] = (data || []).map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price || 0,
          pricePeriod: item.price_period || "",
          location: item.city_id || "حلب",
          city: item.city_id || "حلب",
          type: item.type || "sale",
          propertyType: item.property_type || (item.category === "commercial" ? "commercial_shop" : item.category === "land" ? "land_plot" : "apartment"),
          category: item.category || "sale",
          ownershipType: item.ownership_type || "طابو أخضر 2400 سهم (سجل عقاري)",
          finishing: item.finishing,
          floor: item.floor,
          hasSolarPower: Boolean(item.has_solar_power),
          bedrooms: item.bedrooms || 0,
          bathrooms: item.bathrooms || 0,
          area: item.area || 0,
          furnishing: item.furnishing || "",
          description: item.description || "",
          amenities: Array.isArray(item.amenities) ? item.amenities : [],
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [PROPERTY_IMAGE_FALLBACK],
          isVerified: Boolean(item.is_verified),
          agent: {
            name: item.advertiser_name || "معلن معتمد",
            phone: item.phone || "+963912345678",
            whatsapp: item.whatsapp || "+963912345678"
          },
          postedAt: item.created_at || new Date().toISOString()
        }));

        setRecentProperties(fetchedProps.slice(0, 4));
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    
    fetchListings();
  }, []);

  // 8 Exact Syrian Real Estate Categories (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع، أخرى)
  const syrianCategories = [
    { 
      id: 'houses', 
      label: 'بيوت', 
      sublabel: 'شقق سكنية وبيوت عربية ودوبلكس',
      tag: 'بيوت وشقق',
      tagBg: 'bg-blue-600 text-white',
      icon: HomeIcon,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      image: CATEGORY_IMAGES.houses,
      link: '/properties?category=houses' 
    },
    { 
      id: 'buildings', 
      label: 'بنايات', 
      sublabel: 'أبنية سكنية وعمارات استثمارية',
      tag: 'عمارات وأبراج',
      tagBg: 'bg-slate-800 text-white',
      icon: Building2,
      iconColor: 'text-slate-800',
      iconBg: 'bg-slate-100',
      image: CATEGORY_IMAGES.buildings,
      link: '/properties?category=buildings' 
    },
    { 
      id: 'farms', 
      label: 'مزارع', 
      sublabel: 'بساتين زيتون واستراحات ريفية',
      tag: 'مزارع واستراحات',
      tagBg: 'bg-emerald-700 text-white',
      icon: Trees,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50',
      image: CATEGORY_IMAGES.farms,
      link: '/properties?category=farms' 
    },
    { 
      id: 'lands', 
      label: 'أراضي', 
      sublabel: 'مقاسم سكنية وأراض زراعية',
      tag: 'مقاسم وأراضي',
      tagBg: 'bg-stone-700 text-white',
      icon: MapPin,
      iconColor: 'text-stone-700',
      iconBg: 'bg-stone-100',
      image: CATEGORY_IMAGES.lands,
      link: '/properties?category=lands' 
    },
    { 
      id: 'shops', 
      label: 'محلات', 
      sublabel: 'محلات وفروغ وصالات تجارية',
      tag: 'تجاري وفروغ',
      tagBg: 'bg-purple-700 text-white',
      icon: Store,
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-50',
      image: CATEGORY_IMAGES.shops,
      link: '/properties?category=shops' 
    },
    { 
      id: 'villas', 
      label: 'فلل', 
      sublabel: 'فلل مستقلة وبيوت ريفية',
      tag: 'فلل فاخرة',
      tagBg: 'bg-amber-600 text-white',
      icon: Sparkles,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      image: CATEGORY_IMAGES.villas,
      link: '/properties?category=villas' 
    },
    { 
      id: 'factories', 
      label: 'مصانع', 
      sublabel: 'هناغر ومستودعات ومنشآت صناعية',
      tag: 'صناعي ومستودعات',
      tagBg: 'bg-orange-700 text-white',
      icon: Factory,
      iconColor: 'text-orange-700',
      iconBg: 'bg-orange-50',
      image: CATEGORY_IMAGES.factories,
      link: '/properties?category=factories' 
    },
    { 
      id: 'other', 
      label: 'أخرى', 
      sublabel: 'شاليهات، استوديوهات وسكن طلاب',
      tag: 'عقارات متنوعة',
      tagBg: 'bg-indigo-600 text-white',
      icon: Landmark,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      image: CATEGORY_IMAGES.other,
      link: '/properties?category=other' 
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return Zap;
      case "Sun": return Sun;
      case "Droplets": return Droplets;
      case "Wind": return Wind;
      case "Paintbrush": return Paintbrush;
      case "Hammer": return Hammer;
      case "ShieldCheck": return ShieldCheck;
      case "Sparkles": return Sparkles;
      case "Truck": return Truck;
      default: return Wrench;
    }
  };

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

      <main className="flex-1 flex flex-col px-3 md:px-8 py-5 max-w-7xl mx-auto w-full">
        <section className="mb-6 border-b border-stone-200 pb-5">
          <p className="mb-1 text-xs font-bold text-brand-700">لقطة | عقارات وخدمات</p>
          <h1 className="text-2xl font-bold leading-10 text-stone-900 md:text-3xl">ابحث عن عقار يناسبك</h1>
          <p className="mt-1 text-sm leading-7 text-stone-600">عقارات للبيع والإيجار وخدمات للمنزل في المحافظات السورية.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-medium text-stone-700">
              <ShieldCheck className="h-4 w-4 text-green-700" /> إعلانات موثّقة
            </span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-medium text-stone-700">
              <MapPin className="h-4 w-4 text-stone-500" /> محافظات متعددة
            </span>
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-medium text-stone-700">
              <MessageSquare className="h-4 w-4 text-stone-500" /> تواصل مباشر
            </span>
          </div>
        </section>
        
        {/* Real Estate Categories (8 Explicit Categories) */}
        <section className="mb-8 space-y-4 rounded-xl border border-stone-200 bg-white p-4 md:p-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-slate-900">أقسام العقارات</h2>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  8 أقسام رئيسية
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">تصفح العقارات حسب النوع المتاح</p>
            </div>

            <Link 
              to="/properties" 
              className="text-xs text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100 transition-colors shrink-0"
            >
              <span>تصفح الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clean 8-Category Grid with Realistic Architecture Photos & Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 pt-1">
            {syrianCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link 
                  key={cat.id} 
                  to={cat.link} 
                   className="relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors duration-175 hover:border-stone-400 hover:bg-stone-50 group"
                >
                  {/* Photo Container with subtle gradient & tag */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      containerClassName="h-full w-full"
                      className="transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Category Tag Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="rounded-md border border-white/70 bg-white/95 px-2 py-0.5 text-[9px] font-bold text-stone-800">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Category Icon Badge */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-xs border border-white/40">
                       <IconComp className="h-3.5 w-3.5 text-stone-700" />
                      <span className="text-[11px] font-black text-slate-900">{cat.label}</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-3 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm font-black text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
                          {cat.label}
                        </span>
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 group-hover:-translate-x-1 transition-all" />
                      </div>
                      <p className="text-[10px] md:text-[11px] text-slate-500 font-medium line-clamp-1 mt-1">
                        {cat.sublabel}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Maintenance & Services Section */}
        <section className="mb-8 space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-4 md:p-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">خدمات الصيانة والتشطيبات</h2>
              <p className="text-xs text-slate-600 mt-0.5">خدمات متخصصة لصيانة وتطوير العقارات</p>
            </div>
            <Link 
              to="/services" 
              className="flex min-h-11 items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 text-xs font-bold text-stone-700 transition-colors hover:border-brand-300 hover:text-brand-700"
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
                  className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-lg p-2.5 text-center transition-colors hover:bg-white group"
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

        <Link
          to="/contact"
          className="mb-8 flex min-h-16 items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 transition-colors hover:border-brand-300"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500 text-white">
              <MessageSquare className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-black">اتصل بنا</span>
              <span className="block text-xs text-stone-600">فريق الدعم جاهز لمساعدتك</span>
            </span>
          </span>
          <ArrowLeft className="h-5 w-5 shrink-0 text-brand-600" />
        </Link>

        {/* Real Estate Highlights / What's New */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3.5">الخيارات المميزة</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x">
            <Link to="/properties?category=chalet" className="relative aspect-[4/3] min-w-[240px] overflow-hidden rounded-2xl shadow-sm snap-center group">
              <Image src={FEATURED_CHALET_IMAGE} alt="شاليه" containerClassName="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-stone-950/45"></div>
              <div className="absolute inset-x-3 bottom-3.5">
                <h3 className="text-white font-bold text-base leading-tight mb-0.5">شاليهات ومنازل خارج المدينة</h3>
                <p className="text-slate-200 text-xs">مواقع هادئة ومناسبة للراحة والاستثمار</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="flex-1 mt-2">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">أحدث الإعلانات العقارية</h2>
              <p className="text-xs text-slate-500">عقارات موثقة ومحدثة في المحافظات</p>
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
        </section>

        <section className="mt-10 border-t border-stone-200 py-7">
          <h2 className="text-xl font-bold text-stone-900">كيف تعمل المنصة</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <div className="border-s-2 border-brand-500 ps-3">
              <span className="text-xs font-bold text-brand-700">01</span>
              <h3 className="mt-1 text-sm font-bold text-stone-900">اختر القسم</h3>
              <p className="text-sm leading-7 text-stone-600">ابدأ بنوع العقار أو الخدمة التي تبحث عنها.</p>
            </div>
            <div className="border-s-2 border-stone-300 ps-3">
              <span className="text-xs font-bold text-stone-500">02</span>
              <h3 className="mt-1 text-sm font-bold text-stone-900">راجع التفاصيل</h3>
              <p className="text-sm leading-7 text-stone-600">قارن الموقع والسعر والمواصفات المعروضة.</p>
            </div>
            <div className="border-s-2 border-stone-300 ps-3">
              <span className="text-xs font-bold text-stone-500">03</span>
              <h3 className="mt-1 text-sm font-bold text-stone-900">تواصل مباشرة</h3>
              <p className="text-sm leading-7 text-stone-600">اتصل بالمعلن أو أرسل طلب الخدمة.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 py-7">
          <h2 className="text-xl font-bold text-stone-900">أسئلة شائعة</h2>
          <dl className="mt-4 divide-y divide-stone-200">
            <div className="py-3">
              <dt className="text-sm font-bold text-stone-900">كيف أضيف إعلاناً؟</dt>
              <dd className="text-sm leading-7 text-stone-600">ابدأ من «أضف إعلان» واتبع حقول العقار والاتصال.</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-bold text-stone-900">أين أجد خدمات الصيانة؟</dt>
              <dd className="text-sm leading-7 text-stone-600">افتح قسم الخدمات واختر نوع العمل المطلوب.</dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-bold text-stone-900">كيف أتواصل بشأن عقار؟</dt>
              <dd className="text-sm leading-7 text-stone-600">استخدم الاتصال أو WhatsApp في بطاقة العقار أو تفاصيله.</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
