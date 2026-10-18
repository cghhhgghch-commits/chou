import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  X,
  Building2,
} from "lucide-react";
import { useSearchParams } from "react-router";
import PropertyCard from "../components/properties/PropertyCard";
import { fetchVerifiedListings } from "../lib/listings";
import {
  SYRIAN_CATEGORIES,
  SYRIAN_GOVERNORATES,
  SYRIAN_CATEGORY_ICONS,
} from "../lib/constants";
import { filterProperties, normalizePropertyCategory } from "../lib/propertyFilters";
import FadeContent from "../components/ui/FadeContent";
import SegmentedControl from "../components/ui/SegmentedControl";
import Dialog from "../components/ui/Dialog";

export const CATEGORY_TABS = [
  { id: "all", label: "الكل", icon: null },
  ...SYRIAN_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    icon: SYRIAN_CATEGORY_ICONS[c.id as keyof typeof SYRIAN_CATEGORY_ICONS],
  })),
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

  const initialCategory = normalizePropertyCategory(rawCategory);
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
  const {
    data: firestoreProperties = [],
    isPending: isLoadingListings,
    isError: listingsError,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ["verified-listings", "all"],
    queryFn: () => fetchVerifiedListings(),
  });

  useEffect(() => {
    const cat = searchParams.get("category") || searchParams.get("type") || "all";
    const city = searchParams.get("city") || "";
    setActiveCategory(normalizePropertyCategory(cat));
    setSelectedGovernorate(city);
    if (city !== selectedGovernorate) setSelectedArea("");
  }, [searchParams, selectedGovernorate]);

  const availableAreas = useMemo(() => {
    const selectedGovernorateName = selectedGovernorate.trim();

    return SYRIAN_GOVERNORATES.find(
      (governorate) => governorate.name === selectedGovernorateName,
    )?.popularAreas ?? [];
  }, [selectedGovernorate]);

  const filteredProperties = useMemo(() => filterProperties(firestoreProperties, {
    selectedCity: selectedGovernorate,
    selectedArea,
    bedrooms: selectedBedrooms,
    priceCurrency,
    minPrice,
    maxPrice,
    selectedCategory: activeCategory,
    searchQuery,
  }), [firestoreProperties, searchQuery, selectedGovernorate, selectedArea, selectedBedrooms, priceCurrency, minPrice, maxPrice, activeCategory]);

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
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-800 md:pb-12" dir="rtl">
      <div className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute right-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ابحث بالمنطقة أو الميزة (المالكي، المزة، الفرقان، طاقة شمسية...)"
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 py-2.5 pe-11 ps-4 text-sm font-medium text-stone-900 outline-none transition-colors focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-400 md:text-base"
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
              className="relative flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              <span>فلترة</span>
              {activeFilterCount > 0 && (
                <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 overflow-x-auto pb-1 hide-scrollbar">
            <SegmentedControl
              label="اختر نوع العقار"
              options={CATEGORY_TABS}
              value={activeCategory}
              onChange={handleCategorySelect}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-lg font-bold text-stone-900">
              <span aria-live="polite">{isLoadingListings ? "جارٍ تحميل العقارات" : `${filteredProperties.length} عقار متاح`}</span>
              {selectedGovernorate && <span className="text-brand-600">في {selectedGovernorate}</span>}
              {firestoreProperties.length > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  محدث ومباشر
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              تصفّح حسب النوع والموقع والسعر، وتواصل مع المعلن مباشرة.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-stone-500">إعلانات متاحة من المعلنين</span>
          </div>
        </div>

        {isLoadingListings ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="جارٍ تحميل العقارات">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                <div className="aspect-[4/3] animate-pulse bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-stone-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <FadeContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.045}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}

            {filteredProperties.length === 0 && (
              <div className="col-span-full rounded-lg border border-stone-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-stone-100">
                  <Search className="h-6 w-6 text-stone-500" />
                </div>
                <h3 className="mb-1 text-lg font-bold text-stone-900">{listingsError ? "تعذر تحميل العقارات" : "لم نجد عقارات تطابق هذا البحث"}</h3>
                <p className="mx-auto mb-5 max-w-sm text-sm text-stone-600">
                  {listingsError ? "تحقق من اتصالك ثم أعد المحاولة." : "جرّب تغيير كلمات البحث أو خيارات التصفية."}
                </p>
                <button
                  onClick={() => listingsError ? void refetchListings() : resetAllFilters()}
                  className="min-h-11 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                >
                  {listingsError ? "إعادة المحاولة" : "مسح الفلاتر"}
                </button>
              </div>
            )}
          </FadeContent>
        )}
      </div>

      <Dialog
        open={showFilters}
        onOpenChange={setShowFilters}
        title="تصفية العقارات"
        description="اختر المحافظة والمنطقة وعدد الغرف وحدود السعر لتصفية النتائج."
        contentClassName="flex max-h-[94dvh] w-full flex-col overflow-y-auto bg-stone-50 sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-lg sm:border sm:border-stone-200 sm:bg-white"
      >
          <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
            <button onClick={() => setShowFilters(false)} className="-ml-2 p-2 text-slate-500 transition-colors hover:text-slate-900" aria-label="إغلاق الفلاتر">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">تصفية العقارات</h2>
            <button onClick={resetAllFilters} className="text-sm font-bold text-brand-600 hover:text-brand-700">
              مسح الكل
            </button>
          </div>

          <div className="flex-1 space-y-6 p-5 pb-28 sm:grid sm:grid-cols-2 sm:items-start sm:gap-x-5 sm:gap-y-6 sm:space-y-0">
            <div>
              <label htmlFor="property-governorate" className="mb-2 block text-sm font-bold text-slate-900">المحافظة</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="property-governorate"
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
              <label htmlFor="property-area" className="mb-2 block text-sm font-bold text-slate-900">الحي أو المنطقة (اختياري)</label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="property-area"
                  list="property-area-suggestions"
                  value={selectedArea}
                  onChange={(event) => setSelectedArea(event.target.value)}
                  disabled={!selectedGovernorate}
                  placeholder={selectedGovernorate === "حلب"
                    ? "ابحث عن حي حلب أو اختره"
                    : selectedGovernorate
                      ? "اكتب اسم الحي أو البلدة"
                      : "اختر المحافظة أولاً"}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-12 pl-10 text-sm font-bold text-slate-900 outline-none shadow-xs placeholder:text-slate-400 focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  autoComplete="off"
                />
                <datalist id="property-area-suggestions">
                  {availableAreas.map((area) => (
                    <option key={area} value={area} />
                  ))}
                </datalist>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                أحياء وبلدات حلب تظهر كاقتراحات؛ في المحافظات الأخرى اكتب اسم الحي أو البلدة.
              </p>
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
              <SegmentedControl
                label="عملة السعر"
                options={[{ id: "SYP", label: "ل.س" }, { id: "USD", label: "$" }]}
                value={priceCurrency}
                onChange={(currency) => setPriceCurrency(currency as "SYP" | "USD")}
                className="mb-3 w-full justify-center"
              />
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

          <div className="sticky bottom-0 border-t border-stone-200 bg-white p-4 pb-safe">
            <button
              onClick={() => setShowFilters(false)}
              className="min-h-11 w-full rounded-lg bg-brand-500 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-600"
            >
              تطبيق الفلاتر
            </button>
          </div>
      </Dialog>
    </div>
  );
}