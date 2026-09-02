export type PropertyCategory = 
  | 'houses'          // بيوت
  | 'buildings'       // بنايات
  | 'farms'           // مزارع
  | 'lands'           // أراضي
  | 'shops'           // محلات
  | 'villas'          // فلل
  | 'factories'       // مصانع
  | 'other'           // أخرى
  // Backward compatibility alias types
  | 'sale' | 'rent' | 'furnished' | 'damascene_house' | 'chalet' | 'villa_farm' | 'student' | 'commercial' | 'offplan' | 'land';

export type SyrianPropertyType = 
  | 'apartment'       // شقة سكنية عادية / طابقية / دوبلكس
  | 'studio'          // استوديو / ملحق مستقل (روف)
  | 'damascene_house' // بيت عربي دمشقي / حلبي قديم (أرض ديار)
  | 'villa_farm'      // فيلا / مزرعة مستقلة مع مسبح
  | 'student_room'    // سكن طلاب وشباب / غرف مستقلة
  | 'chalet'          // شاليه بحري أو جبلي مصيف
  | 'commercial_shop' // محل تجاري / فروغ / صالة
  | 'office_clinic'   // مكتب / عيادة / مقر شركة
  | 'offplan_raw'     // شقة على العظم (قيد الإنشاء)
  | 'land_plot';      // أرض زراعية / مقسم سكني / عمار

export type SyrianOwnershipType = 
  | 'طابو أخضر 2400 سهم (سجل عقاري)'
  | 'حكم محكمة مبرم ومكتسب الدرجة القطعية'
  | 'وكالة كاتب عدل غير قابلة للعزل'
  | 'فروغ تجاري نظامي'
  | 'جمعية سكنية / إسكان'
  | 'طابو زراعي أسهم مشاع'
  | 'طابو سجل صناعي / ترخيص'
  | 'عقد بيع قطعي مع تسليم المفتاح';

export type SyrianFinishing = 
  | 'سوبر ديلوكس حديث'
  | 'ديلوكس'
  | 'إكساء عادي نظيف'
  | 'على العظم (قيد الإنشاء)'
  | 'مفروش بالكامل VIP'
  | 'مفروش عادي'
  | 'نصف مفروش';

export type SyrianSolarPower = 
  | 'منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)'
  | 'إنفيرتر وبطاريات إنارة وتشغيل'
  | 'تمديد طاقة جاهز بدون بطاريات'
  | 'اشتراك مولدة / خط أمبير'
  | 'لا يوجد (شبكة كهرباء فقط)';

export interface FarmSpecs {
  landDunams?: string; // مساحة بالدونمات
  waterWellDepth?: string; // عمق البئر الارتوازي بالمتر
  waterWellYield?: string; // غزارة البئر (إنش / م3 بالساعة)
  waterWellPump?: string; // غطاس ومضخة مياه
  irrigationType?: string; // شبكة تنقيط / ري رذاذي حديث
  poolSpecs?: string; // مواصفات المسبح والفلترة (أبعاد، عمق، مسبح أطفال)
  treesCount?: string; // عدد ونوع الأشجار المثمرة (زيتون، فواكه، حمضيات)
  livingVillaArea?: string; // مساحة الاستراحة / السكن الداخلي
  farmFacilities?: string[]; // حظائر، سكن حارس، مستودع أعلاف
  solarPumpPower?: string; // استطاعة الطاقة لتشغيل الغطاس والإنارة
  fenceType?: string; // نوع السور والبوابة
}

export interface VillaSpecs {
  builtArea?: string; // المساحة المبنية الإجمالية
  floorsCount?: string; // عدد الطوابق (قبو، أرضي، أول، روف)
  masterSuites?: string; // عدد أجنحة الماستر مع حمام ودريسينج
  privatePool?: string; // مسبح وجاكوزي خاص مع فلترة وتدفئة
  smartHome?: boolean; // نظام بيت ذكي وتحكم بالهاتف
  luxuryAmenities?: string[]; // سينما، جيم، مصعد بانورامي، ساونا وبخار
  garageCapacity?: string; // سعة الكراج المغلق مع باب أوتوماتيكي
  maidDriverQuarters?: string; // سكن الخدم وغرفة السائق
  claddingMaterial?: string; // رخام إيطالي / حجر طبيعي معزول
  landscapeGarden?: string; // حديقة منسقة وشلالات وجلسات شواء
}

export interface FactorySpecs {
  totalArea?: string; // المساحة الإجمالية
  hangarArea?: string; // مساحة الهنغار المسقوف
  yardArea?: string; // الساحة المكشوفة والمناورات
  ceilingHeight?: string; // ارتفاع السقف والجمالون بالمتر الصافي
  powerCapacity?: string; // استطاعة الكهرباء KVA وخط 3 فاز ومحولة
  industrialLicense?: string; // نوع السجل الصناعي والتراخيص الممنوحة
  adminOffices?: string; // مبنى الإدارة المستقل وسكن العمال
  loadingDocks?: string; // مداخل تريلات، ميزان بسكول، ونش سقفي
  flooringType?: string; // أرضيات هليكوبتر مسلحة / إيبوكسي صناعي
  fireSafetySystem?: string; // شبكة إطفاء ومرشات حريق معتمدة
}

export interface LandSpecs {
  zoningType?: string; // نوع التنظيم (سكني فلل، طابقي، تجاري، زراعي)
  buildingRatio?: string; // النسبة الطابقية وعدد الطوابق المسموحة
  streetFrontage?: string; // طول الواجهة على الشارع بالمتر
  streetWidth?: string; // عرض الشارع بالمتر
  infrastructure?: string[]; // ماء، كهرباء، هاتف، زفت، صرف صحي
}

export interface CommercialSpecs {
  shopFrontage?: string; // واجهة المحل بالمتر
  mezzanineArea?: string; // سدة وميزانين
  basementArea?: string; // قبو تخزين ملحق
  rightsType?: string; // نوع الحق (فروغ، ملكية، إيجار سنوي)
  pedestrianTraffic?: string; // حركة المارة وموقع الشارع
}

export interface BuildingSpecs {
  totalFloors?: string; // إجمالي الطوابق
  apartmentsCount?: string; // عدد الشقق السكنية
  shopsCount?: string; // عدد المحلات التجارية الأرضية
  parkingSpaces?: string; // مواقف السيارات تحت الأرض
  annualIncome?: string; // الدخل والعائد الاستثماري المتوقع
}

export interface Property {
  id: string;
  user_id?: string;
  title: string;
  price: number;
  pricePeriod?: 'سنوياً' | 'شهرياً' | 'يومياً' | 'موسمي' | '3 أشهر سلف' | '6 أشهر سلف' | string;
  priceInUSD?: number;
  location: string;
  city: string;
  areaName?: string;
  type: 'sale' | 'rent' | 'offplan' | string;
  category: PropertyCategory;
  categoryType?: string;
  propertyType: SyrianPropertyType | string;
  ownershipType?: SyrianOwnershipType | string;
  finishing?: SyrianFinishing | string;
  solarStatus?: SyrianSolarPower | string;
  direction?: string;
  floor?: string;
  totalFloors?: string;
  bedrooms?: number | string;
  bathrooms?: number;
  salons?: string;
  area: number;
  landArea?: number;
  furnishing?: 'مفروش' | 'غير مفروش' | 'مفروش جزئياً' | string;
  hasSolarPower?: boolean;
  hasWaterWell?: boolean;
  hasElevator?: boolean;
  hasGenerator?: boolean;
  description: string;
  amenities: string[];
  images: string[];
  isVerified: boolean;
  isFeatured?: boolean;
  status?: 'active' | 'pending' | 'sold' | 'rented' | string;
  advertiserType?: 'owner' | 'agent' | 'agency' | string;
  farmSpecs?: FarmSpecs;
  villaSpecs?: VillaSpecs;
  factorySpecs?: FactorySpecs;
  landSpecs?: LandSpecs;
  commercialSpecs?: CommercialSpecs;
  buildingSpecs?: BuildingSpecs;
  agent: {
    name: string;
    phone: string;
    whatsapp: string;
    avatar?: string;
    isAgency?: boolean;
  };
  postedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ad_submitted' | 'ad_approved' | 'new_property' | 'new_studio' | 'new_chalet' | 'service' | 'system' | 'new_message' | 'property_interaction' | 'account_event';
  propertyId?: string;
  conversationId?: string;
  userId?: string;
  propertyTitle?: string;
  cityName?: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  iconType?: 'whatsapp' | 'building' | 'bell' | 'sun' | 'check' | 'home' | 'sparkles' | 'message';
  metadata?: Record<string, string>;
}
