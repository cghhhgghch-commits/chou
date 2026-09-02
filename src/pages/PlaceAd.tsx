import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { 
  ArrowRight, Camera, MapPin, Tag, CheckCircle2, Loader2, 
  Sun, Building2, Sparkles, X, Plus,
  MessageSquare, Phone, Link2
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { useNotifications } from "../lib/NotificationsContext";
import { 
  APP_CONFIG, 
  SYRIAN_CITIES,
  SYRIAN_GOVERNORATES, 
  SYRIAN_CATEGORIES, 
  OWNERSHIP_TYPES, 
  FINISHING_TYPES, 
  AMENITIES_LIST, 
  getWhatsAppUrl, 
  formatSyrianPrice 
} from "../lib/constants";

export default function PlaceAd() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // Basic Category & Deal
  const [selectedCategory, setSelectedCategory] = useState("houses");
  const [dealType, setDealType] = useState<"sale" | "rent" | "offplan">("sale");
  const [advertiserType, setAdvertiserType] = useState<"owner" | "agent" | "agency">("owner");
  
  // Title & Pricing
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceInUSD, setPriceInUSD] = useState("");
  const [pricePeriod, setPricePeriod] = useState("شهرياً");
  
  // Location & Legal
  const [cityId, setCityId] = useState("حلب");
  const [areaName, setAreaName] = useState("");
  const [ownershipType, setOwnershipType] = useState(OWNERSHIP_TYPES[0]);
  const [finishing, setFinishing] = useState(FINISHING_TYPES[0]);
  const [direction, setDirection] = useState("قبلي غربي (مشمس)");
  
  // Architectural Specs
  const [floor, setFloor] = useState("الطابق الثاني");
  const [totalFloors, setTotalFloors] = useState("4 طوابق");
  const [bedrooms, setBedrooms] = useState("3 غرف نوم");
  const [bathrooms, setBathrooms] = useState(2);
  const [salons, setSalons] = useState("صالون كبير وموزع");
  const [area, setArea] = useState("");
  const [landArea, setLandArea] = useState("");
  const [furnishing, setFurnishing] = useState("غير مفروش");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "منظومة طاقة شمسية وإنفيرتر",
    "خزان ماء إضافي ومضخة",
    "سند طابو نظامي فوري",
    "إطلالة مفتوحة ومشمسة"
  ]);
  const [categoryDetailText, setCategoryDetailText] = useState("");
  const [categoryNumericDetail, setCategoryNumericDetail] = useState("");
  const [categoryExtraDetail, setCategoryExtraDetail] = useState("");
  const [description, setDescription] = useState("");
  
  // Contacts
  const [advertiserName, setAdvertiserName] = useState(user?.displayName || "معلن عقاري");
  const [phone, setPhone] = useState(user?.phoneNumber || "+963");
  const [whatsapp, setWhatsapp] = useState(APP_CONFIG.adminPhone);
  
  // Image handling (Local files + Direct URLs)
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  
  // Submission & Dialog State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(Boolean(editingId));
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState("");

  useEffect(() => {
    if (!editingId) return;

    const fetchListing = async () => {
      setLoadingExisting(true);
      setNotFound(false);
      setNotOwner(false);

      try {
        const { data, error } = await supabase.from("listings").select("*").eq("id", editingId).single();
        if (error || !data) {
          setNotFound(true);
          return;
        }

        if (user && data.user_id && data.user_id !== user.id) {
          setNotOwner(true);
          return;
        }

        setSelectedCategory(data.category || "houses");
        setDealType((data.type as "sale" | "rent" | "offplan") || "sale");
        setAdvertiserType((data.advertiser_type as "owner" | "agent" | "agency") || "owner");
        setTitle(data.title || "");
        setPrice(data.price ? String(data.price) : "");
        setPriceInUSD(data.price_in_usd ? String(data.price_in_usd) : "");
        setPricePeriod(data.price_period || "شهرياً");
        setCityId(data.city_id || "حلب");
        setAreaName(data.area_id || "");
        setOwnershipType(data.ownership_type || OWNERSHIP_TYPES[0]);
        setFinishing(data.finishing || FINISHING_TYPES[0]);
        setDirection(data.direction || "قبلي غربي (مشمس)");
        setFloor(data.floor || "الطابق الثاني");
        setTotalFloors(data.total_floors || "4 طوابق");
        setBedrooms(data.bedrooms != null ? String(data.bedrooms) : "3");
        setBathrooms(Number(data.bathrooms || 2));
        setSalons(data.salons || "صالون كبير وموزع");
        setArea(data.area ? String(data.area) : "");
        setLandArea(data.land_area ? String(data.land_area) : "");
        setFurnishing(data.furnishing || "غير مفروش");
        setSelectedAmenities(Array.isArray(data.amenities) && data.amenities.length > 0 ? data.amenities : [
          "منظومة طاقة شمسية وإنفيرتر",
          "خزان ماء إضافي ومضخة",
          "سند طابو نظامي فوري",
          "إطلالة مفتوحة ومشمسة"
        ]);
        setCategoryDetailText(data.categorySpecificText || "");
        setCategoryNumericDetail(data.categorySpecificNumeric || "");
        setCategoryExtraDetail(data.categorySpecificExtra || "");
        setDescription(data.description || "");
        setAdvertiserName(data.advertiser_name || user?.displayName || "معلن عقاري");
        setPhone(data.phone || user?.phoneNumber || "+963");
        setWhatsapp(data.whatsapp || data.phone || APP_CONFIG.adminPhone);
        setPreviewUrls(Array.isArray(data.images) && data.images.length > 0 ? data.images : []);
      } catch (err) {
        console.warn("Failed to fetch listing for edit mode:", err);
        setNotFound(true);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchListing();
  }, [editingId, user]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCategoryDetailText("");
    setCategoryNumericDetail("");
    setCategoryExtraDetail("");
    
    // Smart architectural presets based on Syrian category
    if (catId === "shops") {
      setDealType("rent");
      setSalons("صالة عرض ومستودع");
      setOwnershipType("فروغ تجاري نظامي");
    } else if (catId === "farms") {
      setDealType("sale");
      setOwnershipType("طابو أخضر 2400 سهم (سجل عقاري)");
      if (!selectedAmenities.includes("مسبح مفلتر خاص")) {
        setSelectedAmenities(prev => [...prev, "مسبح مفلتر خاص", "بئر ماء ارتوازي عذب"]);
      }
    } else if (catId === "lands") {
      setDealType("sale");
      setFinishing("على العظم (قيد الإنشاء)");
    } else if (catId === "factories") {
      setDealType("sale");
      setOwnershipType("طابو سجل صناعي / ترخيص");
      setSalons("هنغار ومكاتب إدارية");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setPreviewUrls(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
  };

  const removeImage = (index: number) => {
    const removedUrl = previewUrls[index];
    if (removedUrl?.startsWith("blob:")) {
      const fileIndex = previewUrls.slice(0, index).filter((url) => url.startsWith("blob:")).length;
      setImages((prev) => prev.filter((_, i) => i !== fileIndex));
      URL.revokeObjectURL(removedUrl);
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Validation helper functions
  const isValidPhoneNumber = (phoneNum: string): boolean => {
    // Syrian phone numbers or international format
    const phoneRegex = /^(\+?963|0)?[0-9]{9,10}$/;
    return phoneRegex.test(phoneNum.replace(/[\s-()]/g, ''));
  };

  const formatPhoneNumber = (phoneNum: string): string => {
    // Remove all non-numeric characters except +
    const cleaned = phoneNum.replace(/[^\d+]/g, '');
    return cleaned;
  };

  const categoryFormConfig = {
    houses: {
      areaLabel: "المساحة م² *",
      secondFieldLabel: "غرف النوم",
      secondFieldPlaceholder: "3 غرف نوم",
      thirdFieldLabel: "الحمامات",
      thirdFieldPlaceholder: "حمامين",
      detailLabel: "تفاصيل الشقة / المنزل",
      detailPlaceholder: "عدد الغرف / الواجهة / الموقع"
    },
    buildings: {
      areaLabel: "المساحة الإجمالية م² *",
      secondFieldLabel: "عدد الشقق",
      secondFieldPlaceholder: "8 شقق",
      thirdFieldLabel: "عدد الطوابق",
      thirdFieldPlaceholder: "طابق 5",
      detailLabel: "تفاصيل المبنى",
      detailPlaceholder: "مصعد / موقف / محلات أرضية"
    },
    farms: {
      areaLabel: "مساحة الأرض م² *",
      secondFieldLabel: "غرف النوم",
      secondFieldPlaceholder: "2 غرف",
      thirdFieldLabel: "الحمامات",
      thirdFieldPlaceholder: "2 حمامات",
      detailLabel: "تفاصيل المزرعة",
      detailPlaceholder: "نوع الري / الأشجار / المساحات الخارجية"
    },
    lands: {
      areaLabel: "مساحة الأرض م² *",
      secondFieldLabel: "طول الواجهة",
      secondFieldPlaceholder: "18 م",
      thirdFieldLabel: "نوع التنظيم",
      thirdFieldPlaceholder: "سكني / تجاري / زراعي",
      detailLabel: "تفاصيل الأرض",
      detailPlaceholder: "موقع / تنظيم / استخدام / تنسيق"
    },
    shops: {
      areaLabel: "مساحة المحل م² *",
      secondFieldLabel: "واجهة المحل",
      secondFieldPlaceholder: "15 م",
      thirdFieldLabel: "حالة المحل",
      thirdFieldPlaceholder: "مستقل / ضمن مبنى / تجاري",
      detailLabel: "تفاصيل المحل",
      detailPlaceholder: "مداخل / قبو / ترخيص / موقع" 
    },
    villas: {
      areaLabel: "مساحة الفيلا م² *",
      secondFieldLabel: "غرف النوم",
      secondFieldPlaceholder: "4 غرف نوم",
      thirdFieldLabel: "الحمامات",
      thirdFieldPlaceholder: "3 حمامات",
      detailLabel: "تفاصيل الفيلا",
      detailPlaceholder: "عدد الطوابق / المسبح / الحديقة"
    },
    factories: {
      areaLabel: "مساحة المصنع م² *",
      secondFieldLabel: "ارتفاع السقف",
      secondFieldPlaceholder: "8 م",
      thirdFieldLabel: "الاستطاعة",
      thirdFieldPlaceholder: "450 KVA",
      detailLabel: "تفاصيل المصنع",
      detailPlaceholder: "ترخيص / ميناء تحميل / موقع/مخزن"
    },
    other: {
      areaLabel: "المساحة م² *",
      secondFieldLabel: "نوع الوحدة",
      secondFieldPlaceholder: "استوديو / شاليه / غرفة",
      thirdFieldLabel: "الحمامات",
      thirdFieldPlaceholder: "1 حمام",
      detailLabel: "تفاصيل الوحدة",
      detailPlaceholder: "مميزات إضافية / الموقع / الاستخدام"
    }
  } as const;

  const currentCategoryForm = categoryFormConfig[selectedCategory as keyof typeof categoryFormConfig] || categoryFormConfig.houses;

  const buildCategorySpecificSummary = () => {
    switch (selectedCategory) {
      case "farms":
        return `📐 تفاصيل المزرعة: مساحة الأرض ${landArea || "—"} م² | نوع الري ${categoryDetailText || "—"} | عمق البئر ${categoryNumericDetail || "—"} م | المسبح/الخدمة ${categoryExtraDetail || "—"}`;
      case "lands":
        return `📐 تفاصيل الأرض: نوع التنظيم ${categoryDetailText || "—"} | نسبة البناء ${categoryNumericDetail || "—"} | طول الواجهة ${categoryExtraDetail || "—"} م | عرض الشارع ${direction || "—"}`;
      case "factories":
        return `🏭 تفاصيل المصنع: المساحة الإجمالية ${area || "—"} م² | ارتفاع السقف ${categoryDetailText || "—"} م | الاستطاعة ${categoryNumericDetail || "—"} KVA | ترخيص ${categoryExtraDetail || "—"}`;
      case "shops":
        return `🏬 تفاصيل المحل: واجهة المحل ${categoryDetailText || "—"} م | نوع الحق ${ownershipType || "—"} | مساحة الواجهة ${categoryNumericDetail || "—"} م² | مداخل/تخزين ${categoryExtraDetail || "—"}`;
      case "villas":
        return `🏰 تفاصيل الفيلا: عدد الطوابق ${categoryDetailText || "—"} | مساحة المسبح ${categoryNumericDetail || "—"} | سعة الكراج ${categoryExtraDetail || "—"} | نظام المنزل الذكي ${selectedAmenities.includes("حديقة خاصة / مساحات خضراء") ? "نعم" : "غير محدد"}`;
      case "buildings":
        return `🏢 تفاصيل المبنى: عدد الطوابق ${totalFloors || "—"} | عدد الشقق ${categoryDetailText || "—"} | مواقف السيارات ${categoryNumericDetail || "—"} | المحلات الأرضية ${categoryExtraDetail || "—"}`;
      default:
        return `🏠 تفاصيل العقار: الوصف الهندسي ${categoryDetailText || "—"} | التوزيع ${categoryNumericDetail || "—"} | الملاحظات ${categoryExtraDetail || "—"}`;
    }
  };

  const buildWhatsAppMessage = () => {
    const catObj = SYRIAN_CATEGORIES.find(c => c.id === selectedCategory);
    const catLabel = catObj?.label || selectedCategory;
    const dealLabel = dealType === 'sale' ? 'بيع قطعي' : dealType === 'rent' ? `إيجار (${pricePeriod})` : 'على العظم / استثمار';
    const advRole = advertiserType === 'owner' ? 'المالك المباشر' : advertiserType === 'agency' ? 'مكتب عقاري معتمد' : 'وسيط عقاري';
    const categorySpecificSummary = buildCategorySpecificSummary();
    
    return `🇸🇾 *طلب نشر وتوثيق إعلان عقاري جديد على تطبيق لقطة*
━━━━━━━━━━━━━━━━━━━━
🏠 *عنوان الإعلان:* ${title}
📍 *المحافظة والمنطقة:* ${cityId} - ${areaName || "غير محدد"}
🏷️ *القسم الرئيسي:* ${catLabel} (${catObj?.subtitle || ""})
📌 *نوع الصفقة:* ${dealLabel}
💰 *السعر بالليرة:* ${Number(price || 0).toLocaleString()} ل.س ${priceInUSD ? `| معادل بالدولار: $${Number(priceInUSD).toLocaleString()}` : ''} ${dealType === 'rent' ? `(${pricePeriod})` : ''}
📜 *نوع سند الملكية والطابو:* ${ownershipType}
📐 *المساحة:* ${area || "—"} م² ${landArea ? `(مساحة الأرض: ${landArea} م²)` : ''}
🚪 *التقسيم الداخلي:* ${bedrooms} | ${salons} | ${bathrooms} حمام | ${floor} (${totalFloors})
🧭 *الاتجاه والواجهة:* ${direction}
🎨 *مستوى الإكساء:* ${finishing} (${furnishing})
${categorySpecificSummary}
✨ *المميزات والخدمات المتاحة:*
${selectedAmenities.map(a => `  • ${a}`).join('\n') || "  • لا توجد ميزات إضافية"}

📝 *التفاصيل والوصف الشامل:*
${description || "يرجى التواصل لمعرفة باقي التفاصيل."}

👤 *صفة المعلن:* ${advRole} (${advertiserName})
📞 *هاتف الاتصال:* ${phone}
💬 *رقم الواتساب:* ${whatsapp || phone}
━━━━━━━━━━━━━━━━━━━━
📸 *ملاحظة:* تم رفع وتوثيق الإعلان في قاعدة بيانات تطبيق لقطة ويُرجى نشر الصور والتفاصيل عبر الواتساب للاعتماد الفوري.`;
  };

  const handleGenerateDescription = async () => {
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: selectedCategory,
          city: cityId,
          dealType,
          price: Number(price || 0),
          area: Number(area || 0),
          bedrooms,
          description,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "فشل في توليد الوصف");
      }

      const data = await response.json();
      if (data.description) {
        setDescription(data.description.trim());
      }
    } catch (err) {
      console.warn("AI description generation failed:", err);
      setError("تعذّر توليد الوصف تلقائياً الآن. يمكنك إكماله يدوياً.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    if (!title.trim()) {
      setError("يرجى إدخال عنوان الإعلان.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("يرجى إدخال سعر صحيح (أكبر من صفر).");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (Number.isNaN(Number(price))) {
      setError("السعر يجب أن يكون رقماً.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (area && (Number.isNaN(Number(area)) || Number(area) <= 0)) {
      setError("المساحة يجب أن تكون رقماً موجباً.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!cityId) {
      setError("يرجى تحديد المحافظة.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!phone || phone.length < 9) {
      setError("يرجى إدخال رقم هاتف صحيح.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (previewUrls.length > 0) {
      const invalidUrls = previewUrls.filter(url => {
        if (!url.startsWith('blob:') && !url.startsWith('http://') && !url.startsWith('https://')) {
          return true;
        }
        if (url.startsWith('http')) {
          try {
            new URL(url);
            return false;
          } catch {
            return true;
          }
        }
        return false;
      });
      
      if (invalidUrls.length > 0) {
        setError("بعض روابط الصور غير صحيحة. تأكد من أن الروابط تبدأ بـ http أو https.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (!user) {
        setError("يجب تسجيل الدخول أولاً قبل إضافة الإعلان.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      let finalImageUrls = [...previewUrls.filter((u) => u.startsWith("http"))];

      for (const imageFile of images) {
        const filePath = `${user.id}/${crypto.randomUUID()}-${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-media")
          .upload(filePath, imageFile, { upsert: false, contentType: imageFile.type });
        if (uploadError) throw new Error(`تعذر رفع الصورة: ${uploadError.message}`);

        const { data: publicUrl } = supabase.storage.from("listing-media").getPublicUrl(filePath);
        finalImageUrls.push(publicUrl.publicUrl);
      }

      finalImageUrls = [...new Set(finalImageUrls)];

      if (finalImageUrls.length === 0) {
        finalImageUrls = [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        ];
      }

      const listingData = {
        user_id: user.id,
        title: title.trim(),
        price: Number(price),
        price_in_usd: priceInUSD ? Number(priceInUSD) : null,
        price_period: dealType === 'rent' ? pricePeriod : null,
        type: dealType,
        category: selectedCategory,
        property_type: selectedCategory,
        city_id: cityId,
        area_id: areaName,
        ownership_type: ownershipType,
        finishing,
        floor,
        total_floors: totalFloors,
        bedrooms: Number.parseInt(bedrooms, 10) || 0,
        bathrooms: Number(bathrooms) || 1,
        salons,
        area: area ? Number(area) : 0,
        land_area: landArea ? Number(landArea) : 0,
        furnishing,
        has_water_well: selectedAmenities.includes("بئر ماء ارتوازي عذب"),
        has_elevator: selectedAmenities.includes("مصعد حديث شغال"),
        has_generator: selectedAmenities.includes("مولدة كهرباء / خط أمبير"),
        amenities: selectedAmenities,
        description: description.trim(),
        advertiser_type: advertiserType,
        advertiser_name: advertiserName,
        phone,
        whatsapp: whatsapp || phone,
        status: "active",
        is_verified: true,
        images: finalImageUrls,
        videos: [],
        updated_at: new Date().toISOString(),
        ...(editingId ? {} : { created_at: new Date().toISOString() })
      };

      let createdId: string | null = editingId ?? null;

      if (editingId) {
        const { error } = await supabase.from("listings").update(listingData).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("listings").insert(listingData).select("id").single();
        if (error) throw error;
        createdId = data?.id || null;
      }

      const whatsappMessage = buildWhatsAppMessage();
      try {
        const { error: leadError } = await supabase.from("whatsapp_leads").insert({
          message: whatsappMessage,
          status: "pending",
          parsed_data: {
            title: title.trim(),
            city: cityId,
            price,
            area,
            category: selectedCategory,
            description: description.trim(),
          },
        });
        if (leadError) console.warn("Could not save admin notification:", leadError);
      } catch (leadError) {
        console.warn("Admin notification table is unavailable:", leadError);
      }

      addNotification({
        title: editingId ? `🔄 تم تحديث إعلانك (${title})` : `📢 تم إضافة عقار جديد (${title})`,
        message: editingId ? `تم تحديث تفاصيل العقار في ${cityId} بنجاح.` : `تم إضافة عقار جديد في ${cityId} وهو الآن متاح للمستخدمين في المنصة.`,
        type: editingId ? "ad_approved" : "new_property",
        propertyId: createdId || undefined,
        propertyTitle: title.trim(),
        cityName: cityId,
        iconType: editingId ? "check" : "building",
        link: createdId ? `/property/${createdId}` : "/properties"
      });

      // Construct WhatsApp link
      const waUrl = getWhatsAppUrl(whatsappMessage);
      setGeneratedWhatsAppUrl(waUrl);
      setShowSuccessModal(true);

      // Trigger WhatsApp open
      window.open(waUrl, "_blank");

    } catch (err: any) {
      console.error("Submission error:", err);
      const errorMessage = err.message || err.error?.message || "حدث خطأ في رفع الإعلان. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formTitle = editingId ? "تعديل الإعلان" : "أضف إعلان عقار جديد";
  const formDescription = editingId ? "تحديث تفاصيل العقار الحالي" : "نموذج شامل بكافة تفاصيل دوبيزل مع إرسال فوري لواتساب الإدارة";

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">جاري تحميل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 max-w-md w-full">
          <h2 className="text-lg font-black text-slate-900">الإعلان غير موجود</h2>
          <p className="text-xs text-slate-600 mt-2">قد يكون تم حذفه أو أن الرابط غير صحيح.</p>
          <button onClick={() => navigate("/my-ads")} className="mt-5 bg-brand-500 text-white rounded-xl px-5 py-3 text-xs font-bold">العودة إلى إعلاناتي</button>
        </div>
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 max-w-md w-full">
          <h2 className="text-lg font-black text-slate-900">لا يمكنك تعديل هذا الإعلان</h2>
          <p className="text-xs text-slate-600 mt-2">هذا الإعلان ليس لك، لذلك لا يمكنك تعديله.</p>
          <button onClick={() => navigate("/my-ads")} className="mt-5 bg-brand-500 text-white rounded-xl px-5 py-3 text-xs font-bold">عرض إعلاناتي</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-800">
      
      {/* Top Bar */}
      <div className="bg-white sticky top-0 z-40 border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-700 hover:text-slate-900 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">{formTitle}</h1>
            <p className="text-[11px] text-slate-500 font-medium">{formDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-2" />
      </div>

      <div className="container mx-auto max-w-3xl p-3 sm:p-5 space-y-5 mt-1">
        
        {/* Real Estate Listing Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-3xl shadow-sm flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-black mb-1">إضافة عقار جديد في لقطة</h3>
            <p className="text-[11px] sm:text-xs text-emerald-50 leading-relaxed">
              اكتب تفاصيل العقار بدقة ووضوح، ثم أرسلها مباشرة إلى الإدارة عبر الواتساب لتقييمها ومراجعتها قبل النشر في القائمة العامة.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Category Selector (The 8 requested core categories) */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <h3 className="font-black text-slate-900 text-sm">1. القسم العقاري الرئيسي</h3>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                8 أقسام معتمدة
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SYRIAN_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-3 rounded-2xl border text-right flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? "bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-xs"
                        : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{cat.icon}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                    </div>
                    <div>
                      <span className="font-black text-xs text-slate-900 block">{cat.label}</span>
                      <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{cat.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deal Type & Advertiser Role */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع العملية / الصفقة:</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {[
                    { id: "sale", label: "للبيع" },
                    { id: "rent", label: "للإيجار" },
                    { id: "offplan", label: "على العظم" },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDealType(d.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                        dealType === d.id
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">صفة المعلن:</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {[
                    { id: "owner", label: "المالك" },
                    { id: "agent", label: "وسيط" },
                    { id: "agency", label: "مكتب عقاري" },
                  ].map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAdvertiserType(a.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                        advertiserType === a.id
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Photos & Media Section */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-600" />
                <h3 className="font-black text-slate-900 text-sm">2. صور العقار والواجهات</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">({previewUrls.length} صور مرفقة)</span>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 left-1.5 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="حذف الصورة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <label className="w-full sm:w-auto cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>اختيار صور من الجهاز</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="w-full sm:flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="أو ضع رابط صورة مباشر (https://...)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2.5 text-xs font-medium focus:bg-white focus:border-brand-500 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>

          {/* 3. Title, Price & Currency Details (Dubizzle Style) */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>3. عنوان الإعلان والتسعير</span>
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان الإعلان المباشر والواضح *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: شقة سوبر ديلوكس 180م² في المزة فيلات مع غرفتين نوم وتفاصيل واضحة..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white focus:border-brand-500 outline-none" 
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">السعر بالليرة السورية (ل.س) *</label>
                  <span className="text-[11px] font-extrabold text-emerald-600">{formatSyrianPrice(Number(price))}</span>
                </div>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثال: 950000000 أو 3500000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white focus:border-brand-500 outline-none" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">السعر بالدولار الأمريكي ($ اختياري)</label>
                <input 
                  type="number" 
                  value={priceInUSD}
                  onChange={(e) => setPriceInUSD(e.target.value)}
                  placeholder="مثال: 65000 أو 450" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white focus:border-brand-500 outline-none" 
                />
              </div>
            </div>

            {dealType === 'rent' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">طريقة وفترة دفع الإيجار</label>
                  <select 
                    value={pricePeriod} 
                    onChange={(e) => setPricePeriod(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none"
                  >
                    <option value="شهرياً">شهرياً (دفع شهري منتظم)</option>
                    <option value="3 أشهر سلف">دفع 3 أشهر مقدماً</option>
                    <option value="6 أشهر سلف">دفع 6 أشهر مقدماً</option>
                    <option value="سنوياً">سنوياً (سلف كامل السنة)</option>
                    <option value="يومياً">يومياً (شاليهات ومصايف وسياحي)</option>
                    <option value="موسمي">موسمي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">حالة الفرش</label>
                  <select 
                    value={furnishing} 
                    onChange={(e) => setFurnishing(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none"
                  >
                    <option value="مفروش">مفروش بالكامل (أثاث ومطبخ وأجهزة)</option>
                    <option value="غير مفروش">غير مفروش (فارغ جاهز للسكن)</option>
                    <option value="مفروش جزئياً">مفروش جزئياً (مطبخ وأجهزة فقط)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 4. Location & Legal Details (Syrian Realities) */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>4. الموقع وسند الملكية (الطابو)</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المحافظة السورية *</label>
                <select 
                  value={cityId} 
                  onChange={(e) => setCityId(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none"
                >
                  {SYRIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المنطقة / الحي / الشارع</label>
                <input 
                  type="text" 
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="مثال: المزة فيلات غربية، الفرقان، حي البعث، الصليبة..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع سند الملكية القانونية</label>
                <select 
                  value={ownershipType} 
                  onChange={(e) => setOwnershipType(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none"
                >
                  {OWNERSHIP_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">مستوى الكسوة والتشطيب</label>
                <select 
                  value={finishing} 
                  onChange={(e) => setFinishing(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none"
                >
                  {FINISHING_TYPES.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Architectural fields change by property type, but stay in the same form layout */}
            {selectedCategory === "farms" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مساحة الأرض م² *</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="2500" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع الري / الأشجار</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="أشجار زيتون / ري بالتنقيط" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عمق البئر / م</label>
                  <input type="text" value={categoryNumericDetail} onChange={(e) => setCategoryNumericDetail(e.target.value)} placeholder="120" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "lands" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مساحة الأرض م² *</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1200" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع التنظيم</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="سكني / تجاري / زراعي" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">طول الواجهة</label>
                  <input type="text" value={categoryExtraDetail} onChange={(e) => setCategoryExtraDetail(e.target.value)} placeholder="18 م" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "factories" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مساحة المصنع م² *</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="900" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ارتفاع السقف</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="8 م" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاستطاعة</label>
                  <input type="text" value={categoryNumericDetail} onChange={(e) => setCategoryNumericDetail(e.target.value)} placeholder="KVA / 400" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "shops" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مساحة المحل م² *</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="120" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">واجهة المحل</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="12 م" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحق / المداخل</label>
                  <input type="text" value={categoryExtraDetail} onChange={(e) => setCategoryExtraDetail(e.target.value)} placeholder="فروغ تجاري / قبو / مداخل" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {(selectedCategory === "houses" || selectedCategory === "villas" || selectedCategory === "buildings" || selectedCategory === "other") && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المساحة م² *</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="180" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">غرف النوم</label>
                  <input type="text" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="3 غرف نوم" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الحمامات</label>
                  <select value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-center focus:bg-white outline-none">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4+</option>
                  </select>
                </div>
              </div>
            )}

            {(selectedCategory === "houses" || selectedCategory === "villas" || selectedCategory === "buildings" || selectedCategory === "other" || selectedCategory === "shops") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الصالونات والمضافات</label>
                  <input type="text" value={salons} onChange={(e) => setSalons(e.target.value)} placeholder="صالون كبير وموزع" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاتجاه والواجهة</label>
                  <input type="text" value={direction} onChange={(e) => setDirection(e.target.value)} placeholder="قبلي شرقي مشمس" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "houses" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الشقة / المنزل</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="عدد الغرف / الواجهة / الموقع" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">قيمة رقمية / ملاحظات</label>
                  <input type="text" value={categoryNumericDetail} onChange={(e) => setCategoryNumericDetail(e.target.value)} placeholder="سعر الشارع / م² / ملاحظات" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "villas" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الفيلا</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="عدد الطوابق / الحديقة / المسبح" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">معلومة إضافية</label>
                  <input type="text" value={categoryExtraDetail} onChange={(e) => setCategoryExtraDetail(e.target.value)} placeholder="سعة الكراج / الحديقة" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "buildings" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل المبنى</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="عدد الشقق / المصعد / المحلات" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عدد الطوابق / مواقف</label>
                  <input type="text" value={categoryNumericDetail} onChange={(e) => setCategoryNumericDetail(e.target.value)} placeholder="5 طوابق / 3 مواقف" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}

            {selectedCategory === "other" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الوحدة</label>
                  <input type="text" value={categoryDetailText} onChange={(e) => setCategoryDetailText(e.target.value)} placeholder="نوع الوحدة / الاستخدام" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">معلومة إضافية</label>
                  <input type="text" value={categoryExtraDetail} onChange={(e) => setCategoryExtraDetail(e.target.value)} placeholder="تفاصيل إضافية" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* 5. Features & amenities */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-black text-slate-900 text-sm">5. المزايا والميزات</h3>
                <p className="text-[11px] text-slate-500">اختر المزايا التي توفرها العقار بشكل واقعي وواضح</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">المميزات والمرافق المتوفرة في العقار:</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {AMENITIES_LIST.map(amenity => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-50 border-brand-500 text-brand-700 font-extrabold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {currentCategoryForm.detailLabel}
                </label>
                <input
                  type="text"
                  value={categoryDetailText}
                  onChange={(e) => setCategoryDetailText(e.target.value)}
                  placeholder={currentCategoryForm.detailPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">قيمة رقمية</label>
                <input
                  type="text"
                  value={categoryNumericDetail}
                  onChange={(e) => setCategoryNumericDetail(e.target.value)}
                  placeholder={selectedCategory === "farms" ? "عمق البئر / م" : selectedCategory === "lands" ? "نسبة البناء" : selectedCategory === "factories" ? "KVA / 400" : selectedCategory === "shops" ? "م² / الواجهة" : selectedCategory === "villas" ? "مساحة المسبح / م" : selectedCategory === "buildings" ? "عدد مواقف السيارات" : "قيمة رقمية"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">معلومة إضافية</label>
                <input
                  type="text"
                  value={categoryExtraDetail}
                  onChange={(e) => setCategoryExtraDetail(e.target.value)}
                  placeholder={selectedCategory === "farms" ? "مسبح / خزان / حظيرة" : selectedCategory === "lands" ? "طول الواجهة" : selectedCategory === "factories" ? "ترخيص / ميناء تحميل" : selectedCategory === "shops" ? "مداخل / قبو" : selectedCategory === "villas" ? "سعة الكراج" : selectedCategory === "buildings" ? "محلات أرضية" : "تفاصيل إضافية"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">الوصف والتفاصيل الإضافية</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب تفاصيل إضافية عن العقار، قربه من المواصلات والأسواق والمدارس، حالة البناء والشارع، موعد التسليم..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-medium focus:bg-white focus:border-brand-500 outline-none min-h-[100px] resize-none" 
              />
            </div>
          </div>

          {/* 6. Advertiser Info */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>6. بيانات الاتصال بالمعلن</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المعلن / المكتب *</label>
                <input 
                  type="text" 
                  value={advertiserName}
                  onChange={(e) => setAdvertiserName(e.target.value)}
                  placeholder="محمد العلي" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم هاتف الاتصال *</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+963 9xx xxx xxx" 
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم واتساب للتواصل المباشر</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="971585193270" 
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold focus:bg-white outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black text-base py-4 rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{editingId ? "جاري حفظ التعديلات..." : "جاري حفظ الإعلان وإرساله للواتساب..."}</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                <span>{editingId ? "حفظ التعديلات" : "نشر العقار وإرسال التفاصيل لواتساب الإدارة فوراً"}</span>
              </>
            )}
          </button>
        </form>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">تم توثيق وإرسال إعلانك بنجاح!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تم حفظ كافة بيانات العقار وإعداد رسالة مفصلة لإرسالها عبر واتساب إلى مشرف المنصة للاعتماد والنشر الفوري.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={generatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>متابعة إرسال الإعلان عبر واتساب المشرف</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/properties");
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition-colors"
              >
                تصفح قائمة العقارات المنشورة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
