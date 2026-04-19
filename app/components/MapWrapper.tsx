"use client";

import dynamic from "next/dynamic";
import type { DealType, Property } from "@/types/property";
import type { FiltersState, SupportedPropertyType } from "./filters.types";

type Props = {
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  properties: Property[];
  rawProperties: Property[];
  isLoadingProperties: boolean;
  propertiesError: string | null;
  onMobileListModeChange?: (isListMode: boolean) => void;

  // 🔥 нові callbacks
  onVisibleSearchPropertiesChange?: (properties: Property[]) => void;
  onVisibleBasePropertiesChange?: (properties: Property[]) => void;
};

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({
  hoveredPropertyId,
  setHoveredPropertyId,
  selectedPropertyId,
  setSelectedPropertyId,
  favoriteIds,
  toggleFavorite,
  showFavoritesOnly,
  properties,
  rawProperties,
  isLoadingProperties,
  propertiesError,
  onMobileListModeChange,
  onVisibleSearchPropertiesChange,
  onVisibleBasePropertiesChange,
}: Props) {
  return (
    <Map
      hoveredPropertyId={hoveredPropertyId}
      setHoveredPropertyId={setHoveredPropertyId}
      selectedPropertyId={selectedPropertyId}
      setSelectedPropertyId={setSelectedPropertyId}
      favoriteIds={favoriteIds}
      toggleFavorite={toggleFavorite}
      showFavoritesOnly={showFavoritesOnly}
      properties={properties}
      rawProperties={rawProperties}
      isLoadingProperties={isLoadingProperties}
      propertiesError={propertiesError}
      onMobileListModeChange={onMobileListModeChange}
      // 🔥 тут головна зміна
      onVisibleSearchPropertiesChange={onVisibleSearchPropertiesChange}
      onVisibleBasePropertiesChange={onVisibleBasePropertiesChange}
    />
  );
}
