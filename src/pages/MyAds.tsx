import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { Property } from "../types";

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
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
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
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">يجب تسجيل الدخول لعرض إعلاناتك.</p>
          <Link to="/login" className="mt-4 inline-block rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إعلاناتي</h1>
          <p className="text-xs text-slate-500">إدارة الإعلان الخاص بك بسرعة</p>
        </div>
        <Link to="/place-ad" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-black text-white shadow-sm">
          <Plus className="h-4 w-4" />
          إضافة إعلان جديد
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-black text-slate-900">لا توجد إعلانات منشورة بعد</p>
          <p className="mt-2 text-sm text-slate-500">ابدأ بإضافة أول إعلان واستفد من عرض العقارات لحسابك.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
            عدد الإعلانات: <span className="text-brand-600">{totalAds}</span>
          </div>

          {ads.map((ad) => (
            <div key={ad.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="flex flex-col gap-4 p-4 md:flex-row">
                <img src={ad.images[0]} alt={ad.title} className="h-36 w-full rounded-2xl object-cover md:w-48" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">{ad.title}</h2>
                      <p className="mt-1 text-xs text-slate-500">{ad.location}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-black ${ad.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {ad.status === "active" ? "نشط" : ad.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                    <span>السعر: <strong className="text-slate-900">{Number(ad.price).toLocaleString()} ل.س</strong></span>
                    <span>المساحة: <strong className="text-slate-900">{ad.area} م²</strong></span>
                    <span>الحالة: <strong className="text-slate-900">{ad.isVerified ? "موثوق" : "قيد المراجعة"}</strong></span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/property/${ad.id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-700">
                      <ExternalLink className="h-3.5 w-3.5" />
                      عرض الإعلان
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate(`/place-ad?id=${ad.id}`)}
                      className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-[11px] font-bold text-brand-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ad.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700"
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
