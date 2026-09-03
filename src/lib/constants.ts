export const WHATSAPP_NUMBER = "971585193270";

export const APP_CONFIG = {
  name: "لقطة",
  description: "منصة عقارية متخصصة في بيع وإيجار البيوت، البنايات، المزارع، الأراضي، المحلات، الفلل، والمصانع.",
  adminEmail: "laqtasyr1@gmail.com",
  adminPhone: "+971585193270",
  adminWhatsApp: WHATSAPP_NUMBER,
  supportEmail: "laqtasyr1@gmail.com",
  currencySymbol: "ل.س",
  currencyName: "ليرة سورية",
};

export const formatSyrianPrice = (price: number): string => {
  if (!price || isNaN(price)) return "";
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(2)} مليار ل.س`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} مليون ل.س`;
  }
  return `${price.toLocaleString()} ل.س`;
};

export const sanitizeWhatsAppNumber = (phone?: string) => {
  const digits = (phone ?? APP_CONFIG.adminWhatsApp).replace(/[^0-9]/g, "");
  if (!digits) return APP_CONFIG.adminWhatsApp;
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
};

export const getWhatsAppUrl = (message: string, customPhone?: string) => {
  const phone = sanitizeWhatsAppNumber(customPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const SYRIAN_CITIES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "الرقة",
  "دير الزور",
  "الحسكة",
  "درعا",
  "السويداء",
  "القنيطرة"
];

// 8 Core Categories
export const SYRIAN_CATEGORIES = [
  { id: "houses", label: "بيوت", subtitle: "شقق سكنية وبيوت عربية ودوبلكس", icon: "🏠" },
  { id: "buildings", label: "بنايات", subtitle: "أبنية سكنية وعمارات استثمارية", icon: "🏢" },
  { id: "farms", label: "مزارع", subtitle: "بساتين زيتون واستراحات ريفية", icon: "🌾" },
  { id: "lands", label: "أراضي", subtitle: "مقاسم سكنية وأراض زراعية", icon: "🗺️" },
  { id: "shops", label: "محلات", subtitle: "محلات وفروغ وصالات تجارية", icon: "🏬" },
  { id: "villas", label: "فلل", subtitle: "فلل مستقلة وبيوت ريفية", icon: "🏰" },
  { id: "factories", label: "مصانع", subtitle: "هناغر ومستودعات ومنشآت صناعية", icon: "🏭" },
  { id: "other", label: "أخرى", subtitle: "شاليهات واستوديوهات وسكن طلاب", icon: "✨" },
];

export const OWNERSHIP_TYPES = [
  "طابو أخضر 2400 سهم (سجل عقاري نظامي)",
  "حكم محكمة مبرم ومكتسب الدرجة القطعية",
  "وكالة كاتب عدل خاصة غير قابلة للعزل",
  "طابو زراعي أسهم مشاع",
  "فروغ تجاري نظامي وسند ملكية",
  "جمعية سكنية / إسكان رسمي",
  "عقد بيع قطعي وتنازل فوري"
];

export const SYRIAN_OWNERSHIP_OPTIONS = OWNERSHIP_TYPES;

export const FINISHING_TYPES = [
  "سوبر ديلوكس حديث (تشطيب VIP)",
  "ديلوكس ممتاز",
  "إكساء عادي نظيف وجاهز للسكن",
  "على العظم / الهيكل (قيد الإكساء)",
  "مفروش بالكامل VIP",
  "مفروش عادي"
];

export const DUBIZZLE_FINISHING = FINISHING_TYPES;

export const SOLAR_OPTIONS = [
  "منظومة طاقة شمسية كاملة (إنفرتر + بطاريات ليثيوم 24/7)",
  "إنفرتر وبطاريات إنارة وتشغيل أساسي",
  "تمديد خطوط طاقة شمسية جاهز بالكامل",
  "اشتراك مولدة / خط أمبير كهرباء",
  "شبكة كهرباء عامة فقط"
];

export const DUBIZZLE_SOLAR_OPTIONS = SOLAR_OPTIONS;

export const AMENITIES_LIST = [
  "منظومة طاقة شمسية وإنفرتر",
  "مصعد كهربائي شغال 24/7",
  "اشتراك أمبير / مولدة خاصة",
  "بئر ماء ارتوازي مجهز",
  "خزان ماء أرضي وعلوي مع مضخة",
  "كراج / موقف سيارة خاص مسور",
  "حديقة خاصة / مساحات خضراء",
  "مسبح خاص مفلتر ومجهز",
  "حارس بناء وكاميرات مراقبة",
  "باب مصفح وإنتركم شاشة",
  "خط هاتف أرضي وإنترنت فايبر",
  "تدفئة مركزية شوفاج / تدفئة أرضية",
  "مكيفات إنفرتر راكبة",
  "شترات كهربائية ونوافذ دبل جلاس",
  "إطلالة مفتوحة لا تُحجب",
  "طابو جاهز للإفراغ الفوري"
];

export const DUBIZZLE_AMENITIES_LIST = AMENITIES_LIST;

export const DUBIZZLE_DIRECTIONS = [
  "قبلي (جنوبي مشمس)",
  "شمالي (بحري لطيف)",
  "شرقي (شمس صباحية)",
  "غربي (شمس غاربة)",
  "قبلي شرقي (زاوي)",
  "قبلي غربي (زاوي)",
  "شمالي شرقي",
  "شمالي غربي",
  "مفتوح على 3 جهات",
  "مفتوح على 4 جهات / زاوية مستقلة"
];

export const DUBIZZLE_FLOORS = [
  "قبو سكني / تجاري",
  "طابق أرضي مع حديقة خاصة",
  "طابق أول فني",
  "طابق ثاني",
  "طابق ثالث",
  "طابق رابع",
  "طابق خامس فما فوق",
  "طابق أخير مع سطح مستقل (روف / بنتهاوس)",
  "دوبلكس (طابقين داخليين)",
  "فيلا كاملة متعددة الطوابق"
];

export const DUBIZZLE_FURNISHING_OPTIONS = [
  "غير مفروش (فارغ جاهز للسكن)",
  "مفروش بالكامل VIP (فرش راقي وأجهزة)",
  "مفروش عادي نظيف",
  "نصف مفروش (مطبخ وتكييف فقط)"
];

export const SYRIAN_GOVERNORATES = [
  {
    id: "aleppo",
    name: "حلب",
    popularAreas: ["حلب", "حي العمد", "الشيخ سعد", "الميدان", "الأعظمية", "الفرقان", "القدم", "المزة", "بستان القصر", "مطار حلب"]
  },
  {
    id: "aleppo_rural",
    name: "ريف حلب",
    popularAreas: ["منبج", "الباب", "أعزاز", "عفرين", "جرابلس", "السفيرة", "دير حافر", "عين العرب"]
  },
  {
    id: "northern_aleppo",
    name: "الشمال",
    popularAreas: ["التل", "داريا", "حرستا", "التل", "السحيمية"]
  }
];
