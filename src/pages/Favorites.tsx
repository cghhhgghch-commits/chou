import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { useFavorites } from "../lib/FavoritesContext";
import { Property } from "../types";
import PropertyCard from "../components/properties/PropertyCard";

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
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
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
      <div className="container mx-auto px-4 max-w-7xl py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-center min-h-[250px]">
          <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">المفضلة</h1>
        </div>

        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">لا توجد إعلانات مفضلة</h2>
          <p className="text-slate-500 mb-6">قم بإضافة إعلانات إلى المفضلة للرجوع إليها لاحقاً</p>
          <Link to="/properties" className="btn-primary">
            تصفح العقارات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">المفضلة</h1>
        <span className="text-sm font-bold text-slate-500">{properties.length} إعلان</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
