import { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  X,
  Building2,
  BadgeDollarSign,
  Filter,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { supabase } from "../lib/supabase";
import PropertyCard from "../components/properties/PropertyCard";
import { Property } from "../types";
import {
  SYRIAN_CITIES,
  SYRIAN_CATEGORIES,
  APP_CONFIG,
  SYRIAN_GOVERNORATES,
  formatSyrianPrice,
} from "../lib/constants";
import { filterProperties, getAvailableAreas } from "../lib/propertyFilters";

export const CATEGORY_TABS = [
  { id: "all", label: "الكل" },
  ...SYRIAN_CATEGORIES.map((c) => ({ id: c.id, label: `${c.icon} ${c.label}` })),
];

const BEDROOM_OPTIONS = [
  { id: "all", label: "الكل", value: "" },
  { id: "1", label: "1+", value: "1" },
  { id: "2", label: "2+", value: "2" },
  { id: "3", label: "3+", value: "3" },
  { id: "4", label: "4+", value: "4" },
  { id: "5", label: "5+", value: "5" },
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get("category") || searchParams.get("type") || "all";

  const normalizeCat = (cat: string) => {
    if (["sale", "rent", "furnished", "damascene_house"].includes(cat)) return "houses";
    if (["commercial"].includes(cat)) return "shops";
    if (["land"].includes(cat)) return "lands";
    if (["villa_farm"].includes(cat)) return "farms";
    if (["chalet", "student", "offplan"].includes(cat)) return "other";
    return cat;
  };

  const initialCategory = normalizeCat(rawCategory);
  const initialCity = searchParams.get("city") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGovernorate, setSelectedGovernorate] = useState(initialCity);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<"SYP" | "USD">("SYP");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [firestoreProperties, setFirestoreProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .eq("is_verified", true)
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
        images: Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
        isVerified: item.is_verified ?? true,
        isFeatured: item.is_featured ?? true,
        advertiserType: item.advertiser_type || "owner",
        agent: {
          name: item.advertiser_name || "معلن موثوق",
          phone: item.phone || APP_CONFIG.adminPhone,
          whatsapp: item.whatsapp || item.phone || APP_CONFIG.adminPhone,
          avatar: "",
        },
        postedAt: "جديد اليوم",
      }));
      setFirestoreProperties(liveList);
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") || searchParams.get("type") || "all";
    const city = searchParams.get("city") || "";
    setActiveCategory(normalizeCat(cat));
    setSelectedGovernorate(city);
  }, [searchParams]);

  const availableAreas = useMemo(() => {
    const selectedGovernorateName = selectedGovernorate.trim();
    const governorateAreas = SYRIAN_GOVERNORATES.find(
      (governorate) => governorate.name === selectedGovernorateName,
    )?.popularAreas ?? [];

    const areaMatches = firestoreProperties
      .filter((property) => !selectedGovernorateName || property.city === selectedGovernorateName)
      .map((property) => property.areaName)
      .filter((area): area is string => Boolean(area && area.trim()));

    return [...new Set(governorateAreas.filter((area) => areaMatches.includes(area)))];
  }, [firestoreProperties, selectedGovernorate]);

  useEffect(() => {
    if (selectedGovernorate && selectedArea && !availableAreas.includes(selectedArea)) {
      setSelectedArea("");
    }
  }, [availableAreas, selectedArea, selectedGovernorate]);

  const filteredProperties = useMemo(() => {
    const searchText = searchQuery.trim().toLowerCase();
    const minAmount = Number(minPrice) || 0;
    const maxAmount = Number(maxPrice) || 0;
    const bedroomMinimum = Number(selectedBedrooms) || 0;

    return firestoreProperties.filter((property) => {
      if (selectedGovernorate && property.city !== selectedGovernorate) return false;
      if (selectedArea && property.areaName !== selectedArea) return false;
      if (bedroomMinimum && Number(property.bedrooms) < bedroomMinimum) return false;

      const propertyPrice = priceCurrency === "USD"
        ? Number(property.priceInUSD ?? property.price ?? 0)
        : Number(property.price ?? 0);

      if (minAmount > 0 && propertyPrice < minAmount) return false;
      if (maxAmount > 0 && propertyPrice > maxAmount) return false;

      if (!searchText) return true;

      const matchesTitle = property.title.toLowerCase().includes(searchText);
      const matchesLocation = property.location.toLowerCase().includes(searchText);
      const matchesDescription = property.description.toLowerCase().includes(searchText);
      const matchesAmenities = property.amenities?.some((amenity) =>
        amenity.toLowerCase().includes(searchText),
      );

      return matchesTitle || matchesLocation || matchesDescription || matchesAmenities;
    });
  }, [firestoreProperties, searchQuery, selectedGovernorate, selectedArea, selectedBedrooms, priceCurrency, minPrice, maxPrice]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedGovernorate) count += 1;
    if (selectedArea) count += 1;
    if (selectedBedrooms) count += 1;
    if (minPrice) count += 1;
    if (maxPrice) count += 1;
    return count;
  }, [selectedArea, selectedBedrooms, selectedGovernorate, minPrice, maxPrice]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    const newParams = new URLSearchParams(searchParams);
    if (id === "all") {
      newParams.delete("category");
      newParams.delete("type");
    } else {
      newParams.set("category", id);
      newParams.delete("type");
    }
    setSearchParams(newParams);
  };

  const handleGovernorateSelect = (governorate: string) => {
    setSelectedGovernorate(governorate);
    setSelectedArea("");
    const newParams = new URLSearchParams(searchParams);
    if (!governorate) {
      newParams.delete("city");
    } else {
      newParams.set("city", governorate);
    }
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedGovernorate("");
    setSelectedArea("");
    setSelectedBedrooms("");
    setPriceCurrency("SYP");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800 md:pb-12" dir="rtl">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-2xs">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute right-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ابحث بالمنطقة أو الميزة (المالكي، المزة، الفرقان، طاقة شمسية...)"
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-100/90 py-2.5 pr-11 pl-4 text-xs font-medium outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 md:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 p-1 text-slate-400 hover:text-slate-600"
                  aria-label="مسح البحث"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((current) => !current)}
              className="relative flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              <span>فلترة</span>
              {activeFilterCount > 0 && (
                <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCategorySelect(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <span>{filteredProperties.length} عقار متاح</span>
              {selectedGovernorate && <span className="text-brand-600">في {selectedGovernorate}</span>}
              {firestoreProperties.length > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  محدث ومباشر
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              عقارات معتمدة بمواصفات حقيقية وسندات ملكية موثقة
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-600">
              عروض حقيقية ومحدثة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}

          {filteredProperties.length === 0 && (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-8 py-16 text-center shadow-xs">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-1 text-lg font-black text-slate-900">لم نجد عقارات تطابق هذا البحث حالياً</h3>
              <p className="mx-auto mb-5 max-w-sm text-xs text-slate-500">
                جرب تغيير خيارات التصفية أو اختيار قسم عقاري آخر لعرض كافة العقارات المعروضة.
              </p>
              <button
                onClick={resetAllFilters}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-500"
              >
                عرض جميع العقارات المتاحة
              </button>
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-slate-50 animate-in slide-in-from-bottom-4 duration-200">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-xs">
            <button onClick={() => setShowFilters(false)} className="-ml-2 p-2 text-slate-500 transition-colors hover:text-slate-900" aria-label="إغلاق الفلاتر">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">تصفية العقارات</h2>
            <button onClick={resetAllFilters} className="text-sm font-bold text-brand-600 hover:text-brand-700">
              مسح الكل
            </button>
          </div>

          <div className="flex-1 space-y-6 p-5 pb-28">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">المنطقة</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedGovernorate}
                  onChange={(event) => handleGovernorateSelect(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-10 text-sm font-bold text-slate-900 outline-none shadow-xs focus:border-brand-500"
                >
                  <option value="">كل المحافظات</option>
                  {SYRIAN_GOVERNORATES.map((governorate) => (
                    <option key={governorate.id} value={governorate.name}>
                      {governorate.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">المنطقة</label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedArea}
                  onChange={(event) => setSelectedArea(event.target.value)}
                  disabled={!selectedGovernorate || availableAreas.length === 0}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-10 text-sm font-bold text-slate-900 outline-none shadow-xs focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">كل المناطق</option>
                  {availableAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">عدد الغرف</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {BEDROOM_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedBedrooms(option.value)}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                      selectedBedrooms === option.value
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-900">السعر</label>
              <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                {(["SYP", "USD"] as const).map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => setPriceCurrency(currency)}
                    className={`rounded-lg py-2 text-xs font-extrabold transition-colors ${
                      priceCurrency === currency ? "bg-white text-brand-700 shadow-xs" : "text-slate-600"
                    }`}
                  >
                    {currency === "SYP" ? "ل.س" : "$"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs font-bold text-slate-600">
                  من
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder={priceCurrency === "SYP" ? "ل.س" : "USD"}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-brand-500"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-bold text-slate-600">
                  إلى
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder={priceCurrency === "SYP" ? "ل.س" : "USD"}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-brand-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="fixed right-0 bottom-0 left-0 border-t border-slate-200 bg-white p-4 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full rounded-xl bg-brand-600 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-500 active:scale-[0.98]"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}