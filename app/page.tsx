"use client";

// import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): FiltersState {
  const parseStringArray = (key: string) => {
    const raw = searchParams.get(key);
    if (!raw) return [];
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseBoolean = (key: string) => searchParams.get(key) === "1";

  return {
    priceMin: searchParams.get("priceMin") ?? "",
    priceMax: searchParams.get("priceMax") ?? "",

    pricePerSqmMin: searchParams.get("pricePerSqmMin") ?? "",
    pricePerSqmMax: searchParams.get("pricePerSqmMax") ?? "",

    areaMin: searchParams.get("areaMin") ?? "",
    areaMax: searchParams.get("areaMax") ?? "",

    lotAreaMin: searchParams.get("lotAreaMin") ?? "",
    lotAreaMax: searchParams.get("lotAreaMax") ?? "",

    rooms: parseStringArray("rooms"),

    notFirstFloor: parseBoolean("notFirstFloor"),
    notLastFloor: parseBoolean("notLastFloor"),

    floorsMin: searchParams.get("floorsMin") ?? "",
    floorsMax: searchParams.get("floorsMax") ?? "",

    yearBuiltFrom: searchParams.get("yearBuiltFrom") ?? "",
    yearBuiltTo: searchParams.get("yearBuiltTo") ?? "",

    marketType: parseStringArray("marketType") as FiltersState["marketType"],
    heating: parseStringArray("heating") as FiltersState["heating"],
    parking: parseStringArray("parking") as FiltersState["parking"],
    renovation: parseStringArray("renovation") as FiltersState["renovation"],

    documentsReady: parseBoolean("documentsReady"),

    furnished: parseBoolean("furnished"),
    petsAllowed: parseBoolean("petsAllowed"),

    landPurpose: parseStringArray("landPurpose") as FiltersState["landPurpose"],
  };
}

function buildSearchParamsFromState(args: {
  dealType: DealType;
  propertyType: SupportedPropertyType;
  showFavoritesOnly: boolean;
  filters: FiltersState;
}) {
  const params = new URLSearchParams();

  params.set("dealType", args.dealType);
  params.set("propertyType", args.propertyType);

  if (args.showFavoritesOnly) {
    params.set("favorites", "1");
  }

  const setIfValue = (key: string, value: string) => {
    if (value) params.set(key, value);
  };

  const setIfArray = (key: string, value: string[]) => {
    if (value.length > 0) params.set(key, value.join(","));
  };

  const setIfBoolean = (key: string, value: boolean) => {
    if (value) params.set(key, "1");
  };

  const { filters } = args;

  setIfValue("priceMin", filters.priceMin);
  setIfValue("priceMax", filters.priceMax);

  setIfValue("pricePerSqmMin", filters.pricePerSqmMin);
  setIfValue("pricePerSqmMax", filters.pricePerSqmMax);

  setIfValue("areaMin", filters.areaMin);
  setIfValue("areaMax", filters.areaMax);

  setIfValue("lotAreaMin", filters.lotAreaMin);
  setIfValue("lotAreaMax", filters.lotAreaMax);

  setIfArray("rooms", filters.rooms);

  setIfBoolean("notFirstFloor", filters.notFirstFloor);
  setIfBoolean("notLastFloor", filters.notLastFloor);

  setIfValue("floorsMin", filters.floorsMin);
  setIfValue("floorsMax", filters.floorsMax);

  setIfValue("yearBuiltFrom", filters.yearBuiltFrom);
  setIfValue("yearBuiltTo", filters.yearBuiltTo);

  setIfArray("marketType", filters.marketType);
  setIfArray("heating", filters.heating);
  setIfArray("parking", filters.parking);
  setIfArray("renovation", filters.renovation);

  setIfBoolean("documentsReady", filters.documentsReady);

  setIfBoolean("furnished", filters.furnished);
  setIfBoolean("petsAllowed", filters.petsAllowed);

  setIfArray("landPurpose", filters.landPurpose);

  return params;
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  const hasHydratedFromUrlRef = useRef(false);
  const hasMountedSelectionResetRef = useRef(false);
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

  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(
    DEFAULT_FILTERS_STATE,
  );

  const [rawProperties, setRawProperties] = useState<Property[]>([]);
  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
  const [visiblePropertiesForDrawer, setVisiblePropertiesForDrawer] = useState<
    Property[]
  >([]);

  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  const { favoriteIds, toggleFavorite } = useFavorites();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobileListMode, setIsMobileListMode] = useState(false);

  const favoriteIdsSet = useMemo(
    () => new Set(favoriteIds.map(String)),
    [favoriteIds],
  );

  const isFavoritesMode = showFavoritesOnly;

  const activeFiltersCount = [
    appliedFilters.priceMin,
    appliedFilters.priceMax,
    appliedFilters.areaMin,
    appliedFilters.areaMax,
    appliedFilters.pricePerSqmMin,
    appliedFilters.pricePerSqmMax,
    appliedFilters.lotAreaMin,
    appliedFilters.lotAreaMax,
    appliedFilters.floorsMin,
    appliedFilters.floorsMax,
    appliedFilters.yearBuiltFrom,
    appliedFilters.yearBuiltTo,
    appliedFilters.rooms.length > 0 ? "rooms" : "",
    appliedFilters.notFirstFloor ? "notFirstFloor" : "",
    appliedFilters.notLastFloor ? "notLastFloor" : "",
    appliedFilters.marketType.length > 0 ? "marketType" : "",
    appliedFilters.heating.length > 0 ? "heating" : "",
    appliedFilters.parking.length > 0 ? "parking" : "",
    appliedFilters.renovation.length > 0 ? "renovation" : "",
    appliedFilters.documentsReady ? "documentsReady" : "",
    appliedFilters.furnished ? "furnished" : "",
    appliedFilters.petsAllowed ? "petsAllowed" : "",
    appliedFilters.landPurpose.length > 0 ? "landPurpose" : "",
  ].filter(Boolean).length;

  const isBootLoading = isLoadingProperties && !hasLoadedOnce;
  const isRefreshing = isLoadingProperties && hasLoadedOnce;

  // hydration-effect
  useEffect(() => {
    if (hasHydratedFromUrlRef.current) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const nextDealType = params.get("dealType");
    const nextPropertyType = params.get("propertyType");
    const nextShowFavoritesOnly = params.get("favorites") === "1";
    const nextFilters = parseFiltersFromSearchParams(params);

    if (nextDealType === "sale" || nextDealType === "rent") {
      setDealType(nextDealType);
    }

    if (
      nextPropertyType === "apartment" ||
      nextPropertyType === "house" ||
      nextPropertyType === "land" ||
      nextPropertyType === "commercial"
    ) {
      setPropertyType(nextPropertyType);
    }

    setShowFavoritesOnly(nextShowFavoritesOnly);
    setAppliedFilters(nextFilters);

    hasHydratedFromUrlRef.current = true;
  }, []);

  // add sync state - url
  useEffect(() => {
    if (!hasHydratedFromUrlRef.current) return;
    if (typeof window === "undefined") return;

    const params = buildSearchParamsFromState({
      dealType,
      propertyType,
      showFavoritesOnly,
      filters: appliedFilters,
    });

    const nextQuery = params.toString();
    const currentQuery = new URLSearchParams(window.location.search).toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    dealType,
    propertyType,
    showFavoritesOnly,
    appliedFilters,
    pathname,
    router,
  ]);

  // loading effect
  useEffect(() => {
    if (!hasHydratedFromUrlRef.current) return;

    async function loadRawProperties() {
      try {
        setIsLoadingProperties(true);
        setPropertiesError(null);

        const data = showFavoritesOnly
          ? await getPropertiesFromSupabase({})
          : await getPropertiesFromSupabase({
              dealType,
              propertyType,
            });

        setRawProperties(data);
      } catch (error) {
        console.error(error);
        setPropertiesError("Не вдалося завантажити оголошення");
      } finally {
        setIsLoadingProperties(false);
        setHasLoadedOnce(true);
      }
    }

    loadRawProperties();
  }, [dealType, propertyType, showFavoritesOnly]);

  useEffect(() => {
    if (!hasMountedSelectionResetRef.current) {
      hasMountedSelectionResetRef.current = true;
      return;
    }

    setSelectedPropertyId(null);
    setHoveredPropertyId(null);
  }, [dealType, propertyType, isFavoritesMode]);

  useEffect(() => {
    if (isFavoritesMode) {
      setIsFiltersOpen(false);
    }
  }, [isFavoritesMode]);

  const searchModeProperties = useMemo(() => {
    return rawProperties.filter((property) =>
      matchesAppliedFilters(property, propertyType, dealType, appliedFilters),
    );
  }, [rawProperties, propertyType, dealType, appliedFilters]);

  const favoriteModeProperties = useMemo(() => {
    return rawProperties.filter((property) =>
      favoriteIdsSet.has(String(property.id)),
    );
  }, [rawProperties, favoriteIdsSet]);

  const propertiesForMap = isFavoritesMode
    ? favoriteModeProperties
    : searchModeProperties;

  const handleToggleFavorites = () => {
    setShowFavoritesOnly((prev) => !prev);
  };

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
          onOpenFilters={() => {
            if (!isFavoritesMode) {
              setIsFiltersOpen(true);
            }
          }}
          onOpenUserMenu={() => {}}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={handleToggleFavorites}
          favoritesCount={favoriteIds.length}
          activeFiltersCount={isFavoritesMode ? 0 : activeFiltersCount}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          {!isFavoritesMode ? (
            <ActiveFiltersBar
              filters={appliedFilters}
              onChange={(next) => setAppliedFilters(next)}
              isHiddenOnMobile={isMobileListMode}
            />
          ) : null}

          <MapWrapper
            hoveredPropertyId={hoveredPropertyId}
            setHoveredPropertyId={setHoveredPropertyId}
            selectedPropertyId={selectedPropertyId}
            setSelectedPropertyId={setSelectedPropertyId}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            properties={propertiesForMap}
            rawProperties={rawProperties}
            isLoadingProperties={isLoadingProperties}
            propertiesError={propertiesError}
            onMobileListModeChange={setIsMobileListMode}
            onVisibleSearchPropertiesChange={setVisibleProperties}
            onVisibleBasePropertiesChange={setVisiblePropertiesForDrawer}
            isBootLoading={isBootLoading}
            isRefreshing={isRefreshing}
          />
        </div>
      </main>

      {!isFavoritesMode ? (
        <FiltersDrawer
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          value={appliedFilters}
          onApply={(next) => setAppliedFilters(next)}
          onReset={() => setAppliedFilters(DEFAULT_FILTERS_STATE)}
          propertyType={propertyType}
          dealType={dealType}
          visibleProperties={visiblePropertiesForDrawer}
        />
      ) : null}
    </>
  );
}

function matchesAppliedFilters(
  property: Property,
  propertyType: SupportedPropertyType,
  dealType: DealType,
  filters: FiltersState,
) {
  if (property.propertyType !== propertyType) return false;
  if (property.dealType !== dealType) return false;

  const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : null;
  const areaMin = filters.areaMin ? Number(filters.areaMin) : null;
  const areaMax = filters.areaMax ? Number(filters.areaMax) : null;
  const lotAreaMin = filters.lotAreaMin ? Number(filters.lotAreaMin) : null;
  const lotAreaMax = filters.lotAreaMax ? Number(filters.lotAreaMax) : null;
  const floorsMin = filters.floorsMin ? Number(filters.floorsMin) : null;
  const floorsMax = filters.floorsMax ? Number(filters.floorsMax) : null;
  const yearBuiltFrom = filters.yearBuiltFrom
    ? Number(filters.yearBuiltFrom)
    : null;
  const yearBuiltTo = filters.yearBuiltTo ? Number(filters.yearBuiltTo) : null;

  if (priceMin !== null && property.price < priceMin) return false;
  if (priceMax !== null && property.price > priceMax) return false;
  if (areaMin !== null && property.area < areaMin) return false;
  if (areaMax !== null && property.area > areaMax) return false;

  if (propertyType !== "land" && propertyType !== "commercial") {
    if (filters.rooms.length > 0) {
      const normalizedRooms = filters.rooms.map((value) =>
        value === "5+" ? 5 : Number(value),
      );

      const propertyRooms = property.rooms;

      if (
        propertyRooms === undefined ||
        !normalizedRooms.some((value) =>
          value === 5 ? propertyRooms >= 5 : propertyRooms === value,
        )
      ) {
        return false;
      }
    }

    if (
      filters.notFirstFloor &&
      property.floor !== undefined &&
      property.floor <= 1
    ) {
      return false;
    }

    if (
      filters.notLastFloor &&
      property.floor !== undefined &&
      property.totalFloors !== undefined &&
      property.floor >= property.totalFloors
    ) {
      return false;
    }
  }

  if (lotAreaMin !== null) {
    if (property.lotArea === undefined || property.lotArea < lotAreaMin) {
      return false;
    }
  }

  if (lotAreaMax !== null) {
    if (property.lotArea === undefined || property.lotArea > lotAreaMax) {
      return false;
    }
  }

  const propertyFloors =
    property.propertyType === "house" ? property.floors : property.totalFloors;

  if (floorsMin !== null) {
    if (propertyFloors === undefined || propertyFloors < floorsMin) {
      return false;
    }
  }

  if (floorsMax !== null) {
    if (propertyFloors === undefined || propertyFloors > floorsMax) {
      return false;
    }
  }

  if (yearBuiltFrom !== null) {
    if (
      property.yearBuilt === undefined ||
      property.yearBuilt < yearBuiltFrom
    ) {
      return false;
    }
  }

  if (yearBuiltTo !== null) {
    if (property.yearBuilt === undefined || property.yearBuilt > yearBuiltTo) {
      return false;
    }
  }

  if (
    filters.marketType.length > 0 &&
    (!property.marketType || !filters.marketType.includes(property.marketType))
  ) {
    return false;
  }

  if (
    filters.heating.length > 0 &&
    (!property.heating || !filters.heating.includes(property.heating))
  ) {
    return false;
  }

  if (
    filters.parking.length > 0 &&
    (!property.parking || !filters.parking.includes(property.parking))
  ) {
    return false;
  }

  if (
    filters.renovation.length > 0 &&
    (!property.renovation || !filters.renovation.includes(property.renovation))
  ) {
    return false;
  }

  if (
    filters.landPurpose.length > 0 &&
    (!property.landPurpose ||
      !filters.landPurpose.includes(property.landPurpose))
  ) {
    return false;
  }

  if (filters.documentsReady && !property.documentsReady) return false;
  if (filters.furnished && !property.isFurnished) return false;
  if (filters.petsAllowed && !property.petsAllowed) return false;

  return true;
}
