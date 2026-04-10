"use client";

import { useEffect, useState } from "react";
import MainTopBar from "./components/MainTopBar";
import MapWrapper from "./components/MapWrapper";
import FiltersDrawer, { type FiltersState } from "./components/FiltersDrawer";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import { useFavorites } from "./hooks/useFavorites";
import type { DealType, Property } from "@/types/property";
import { getPropertiesFromSupabase } from "../lib/properties";

type SupportedPropertyType = "apartment" | "house" | "land";

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

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: "",
    priceMax: "",
    rooms: "",
    areaMin: "",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const activeFiltersCount = [
    filters.priceMin,
    filters.priceMax,
    filters.rooms,
    filters.areaMin,
  ].filter(Boolean).length;

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

        <ActiveFiltersBar
          filters={filters}
          onChange={(next) => setFilters(next)}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
          }}
        >
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
          />
        </div>
      </main>

      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        value={filters}
        onApply={(next) => setFilters(next)}
        onReset={() =>
          setFilters({
            priceMin: "",
            priceMax: "",
            rooms: "",
            areaMin: "",
          })
        }
        propertyType={propertyType}
        dealType={dealType}
      />
    </>
  );
}
