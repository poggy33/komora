"use client";

import { useState } from "react";
import MainTopBar from "./components/MainTopBar";
import MapWrapper from "./components/MapWrapper";
import FiltersDrawer, { type FiltersState } from "./components/FiltersDrawer";
import ActiveFiltersBar from "./components/ActiveFiltersBar";
import { properties } from "./data/properties";
import { useFavorites } from "./hooks/useFavorites";

function allPropertiesCount({
  dealType,
  propertyType,
  filters,
}: {
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
  filters: FiltersState;
}) {
  return properties.filter((p) => {
    if (p.dealType !== dealType) return false;
    if (p.propertyType !== propertyType) return false;

    const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
    const priceMax = filters.priceMax ? Number(filters.priceMax) : null;
    const rooms = filters.rooms ? Number(filters.rooms) : null;
    const areaMin = filters.areaMin ? Number(filters.areaMin) : null;

    if (priceMin !== null && p.price < priceMin) return false;
    if (priceMax !== null && p.price > priceMax) return false;

    if (
      rooms !== null &&
      propertyType !== "land" &&
      (p.rooms === undefined || p.rooms < rooms)
    ) {
      return false;
    }

    if (areaMin !== null && p.area < areaMin) return false;

    return true;
  }).length;
}

export default function HomePage() {
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<
    "apartment" | "house" | "land"
  >("apartment");

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

  const hasActiveFilters =
    !!filters.priceMin ||
    !!filters.priceMax ||
    !!filters.rooms ||
    !!filters.areaMin;

  const activeFiltersCount = [
    filters.priceMin,
    filters.priceMax,
    filters.rooms,
    filters.areaMin,
  ].filter(Boolean).length;

  const resultsCount = allPropertiesCount({
    dealType,
    propertyType,
    filters,
  });

  const { isFavorite, toggleFavorite, favoriteIds } = useFavorites();

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
