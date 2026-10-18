import assert from "node:assert/strict";
import { filterProperties } from "./propertyFilters.js";
import { SYRIAN_CITIES, SYRIAN_GOVERNORATES } from "./constants.js";
import type { Property } from "../types";

assert.equal(SYRIAN_GOVERNORATES[0]?.name, "حلب", "يجب إظهار حلب أولاً في قائمة المحافظات");
assert.deepEqual(
  SYRIAN_GOVERNORATES.map((governorate) => governorate.name),
  SYRIAN_CITIES,
  "يجب أن تشمل قائمة الفلتر المحافظات السورية كلها",
);
assert.ok(
  (SYRIAN_GOVERNORATES.find((governorate) => governorate.name === "حلب")?.popularAreas.length ?? 0) >= 100,
  "يجب توفير قائمة أحياء وبلدات حلب التفصيلية",
);
assert.equal(
  SYRIAN_GOVERNORATES.find((governorate) => governorate.name === "دمشق")?.popularAreas.length,
  0,
  "يجب عدم عرض قائمة أحياء طويلة لبقية المحافظات",
);
assert.equal(
  SYRIAN_GOVERNORATES.find((governorate) => governorate.name === "حلب")?.popularAreas.includes("المزة"),
  false,
  "يجب عدم إظهار حي من دمشق ضمن أحياء حلب",
);

const properties: Property[] = [
  {
    id: "1",
    title: "شقة في المالكي",
    price: 50_000_000,
    priceInUSD: 2_500,
    location: "دمشق - المالكي",
    city: "دمشق",
    areaName: "المالكي",
    type: "sale",
    category: "houses",
    propertyType: "apartment",
    description: "",
    amenities: [],
    images: [],
    isVerified: true,
    agent: { name: "", phone: "", whatsapp: "" },
    postedAt: "",
    area: 90,
    bedrooms: 2,
  },
  {
    id: "2",
    title: "شقة في الميدان",
    price: 80_000_000,
    priceInUSD: 4_000,
    location: "حلب - الميدان",
    city: "حلب",
    areaName: "الميدان",
    type: "sale",
    category: "houses",
    propertyType: "apartment",
    description: "",
    amenities: [],
    images: [],
    isVerified: true,
    agent: { name: "", phone: "", whatsapp: "" },
    postedAt: "",
    area: 110,
    bedrooms: 3,
  },
  {
    id: "3",
    title: "شقة في باب توما",
    price: 100_000_000,
    priceInUSD: 5_000,
    location: "دمشق - باب توما",
    city: "دمشق",
    areaName: "باب توما",
    type: "rent",
    category: "houses",
    propertyType: "apartment",
    description: "",
    amenities: [],
    images: [],
    isVerified: true,
    agent: { name: "", phone: "", whatsapp: "" },
    postedAt: "",
    area: 120,
    bedrooms: 3,
  },
];

assert.deepEqual(
  filterProperties(properties, {
    selectedCity: "دمشق",
    selectedArea: "المالكي",
    bedrooms: "2",
    priceCurrency: "SYP",
    maxPrice: "60000000",
  }),
  [properties[0]],
  "يجب تطبيق منطقة وغرفة وسعر دفعة واحدة",
);

assert.deepEqual(
  filterProperties(properties, {
    priceCurrency: "USD",
    maxPrice: "4500",
  }),
  [properties[0], properties[1]],
  "يجب مقارنة الحد الأعلى بالدولار باستخدام priceInUSD",
);

assert.deepEqual(
  filterProperties(properties, {
    bedrooms: "3",
  }),
  [properties[1], properties[2]],
  "يجب تصفية العقارات بعدد الغرف",
);

assert.deepEqual(
  filterProperties(properties, {
    selectedArea: "الميدان",
  }),
  [properties[1]],
  "يجب تطبيق فلتر المنطقة",
);

assert.deepEqual(
  filterProperties(properties, { selectedCategory: "buildings" }),
  [],
  "يجب تطبيق التصنيف المختار بدل تجاهله",
);

assert.deepEqual(
  filterProperties(properties, { bedrooms: "2", minPrice: "60000000" }),
  [properties[1], properties[2]],
  "يجب اعتبار عدد الغرف حدًا أدنى وتطبيق السعر الأدنى",
);

assert.deepEqual(
  filterProperties(properties, { priceCurrency: "USD", minPrice: "3000" }),
  [properties[1], properties[2]],
  "يجب تطبيق الحد الأدنى باستخدام السعر بالدولار",
);

assert.deepEqual(
  filterProperties(properties, { searchQuery: "المالكي" }),
  [properties[0]],
  "يجب تصفية النتائج بنص البحث",
);

console.log("property filter tests passed");
