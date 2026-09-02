import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Loader,
  Search,
  Home as HomeIcon,
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface PropertyListing {
  id: string;
  title: string;
  category: string;
  type: string;
  city: string;
  price: number;
  area: number;
  images: string[];
  description?: string;
  createdAt: any;
  userEmail?: string;
}

const ADMIN_AMENITIES = [
  "منظومة طاقة شمسية وإنفيرتر",
  "مصعد حديث شغال",
  "مولدة كهرباء / خط أمبير",
  "بئر ماء ارتوازي عذب",
  "خزان ماء إضافي ومضخة",
  "حديقة خاصة ومشجرة",
  "مسبح مفلتر خاص",
  "تدفئة مركزية",
  "موقف سيارة مسور",
  "واجهة واسعة وممرات",
  "كاميرات مراقبة",
  "بوابة آمنة",
];

const PROFESSIONAL_PROPERTY_CATEGORIES = [
  { id: "houses", label: "منازل" },
  { id: "villas", label: "فلل" },
  { id: "buildings", label: "بنايات" },
  { id: "shops", label: "محلات" },
  { id: "farms", label: "مزارع" },
  { id: "lands", label: "أراضي" },
  { id: "factories", label: "مصانع" },
  { id: "other", label: "أخرى" },
];

const PROPERTY_TYPES = [
  { value: "sale", label: "بيع" },
  { value: "rent", label: "إيجار" },
  { value: "offplan", label: "على العظم" },
];

const OWNERSHIP_TYPES = [
  "طابو أخضر 2400 سهم (سجل عقاري نظامي)",
  "حكم محكمة مبرم ومكتسب الدرجة القطعية",
  "وكالة كاتب عدل خاصة غير قابلة للعزل",
  "طابو زراعي أسهم مشاع",
  "فروغ تجاري نظامي وسند ملكية",
  "جمعية سكنية / إسكان رسمي",
  "عقد بيع قطعي وتنازل فوري",
];

const FINISHING_TYPES = [
  "سوبر ديلوكس حديث (تشطيب VIP)",
  "ديلوكس ممتاز",
  "إكساء عادي نظيف وجاهز للسكن",
  "على العظم / الهيكل (قيد الإكساء)",
  "مفروش بالكامل VIP",
  "مفروش عادي",
  "يحتاج صيانة وترميم جزئي",
];

const SYRIAN_CITIES = [
  "حلب",
  "ريف حلب",
  "منبج",
  "أعزاز",
  "الباب",
  "عفرين",
  "جرابلس",
  "السفيرة",
  "عين العرب",
  "الدانا",
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { signOut, isAdmin, user } = useAuth();
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"dashboard" | "listings" | "create">("dashboard");

  const [formData, setFormData] = useState({
    title: "",
    category: "houses",
    type: "sale",
    city: "دمشق",
    price: "",
    priceInUSD: "",
    area: "",
    landArea: "",
    bedrooms: "3",
    bathrooms: "2",
    floor: "الطابق الثاني",
    totalFloors: "4",
    ownershipType: OWNERSHIP_TYPES[0],
    finishing: FINISHING_TYPES[0],
    direction: "قبلي غربي (مشمس)",
    furnishing: "غير مفروش",
    neighborhood: "",
    advertiserName: user?.displayName || "مسؤول العقارات",
    phone: user?.phoneNumber || "+963",
    whatsapp: user?.phoneNumber || "+963",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "منظومة طاقة شمسية وإنفيرتر",
    "خزان ماء إضافي ومضخة",
    "موقف سيارة مسور",
  ]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data || []).map((item) => ({
        id: item.id,
        title: item.title || "",
        category: item.category || "houses",
        type: item.type || "sale",
        city: item.city_id || item.city || "دمشق",
        price: Number(item.price || 0),
        area: Number(item.area || 0),
        images: Array.isArray(item.images) ? item.images : [],
        description: item.description || "",
        createdAt: item.created_at,
        userEmail: item.user_email || item.userEmail,
      }) as PropertyListing);
      setListings(rows);
      setFilteredListings(rows);
    } catch (error) {
      console.error("خطأ في جلب الإعلانات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchListings();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, categoryFilter, listings]);

  const handleDeleteListing = async (id: string) => {
    if (confirm("هل تريد حذف هذا الإعلان نهائياً؟")) {
      try {
        const { error } = await supabase.from("listings").delete().eq("id", id);
        if (error) throw error;
        setListings((current) => current.filter((item) => item.id !== id));
        alert("تم حذف الإعلان بنجاح");
      } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("حدث خطأ في حذف الإعلان");
      }
    }
  };

  const clearDemoListings = async () => {
    if (!confirm("هل تريد حذف جميع الإعلانات التجريبية؟")) return;

    try {
      const demoIds = listings
        .filter((item) => item.userEmail === "admin@system" || item.title.toLowerCase().includes("demo"))
        .map((item) => item.id);

      if (demoIds.length === 0) {
        alert("لا توجد إعلانات تجريبية للحذف");
        return;
      }

      const { error } = await supabase.from("listings").delete().in("id", demoIds);
      if (error) throw error;
      setListings((current) => current.filter((item) => !demoIds.includes(item.id)));
      alert(`تم حذف ${demoIds.length} إعلان تجريبي`);
    } catch (error) {
      console.error("خطأ في حذف الإعلانات التجريبية:", error);
      alert("حدث خطأ أثناء حذف الإعلانات التجريبية");
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.city || !formData.price || !formData.area) {
      alert("يرجى إدخال عنوان الإعلان، المدينة، السعر، والمساحة قبل الحفظ.");
      return;
    }

    try {
      const newListing = {
        title: formData.title.trim(),
        category: formData.category,
        type: formData.type,
        city: formData.city,
        city_id: formData.city,
        price: Number(formData.price),
        price_in_usd: formData.priceInUSD ? Number(formData.priceInUSD) : null,
        area: Number(formData.area),
        land_area: formData.landArea ? Number(formData.landArea) : 0,
        bedrooms: formData.bedrooms || "3",
        bathrooms: Number(formData.bathrooms) || 2,
        floor: formData.floor,
        total_floors: formData.totalFloors,
        ownership_type: formData.ownershipType,
        finishing: formData.finishing,
        direction: formData.direction,
        furnishing: formData.furnishing,
        neighborhood: formData.neighborhood,
        advertiser_name: formData.advertiserName || "مسؤول العقارات",
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        amenities: selectedAmenities,
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
        is_verified: true,
        status: "active",
        created_at: new Date().toISOString(),
        user_email: user?.email || "admin@system",
        user_id: user?.id || "admin-user",
      };

      const { data, error: insertError } = await supabase.from("listings").insert(newListing).select().single();
      if (insertError) throw insertError;
      setListings((current) => [
        {
          id: data.id,
          ...newListing,
          createdAt: new Date(),
        },
        ...current,
      ]);

      setFormData({
        title: "",
        category: "houses",
        type: "sale",
        city: "دمشق",
        price: "",
        priceInUSD: "",
        area: "",
        landArea: "",
        bedrooms: "3",
        bathrooms: "2",
        floor: "الطابق الثاني",
        totalFloors: "4",
        ownershipType: OWNERSHIP_TYPES[0],
        finishing: FINISHING_TYPES[0],
        direction: "قبلي غربي (مشمس)",
        furnishing: "غير مفروش",
        neighborhood: "",
        advertiserName: user?.displayName || "مسؤول العقارات",
        phone: user?.phoneNumber || "+963",
        whatsapp: user?.phoneNumber || "+963",
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      });
      setSelectedAmenities(["منظومة طاقة شمسية وإنفيرتر", "خزان ماء إضافي ومضخة", "موقف سيارة مسور"]);
      setActiveTab("listings");
      alert("تم إنشاء الإعلان الاحترافي بنجاح ✅");
    } catch (error) {
      console.error("خطأ في الإنشاء:", error);
      alert("حدث خطأ في إنشاء الإعلان الاحترافي");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">لوحة التحكم الإدارية</h1>
              <p className="text-xs text-slate-500">مرحباً بك أيها المسؤول</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="flex max-w-7xl mx-auto px-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === "dashboard"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              لوحة المعلومات
            </div>
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === "listings"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              الإعلانات
            </div>
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${
              activeTab === "create"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إنشاء إعلان
            </div>
          </button>
        </div>
      </div>

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 font-bold mb-1">إجمالي الإعلانات</div>
                    <div className="text-4xl font-black text-slate-900">{listings.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 font-bold mb-1">للإيجار</div>
                    <div className="text-4xl font-black text-slate-900">
                      {listings.filter((item) => item.type === "rent").length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 font-bold mb-1">للبيع</div>
                    <div className="text-4xl font-black text-slate-900">
                      {listings.filter((item) => item.type === "sell").length}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900">أحدث الإعلانات</h2>
                <span className="text-xs text-slate-500">مباشرة</span>
              </div>

              {listings.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">
                      {item.city} • {item.price.toLocaleString()} ل.س
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                    {item.type === "sell" ? "بيع" : "إيجار"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن إعلان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">جميع الفئات</option>
                  <option value="houses">منازل</option>
                  <option value="villas">فلل</option>
                  <option value="lands">أراضي</option>
                  <option value="shops">محلات</option>
                  <option value="factories">مصانع</option>
                </select>

                <button
                  type="button"
                  onClick={clearDemoListings}
                  className="px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                >
                  مسح التجريبية
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader className="w-8 h-8 animate-spin text-brand-600" />
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-600 font-bold">لا توجد إعلانات</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-xs font-black text-slate-700">العنوان</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-700">الفئة</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-700">النوع</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-700">السعر</th>
                        <th className="px-6 py-3 text-xs font-black text-slate-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredListings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{item.title.substring(0, 30)}...</td>
                          <td className="px-6 py-4 text-slate-600">{item.category}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold">
                              {item.type === "sell" ? "بيع" : "إيجار"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">{item.price.toLocaleString()} ل.س</td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => navigate(`/property/${item.id}`)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteListing(item.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6">إنشاء إعلان جديد</h2>

              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="العنوان"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />

                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="houses">منازل</option>
                    <option value="villas">فلل</option>
                    <option value="lands">أراضي</option>
                    <option value="shops">محلات</option>
                    <option value="factories">مصانع</option>
                  </select>

                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="sell">بيع</option>
                    <option value="rent">إيجار</option>
                  </select>

                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {SYRIAN_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="السعر (ل.س)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />

                  <input
                    type="number"
                    placeholder="المساحة (م²)"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <textarea
                  placeholder="الوصف"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={4}
                />

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-black rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    نشر الإعلان
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      title: "",
                      category: "houses",
                      type: "sale",
                      city: "دمشق",
                      price: "",
                      priceInUSD: "",
                      area: "",
                      landArea: "",
                      bedrooms: "3",
                      bathrooms: "2",
                      floor: "الطابق الثاني",
                      totalFloors: "4",
                      ownershipType: OWNERSHIP_TYPES[0],
                      finishing: FINISHING_TYPES[0],
                      direction: "قبلي غربي (مشمس)",
                      furnishing: "غير مفروش",
                      neighborhood: "",
                      advertiserName: user?.displayName || "مسؤول العقارات",
                      phone: user?.phoneNumber || "+963",
                      whatsapp: user?.phoneNumber || "+963",
                      description: "",
                      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                    })}
                    className="px-6 py-3 bg-slate-200 text-slate-800 font-black rounded-xl hover:bg-slate-300 transition-all"
                  >
                    إفراغ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
