import { supabase } from "./supabase";
import { APP_CONFIG } from "./constants";
import type { Property } from "../types";

export async function fetchVerifiedListings(limit?: number): Promise<Property[]> {
  const request = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });
  const { data, error } = limit ? await request.limit(limit) : await request;

  if (error) throw error;

  return (data || []).map((item) => {
    const city = item.city_id || "";
    const areaName = item.area_id || "";
    const images = Array.isArray(item.images)
      ? item.images.filter((image): image is string => typeof image === "string" && image.trim().length > 0)
      : [];

    return {
      id: item.id,
      title: item.title || "عقار جديد",
      price: Number(item.price ?? 0),
      pricePeriod: item.price_period || undefined,
      priceInUSD: item.price_in_usd ? Number(item.price_in_usd) : undefined,
      location: [city, areaName].filter(Boolean).join(" - ") || "موقع غير محدد",
      city: city || "غير محدد",
      areaName,
      type: item.type || "sale",
      category: item.category || "houses",
      categoryType: item.category || "houses",
      propertyType: item.property_type || "apartment",
      ownershipType: item.ownership_type || undefined,
      finishing: item.finishing || undefined,
      solarStatus: item.solar_status || undefined,
      direction: item.direction || undefined,
      floor: item.floor || undefined,
      totalFloors: item.total_floors || undefined,
      bedrooms: item.bedrooms ?? 0,
      bathrooms: item.bathrooms ?? 0,
      salons: item.salons || undefined,
      area: Number(item.area ?? 0),
      landArea: item.land_area ? Number(item.land_area) : undefined,
      furnishing: item.furnishing || undefined,
      hasSolarPower: Boolean(item.has_solar_power),
      hasWaterWell: Boolean(item.has_water_well),
      hasElevator: Boolean(item.has_elevator),
      hasGenerator: Boolean(item.has_generator),
      description: item.description || "",
      amenities: Array.isArray(item.amenities)
        ? item.amenities.filter((amenity): amenity is string => typeof amenity === "string")
        : [],
      images,
      isVerified: Boolean(item.is_verified),
      isFeatured: Boolean(item.is_featured),
      advertiserType: item.advertiser_type || "owner",
      agent: {
        name: item.advertiser_name || "معلن",
        phone: item.phone || APP_CONFIG.adminPhone,
        whatsapp: item.whatsapp || item.phone || APP_CONFIG.adminPhone,
        avatar: "",
      },
      postedAt: item.created_at || "",
    } satisfies Property;
  });
}