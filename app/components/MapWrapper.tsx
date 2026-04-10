"use client";

import dynamic from "next/dynamic";
import type { FiltersState } from "./FiltersDrawer";
import type { DealType, Property } from "@/types/property";

type SupportedPropertyType = "apartment" | "house" | "land";

type Props = {
  dealType: DealType;
  propertyType: SupportedPropertyType;
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  filters: FiltersState;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  properties: Property[];
  isLoadingProperties: boolean;
  propertiesError: string | null;
};

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({
  dealType,
  propertyType,
  hoveredPropertyId,
  setHoveredPropertyId,
  selectedPropertyId,
  setSelectedPropertyId,
  filters,
  favoriteIds,
  toggleFavorite,
  showFavoritesOnly,
  properties,
  isLoadingProperties,
  propertiesError,
}: Props) {
  return (
    <Map
      dealType={dealType}
      propertyType={propertyType}
      hoveredPropertyId={hoveredPropertyId}
      setHoveredPropertyId={setHoveredPropertyId}
      selectedPropertyId={selectedPropertyId}
      setSelectedPropertyId={setSelectedPropertyId}
      filters={filters}
      favoriteIds={favoriteIds}
      toggleFavorite={toggleFavorite}
      showFavoritesOnly={showFavoritesOnly}
      properties={properties}
      isLoadingProperties={isLoadingProperties}
      propertiesError={propertiesError}
    />
  );
}
