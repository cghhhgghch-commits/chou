// Replace these remote sources with files under public/images when project photography is ready.
export const PROPERTY_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export const CATEGORY_IMAGES = {
  houses: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85",
  buildings: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=85",
  farms: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=85",
  lands: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=600&q=85",
  shops: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=85",
  villas: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=85",
  factories: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=85",
  other: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=85",
} as const;

export const FEATURED_CHALET_IMAGE = CATEGORY_IMAGES.other;
export const AUTH_PANEL_IMAGE = CATEGORY_IMAGES.houses;
