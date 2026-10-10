import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { Property } from "../types";
import Image from "../components/ui/Image";
import { PROPERTY_IMAGE_FALLBACK } from "../config/images";
import Skeleton from "../components/ui/Skeleton";

export default function MyAds() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAds([]);
      setLoading(false);
      return;
    }

    const fetchMyAds = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        const rows = (data || []).map((item) => ({
          id: item.id,
          title: item.title || "إعلان",
          price: Number(item.price || 0),
          pricePeriod: item.price_period || undefined,
          location: `${item.city_id || ""} ${item.area_id ? `- ${item.area_id}` : ""}`.trim() || "حلب",
          city: item.city_id || "حلب",
          category: item.category || "houses",
          type: item.type || "sale",
          area: Number(item.area || 0),
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [PROPERTY_IMAGE_FALLBACK],
          status: item.status || "active",
          isVerified: Boolean(item.is_verified),
          description: item.description || "",
          agent: {
            name: item.advertiser_name || "أنا",
            phone: item.phone || "",
            whatsapp: item.whatsapp || item.phone || "",
          },
          postedAt: "معلن الآن",
        } as Property));
        setAds(rows);
      } catch (error) {
        console.warn("Failed to fetch my ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل تريد حذف هذا الإعلان؟")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (!error) setAds((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAds = useMemo(() => ads.length, [ads]);

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-sm text-stone-700">يجب تسجيل الدخول لعرض إعلاناتك.</p>
          <Link to="/login" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row">
              <Skeleton className="aspect-[4/3] w-full sm:w-48" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">إعلاناتي</h1>
          <p className="text-sm text-stone-600">إدارة الإعلان الخاص بك بسرعة</p>
        </div>
        <Link to="/place-ad" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white">
          <Plus className="h-4 w-4" />
          إضافة إعلان جديد
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center">
          <Building2 className="mx-auto mb-3 h-8 w-8 text-stone-500" />
          <p className="text-lg font-bold text-stone-900">لا توجد إعلانات منشورة بعد</p>
          <p className="mt-2 text-sm text-stone-600">ابدأ بإضافة أول إعلان واستفد من عرض العقارات لحسابك.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-800">
            عدد الإعلانات: <span className="text-brand-600">{totalAds}</span>
          </div>

          {ads.map((ad) => (
            <div key={ad.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
              <div className="flex flex-col gap-4 p-4 md:flex-row">
                <Image src={ad.images[0]} alt={ad.title} containerClassName="w-full rounded-xl md:w-48" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">{ad.title}</h2>
                      <p className="mt-1 text-sm text-stone-600">{ad.location}</p>
                    </div>
                    <span className={`rounded-md border px-2 py-1 text-xs font-bold ${ad.status === "active" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                      {ad.status === "active" ? "نشط" : ad.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-stone-600">
                    <span>السعر: <strong className="text-stone-900">{Number(ad.price).toLocaleString()} ل.س</strong></span>
                    <span>المساحة: <strong className="text-stone-900">{ad.area} م²</strong></span>
                    <span>الحالة: <strong className="text-stone-900">{ad.isVerified ? "موثوق" : "قيد المراجعة"}</strong></span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/property/${ad.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-800">
                      <ExternalLink className="h-3.5 w-3.5" />
                      عرض الإعلان
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate(`/place-ad?id=${ad.id}`)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-800 hover:border-brand-300 hover:text-brand-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ad.id)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-500 bg-white px-3 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
