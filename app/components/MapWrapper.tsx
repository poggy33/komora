"use client";

import dynamic from "next/dynamic";
import type { DealType, Property } from "@/types/property";
import type { FiltersState, SupportedPropertyType } from "./filters.types";

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
  rawProperties: Property[];
  isLoadingProperties: boolean;
  propertiesError: string | null;
  onVisibleCountChange?: (count: number) => void;
  onMobileListModeChange?: (isListMode: boolean) => void;
  onVisiblePropertiesChange?: (properties: Property[]) => void;
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
  rawProperties,
  isLoadingProperties,
  propertiesError,
  onVisibleCountChange,
  onMobileListModeChange,
  onVisiblePropertiesChange,
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
      rawProperties={rawProperties}
      isLoadingProperties={isLoadingProperties}
      propertiesError={propertiesError}
      onVisibleCountChange={onVisibleCountChange}
      onMobileListModeChange={onMobileListModeChange}
      onVisiblePropertiesChange={onVisiblePropertiesChange}
    />
  );
}
