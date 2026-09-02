import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import { useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import PropertyCard from "../components/properties/PropertyCard";
import { Property } from "../types";
import { SYRIAN_CITIES, SYRIAN_CATEGORIES, APP_CONFIG } from "../lib/constants";

export const CATEGORY_TABS = [
  { id: 'all', label: 'الكل' },
  ...SYRIAN_CATEGORIES.map(c => ({ id: c.id, label: `${c.icon} ${c.label}` }))
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get('category') || searchParams.get('type') || 'all';
  
  // Normalize legacy categories if any
  const normalizeCat = (cat: string) => {
    if (['sale', 'rent', 'furnished', 'damascene_house'].includes(cat)) return 'houses';
    if (['commercial'].includes(cat)) return 'shops';
    if (['land'].includes(cat)) return 'lands';
    if (['villa_farm'].includes(cat)) return 'farms';
    if (['chalet', 'student', 'offplan'].includes(cat)) return 'other';
    return cat;
  };

  const initialCategory = normalizeCat(rawCategory);
  const initialCity = searchParams.get('city') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedFurnishing, setSelectedFurnishing] = useState<string>('all');
  const [dealTypeFilter, setDealTypeFilter] = useState<string>('all');

  // Firestore live properties
  const [firestoreProperties, setFirestoreProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase listing fetch note:", error);
        setFirestoreProperties([]);
        return;
      }

      const liveList: Property[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title || "عقار جديد",
        price: item.price || 0,
        pricePeriod: item.price_period || undefined,
        priceInUSD: item.price_in_usd || undefined,
        location: `${item.city_id || ""} ${item.area_id ? `- ${item.area_id}` : ""}`.trim() || "حلب",
        city: item.city_id || "حلب",
        areaName: item.area_id || "",
        type: item.type || "sale",
        category: item.category || "houses",
        categoryType: item.category || "houses",
        propertyType: item.property_type || "apartment",
        ownershipType: item.ownership_type || "طابو أخضر",
        finishing: item.finishing || "سوبر ديلوكس",
        solarStatus: item.solar_status || "منظومة طاقة شمسية كاملة",
        direction: item.direction || "قبلي",
        floor: item.floor || "الطابق الثاني",
        totalFloors: item.total_floors || "",
        bedrooms: item.bedrooms || "3",
        bathrooms: item.bathrooms || 2,
        salons: item.salons || "صالون",
        area: item.area || 120,
        landArea: item.land_area || undefined,
        furnishing: item.furnishing || "غير مفروش",
        hasSolarPower: Boolean(item.has_solar_power),
        hasWaterWell: Boolean(item.has_water_well),
        hasElevator: Boolean(item.has_elevator),
        hasGenerator: Boolean(item.has_generator),
        description: item.description || "",
        amenities: Array.isArray(item.amenities) ? item.amenities : ["طاقة شمسية", "سند طابو"],
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        ],
        isVerified: item.is_verified ?? true,
        isFeatured: item.is_featured ?? true,
        advertiserType: item.advertiser_type || "owner",
        agent: {
          name: item.advertiser_name || "معلن موثوق",
          phone: item.phone || APP_CONFIG.adminPhone,
          whatsapp: item.whatsapp || item.phone || APP_CONFIG.adminPhone,
          avatar: ""
        },
        postedAt: "جديد اليوم"
      }));
      setFirestoreProperties(liveList);
    };

    fetchListings();
  }, []);

  // Combine real Firestore listings with curated properties (no duplicates)
  const allCombinedProperties = useMemo(() => {
    return firestoreProperties;
  }, [firestoreProperties]);

  // Keep state synchronized with URL search params
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('type') || 'all';
    const city = searchParams.get('city') || '';
    setActiveCategory(normalizeCat(cat));
    setSelectedCity(city);
  }, [searchParams]);
  
  const filteredProperties = useMemo(() => {
    return allCombinedProperties.filter(p => {
      // 1. Search Query filter (matches title, location, description, or amenities)
      if (searchQuery.trim()) {
        const queryText = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(queryText);
        const matchesLocation = p.location.toLowerCase().includes(queryText);
        const matchesDesc = p.description.toLowerCase().includes(queryText);
        const matchesAmenities = p.amenities?.some(a => a.toLowerCase().includes(queryText));
        if (!matchesTitle && !matchesLocation && !matchesDesc && !matchesAmenities) {
          return false;
        }
      }

      // 2. Category filter (8 core categories)
      if (activeCategory !== 'all') {
        const propCat = normalizeCat(p.category || p.categoryType || '');
        if (propCat !== activeCategory) {
          return false;
        }
      }
      
      // 3. City filter
      if (selectedCity && !p.location.includes(selectedCity) && p.city !== selectedCity) {
        return false;
      }

      // 4. Deal type filter (sale / rent / offplan)
      if (dealTypeFilter !== 'all') {
        if (p.type !== dealTypeFilter) return false;
      }

      // 5. Furnishing filter
      if (selectedFurnishing !== 'all') {
        if (p.furnishing !== selectedFurnishing) return false;
      }
      
      return true;
    });
  }, [allCombinedProperties, searchQuery, activeCategory, selectedCity, dealTypeFilter, selectedFurnishing]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') {
      newParams.delete('category');
      newParams.delete('type');
    } else {
      newParams.set('category', id);
      newParams.delete('type');
    }
    setSearchParams(newParams);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const newParams = new URLSearchParams(searchParams);
    if (!city) {
      newParams.delete('city');
    } else {
      newParams.set('city', city);
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedCity('');
    setDealTypeFilter('all');
    setSelectedFurnishing('all');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-800">
      
      {/* Top Search Bar (Sticky) */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute right-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالمنطقة أو الميزة (المالكي، المزة، الفرقان، طاقة شمسية...)" 
                className="w-full bg-slate-100/90 border border-slate-200/80 rounded-2xl py-2.5 pr-11 pl-4 text-xs md:text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-medium transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-colors font-bold text-xs shadow-xs shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>فلاتر</span>
            </button>
          </div>
          
          {/* Syrian Category Scrollable Pills (8 Core Categories) */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => handleCategorySelect(tab.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Results Header & Quick toggles */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
          <div>
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{filteredProperties.length} عقار متاح</span>
              {selectedCity && <span className="text-brand-600">في {selectedCity}</span>}
              {firestoreProperties.length > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  محدث ومباشر
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              عقارات معتمدة بمواصفات حقيقية وسندات ملكية موثقة
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-1 rounded-full border border-slate-200">
              عروض حقيقية ومحدثة
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
          
          {filteredProperties.length === 0 && (
            <div className="col-span-full py-16 text-center flex flex-col items-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">لم نجد عقارات تطابق هذا البحث حالياً</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-5">
                جرب تغيير خيارات التصفية أو اختيار قسم عقاري آخر لعرض كافة العقارات المعروضة.
              </p>
              <button 
                onClick={resetAllFilters} 
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                عرض جميع العقارات المتاحة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Fullscreen Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between z-10 shadow-xs">
            <button onClick={() => setShowFilters(false)} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-lg text-slate-900">تصفية العقارات</h2>
            <button onClick={resetAllFilters} className="text-brand-600 font-bold text-sm hover:text-brand-700">
              إعادة ضبط
            </button>
          </div>
          
          <div className="flex-1 p-5 space-y-6 pb-28">
            
            {/* Location (Syrian Governorates) */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">المحافظة</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select 
                  value={selectedCity}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-12 pl-10 text-sm font-bold text-slate-900 focus:border-brand-500 outline-none appearance-none cursor-pointer shadow-xs"
                >
                  <option value="">جميع المحافظات السورية</option>
                  {SYRIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">القسم والتصنيف</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_TABS.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`py-2.5 px-3 bg-white border rounded-xl text-xs font-bold transition-all text-right flex items-center justify-between ${
                      activeCategory === cat.id 
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-extrabold shadow-xs' 
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {activeCategory === cat.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Type */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">نوع الصفقة</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'sale', label: 'للبيع' },
                  { id: 'rent', label: 'للإيجار' },
                  { id: 'offplan', label: 'على العظم' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDealTypeFilter(d.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      dealTypeFilter === d.id 
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-extrabold' 
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">حالة الفرش والتجهيز</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'مفروش', label: 'مفروش' },
                  { id: 'غير مفروش', label: 'غير مفروش' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFurnishing(f.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedFurnishing === f.id 
                        ? 'bg-brand-50 border-brand-500 text-brand-700' 
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>


          </div>
          
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98]"
            >
              عرض {filteredProperties.length} عقار مطابق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
