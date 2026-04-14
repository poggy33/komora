"use client";

import { useEffect, useState } from "react";
import MainTopBar from "./components/MainTopBar";
import MapWrapper from "./components/MapWrapper";
import FiltersDrawer from "./components/FiltersDrawer";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import { useFavorites } from "./hooks/useFavorites";
import type { DealType, Property } from "@/types/property";
import { getPropertiesFromSupabase } from "../lib/properties";
import {
  DEFAULT_FILTERS_STATE,
  type FiltersState,
  type SupportedPropertyType,
} from "./components/filters.types";


export default function HomePage() {
  const [dealType, setDealType] = useState<DealType>("sale");
  const [propertyType, setPropertyType] =
    useState<SupportedPropertyType>("apartment");

  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null,
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS_STATE);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const activeFiltersCount = [
    filters.priceMin,
    filters.priceMax,
    filters.areaMin,
    filters.areaMax,
    filters.pricePerSqmMin,
    filters.pricePerSqmMax,
    filters.lotAreaMin,
    filters.lotAreaMax,
    filters.floorsMin,
    filters.floorsMax,
    filters.yearBuiltFrom,
    filters.yearBuiltTo,
    filters.rooms.length > 0 ? "rooms" : "",
    filters.notFirstFloor ? "notFirstFloor" : "",
    filters.notLastFloor ? "notLastFloor" : "",
    filters.marketType.length > 0 ? "marketType" : "",
    filters.heating.length > 0 ? "heating" : "",
    filters.parking.length > 0 ? "parking" : "",
    filters.renovation.length > 0 ? "renovation" : "",
    filters.documentsReady ? "documentsReady" : "",
    filters.furnished ? "furnished" : "",
    filters.petsAllowed ? "petsAllowed" : "",
    filters.landPurpose.length > 0 ? "landPurpose" : "",
  ].filter(Boolean).length;

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isMobileListMode, setIsMobileListMode] = useState(false);
  const [visiblePropertiesForDrawer, setVisiblePropertiesForDrawer] = useState<
    Property[]
  >([]);

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoadingProperties(true);
        setPropertiesError(null);

        const data = showFavoritesOnly
          ? await getPropertiesFromSupabase({})
          : await getPropertiesFromSupabase({
              dealType,
              propertyType,
              filters,
            });

        setProperties(data);
      } catch (error) {
        console.error(error);
        setPropertiesError("Не вдалося завантажити оголошення");
      } finally {
        setIsLoadingProperties(false);
      }
    }

    loadProperties();
  }, [dealType, propertyType, filters, showFavoritesOnly]);

  return (
    <>
      <main
        style={{
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <MainTopBar
          propertyType={propertyType}
          dealType={dealType}
          setPropertyType={setPropertyType}
          setDealType={setDealType}
          onOpenFilters={() => setIsFiltersOpen(true)}
          onOpenUserMenu={() => {}}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
          favoritesCount={favoriteIds.length}
          activeFiltersCount={activeFiltersCount}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          <ActiveFiltersBar
            filters={filters}
            onChange={(next) => setFilters(next)}
            isHiddenOnMobile={isMobileListMode}
          />

          <MapWrapper
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
            onVisibleCountChange={setVisibleCount}
            onMobileListModeChange={setIsMobileListMode}
            onVisiblePropertiesChange={setVisiblePropertiesForDrawer}
          />
        </div>
      </main>

      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        value={filters}
        onApply={(next) => setFilters(next)}
        onReset={() => setFilters(DEFAULT_FILTERS_STATE)}
        propertyType={propertyType}
        dealType={dealType}
        visibleProperties={visiblePropertiesForDrawer}
      />
    </>
  );
}