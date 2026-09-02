import { Property } from "../types";

export const dummyProperties: Property[] = [
  // 1. بيوت (Houses & Apartments)
  {
    id: "prop-1",
    title: "شقة فاخرة بإطلالة مفتوحة على حديقة تشرين",
    price: 950000000,
    priceInUSD: 65000,
    location: "المالكي، دمشق",
    city: "دمشق",
    areaName: "المالكي",
    type: "sale",
    category: "houses",
    propertyType: "apartment",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    floor: "الطابق الثالث",
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    furnishing: "غير مفروش",
    hasSolarPower: true,
    hasElevator: true,
    hasGenerator: true,
    description: "شقة سكنية راقية في أرقى أحياء دمشق (المالكي) بإطلالة مباشرة على حديقة تشرين. كسوة سوبر ديلوكس حديثة، شوفاج وتدفئة مركزية، تمديدات طاقة شمسية كاملة مع بطاريات ليثيوم. بناء مكسي حجر مخدم بمصعد حديث وبئر ماء.",
    amenities: ["طابو أخضر 2400 سهم", "طاقة شمسية ليثيوم", "مصعد حديث", "بئر ماء ارتوازي", "مولدة للبناء", "تدفئة مركزية شوفاج", "بلكونة واسعة", "حراسة 24/7"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18efc2069?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "مكتب المالكي العقاري",
      phone: "+963988112233",
      whatsapp: "971585193270",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
      isAgency: true
    },
    postedAt: "2026-08-29T10:00:00Z"
  },
  
  {
    id: "prop-2",
    title: "شقة واسعة للإيجار السكني العائلي في أبو رمانة",
    price: 3500000,
    pricePeriod: "شهرياً",
    location: "أبو رمانة، دمشق",
    city: "دمشق",
    areaName: "أبو رمانة",
    type: "rent",
    category: "houses",
    propertyType: "apartment",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "ديلوكس",
    solarStatus: "إنفيرتر وبطاريات إنارة وتشغيل",
    floor: "الطابق الثاني",
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    furnishing: "غير مفروش",
    hasElevator: true,
    hasSolarPower: true,
    description: "شقة للإيجار العائلي في موقع مميز وهادئ في أبو رمانة بالقرب من ساحة النجمة. صالون واسع مع برندة، 3 غرف نوم، مطبخ مجهز بخشب زان، منظومة إنفيرتر وبطاريات راكبة.",
    amenities: ["مصعد شغال", "إنفيرتر وبطاريات", "مطبخ راكب خشب زان", "موقف سيارة", "خزان ماء إضافي مع دينمو"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب قاسيون للخدمات العقارية",
      phone: "+963933445566",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T08:00:00Z"
  },

  {
    id: "prop-4",
    title: "بيت عربي دمشقي أثري مرمم مع أرض ديار وبحرة رخام",
    price: 1800000000,
    priceInUSD: 120000,
    location: "باب توما، دمشق القديمة",
    city: "دمشق",
    areaName: "باب توما",
    type: "sale",
    category: "houses",
    propertyType: "damascene_house",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    bedrooms: 5,
    bathrooms: 3,
    area: 280,
    furnishing: "مفروش جزئياً",
    hasSolarPower: true,
    hasWaterWell: true,
    description: "تحفة معمارية دمشقية في قلب باب توما. بيت عربي أصيل مرمم بأعلى المعايير، يضم أرض ديار واسعة، بحرة ماء رخامية قديمة، شجرة نارنج وياسمين دمشقي، أقواس حجرية أثرية، قاعة عجمي خشبية، وغرف طابقين مع سطح مطل على كنائس وجوامع الشام القديمة.",
    amenities: ["طابو أخضر 2400 سهم", "أرض ديار وبحرة رخام", "قاعة عجمي أثرية", "طاقة شمسية كاملة", "بئر ماء عذب", "شجر نارنج وياسمين", "مناسب للاستثمار السياحي كافيه/أوتيل"],
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "مؤسسة تراث الشام العقارية",
      phone: "+963966554433",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T09:00:00Z"
  },

  {
    id: "prop-11",
    title: "شقة عائلية مشمسة طابو أخضر بحي الموغامبو الراقي",
    price: 680000000,
    priceInUSD: 45000,
    location: "الموغامبو، حلب",
    city: "حلب",
    areaName: "الموغامبو",
    type: "sale",
    category: "houses",
    propertyType: "apartment",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "ديلوكس",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    floor: "الطابق الثاني",
    bedrooms: 3,
    bathrooms: 2,
    area: 170,
    furnishing: "غير مفروش",
    hasElevator: true,
    hasSolarPower: true,
    description: "شقة سكنية بتشطيب ممتاز في أرقى أحياء حلب. 3 غرف نوم وصالون ضيوف مستقل، طاقة شمسية جاهزة، بناء حجر مميز مع مصعد شغال وخط أمبير ومياه مستقرة.",
    amenities: ["طابو أخضر 2400 سهم", "مصعد", "طاقة شمسية", "خزان ماء كبير", "بلكونة مشمسة", "موقع مخدم وهادئ"],
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب الشهباء للخدمات العقارية",
      phone: "+963922334455",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-28T11:30:00Z"
  },

  // 2. بنايات (Buildings)
  {
    id: "prop-12",
    title: "بناية سكنية وتجارية كاملة 5 طوابق طابو أخضر نظامي",
    price: 6500000000,
    priceInUSD: 430000,
    location: "الميدان، دمشق",
    city: "دمشق",
    areaName: "الميدان",
    type: "sale",
    category: "buildings",
    propertyType: "building",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "ديلوكس",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    area: 1200,
    hasElevator: true,
    hasGenerator: true,
    hasWaterWell: true,
    description: "بناية كاملة مستقلة مؤلفة من 5 طوابق سكنية بالإضافة إلى محلات تجارية بالطابق الأرضي وقبو تخزين واسع. موقع استراتيجي على شارع رئيسي حيوي، مناسبة للاستثمار التأجيري أو مقر شركات ومنظمات.",
    amenities: ["طابو أخضر نظامي 2400 سهم", "محلات تجارية أرضية", "مصعد كهربائي حديث", "بئر ماء ارتوازي", "مولدة كهربائية ضخمة", "مواقف سيارات خاصة"],
    images: [
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "مكتب الميدان للاستثمار العقاري",
      phone: "+963944332211",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T11:00:00Z"
  },

  {
    id: "prop-13",
    title: "برج سكني حديث قيد التشطيب والإكساء في مشروع دمر",
    price: 8200000000,
    priceInUSD: 540000,
    location: "مشروع دمر، دمشق",
    city: "دمشق",
    areaName: "مشروع دمر",
    type: "sale",
    category: "buildings",
    propertyType: "building",
    ownershipType: "جمعية سكنية / إسكان",
    finishing: "على العظم (قيد الإنشاء)",
    area: 2100,
    hasElevator: true,
    description: "مبنى برجي سكني مؤلف من 7 طوابق (14 شقة سكنية مستقلة + روف بانورامي + طابقين كراج ومستودعات). واجهات حجر طبيعي جاهزة ومطلة على التلال الخضراء.",
    amenities: ["مواقف تحت الأرض", "تجهيزات مصاعد مزدوجة", "واجهات حجر سوري نخب أول", "موقع استثماري ممتاز"],
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "شركة البنيان الهندسية",
      phone: "+963955112288",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-28T14:00:00Z"
  },

  // 3. مزارع (Farms)
  {
    id: "prop-6",
    title: "مزرعة واستراحة فاخرة مع مسبح مفلتر وطاقة 20KW",
    price: 3200000000,
    priceInUSD: 210000,
    location: "يعفور، ريف دمشق",
    city: "ريف دمشق",
    areaName: "يعفور",
    type: "sale",
    category: "farms",
    propertyType: "villa_farm",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    bedrooms: 5,
    bathrooms: 4,
    area: 2500,
    furnishing: "مفروش",
    hasSolarPower: true,
    hasWaterWell: true,
    hasGenerator: true,
    description: "مزرعة واستراحة نموذجية متكاملة في يعفور. مساحة الأرض 2500م تضم فيلا 450م طابقين، مسبح عائلي مفلتر، منظومة طاقة شمسية 20 كيلو واط، بئر ماء عذب ارتوازي، أشجار زيتون وفواكه مثمرة مع جلسات ومطبخ خارجي للشواء.",
    amenities: ["طابو أخضر 2400 سهم", "مسبح خاص مفلتر", "طاقة شمسية 20KW", "بئر ماء خاص", "مولدة كهرباء", "كاميرات مراقبة", "حديقة منسقة", "شواء وجلسات خارجية"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "يعفور للعقارات والفلل والمزارع",
      phone: "+963999887766",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T10:00:00Z"
  },

  {
    id: "prop-17",
    title: "مزرعة ريفية منتجة أشجار زيتون وجوز مع سكن وكهرباء",
    price: 850000000,
    priceInUSD: 56000,
    location: "صحنايا، ريف دمشق",
    city: "ريف دمشق",
    areaName: "صحنايا",
    type: "sale",
    category: "farms",
    propertyType: "villa_farm",
    ownershipType: "طابو زراعي أسهم مشاع",
    finishing: "إكساء عادي نظيف",
    area: 4000,
    hasWaterWell: true,
    hasSolarPower: true,
    description: "مزرعة زراعية خصبة مساحة 4 دونم محاطة بسياج، تضم 120 شجرة زيتون مثمرة وشجر جوز ودراق. مجهزة ببئر ماء وشبكة ري بالتنقيط ومنظومة طاقة شمسية وغرفتين نوم للراحة.",
    amenities: ["بئر ماء غزير", "طاقة شمسية", "شبكة ري بالتنقيط", "منزل ريفي صغير", "أشجار مثمرة", "طريق معبد للسيارات"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب الغوطة الزراعي",
      phone: "+963933998877",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-27T16:00:00Z"
  },

  // 4. أراضي (Lands)
  {
    id: "prop-10",
    title: "مقسم أرض زراعية وسكنية مسور مع بئر ماء وكهرباء",
    price: 1350000000,
    priceInUSD: 90000,
    location: "طريق المطار، ريف دمشق",
    city: "ريف دمشق",
    areaName: "طريق المطار",
    type: "sale",
    category: "lands",
    propertyType: "land_plot",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    area: 2500,
    hasWaterWell: true,
    description: "أرض زراعية وسكنية مستوية ومنتجة، محاطة بسور حجري وبوابة حديدية عريضة. تحتوي على غراس زيتون وحمضيات مثمرة، بئر ماء ارتوازي مرخص مع مضخة غاطسة، محولة كهرباء، وغرفة حارس مستقلة.",
    amenities: ["طابو نظامي 2400 سهم", "بئر ماء مرخص", "محولة كهرباء", "مسورة بالكامل", "أشجار مثمرة", "غرفة حارس"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب مروج الشام للأراضي",
      phone: "+963955223344",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-27T10:00:00Z"
  },

  {
    id: "prop-14",
    title: "أرض مقسم سكني وتنظيم عمار طابو أخضر نخب أول",
    price: 2100000000,
    priceInUSD: 140000,
    location: "قدسيا الجديدة، ريف دمشق",
    city: "ريف دمشق",
    areaName: "قدسيا الجديدة",
    type: "sale",
    category: "lands",
    propertyType: "land_plot",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    area: 850,
    description: "مقسم أرض داخل المخطط التنظيمي السكني في قدسيا الجديدة، مخصص لبناء فيلا أو عمارة سكنية طابقية. إطلالة كاشفة وواجهة عريضة على شارع 16م مع تخديم كامل (مياه، صرف صحي، كهرباء).",
    amenities: ["داخل التنظيم السكني", "طابو أخضر 2400 سهم", "واجهة على شارع عريض", "مخدمة بالكامل بالبنية التحتية"],
    images: [
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب قاسيون للتقسيم العقاري",
      phone: "+963944887711",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-26T15:00:00Z"
  },

  // 5. محلات (Shops)
  {
    id: "prop-8",
    title: "محل تجاري مع حق فروغ في سوق الصالحية موقع تجاري نشط",
    price: 450000000,
    priceInUSD: 30000,
    location: "الصالحية، دمشق",
    city: "دمشق",
    areaName: "الصالحية",
    type: "sale",
    category: "shops",
    propertyType: "commercial_shop",
    ownershipType: "فروغ تجاري نظامي",
    finishing: "ديلوكس",
    solarStatus: "اشتراك مولدة / خط أمبير",
    area: 45,
    furnishing: "غير مفروش",
    description: "محل تجاري للبيع مع حق الفروغ النظامي في قلب سوق الصالحية بالقرب من ساحة الشهداء. واجهة زجاجية عريضة (سيكوريت)، ديكورات إنارة كاملة، سدة تجارية، خط أمبير شغال ومناسب للألبسة أو العطور أو الإلكترونيات.",
    amenities: ["حق فروغ نظامي", "واجهة سيكوريت عريضة", "سدة تجارية مجهزة", "خط أمبير شغال", "موقع تجاري شديد الحيوية"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "الوسيط التجاري السوري",
      phone: "+963988776655",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T09:15:00Z"
  },

  {
    id: "prop-18",
    title: "محل وصالة عرض تجارية طابو ملكي في شارع الحمراء",
    price: 1200000000,
    priceInUSD: 80000,
    location: "الحمراء، دمشق",
    city: "دمشق",
    areaName: "شارع الحمراء",
    type: "sale",
    category: "shops",
    propertyType: "commercial_shop",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    area: 85,
    description: "صالة عرض تجارية ملكية طابو أخضر في أهم شوارع دمشق التجارية (شارع الحمراء). واجهة حجرية مع زجاج سيكوريت بارتفاع 4 أمتار وديكورات جبسمبورد وإضاءة LED حديثة.",
    amenities: ["طابو ملكي 2400 سهم", "واجهة سيكوريت فخمة", "إنفيرتر وطاقة شمسية", "تكييف مركزي راكب", "سدة واسعة للمستودع"],
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب الحمراء التجاري",
      phone: "+963955443322",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-28T09:00:00Z"
  },

  // 6. فلل (Villas)
  {
    id: "prop-15",
    title: "فيلا مودرن مستقلة فاخرة مع حديقة ومسبح مفلتر",
    price: 4500000000,
    priceInUSD: 300000,
    location: "قرى الأسد، ريف دمشق",
    city: "ريف دمشق",
    areaName: "قرى الأسد",
    type: "sale",
    category: "villas",
    propertyType: "villa_farm",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    bedrooms: 6,
    bathrooms: 5,
    area: 750,
    furnishing: "مفروش",
    hasSolarPower: true,
    hasWaterWell: true,
    hasGenerator: true,
    description: "فيلا سكنية حديثة بتصميم معماري فخم وإطلالة جبلية ساحرة. 3 طوابق مع مصعد داخلي بانورامي، صالونات ضيوف رخام إيطالي، مسبح مغطى ومدفأ، حديقة مشجرة مع شلال وموقف لـ 4 سيارات.",
    amenities: ["طابو أخضر 2400 سهم", "مسبح مغطى ومدفأ", "مصعد بانورامي داخلي", "منظومة طاقة شمسية ليثيوم 25KW", "تدفئة أرضية", "حراسة وكاميرات 24/7"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "مجموعة الفلل والقصور السورية",
      phone: "+963999443322",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T11:45:00Z"
  },

  {
    id: "prop-19",
    title: "فيلا مصيفية بإطلالة كاشفة على سهل الزبداني وبلودان",
    price: 2800000000,
    priceInUSD: 185000,
    location: "بلودان، ريف دمشق",
    city: "ريف دمشق",
    areaName: "بلودان",
    type: "sale",
    category: "villas",
    propertyType: "villa_farm",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    bedrooms: 4,
    bathrooms: 3,
    area: 520,
    furnishing: "مفروش بالكامل VIP",
    hasSolarPower: true,
    description: "فيلا جبلية رائعة في أعلى مرتفعات بلودان. مكسية بالكامل حجر ومجهزة بشوفاج تدفئة وطاقة شمسية وفرش خشب زان وجلسات تراس تطل على السهل بالكامل.",
    amenities: ["طابو أخضر 2400 سهم", "تدفئة مركزية وشومينيه حطب", "طاقة شمسية كاملة", "فرش VIP كامل", "تراس بإطلالة بانورامية"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب بلودان للمصايف والفلل",
      phone: "+963933776655",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-27T18:00:00Z"
  },

  // 7. مصانع (Factories)
  {
    id: "prop-16",
    title: "مصنع وهنغار صناعي متكامل مع محولة كهرباء 500KVA",
    price: 4800000000,
    priceInUSD: 320000,
    location: "مدينة عدرا الصناعية، ريف دمشق",
    city: "ريف دمشق",
    areaName: "عدرا الصناعية",
    type: "sale",
    category: "factories",
    propertyType: "commercial_shop",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "ديلوكس",
    area: 3000,
    hasWaterWell: true,
    hasGenerator: true,
    description: "منشأة صناعية متكاملة في القطاع الغذائي/الكيميائي بالمدينة الصناعية بعدرا. مساحة الأرض 3000م والهناغر المغلقة 1800م بارتفاع 8 أمتار وأرضيات إيبوكسي صناعية. تتضمن مبنى إداري من طابقين ومحولة كهرباء 500KVA وساحة تفريغ للشاحنات.",
    amenities: ["طابو صناعي نظامي 2400 سهم", "محولة كهرباء 500KVA", "أرضيات إيبوكسي صناعية", "مبنى إداري مستقل ومكاتب", "ساحة مناورة للشاحنات والتريلات", "مياه صناعية وصرف صحي مرخص"],
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "الوسيط الصناعي السوري",
      phone: "+963966119933",
      whatsapp: "971585193270",
      isAgency: true
    },
    postedAt: "2026-08-29T12:00:00Z"
  },

  {
    id: "prop-20",
    title: "معمل ومستودع صناعي وتخزيني في الشيخ نجار بحلب",
    price: 3900000000,
    priceInUSD: 260000,
    location: "الشيخ نجار، حلب",
    city: "حلب",
    areaName: "المدينة الصناعية",
    type: "sale",
    category: "factories",
    propertyType: "commercial_shop",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "إكساء عادي نظيف",
    area: 2400,
    description: "هنغار ومصنع جاهز للتشغيل في المدينة الصناعية بالشيخ نجار (الفئة النسيجية والهندسية). يضم بوابات دخول تريلات، قبان إلكتروني، مكاتب إدارية، وكافة تراخيص التشغيل والصناعة.",
    amenities: ["تراخيص صناعية جاهزة", "طاقة كهربائية مستمرة 24/7", "بوابات للشاحنات الضخمة", "مكاتب وغرف عمال"],
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مكتب الشهباء للمنشآت الصناعية",
      phone: "+963988223311",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-28T13:00:00Z"
  },

  // 8. أخرى (Other - Chalets, Studios, Student rooms, Offplan)
  {
    id: "prop-3",
    title: "استوديو روف مفروش VIP مع طاقة شمسية 24/7 وإطلالة",
    price: 450000,
    pricePeriod: "يومياً",
    location: "المزة فيلات غربية، دمشق",
    city: "دمشق",
    areaName: "المزة فيلات",
    type: "rent",
    category: "other",
    propertyType: "studio",
    finishing: "مفروش بالكامل VIP",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    floor: "الطابق الرابع (روف)",
    bedrooms: "استوديو (غرفة وصالون)",
    bathrooms: 1,
    area: 75,
    furnishing: "مفروش",
    hasSolarPower: true,
    hasElevator: true,
    description: "استوديو مفروش VIP للإيجار السياحي واليومي والشهري بالمزة فيلات غربية. كهرباء مستمرة 24/7 عبر طاقة شمسية، إنترنت ألياف ضوئية فايبر، شاشة سمارت 55 بوصة، وتراس روف خاص مطل على قاسيون.",
    amenities: ["طاقة شمسية 24/7", "إنترنت فايبر فائق السرعة", "تراس روف خاص", "مكيفات إنفيرتر", "شاشة سمارت", "غسالة ومطبخ متكامل"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "الأجنحة الشامية للضيافة",
      phone: "+963944556677",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-29T11:00:00Z"
  },

  {
    id: "prop-5",
    title: "شاليه بحري نسق أول مباشر على الشاطئ بالرمال الذهبية",
    price: 600000,
    pricePeriod: "يومياً",
    location: "الرمال الذهبية، طرطوس",
    city: "طرطوس",
    areaName: "الرمال الذهبية",
    type: "rent",
    category: "other",
    propertyType: "chalet",
    finishing: "سوبر ديلوكس حديث",
    solarStatus: "منظومة طاقة شمسية كاملة (إنفيرتر + بطاريات ليثيوم)",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    furnishing: "مفروش",
    hasSolarPower: true,
    description: "شاليه عائلي فخم على البحر مباشرة في مجمع الرمال الذهبية بطرطوس. إطلالة بانورامية ساحرة على غروب الشمس. تراس واسع مجهز للشواء، مكيف بالكامل، شاطئ رملي نظيف ومسبح متاح.",
    amenities: ["إطلالة بحرية مباشرة", "تراس شواء واسع", "مكيفات راكبة", "كهرباء طاقة شمسية", "ألعاب أطفال ومسابح", "موقف سيارات خاص"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "مكتب الساحل للمصايف والشاليهات",
      phone: "+963933112244",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-28T16:00:00Z"
  },

  {
    id: "prop-7",
    title: "غرفة خاصة ومستقلة مفروشة للطلاب قرب جامعة دمشق",
    price: 650000,
    pricePeriod: "شهرياً",
    location: "البرامكة، دمشق",
    city: "دمشق",
    areaName: "البرامكة",
    type: "rent",
    category: "other",
    propertyType: "student_room",
    finishing: "مفروش بالكامل VIP",
    solarStatus: "إنفيرتر وبطاريات إنارة وتشغيل",
    floor: "الطابق الأرضي مرتفع",
    bedrooms: "غرفة مفردة مستقلة",
    bathrooms: 1,
    area: 35,
    furnishing: "مفروش",
    hasSolarPower: true,
    description: "غرفة خاصة ومستقلة تماماً مؤثثة لطالب أو شاب، على بُعد 3 دقائق سيراً من كليات الهندسة وجامعة دمشق. تشتمل على سرير مريح، مكتب دراسة، إنترنت سريع متواصل، وإنفيرتر لإنارة وتشغيل اللابتوب.",
    amenities: ["إنترنت سريع غير محدود", "إنفيرتر وطاقة مستمرة", "مكتب دراسي", "غسالة مشتركة", "مطبخ تحضيري", "شامل فواتير المياه والكهرباء"],
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "سكن الأوائل الطلابي",
      phone: "+963955667788",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-29T07:30:00Z"
  },

  {
    id: "prop-9",
    title: "شقة على العظم طابو أخضر في مشروع دمر الجزيرة 16",
    price: 420000000,
    priceInUSD: 28000,
    location: "مشروع دمر، دمشق",
    city: "دمشق",
    areaName: "مشروع دمر",
    type: "offplan",
    category: "other",
    propertyType: "offplan_raw",
    ownershipType: "طابو أخضر 2400 سهم (سجل عقاري)",
    finishing: "على العظم (قيد الإنشاء)",
    floor: "الطابق الرابع",
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    furnishing: "غير مفروش",
    hasElevator: true,
    description: "فرصة استثمارية ممتازة: شقة على العظم بمشروع دمر، جاهزة للتقطيع الداخلي والإكساء حسب رغبة المشتري. اتجاه قبلي شرقي مشمس. البناء مكسي حجر بالكامل ومجهز لتركيب المصعد.",
    amenities: ["طابو أخضر نظامي 2400 سهم", "بناء حجر بالكامل", "مكان مخصص للمصعد", "كراج سيارات مشترك", "خزان ماء على السطح"],
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    agent: {
      name: "مجموعة دمر العقارية",
      phone: "+963944118899",
      whatsapp: "971585193270"
    },
    postedAt: "2026-08-27T12:00:00Z"
  }
];
