import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { useFavorites } from "../lib/FavoritesContext";
import { Property } from "../types";
import PropertyCard from "../components/properties/PropertyCard";
import { PROPERTY_IMAGE_FALLBACK } from "../config/images";
import Skeleton from "../components/ui/Skeleton";

export default function Favorites() {
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    const fetchFavoriteProperties = async () => {
      setLoading(true);
      try {
        const { data: listingRows, error } = await supabase
          .from("listings")
          .select("*")
          .in("id", favoriteIds)
          .eq("status", "active");

        if (error) throw error;

        const items = (listingRows || []).map((data) => ({
          id: data.id,
          title: data.title || "عقار",
          price: Number(data.price || 0),
          pricePeriod: data.price_period || undefined,
          priceInUSD: data.price_in_usd || undefined,
          location: `${data.city_id || ""} ${data.area_id ? `- ${data.area_id}` : ""}`.trim() || "حلب",
          city: data.city_id || "حلب",
          areaName: data.area_id || "",
          type: data.type || "sale",
          category: data.category || "houses",
          categoryType: data.category || "houses",
          propertyType: data.property_type || "apartment",
          ownershipType: data.ownership_type || "طابو أخضر",
          finishing: data.finishing || "سوبر ديلوكس",
          solarStatus: data.solar_status || "منظومة طاقة شمسية كاملة",
          direction: data.direction || "قبلي",
          floor: data.floor || "الطابق الثاني",
          totalFloors: data.total_floors || "",
          bedrooms: data.bedrooms || "3",
          bathrooms: Number(data.bathrooms || 2),
          salons: data.salons || "صالون",
          area: Number(data.area || 120),
          landArea: data.land_area || undefined,
          furnishing: data.furnishing || "غير مفروش",
          hasSolarPower: Boolean(data.has_solar_power),
          hasWaterWell: Boolean(data.has_water_well),
          hasElevator: Boolean(data.has_elevator),
          hasGenerator: Boolean(data.has_generator),
          description: data.description || "",
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [PROPERTY_IMAGE_FALLBACK],
          isVerified: Boolean(data.is_verified),
          isFeatured: Boolean(data.is_featured),
          advertiserType: data.advertiser_type || "owner",
          agent: {
            name: data.advertiser_name || "معلن موثوق",
            phone: data.phone || "+963912345678",
            whatsapp: data.whatsapp || data.phone || "+963912345678",
            avatar: data.avatar || "",
          },
          postedAt: "جديد اليوم",
        } as Property));

        setProperties(items);
      } catch (error) {
        console.warn("Failed to fetch favorite properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favoriteIds]);

  if (favoritesLoading || loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton width={120} height={32} />
          <Skeleton width={72} height={24} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border border-stone-200 bg-white p-3">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="mt-4 h-5 w-2/5" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-3 h-4 w-3/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">المفضلة</h1>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">لا توجد إعلانات مفضلة</h2>
          <p className="mb-6 text-sm leading-7 text-stone-600">قم بإضافة إعلانات إلى المفضلة للرجوع إليها لاحقاً</p>
          <Link to="/properties" className="btn-primary inline-flex min-h-11 items-center justify-center">
            تصفح العقارات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">المفضلة</h1>
        <span className="text-sm font-medium text-stone-600">{properties.length} إعلان</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
