import { useEffect, useState } from "react";
import { 
  ArrowLeft, Bell, Building2, Wrench, Sun, Droplets, Wind, Paintbrush,
  Hammer, Zap, ShieldCheck, Home as HomeIcon, MapPin, Store, Sparkles,
  Factory, Landmark, Trees, Truck
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import PropertyCard from "../components/properties/PropertyCard";
import { supabase } from "../lib/supabase";
import { Property } from "../types";
import { maintenanceServices } from "../data/servicesData";
import { SYRIAN_CITIES } from "../lib/constants";

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
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
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
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=85', 
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
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=85', 
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
            <div className="absolute left-3.5 text-brand-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl py-2.5 pl-10 pr-4 text-xs md:text-sm font-medium text-slate-400 transition-colors">
              ابحث عن عقارات، مناطق، وأحياء تناسب احتياجك...
            </div>
          </div>

        </div>

        <div className="pt-2.5 pb-0.5 max-w-7xl mx-auto" />

      </div>

      <main className="flex-1 flex flex-col px-3 md:px-8 py-5 max-w-7xl mx-auto w-full">
        
        {/* Real Estate Categories (8 Explicit Categories) */}
        <section className="mb-6 bg-white p-4 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
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
                  className="bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col relative hover:shadow-lg hover:border-brand-400/80 transition-all group duration-300 transform hover:-translate-y-0.5"
                >
                  {/* Photo Container with subtle gradient & tag */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={cat.image} 
                      alt={cat.label} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    
                    {/* Category Tag Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg shadow-xs ${cat.tagBg}`}>
                        {cat.tag}
                      </span>
                    </div>

                    {/* Category Icon Badge */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-xs border border-white/40">
                      <IconComp className={`w-3.5 h-3.5 ${cat.iconColor}`} />
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
        <section className="mb-8 bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6 rounded-3xl border border-amber-200/50 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/30">
            <div>
              <h2 className="text-lg font-bold text-slate-900">خدمات الصيانة والتشطيبات</h2>
              <p className="text-xs text-slate-600 mt-0.5">خدمات متخصصة لصيانة وتطوير العقارات</p>
            </div>
            <Link 
              to="/services" 
              className="text-xs text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-orange-200 transition-colors"
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
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-white/80 transition-all group text-center"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${service.bg} ${service.color} group-hover:scale-105 transition-transform shadow-xs`}>
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

        {/* Real Estate Highlights / What's New */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3.5">الخيارات المميزة</h2>
          <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x">
            <Link to="/properties?category=chalet" className="min-w-[280px] h-[160px] relative rounded-2xl overflow-hidden shadow-sm snap-center group">
              <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" alt="Chalets" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-3.5 left-3.5 right-3.5">
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
      </main>
    </div>
  );
}
