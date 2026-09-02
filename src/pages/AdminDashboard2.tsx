import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAdmin } from "../lib/AdminContext";
import { supabase } from "../lib/supabase";
import {
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  AlertCircle,
  Loader,
  Eye,
  Building2,
  Check,
  X,
} from "lucide-react";
import { SYRIAN_CITIES } from "../lib/constants";

interface PropertyListing {
  id: string;
  title: string;
  category: string;
  type: string;
  city: string;
  price: string;
  area: string;
  bedrooms?: string;
  bathrooms?: string;
  images?: string[];
  videos?: string[];
  description?: string;
  status?: "active" | "pending" | "approved" | "rejected";
  createdAt?: any;
  userEmail?: string;
}

const normalizeListing = (row: any): PropertyListing => ({
  id: row.id,
  title: row.title || "إعلان بدون عنوان",
  category: row.category || "houses",
  type: row.type || "sale",
  city: row.city_id || row.city || "دمشق",
  price: String(row.price ?? 0),
  area: String(row.area ?? 0),
  bedrooms: row.bedrooms != null ? String(row.bedrooms) : undefined,
  bathrooms: row.bathrooms != null ? String(row.bathrooms) : undefined,
  images: Array.isArray(row.images) ? row.images.filter(Boolean) : row.images ? [row.images] : [],
  videos: Array.isArray(row.videos) ? row.videos.filter(Boolean) : row.videos ? [row.videos] : [],
  description: row.description || "",
  createdAt: row.created_at,
  userEmail: row.user_email || row.user_id || "admin",
});

interface WhatsAppLead {
  id: string;
  message: string;
  status: "active" | "pending" | "approved" | "rejected";
  createdAt?: any;
  parsedData?: {
    title?: string;
    city?: string;
    price?: string;
    area?: string;
    category?: string;
    description?: string;
  };
}

const CATEGORIES = [
  { id: "houses", label: "🏠 منازل" },
  { id: "villas", label: "🏰 فلل" },
  { id: "buildings", label: "🏢 بنايات" },
  { id: "shops", label: "🏬 محلات" },
  { id: "farms", label: "🌾 مزارع" },
  { id: "lands", label: "🗺️ أراضي" },
  { id: "factories", label: "🏭 مصانع" },
];

const DEAL_TYPES = [
  { value: "sale", label: "بيع" },
  { value: "rent", label: "إيجار" },
  { value: "offplan", label: "على العظم" },
];

export default function AdminDashboard2() {
  const navigate = useNavigate();
  const { adminEmail, isAdmin, logoutAdmin, adminUser, isLoading } = useAdmin();

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [pendingLeads, setPendingLeads] = useState<WhatsAppLead[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "houses",
    type: "sale",
    city: "دمشق",
    price: "",
    area: "",
    bedrooms: "3",
    bathrooms: "2",
    description: "",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
    videos: [""],
  });

  const parseWhatsAppLead = (message: string) => {
    const text = message.trim();
    if (!text) return;

    const normalized = text.replace(/\s+/g, " ");
    const priceMatch = normalized.match(/(\d[\d,]{2,})\s*(ل\.س|للس|ل\.س|SYP|USD|دولار)/i);
    const areaMatch = normalized.match(/(\d{2,5})\s*(م²|م2|متر مربع|متر|م\²)/i);
    const phoneMatch = normalized.match(/(\+?963[\d\s-]{8,}|0\d{9,10})/);
    const cityMatch = SYRIAN_CITIES.find((city) => normalized.toLowerCase().includes(city.toLowerCase()));
    const categoryMatch = [
      { key: "houses", terms: ["بيت", "شقة", "منزل", "أرضي", "دبلكس", "شقق"] },
      { key: "villas", terms: ["فيلا", "فلل", "قصور"] },
      { key: "lands", terms: ["أرض", "قطعة", "مقاسم", "مزرعة", "أراضي"] },
      { key: "shops", terms: ["محل", "مركز تجاري", "تجاري", "موقف تجاري"] },
      { key: "farms", terms: ["مزرعة", "استراحة", "بستان"] },
      { key: "factories", terms: ["مصنع", "منشأة", "مستودع"] },
    ].find((item) => item.terms.some((term) => normalized.toLowerCase().includes(term.toLowerCase())));

    const guessedTitle = normalized.length > 60 ? normalized.slice(0, 60).trim() + "..." : normalized;

    setFormData((prev) => ({
      ...prev,
      title: prev.title || guessedTitle,
      city: cityMatch || prev.city,
      price: priceMatch ? priceMatch[1].replace(/,/g, "") : prev.price,
      area: areaMatch ? areaMatch[1] : prev.area,
      category: categoryMatch?.key || prev.category,
      description: prev.description || normalized,
      bedrooms: prev.bedrooms || "3",
      bathrooms: prev.bathrooms || "2",
    }));

    if (phoneMatch) {
      setFormData((prev) => ({
        ...prev,
        description: `${prev.description || normalized}\n\nرقم الاتصال: ${phoneMatch[0].trim()}`,
      }));
    }
  };

  const saveLeadToQueue = async () => {
    const trimmed = whatsappMessage.trim();
    if (!trimmed) {
      alert("أدخل نص رسالة الواتساب أولاً");
      return;
    }

    try {
      const parsedData = {
        title: formData.title || trimmed.slice(0, 80),
        city: formData.city,
        price: formData.price,
        area: formData.area,
        category: formData.category,
        description: formData.description || trimmed,
      };

      const { data: lead, error: leadError } = await supabase.from("whatsapp_leads").insert({
        message: trimmed,
        status: "pending",
        parsed_data: parsedData,
        created_at: new Date().toISOString(),
      }).select().single();

      if (leadError) {
        if (String(leadError.message).includes("does not exist") || String(leadError.message).includes("relation \"whatsapp_leads\"")) {
          setPendingLeads((prev) => prev);
          alert("⚠️ جدول طلبات الواتساب غير مفعّل بعد، لكن النموذج ما زال يعمل بشكل آمن.");
          return;
        }
        throw leadError;
      }

      setPendingLeads((prev) => [{
        id: lead.id,
        message: trimmed,
        status: "pending",
        parsedData,
        createdAt: new Date(),
      }, ...prev]);

      setWhatsappMessage("");
      setFormData((prev) => ({
        ...prev,
        title: "",
        city: "دمشق",
        price: "",
        area: "",
        description: "",
      }));

      alert("✅ تم حفظ رسالة الواتساب في قائمة الطلبات الجديدة");
    } catch (error) {
      console.error("Failed to save whatsapp lead:", error);
      alert("❌ فشل حفظ رسالة الواتساب");
    }
  };

  const openLeadAsDraft = (lead: WhatsAppLead) => {
    const parsed = lead.parsedData || {};
    setWhatsappMessage(lead.message);
    setFormData((prev) => ({
      ...prev,
      title: parsed.title || prev.title || "",
      city: parsed.city || prev.city || "دمشق",
      price: parsed.price || prev.price || "",
      area: parsed.area || prev.area || "",
      category: parsed.category || prev.category || "houses",
      description: parsed.description || lead.message || prev.description || "",
    }));
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rejectLead = async (leadId: string) => {
    try {
      const { error } = await supabase.from("whatsapp_leads").update({ status: "rejected" }).eq("id", leadId);
      if (error) throw error;
      setPendingLeads((prev) => prev.filter((item) => item.id !== leadId));
      alert("✅ تم رفض الطلب واستبعاده من قائمة المراجعة");
    } catch (error) {
      console.error("Failed to reject lead:", error);
      alert("❌ فشل في رفض الطلب");
    }
  };

  // التحقق من الصلاحيات
  useEffect(() => {
    if (isLoading) return;

    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    fetchListings();
  }, [isAdmin, isLoading, navigate]);

  // جلب الإعلانات
  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data: listingRows, error: listingError } = await supabase.from("listings").select("*");
      if (listingError) throw listingError;
      const normalizedListings = (listingRows || []).map(normalizeListing);
      setListings(normalizedListings);

      try {
        const { data: leadRows, error: leadError } = await supabase.from("whatsapp_leads").select("*").order("created_at", { ascending: false });
        if (leadError) {
          if (String(leadError.message).includes("does not exist") || String(leadError.message).includes("relation \"whatsapp_leads\"")) {
            setPendingLeads([]);
          } else {
            throw leadError;
          }
        } else {
          const leads = (leadRows || []).map((item) => ({
            id: item.id,
            message: item.message,
            status: item.status,
            createdAt: item.created_at,
            parsedData: item.parsed_data,
          })) as WhatsAppLead[];
          setPendingLeads(leads.filter((lead) => lead.status === "pending"));
        }
      } catch (leadError) {
        console.warn("Whatsapp leads table not available yet:", leadError);
        setPendingLeads([]);
      }
    } catch (error) {
      console.error("خطأ في جلب الإعلانات:", error);
      alert("فشل في جلب الإعلانات. تأكد من أن جداول Supabase تم إنشاؤها بشكل صحيح.");
    } finally {
      setLoading(false);
    }
  };

  // تصفية الإعلانات
  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, categoryFilter, listings]);

  // حذف إعلان
  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الإعلان؟")) return;

    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
      setListings((prev) => prev.filter((item) => item.id !== id));
      alert("✅ تم حذف الإعلان بنجاح");
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("❌ فشل حذف الإعلان");
    }
  };

  const handleModerate = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase.from("listings").update({
        status: approved ? "active" : "rejected",
        is_verified: approved,
      }).eq("id", id);
      if (error) throw error;
      setListings((current) => current.map((item) => (
        item.id === id ? { ...item, status: approved ? "active" : "rejected" } : item
      )));
      alert(approved ? "✅ تمت الموافقة على الإعلان" : "✅ تم رفض الإعلان");
    } catch (error) {
      console.error("Failed to moderate listing:", error);
      alert("❌ تعذرت معالجة الإعلان");
    }
  };

  // حفظ الإعلان (إنشاء أو تحديث)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price || !formData.area) {
      alert("⚠️ يرجى ملء عنوان الإعلان والسعر والمساحة قبل الحفظ");
      return;
    }

    setIsSubmitting(true);
    try {
      const safeImages = (formData.images || []).filter(Boolean);
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        type: formData.type,
        city_id: formData.city,
        price: Number(formData.price) || 0,
        area: Number(formData.area) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        description: formData.description.trim(),
        images: safeImages.length ? safeImages : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
        videos: (formData.videos || []).filter(Boolean),
        status: "active",
        user_id: adminUser?.uid || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from("listings").update(payload).eq("id", editingId);
        if (error) throw error;
        setListings((prev) => prev.map((item) => (item.id === editingId ? normalizeListing({ ...item, ...payload, id: editingId }) : item)));
        alert("✅ تم تحديث الإعلان بنجاح");
      } else {
        const { data, error } = await supabase.from("listings").insert({
          ...payload,
          created_at: new Date().toISOString(),
        }).select().single();
        if (error) throw error;
        setListings((prev) => [...prev, normalizeListing(data)]);

        const propertyMessage = {
          title: `🏠 تم إضافة عقار جديد (${formData.title})`,
          message: `تم إضافة ${formData.title} في ${formData.city} بنجاح، والآن يمكن للمستخدمين رؤيته في القائمة العامة.`,
          type: "new_property" as const,
          propertyId: data.id,
          propertyTitle: formData.title,
          cityName: formData.city,
          iconType: "building" as const,
          link: `/property/${data.id}`,
        };

        if (typeof window !== "undefined") {
          const notificationEvent = new CustomEvent("laqta:notification", { detail: propertyMessage });
          window.dispatchEvent(notificationEvent);
        }

        alert("✅ تم إنشاء الإعلان بنجاح");
      }

      setFormData({
        title: "",
        category: "houses",
        type: "sale",
        city: "دمشق",
        price: "",
        area: "",
        bedrooms: "3",
        bathrooms: "2",
        description: "",
        images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
        videos: [""],
      });
      setWhatsappMessage("");
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
      alert("❌ فشل في حفظ الإعلان. تأكد من أن الجداول والحقول في Supabase متطابقة مع المشروع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تحرير إعلان
  const handleEdit = (item: PropertyListing) => {
    setFormData({
      title: item.title,
      category: item.category,
      type: item.type,
      city: item.city,
      price: item.price,
      area: item.area,
      bedrooms: item.bedrooms || "3",
      bathrooms: item.bathrooms || "2",
      description: item.description || "",
      images: item.images || ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
      videos: item.videos || [""],
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // إلغاء التحرير
  const handleCancel = () => {
    setFormData({
      title: "",
      category: "houses",
      type: "sale",
      city: "دمشق",
      price: "",
      area: "",
      bedrooms: "3",
      bathrooms: "2",
      description: "",
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
      videos: [""],
    });
    setWhatsappMessage("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-md">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">لقطة</h1>
              <p className="text-sm text-blue-100">لوحة إدارة العقارات الاحترافية</p>
              <p className="text-[11px] text-blue-100 mt-1">صلاحيات المدير: إضافة، تعديل، حذف، وإدارة جميع الأقسام</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div>
            <p className="text-xs font-black text-emerald-800">صلاحيات المدير</p>
            <p className="text-[11px] text-emerald-700">إضافة، تعديل، حذف، وتنظيم كل قسم من أقسام العقارات</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            {adminEmail || adminUser?.email || "مدير مسجل"}
          </div>
        </div>

        {/* نموذج الإنشاء/التعديل */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? "✏️ تعديل الإعلان" : "➕ إنشاء إعلان جديد"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* الصف الأول */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: شقة فاخرة بإطلالة"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    القسم *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* الصف الثاني */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    نوع الصفقة *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEAL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    المحافظة *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SYRIAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    السعر (ل.س) *
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="مثال: 950000000"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* معلومات العقار الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    المساحة (م²) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="185"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    غرف النوم
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    عدد الحمامات
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="2"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    نوع العقار
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DEAL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    رابط الصورة الرئيسية
                  </label>
                  <input
                    type="url"
                    value={formData.images?.[0] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: [e.target.value],
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    🔗 رابط الفيديو (YouTube / Vimeo / Embed)
                  </label>
                  <input
                    type="url"
                    value={formData.videos?.[0] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videos: [e.target.value],
                      })
                    }
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">💡 استخدم رابط embed للحصول على preview احترافي داخل العقار.</p>
                </div>
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  الوصف المفصل
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أضف وصفاً جذاباً للعقار..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* الأزرار */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      حفظ الإعلان
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-bold py-3 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {pendingLeads.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">طلبات الواتساب الواردة</h2>
                <p className="text-[11px] text-slate-500 mt-1">المدير يتواصل مع العميل أولاً، ثم يضيف الإعلان الاحترافي يدويًا في لوحة الإدارة</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-700">{pendingLeads.length} جديدة</span>
            </div>

            <div className="space-y-3">
              {pendingLeads.map((lead) => (
                <div key={lead.id} className="border border-amber-200 bg-amber-50 rounded-2xl p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-700">{lead.parsedData?.title || "طلب جديد"}</p>
                      <p className="mt-1 text-[11px] text-slate-600 whitespace-pre-wrap">{lead.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openLeadAsDraft(lead)}
                        className="bg-slate-800 text-white px-3 py-2 rounded-xl text-[11px] font-bold"
                      >
                        استيراد إلى النموذج
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectLead(lead.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-xl text-[11px] font-bold"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* البحث والتصفية */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن الإعلانات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأقسام</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                إعلان جديد
              </button>
            )}
          </div>
        </div>

        {/* قائمة الإعلانات */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">لا توجد إعلانات حالياً</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg border border-slate-200 overflow-hidden transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* الصورة والفيديو */}
                  <div className="w-full md:w-64 flex-shrink-0">
                    {/* الفيديو */}
                    {item.videos?.[0] && item.videos[0].trim() ? (
                      <div className="w-full h-64 md:h-auto">
                        <iframe
                          width="100%"
                          height="256"
                          src={item.videos[0]}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      /* الصورة */
                      <div className="w-full h-64 bg-slate-300">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <Building2 className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* المعلومات */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {CATEGORIES.find((c) => c.id === item.category)?.label ||
                              item.category}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {item.type === "sale"
                            ? "بيع"
                            : item.type === "rent"
                              ? "إيجار"
                              : "على العظم"}
                        </span>
                      </div>

                      <div className="flex gap-4 text-sm text-slate-600 mb-4">
                        <span>📍 {item.city}</span>
                        <span>📐 {item.area} م²</span>
                        {item.bedrooms && <span>🛏️ {item.bedrooms}</span>}
                        {item.bathrooms && <span>🚿 {item.bathrooms}</span>}
                      </div>

                      <p className="text-lg font-bold text-green-600">
                        {Number(item.price).toLocaleString()} ل.س
                      </p>

                      {item.description && (
                        <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
                      {item.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleModerate(item.id, true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            موافقة
                          </button>
                          <button
                            onClick={() => handleModerate(item.id, false)}
                            className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            رفض
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* إحصائيات */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-bold mb-2">إجمالي الإعلانات</p>
            <p className="text-3xl font-black text-blue-600">{listings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-bold mb-2">للبيع</p>
            <p className="text-3xl font-black text-green-600">
              {listings.filter((l) => l.type === "sale").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-bold mb-2">للإيجار</p>
            <p className="text-3xl font-black text-orange-600">
              {listings.filter((l) => l.type === "rent").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 text-center">
            <p className="text-slate-500 text-sm font-bold mb-2">على العظم</p>
            <p className="text-3xl font-black text-purple-600">
              {listings.filter((l) => l.type === "offplan").length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
