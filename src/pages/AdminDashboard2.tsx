import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
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
  RefreshCw,
  LayoutDashboard,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Bell,
  Send,
  BedDouble,
  Bath,
  Link2,
  MapPin,
  Ruler,
  ArrowUpDown,
} from "lucide-react";
import { SYRIAN_CITIES, SYRIAN_CATEGORY_ICONS } from "../lib/constants";
import Image from "../components/ui/Image";
import { PROPERTY_IMAGE_FALLBACK } from "../config/images";
import Skeleton from "../components/ui/Skeleton";
import NumberTicker from "../components/ui/NumberTicker";

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
  { id: "houses", label: "منازل" },
  { id: "villas", label: "فلل" },
  { id: "buildings", label: "بنايات" },
  { id: "shops", label: "محلات" },
  { id: "farms", label: "مزارع" },
  { id: "lands", label: "أراضي" },
  { id: "factories", label: "مصانع" },
  { id: "other", label: "أخرى" },
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
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "rejected">("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeSection, setActiveSection] = useState<"overview" | "listings" | "leads" | "notifications">("overview");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [pendingLeads, setPendingLeads] = useState<WhatsAppLead[]>([]);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);

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
    images: [PROPERTY_IMAGE_FALLBACK],
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
          alert("جدول طلبات الواتساب غير مفعّل بعد، لكن النموذج ما زال يعمل بشكل آمن.");
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

      alert("تم حفظ رسالة الواتساب في قائمة الطلبات الجديدة");
    } catch (error) {
      console.error("Failed to save whatsapp lead:", error);
      alert("فشل حفظ رسالة الواتساب");
    }
  };

  const openLeadAsDraft = (lead: WhatsAppLead) => {
    const parsed = lead.parsedData || {};
    navigate("/place-ad", {
      state: {
        draft: {
          title: parsed.title || "",
          city: parsed.city || "دمشق",
          price: parsed.price || "",
          area: parsed.area || "",
          category: parsed.category || "houses",
          description: parsed.description || lead.message || "",
        },
      },
    });
  };

  const rejectLead = async (leadId: string) => {
    try {
      const { error } = await supabase.from("whatsapp_leads").update({ status: "rejected" }).eq("id", leadId);
      if (error) throw error;
      setPendingLeads((prev) => prev.filter((item) => item.id !== leadId));
      alert("تم رفض الطلب واستبعاده من قائمة المراجعة");
    } catch (error) {
      console.error("Failed to reject lead:", error);
      alert("فشل في رفض الطلب");
    }
  };

  // التحقق من الصلاحيات
  useEffect(() => {
    if (isLoading) return;

    if (!isAdmin) {
      navigate("/login");
      return;
    }

    fetchListings();
  }, [isAdmin, isLoading, navigate]);

  // جلب الإعلانات
  const fetchListings = async () => {
    setLoading(true);
    setLoadError("");
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
      setLoadError("تعذر تحميل بيانات لوحة الإدارة. تحقق من اتصال Supabase ثم أعد المحاولة.");
      alert("فشل في جلب الإعلانات. تأكد من أن جداول Supabase تم إنشاؤها بشكل صحيح.");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const sendAdminNotification = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = notificationTitle.trim();
    const message = notificationMessage.trim();

    if (!title || !message) {
      alert("يرجى كتابة عنوان الإشعار ونصه");
      return;
    }
    if (title.length > 80 || message.length > 500) {
      alert("العنوان يجب ألا يتجاوز 80 حرفاً والنص 500 حرف");
      return;
    }

    setIsSendingNotification(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-push-notification", {
        body: { title, message },
      });
      if (error) throw error;

      const sent = Number(data?.sent || 0);
      setNotificationTitle("");
      setNotificationMessage("");
      alert(sent > 0
        ? `تم إرسال الإشعار بنجاح إلى ${sent} جهاز مسجل`
        : "تم قبول الإشعار، لكن لا توجد أجهزة مسجلة حالياً لاستلامه");
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      const detail = error instanceof Error ? error.message : "تحقق من إعدادات Firebase وSupabase Edge Function.";
      alert(`تعذر إرسال الإشعار: ${detail}`);
    } finally {
      setIsSendingNotification(false);
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

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredListings(filtered);
  }, [searchTerm, categoryFilter, statusFilter, listings]);

  const pendingListingsCount = listings.filter((item) => item.status === "pending").length;
  const activeListingsCount = listings.filter((item) => item.status === "active" || item.status === "approved").length;
  const rejectedListingsCount = listings.filter((item) => item.status === "rejected").length;

  // حذف إعلان
  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الإعلان؟")) return;

    try {
      const { data: deleted, error } = await supabase.rpc("admin_delete_listing", { p_listing_id: id });
      if (error) throw error;
      if (!deleted) throw new Error("لم يتم العثور على الإعلان أو لا تملك صلاحية حذفه");
      setListings((prev) => prev.filter((item) => item.id !== id));
      alert("تم حذف الإعلان بنجاح");
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      alert("فشل حذف الإعلان");
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
      alert(approved ? "تمت الموافقة على الإعلان" : "تم رفض الإعلان");
    } catch (error) {
      console.error("Failed to moderate listing:", error);
      alert("تعذرت معالجة الإعلان");
    }
  };

  // حفظ الإعلان (إنشاء أو تحديث)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price || !formData.area) {
      alert("يرجى ملء عنوان الإعلان والسعر والمساحة قبل الحفظ");
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
        images: safeImages.length ? safeImages : [PROPERTY_IMAGE_FALLBACK],
        videos: (formData.videos || []).filter(Boolean),
        status: "active",
        user_id: adminUser?.id || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from("listings").update(payload).eq("id", editingId);
        if (error) throw error;
        setListings((prev) => prev.map((item) => (item.id === editingId ? normalizeListing({ ...item, ...payload, id: editingId }) : item)));
        alert("تم تحديث الإعلان بنجاح");
      } else {
        const { data, error } = await supabase.from("listings").insert({
          ...payload,
          created_at: new Date().toISOString(),
        }).select().single();
        if (error) throw error;
        setListings((prev) => [...prev, normalizeListing(data)]);

        alert("تم إنشاء الإعلان بنجاح");
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
        images: [PROPERTY_IMAGE_FALLBACK],
        videos: [""],
      });
      setWhatsappMessage("");
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
      alert("فشل في حفظ الإعلان. تأكد من أن الجداول والحقول في Supabase متطابقة مع المشروع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تحرير إعلان
  const handleEdit = (item: PropertyListing) => {
    navigate(`/place-ad?id=${encodeURIComponent(item.id)}`);
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
      images: [PROPERTY_IMAGE_FALLBACK],
      videos: [""],
    });
    setWhatsappMessage("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/login");
  };

  const listingColumns = useMemo<ColumnDef<PropertyListing>[]>(() => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button type="button" onClick={column.getToggleSortingHandler()} className="inline-flex items-center gap-2">
          العقار <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex min-w-56 items-center gap-3">
          <Image src={row.original.images?.[0]} alt="" containerClassName="h-12 w-16 shrink-0 rounded-md" className="h-full w-full object-cover" />
          <span className="min-w-0">
            <span className="block max-w-64 truncate font-bold text-stone-900">{row.original.title}</span>
            <span className="mt-1 block text-xs text-stone-500">{CATEGORIES.find((category) => category.id === row.original.category)?.label || row.original.category}</span>
          </span>
        </div>
      ),
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <button type="button" onClick={column.getToggleSortingHandler()} className="inline-flex items-center gap-2">
          المحافظة <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
        </button>
      ),
      cell: ({ getValue }) => <span className="whitespace-nowrap">{getValue<string>()}</span>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <button type="button" onClick={column.getToggleSortingHandler()} className="inline-flex items-center gap-2">
          السعر <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
        </button>
      ),
      sortingFn: (rowA, rowB, columnId) => Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId)),
      cell: ({ getValue }) => <span className="whitespace-nowrap font-bold text-stone-900">{Number(getValue()).toLocaleString()} ل.س</span>,
    },
    {
      accessorKey: "area",
      header: "المساحة",
      sortingFn: (rowA, rowB, columnId) => Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId)),
      cell: ({ getValue }) => <span className="whitespace-nowrap">{getValue<string>()} م²</span>,
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ getValue }) => {
        const status = String(getValue() || "pending");
        const labels: Record<string, string> = { pending: "قيد المراجعة", active: "منشور", approved: "منشور", rejected: "مرفوض" };
        const styles: Record<string, string> = {
          pending: "bg-amber-50 text-amber-800",
          active: "bg-emerald-50 text-emerald-800",
          approved: "bg-emerald-50 text-emerald-800",
          rejected: "bg-rose-50 text-rose-800",
        };
        return <span className={`whitespace-nowrap rounded-sm px-2 py-1 text-xs font-bold ${styles[status] || "bg-stone-100 text-stone-700"}`}>{labels[status] || status}</span>;
      },
    },
    {
      id: "actions",
      header: "إجراءات",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.status === "pending" && (
            <>
              <button type="button" onClick={() => handleModerate(row.original.id, true)} aria-label="موافقة على الإعلان" title="موافقة" className="flex h-9 w-9 items-center justify-center rounded-md text-emerald-800 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleModerate(row.original.id, false)} aria-label="رفض الإعلان" title="رفض" className="flex h-9 w-9 items-center justify-center rounded-md text-brand-700 hover:bg-brand-50"><X className="h-4 w-4" /></button>
            </>
          )}
          <button type="button" onClick={() => handleEdit(row.original)} aria-label="تعديل الإعلان" title="تعديل" className="flex h-9 w-9 items-center justify-center rounded-md text-stone-700 hover:bg-stone-100"><Edit2 className="h-4 w-4" /></button>
          <button type="button" onClick={() => handleDelete(row.original.id)} aria-label="حذف الإعلان" title="حذف" className="flex h-9 w-9 items-center justify-center rounded-md text-brand-700 hover:bg-brand-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ], [handleDelete, handleEdit, handleModerate]);

  const listingsTable = useReactTable({
    data: filteredListings,
    columns: listingColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">لوحة المدير</h1>
              <p className="text-xs text-stone-600 sm:text-sm">إدارة الإعلانات والمراجعة اليومية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-brand-500 bg-white px-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 sm:px-5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-bold text-stone-900">صلاحيات المدير</p>
            <p className="text-xs text-stone-600">إضافة، تعديل، حذف، وتنظيم كل قسم من أقسام العقارات</p>
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700">
            {adminEmail || adminUser?.email || "مدير مسجل"}
          </div>
        </div>

        {loadError && (
          <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-brand-300 bg-brand-50 px-4 py-3 text-brand-900 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{loadError}</span>
            </div>
            <button onClick={refreshDashboard} className="min-h-11 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white">إعادة المحاولة</button>
          </div>
        )}

        <nav className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-stone-200 bg-white p-1.5 sm:grid-cols-4" aria-label="أقسام لوحة المدير">
          {[
            { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
            { id: "listings", label: "الإعلانات", icon: ClipboardList },
            { id: "leads", label: "طلبات المراجعة", icon: Clock3 },
            { id: "notifications", label: "إرسال إشعار", icon: Bell },
          ].map((section) => {
            const Icon = section.icon;
            const selected = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as typeof activeSection)}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-xs font-bold transition-colors sm:text-sm ${selected ? "bg-brand-500 text-white" : "text-stone-700 hover:bg-stone-50"}`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
                {section.id === "leads" && pendingLeads.length > 0 && <span className={`min-w-5 rounded-md px-1.5 text-xs ${selected ? "bg-white text-brand-700" : "bg-amber-100 text-amber-900"}`}>{pendingLeads.length}</span>}
              </button>
            );
          })}
        </nav>

        {activeSection === "notifications" && (
          <section className="mb-8 max-w-3xl rounded-xl border border-stone-200 bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">إرسال إشعار للمستخدمين</h2>
                <p className="mt-1 text-sm leading-7 text-stone-600">اكتب الرسالة وسيتم إرسالها إلى الأجهزة التي فعّلت إشعارات التطبيق.</p>
              </div>
            </div>

            <form onSubmit={sendAdminNotification} className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label htmlFor="notification-title" className="text-sm font-bold text-stone-800">عنوان الإشعار</label>
                  <span className="text-xs text-stone-500">{notificationTitle.length}/80</span>
                </div>
                <input
                  id="notification-title"
                  value={notificationTitle}
                  onChange={(event) => setNotificationTitle(event.target.value)}
                  maxLength={80}
                  placeholder="مثال: إعلان جديد بانتظارك"
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label htmlFor="notification-message" className="text-sm font-bold text-stone-800">نص الإشعار</label>
                  <span className="text-xs text-stone-500">{notificationMessage.length}/500</span>
                </div>
                <textarea
                  id="notification-message"
                  value={notificationMessage}
                  onChange={(event) => setNotificationMessage(event.target.value)}
                  maxLength={500}
                  rows={5}
                  placeholder="اكتب تفاصيل الرسالة التي ستصل للمستخدمين..."
                  className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingNotification || !notificationTitle.trim() || !notificationMessage.trim()}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSendingNotification ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {isSendingNotification ? "جاري الإرسال..." : "إرسال الإشعار"}
              </button>
            </form>
          </section>
        )}

        {activeSection === "overview" && (
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-stone-900">ملخص المنصة</h2>
                <p className="mt-1 text-sm text-stone-600">صورة سريعة عن الإعلانات التي تحتاج متابعة</p>
              </div>
              <button onClick={() => setActiveSection("listings")} className="min-h-11 text-sm font-bold text-brand-700 hover:text-brand-800">إدارة الإعلانات</button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "إجمالي الإعلانات", value: listings.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "بانتظار المراجعة", value: pendingListingsCount, icon: Clock3, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "منشورة وموثقة", value: activeListingsCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "مرفوضة", value: rejectedListingsCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.color}`} /></div>
                      <TrendingUp className="h-4 w-4 text-slate-300" />
                    </div>
                    <p className="mt-4 text-[11px] font-bold text-slate-500">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-black ${stat.color}`}><NumberTicker value={stat.value} /></p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* نموذج الإنشاء/التعديل */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">
                {editingId ? "تعديل الإعلان" : "إنشاء إعلان جديد"}
              </h2>
              <button
                onClick={handleCancel}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-stone-100"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    نوع العقار
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
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
                    placeholder="/images/property-photo.webp"
                    className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />رابط الفيديو (YouTube / Vimeo / Embed)</span>
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
                  <p className="text-xs text-slate-500 mt-1">استخدم رابط embed للحصول على preview داخل العقار.</p>
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
                  className="w-full resize-none rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* الأزرار */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
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
                  className="min-h-11 flex-1 rounded-lg border border-stone-300 bg-white py-3 font-bold text-stone-800 transition-colors hover:bg-stone-50"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === "leads" && (
          <div className="mb-8 rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">طلبات الواتساب الواردة</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">المدير يتواصل مع العميل أولاً، ثم يضيف الإعلان الاحترافي يدويًا في لوحة الإدارة</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-700">{pendingLeads.length} جديدة</span>
            </div>

            <div className="space-y-3">
              {pendingLeads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-700" />
                  <p className="mt-2 text-sm font-bold text-stone-800">لا توجد طلبات بانتظار المراجعة</p>
                </div>
              ) : pendingLeads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-stone-200 bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-stone-900">{lead.parsedData?.title || "طلب جديد"}</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-stone-700">{lead.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openLeadAsDraft(lead)}
                        className="min-h-11 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white"
                      >
                        استيراد إلى النموذج
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectLead(lead.id)}
                        className="min-h-11 rounded-lg border border-brand-500 bg-white px-3 py-2 text-sm font-bold text-brand-700"
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
        {activeSection === "listings" && <div className="mb-8 rounded-xl border border-stone-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن الإعلانات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 py-2 pe-4 ps-10 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="all">جميع الأقسام</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400 md:w-auto"
              aria-label="فلترة حالة الإعلان"
            >
              <option value="all">كل الحالات</option>
              <option value="pending">بانتظار المراجعة</option>
              <option value="active">منشور وموثق</option>
              <option value="rejected">مرفوض</option>
            </select>

            {!showForm && (
              <button
                onClick={() => navigate("/place-ad")}
                className="flex min-h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-600"
              >
                <Plus className="w-5 h-5" />
                إضافة إعلان متكاملة
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-stone-600">
            <span>المعروض الآن: {filteredListings.length}</span>
            <button onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setStatusFilter("all"); }} className="min-h-11 text-brand-700 hover:underline">مسح الفلاتر</button>
          </div>
        </div>}

        {/* قائمة الإعلانات */}
        {activeSection === "listings" && (loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row">
                <Skeleton className="aspect-[4/3] w-full sm:w-64" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/5" />
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-stone-500" />
            <p className="text-lg font-bold text-stone-800">لا توجد إعلانات حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full min-w-[850px] border-collapse text-sm" aria-label="إعلانات العقارات">
              <thead className="bg-stone-50 text-xs font-bold text-stone-600">
                {listingsTable.getHeaderGroups().map((group) => (
                  <tr key={group.id} className="border-b border-stone-200">
                    {group.headers.map((header) => (
                      <th key={header.id} scope="col" className="px-4 py-3 text-start">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {listingsTable.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle text-stone-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      </main>
    </div>
  );
}
