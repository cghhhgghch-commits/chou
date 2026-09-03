import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAdmin } from "../lib/AdminContext";
import { supabase } from "../lib/supabase";
import { LayoutDashboard, LogOut, Plus, Edit, Trash2, Eye, AlertCircle, Loader, Filter, Search } from "lucide-react";

interface PropertyListing {
  id: string;
  title: string;
  category: string;
  type: string;
  city: string;
  price: number;
  area: number;
  images: string[];
  createdAt: any;
  userEmail?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminEmail, logoutAdmin, isAdmin } = useAdmin();
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "houses",
    type: "sell",
    city: "دمشق",
    price: 0,
    area: 0,
    description: "",
  });

  // التحقق من صلاحيات الوصول
  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  // جلب الإعلانات من Supabase
  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const items = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        type: item.type,
        city: item.city_id || item.city || "دمشق",
        price: Number(item.price || 0),
        area: Number(item.area || 0),
        images: Array.isArray(item.images) ? item.images : [],
        createdAt: item.created_at,
        userEmail: item.user_email || item.advertiser_name,
      } as PropertyListing));
      setListings(items);
      setFilteredListings(items);
    } catch (error) {
      console.error("خطأ في جلب الإعلانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث البحث والفلترة
  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.includes(searchTerm) ||
          item.city.includes(searchTerm) ||
          item.userEmail?.includes(searchTerm)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, categoryFilter, listings]);

  // حذف إعلان
  const handleDeleteListing = async (id: string) => {
    if (confirm("هل تريد حذف هذا الإعلان نهائياً؟")) {
      try {
        const { error } = await supabase.from("listings").delete().eq("id", id);
        if (error) throw error;
        setListings(listings.filter((item) => item.id !== id));
        alert("تم حذف الإعلان بنجاح");
      } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("حدث خطأ في حذف الإعلان");
      }
    }
  };

  // إنشاء إعلان جديد
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newListing = {
        title: formData.title,
        category: formData.category,
        type: formData.type,
        city_id: formData.city,
        city: formData.city,
        price: Number(formData.price),
        area: Number(formData.area),
        description: formData.description,
        created_at: new Date().toISOString(),
        user_email: "admin@system",
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
        is_verified: true,
      };

      const { data, error } = await supabase.from("listings").insert(newListing).select().single();
      if (error) throw error;
      setListings([...listings, { id: data.id, ...newListing, createdAt: new Date() }]);
      setFormData({
        title: "",
        category: "houses",
        type: "sell",
        city: "دمشق",
        price: 0,
        area: 0,
        description: "",
      });
      setShowCreateForm(false);
      alert("تم إنشاء الإعلان بنجاح");
    } catch (error) {
      console.error("خطأ في الإنشاء:", error);
      alert("حدث خطأ في إنشاء الإعلان");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">لوحة التحكم الإدارية</h1>
              <p className="text-xs text-slate-500">مرحباً، {adminEmail}</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await logoutAdmin();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 font-bold mb-1">إجمالي الإعلانات</div>
            <div className="text-3xl font-black text-slate-900">{listings.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 font-bold mb-1">إعلانات للبيع</div>
            <div className="text-3xl font-black text-slate-900">
              {listings.filter((item) => item.type === "sell").length}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="text-sm text-slate-600 font-bold mb-1">إعلانات للإيجار</div>
            <div className="text-3xl font-black text-slate-900">
              {listings.filter((item) => item.type === "rent").length}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            إنشاء إعلان جديد
          </button>

          <input
            type="text"
            placeholder="ابحث عن إعلان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">جميع الفئات</option>
            <option value="houses">منازل</option>
            <option value="villas">فلل</option>
            <option value="lands">أراضي</option>
            <option value="shops">محلات</option>
            <option value="factories">مصانع</option>
          </select>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateListing} className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-4">
            <h2 className="text-lg font-black text-slate-900 mb-4">إنشاء إعلان جديد</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="العنوان"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="sell">بيع</option>
                <option value="rent">إيجار</option>
                <option value="offplan">على العظم</option>
              </select>

              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="حلب">حلب</option>
                <option value="ريف حلب">ريف حلب</option>
                <option value="منبج">منبج</option>
                <option value="أعزاز">أعزاز</option>
                <option value="الباب">الباب</option>
              </select>

              <input
                type="number"
                placeholder="السعر"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />

              <input
                type="number"
                placeholder="المساحة (م²)"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <textarea
              placeholder="الوصف"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={3}
            />

            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700">
                إنشاء
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Listings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">العنوان</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">الفئة</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">النوع</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">المدينة</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">السعر</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">المساحة</th>
                    <th className="px-6 py-3 text-xs font-black text-slate-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredListings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold">
                          {item.type === "sell" ? "بيع" : item.type === "rent" ? "إيجار" : "على العظم"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.city}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {item.price.toLocaleString()} ل.س
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.area} م²</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
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
      </main>
    </div>
  );
}
