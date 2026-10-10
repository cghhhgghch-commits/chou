import { useParams, Link, useNavigate } from "react-router";
import { 
  ChevronRight, Heart, Share2, BadgeCheck, MapPin, 
  BedDouble, Bath, Grid, Phone, ChevronLeft, ChevronRight as ChevronIcon,
  Sun, ShieldCheck, CheckCircle2, Building, Sparkles, MessageSquare,
  AlertTriangle, Compass, Home, Layers, Trees, Store, Factory
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Property } from "../types";
import { APP_CONFIG, formatSyrianPrice, getWhatsAppUrl } from "../lib/constants";
import Image from "../components/ui/Image";
import { PROPERTY_IMAGE_FALLBACK } from "../config/images";
import Skeleton from "../components/ui/Skeleton";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      if (!id) {
        setProperty(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .eq("status", "active")
          .eq("is_verified", true)
          .single();

        if (error || !data) {
          setProperty(null);
        } else {
          setProperty({
            id: data.id,
            title: data.title || "عقار مميز في حلب",
            price: data.price || 0,
            pricePeriod: data.price_period || "",
            priceInUSD: data.price_in_usd || undefined,
            location: `${data.city_id || ""} ${data.area_id ? `- ${data.area_id}` : ""}`,
            city: data.city_id || "حلب",
            areaName: data.area_id || "",
            type: data.type || "sale",
            category: data.category || "houses",
            categoryType: data.category || "houses",
            propertyType: data.property_type || "apartment",
            ownershipType: data.ownership_type || "طابو أخضر 2400 سهم (سجل عقاري)",
            finishing: data.finishing || "سوبر ديلوكس",
            solarStatus: data.solar_status || "منظومة طاقة شمسية كاملة",
            direction: data.direction || "قبلي شرقي",
            floor: data.floor || "الطابق الثاني",
            totalFloors: data.total_floors || "",
            bedrooms: data.bedrooms || "3",
            bathrooms: data.bathrooms || 2,
            salons: data.salons || "صالون كبير",
            area: data.area || 150,
            landArea: data.land_area || undefined,
            furnishing: data.furnishing || "غير مفروش",
            hasSolarPower: Boolean(data.has_solar_power),
            hasWaterWell: Boolean(data.has_water_well),
            hasElevator: Boolean(data.has_elevator),
            hasGenerator: Boolean(data.has_generator),
            description: data.description || "عقار مميز بمواصفات ممتازة وموقع استراتيجي.",
            amenities: Array.isArray(data.amenities) ? data.amenities : ["طاقة شمسية", "سند طابو فوري"],
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
              PROPERTY_IMAGE_FALLBACK
            ],
            isVerified: data.is_verified ?? true,
            isFeatured: data.is_featured ?? false,
            advertiserType: data.advertiser_type || "owner",
            agent: {
              name: data.advertiser_name || "معلن عقاري معتمد",
              phone: data.phone || APP_CONFIG.adminPhone,
              whatsapp: data.whatsapp || data.phone || APP_CONFIG.adminPhone,
              avatar: data.avatar || ""
            },
            postedAt: "اليوم"
          });
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 p-4 pb-24">
        <div className="mx-auto max-w-6xl space-y-4 py-6">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-9 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-20" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl text-center space-y-4 max-w-md w-full border border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">لم يتم العثور على الإعلان</h2>
          <p className="text-xs text-slate-500">قد يكون الإعلان تم حذفه أو نقله.</p>
          <Link to="/properties" className="inline-block bg-slate-900 text-white text-xs font-bold px-6 py-3 rounded-xl">
            تصفح كل العقارات
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryTitle = () => {
    switch (property.category) {
      case 'houses':
      case 'sale':
      case 'rent':
      case 'furnished':
      case 'damascene_house':
        return 'قسم البيوت والشقق';
      case 'buildings':
        return 'قسم البنايات والأبراج';
      case 'farms':
        return 'قسم المزارع والاستراحات';
      case 'lands':
      case 'land':
        return 'قسم الأراضي والمقاسم';
      case 'shops':
      case 'commercial':
        return 'قسم المحلات والتجاري';
      case 'villas':
      case 'villa_farm':
        return 'قسم الفلل والقصور';
      case 'factories':
        return 'قسم المصانع والمنشآت';
      case 'other':
      case 'chalet':
      case 'student':
      case 'offplan':
        return 'قسم متنوع وأخرى';
      default: return 'عقار معتمد';
    }
  };

  const formattedPrice = Number(property.price).toLocaleString();
  const contactWhatsApp = property.agent.whatsapp || APP_CONFIG.adminPhone;
  const contactPhone = property.agent.phone || APP_CONFIG.adminPhone;

  const whatsappMessage = encodeURIComponent(
    `🇸🇾 *استفسار عن إعلان عقار عبر تطبيق لقطة*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🏠 *العنوان:* ${property.title}\n` +
    `📍 *الموقع:* ${property.location}\n` +
    `💰 *السعر المطلوب:* ${formattedPrice} ل.س ${property.pricePeriod ? `(${property.pricePeriod})` : ''}\n` +
    `📜 *نوع الطابو:* ${property.ownershipType || "معتمد"}\n` +
    `📐 *المساحة:* ${property.area} م²\n` +
    `🔗 *رابط الإعلان:* ${window.location.href}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `مرحباً، أود معرفة تفاصيل أكثر وتحديد موعد لمعاينة العقار.`
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-800 md:pb-12">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-white sticky top-0 z-40 border-b border-slate-200 shadow-2xs">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full text-slate-700">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          <button onClick={handleShare} className="p-2 bg-slate-100 rounded-full text-slate-700 relative">
            <Share2 className="w-4 h-4" />
            {copied && <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-0.5 px-2 rounded-md font-bold whitespace-nowrap">تم النسخ</span>}
          </button>
          <button className="p-2 bg-slate-100 rounded-full text-slate-700 hover:text-red-500">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-0 md:px-4 md:py-6">
        
        {/* Desktop Breadcrumb & Actions */}
        <div className="hidden md:flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-brand-600">الرئيسية</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <Link to="/properties" className="hover:text-brand-600">العقارات</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{property.title}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700">
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-red-600">
              <Heart className="w-3.5 h-3.5" />
              <span>حفظ</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            
            <div className="flex flex-wrap gap-2 px-1 md:px-0 pt-1">
              <span className="inline-flex items-center rounded-full bg-brand-50 border border-brand-200 px-2.5 py-1 text-[10px] font-black text-brand-700">{getCategoryTitle()}</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-700">{property.type === 'rent' ? 'إيجار' : property.type === 'offplan' ? 'على العظم' : 'بيع'}</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-black text-emerald-700">{property.city}</span>
            </div>

            {/* Image Gallery */}
            <div className="group relative aspect-[4/3] overflow-hidden border-y border-stone-200 bg-stone-200 md:rounded-xl md:border">
              <Image
                src={property.images[activeImage] || PROPERTY_IMAGE_FALLBACK}
                alt={property.title}
                containerClassName="absolute inset-0 h-full w-full"
              />
              
              {/* Badges on top of Image */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
                <span className="rounded-md bg-stone-950/85 px-3 py-1 text-xs font-bold text-white">
                  {getCategoryTitle()}
                </span>
                {property.isVerified && (
                  <div className="flex items-center gap-1 rounded-md bg-green-700 px-2.5 py-1 text-xs font-bold text-white">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>عقار موثوق</span>
                  </div>
                )}
              </div>
              
              {property.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-800" />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronIcon className="w-5 h-5 text-slate-800" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-xl text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5" />
                    <span>{activeImage + 1} / {property.images.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 px-4 md:px-0 hide-scrollbar">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${
                      activeImage === i ? "border-brand-500" : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${property.title} - صورة ${i + 1}`} containerClassName="h-full w-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Price & Core Title */}
            <div className="space-y-4 border-b border-stone-200 bg-white p-5 md:rounded-xl md:border md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl font-bold text-stone-950 md:text-3xl">{formattedPrice}</h1>
                  <span className="text-sm font-bold text-stone-700">ليرة سورية</span>
                  {property.pricePeriod && (
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">/ {property.pricePeriod}</span>
                  )}
                </div>

                {property.priceInUSD && (
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-black w-fit">
                    <span>معادل:</span>
                    <span>${Number(property.priceInUSD).toLocaleString()} USD</span>
                  </div>
                )}
              </div>
              
                <h2 className="text-lg font-bold leading-8 text-stone-900 md:text-xl">
                {property.title}
              </h2>
              
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{property.location}</span>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 border-t border-stone-200 pt-4 sm:grid-cols-3">
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-start">
                  <span className="mb-0.5 block text-xs font-medium text-stone-600">المساحة</span>
                  <span className="text-sm font-bold text-stone-900">{property.area} م²</span>
                </div>

                {property.landArea && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-start">
                    <span className="mb-0.5 block text-xs font-medium text-stone-600">مساحة الأرض</span>
                    <span className="text-sm font-bold text-stone-900">{property.landArea} م²</span>
                  </div>
                )}

                {property.bedrooms && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-start">
                    <span className="mb-0.5 block text-xs font-medium text-stone-600">الغرف</span>
                    <span className="block truncate text-sm font-bold text-stone-900">{property.bedrooms}</span>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-start">
                    <span className="mb-0.5 block text-xs font-medium text-stone-600">الحمامات</span>
                    <span className="text-sm font-bold text-stone-900">{property.bathrooms}</span>
                  </div>
                )}

                {property.floor && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-start">
                    <span className="mb-0.5 block text-xs font-medium text-stone-600">الطابق</span>
                    <span className="block truncate text-sm font-bold text-stone-900">{property.floor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Syrian Real Estate Specifications (Dubizzle Standard) */}
            <div className="space-y-4 border-b border-stone-200 bg-white p-5 md:rounded-xl md:border md:p-6">
              <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>المواصفات القانونية والتجهيز الكامل</span>
              </h3>

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {property.ownershipType && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">نوع سند الملكية والطابو:</span>
                    <span className="block text-sm font-bold leading-7 text-stone-900">{property.ownershipType}</span>
                  </div>
                )}

                {property.solarStatus && (
                  <div className="rounded-lg border border-stone-200 bg-white p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">منظومة الكهرباء والطاقة:</span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{property.solarStatus}</span>
                    </span>
                  </div>
                )}

                {property.finishing && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">مستوى الكسوة:</span>
                    <span className="text-sm font-bold text-stone-900">{property.finishing}</span>
                  </div>
                )}

                {property.furnishing && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">حالة الفرش:</span>
                    <span className="text-sm font-bold text-stone-900">{property.furnishing}</span>
                  </div>
                )}

                {property.direction && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">الاتجاه والواجهة:</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-stone-900">
                      <Compass className="w-3.5 h-3.5 text-brand-600" />
                      <span>{property.direction}</span>
                    </span>
                  </div>
                )}

                {property.salons && (
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                    <span className="mb-1 block text-xs font-medium text-stone-600">الصالونات والمضافات:</span>
                    <span className="text-sm font-bold text-stone-900">{property.salons}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 border-b border-stone-200 bg-white p-5 md:rounded-xl md:border md:p-6">
              <h3 className="text-sm md:text-base font-black text-slate-900">تفاصيل ووصف العقار</h3>
              <p className="text-slate-700 leading-relaxed text-xs md:text-sm whitespace-pre-line font-medium">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4 border-b border-stone-200 bg-white p-5 md:rounded-xl md:border md:p-6">
                <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>المميزات والخدمات المتاحة</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex min-h-11 items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-sm font-medium text-stone-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Desktop Contact Card) */}
          <div className="hidden md:block col-span-1">
            <div className="sticky top-20 space-y-5 rounded-xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-lg font-bold text-stone-800">
                  {property.agent.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{property.agent.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {property.advertiserType === "owner" ? "المالك المباشر" : property.advertiserType === "agency" ? "مكتب عقاري معتمد" : "وسيط عقاري"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a 
                  href={`https://wa.me/${contactWhatsApp}?text=${whatsappMessage}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تواصل فوري عبر واتساب</span>
                </a>

                <a 
                  href={`tel:${contactPhone}`} 
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-stone-800 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال هاتفي مباشر</span>
                </a>
              </div>

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5">
                <div className="flex items-start gap-2 text-start text-[10px] font-semibold leading-relaxed text-amber-900">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>نصيحة أمان: لا تقم بتحويل أي دفعات أو مبالغ مسبقة قبل معاينة العقار شخصياً والتحقق من سندات الملكية.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-2.5 border-t border-stone-200 bg-white p-3 shadow-sm md:hidden">
        <a 
          href={`tel:${contactPhone}`} 
          className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-stone-800 py-3 text-sm font-bold text-white"
        >
          <Phone className="w-4 h-4" />
          <span>اتصال</span>
        </a>
        <a 
          href={`https://wa.me/${contactWhatsApp}?text=${whatsappMessage}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex min-h-11 flex-[1.6] items-center justify-center gap-1.5 rounded-lg bg-green-700 py-3 text-sm font-bold text-white"
        >
          <MessageSquare className="w-4 h-4" />
          <span>واتساب المعلن</span>
        </a>
      </div>
    </div>
  );
}
