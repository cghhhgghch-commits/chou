import type { Property } from "../types";

export interface PropertyFilters {
  selectedCity: string;
  selectedArea: string;
  bedrooms: string;
  priceCurrency: "SYP" | "USD";
  maxPrice: string;
}

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
  const maxPrice = Number(filters.maxPrice?.replace(/,/g, "") || "0");

  return properties.filter((property) => {
    if (selectedCity && property.city !== selectedCity) return false;
    if (selectedArea) {
      const areaMatch = property.areaName?.trim();
      if (!areaMatch || areaMatch !== selectedArea) return false;
    }
    if (bedrooms) {
      const propertyBedrooms = Number(property.bedrooms);
      if (Number.isNaN(propertyBedrooms) || propertyBedrooms !== Number(bedrooms)) return false;
    }
    if (maxPrice > 0) {
      const propertyPrice = priceCurrency === "USD"
        ? Number(property.priceInUSD ?? 0)
        : Number(property.price ?? 0);
      if (propertyPrice > maxPrice) return false;
    }

    return true;
  });
};
