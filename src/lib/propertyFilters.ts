import type { Property } from "../types";

export interface PropertyFilters {
  selectedCity: string;
  selectedArea: string;
  bedrooms: string;
  priceCurrency: "SYP" | "USD";
  maxPrice: string;
  minPrice?: string;
  selectedCategory?: string;
  searchQuery?: string;
}

export const normalizePropertyCategory = (category: string): string => {
  const aliases: Record<string, string> = {
    sale: "houses",
    rent: "houses",
    furnished: "houses",
    damascene_house: "houses",
    commercial: "shops",
    land: "lands",
    villa_farm: "farms",
    chalet: "other",
    student: "other",
    offplan: "other",
  };

  return aliases[category] || category;
};

export const getAvailableAreas = (properties: Property[], city: string): string[] => {
  const areas = properties
    .filter((property) => !city || property.city === city)
    .map((property) => property.areaName)
    .filter((area): area is string => Boolean(area && area.trim()));

  return [...new Set(areas)];
};

export const filterProperties = (
  properties: Property[],
  filters: Partial<PropertyFilters>,
): Property[] => {
  const selectedCity = filters.selectedCity?.trim() || "";
  const selectedArea = filters.selectedArea?.trim() || "";
  const bedrooms = filters.bedrooms?.trim() || "";
  const priceCurrency = filters.priceCurrency || "SYP";
  const selectedCategory = filters.selectedCategory || "all";
  const searchQuery = filters.searchQuery?.trim().toLowerCase() || "";
  const minPrice = Number(filters.minPrice?.replace(/,/g, "") || "0");
  const maxPrice = Number(filters.maxPrice?.replace(/,/g, "") || "0");

  return properties.filter((property) => {
    if (selectedCity && property.city !== selectedCity) return false;
    if (selectedArea) {
      const areaMatch = property.areaName?.trim();
      if (!areaMatch || areaMatch !== selectedArea) return false;
    }
    if (selectedCategory !== "all" && normalizePropertyCategory(property.category) !== selectedCategory) {
      return false;
    }
    if (bedrooms) {
      const propertyBedrooms = Number(property.bedrooms);
      if (Number.isNaN(propertyBedrooms) || propertyBedrooms < Number(bedrooms)) return false;
    }
    if (minPrice > 0 || maxPrice > 0) {
      const propertyPrice = priceCurrency === "USD" ? property.priceInUSD : property.price;
      if (!propertyPrice || (minPrice > 0 && propertyPrice < minPrice) || (maxPrice > 0 && propertyPrice > maxPrice)) {
        return false;
      }
    }
    if (searchQuery) {
      const matches = [property.title, property.location, property.description, ...property.amenities]
        .some((value) => value.toLowerCase().includes(searchQuery));
      if (!matches) return false;
    }

    return true;
  });
};
