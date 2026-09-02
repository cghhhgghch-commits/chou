import { useParams, Link, useNavigate } from "react-router";
import { 
  ChevronRight, Heart, Share2, BadgeCheck, MapPin, 
  BedDouble, Bath, Grid, Phone, ChevronLeft, ChevronRight as ChevronIcon,
  Sun, ShieldCheck, CheckCircle2, Building, Sparkles, MessageSquare,
  AlertTriangle, Loader2, Compass, Home, Layers, Trees, Store, Factory
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Property } from "../types";
import { APP_CONFIG, formatSyrianPrice, getWhatsAppUrl } from "../lib/constants";

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
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">جاري تحميل تفاصيل العقار...</p>
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
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12 text-slate-800">
      
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

      <div className="container mx-auto max-w-5xl md:px-4 md:py-6">
        
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            
            <div className="flex flex-wrap gap-2 px-1 md:px-0 pt-1">
              <span className="inline-flex items-center rounded-full bg-brand-50 border border-brand-200 px-2.5 py-1 text-[10px] font-black text-brand-700">{getCategoryTitle()}</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-black text-slate-700">{property.type === 'rent' ? 'إيجار' : property.type === 'offplan' ? 'على العظم' : 'بيع'}</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-black text-emerald-700">{property.city}</span>
            </div>

            {/* Image Gallery */}
            <div className="relative bg-slate-900 md:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-video group border border-slate-200 shadow-xs">
              <img 
                src={property.images[activeImage] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"} 
                alt={property.title} 
                className="w-full h-full object-cover" 
              />
              
              {/* Badges on top of Image */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10">
                <span className="px-3 py-1 rounded-xl text-xs font-black shadow-md bg-slate-900/90 backdrop-blur-xs text-white">
                  {getCategoryTitle()}
                </span>
                {property.isVerified && (
                  <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
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
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === i ? "border-brand-500 scale-95 ring-2 ring-brand-500/20" : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Price & Core Title */}
            <div className="bg-white p-5 md:p-7 md:rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{formattedPrice}</h1>
                  <span className="text-sm font-bold text-slate-600">ليرة سورية</span>
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
              
              <h2 className="text-base md:text-xl font-black text-slate-900 leading-snug">
                {property.title}
              </h2>
              
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span>{property.location}</span>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">المساحة</span>
                  <span className="font-black text-slate-900 text-xs sm:text-sm">{property.area} م²</span>
                </div>

                {property.landArea && (
                  <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">مساحة الأرض</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">{property.landArea} م²</span>
                  </div>
                )}

                {property.bedrooms && (
                  <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">الغرف</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm truncate block">{property.bedrooms}</span>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">الحمامات</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">{property.bathrooms}</span>
                  </div>
                )}

                {property.floor && (
                  <div className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">الطابق</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm truncate block">{property.floor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Syrian Real Estate Specifications (Dubizzle Standard) */}
            <div className="bg-white p-5 md:p-7 md:rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>المواصفات القانونية والتجهيز الكامل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.ownershipType && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <span className="text-slate-500 font-bold block text-[11px] mb-1">نوع سند الملكية والطابو:</span>
                    <span className="font-black text-blue-900 text-xs leading-tight block">{property.ownershipType}</span>
                  </div>
                )}

                {property.solarStatus && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
                    <span className="text-amber-800 font-bold block text-[11px] mb-1">منظومة الكهرباء والطاقة:</span>
                    <span className="font-black text-amber-950 text-xs flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{property.solarStatus}</span>
                    </span>
                  </div>
                )}

                {property.finishing && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-slate-500 font-bold block text-[11px] mb-1">مستوى الكسوة:</span>
                    <span className="font-black text-slate-900 text-xs">{property.finishing}</span>
                  </div>
                )}

                {property.furnishing && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-slate-500 font-bold block text-[11px] mb-1">حالة الفرش:</span>
                    <span className="font-black text-slate-900 text-xs">{property.furnishing}</span>
                  </div>
                )}

                {property.direction && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-slate-500 font-bold block text-[11px] mb-1">الاتجاه والواجهة:</span>
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-brand-600" />
                      <span>{property.direction}</span>
                    </span>
                  </div>
                )}

                {property.salons && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="text-slate-500 font-bold block text-[11px] mb-1">الصالونات والمضافات:</span>
                    <span className="font-black text-slate-900 text-xs">{property.salons}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-5 md:p-7 md:rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm md:text-base font-black text-slate-900">تفاصيل ووصف العقار</h3>
              <p className="text-slate-700 leading-relaxed text-xs md:text-sm whitespace-pre-line font-medium">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white p-5 md:p-7 md:rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>المميزات والخدمات المتاحة</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Desktop Contact Card) */}
          <div className="hidden md:block col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-20 shadow-xs space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-lg font-black border border-brand-100">
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
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-xs font-black transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تواصل فوري عبر واتساب</span>
                </a>

                <a 
                  href={`tel:${contactPhone}`} 
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 text-xs font-bold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال هاتفي مباشر</span>
                </a>
              </div>

              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70 text-center">
                <p className="text-[10px] text-amber-900 leading-relaxed font-semibold">
                  ⚠️ نصيحة أمان: لا تقم بتحويل أي دفعات أو مبالغ مسبقة قبل معاينة العقار شخصياً والتحقق من سندات الملكية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40 flex items-center gap-2.5 shadow-lg">
        <a 
          href={`tel:${contactPhone}`} 
          className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Phone className="w-4 h-4" />
          <span>اتصال</span>
        </a>
        <a 
          href={`https://wa.me/${contactWhatsApp}?text=${whatsappMessage}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-[1.6] py-3 bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>واتساب المعلن</span>
        </a>
      </div>
    </div>
  );
}
