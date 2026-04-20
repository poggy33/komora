"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Point } from "geojson";
import Sidebar from "./Sidebar";
import PopupCard from "./PopupCard";
import type { DealType, Property } from "@/types/property";
import MobilePropertyOverlay from "./MobilePropertyOverlay";

const MAP_VIEW_STORAGE_KEY = "map-view-state";
const MAP_SELECTED_PROPERTY_STORAGE_KEY = "map-selected-property-id";

function saveMapViewToSessionStorage(map: mapboxgl.Map) {
  try {
    const center = map.getCenter();
    const zoom = map.getZoom();

    window.sessionStorage.setItem(
      MAP_VIEW_STORAGE_KEY,
      JSON.stringify({
        center: [center.lng, center.lat],
        zoom,
      }),
    );
  } catch (error) {
    console.error("Failed to save map view:", error);
  }
}

function readMapViewFromSessionStorage(): {
  center: [number, number];
  zoom: number;
} | null {
  try {
    const raw = window.sessionStorage.getItem(MAP_VIEW_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      !Array.isArray(parsed.center) ||
      parsed.center.length !== 2 ||
      typeof parsed.center[0] !== "number" ||
      typeof parsed.center[1] !== "number" ||
      typeof parsed.zoom !== "number"
    ) {
      return null;
    }

    return {
      center: [parsed.center[0], parsed.center[1]],
      zoom: parsed.zoom,
    };
  } catch (error) {
    console.error("Failed to read map view:", error);
    return null;
  }
}

function saveSelectedPropertyIdToSessionStorage(id: string | null) {
  try {
    if (!id) {
      window.sessionStorage.removeItem(MAP_SELECTED_PROPERTY_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(MAP_SELECTED_PROPERTY_STORAGE_KEY, id);
  } catch (error) {
    console.error("Failed to save selected property id:", error);
  }
}

function readSelectedPropertyIdFromSessionStorage(): string | null {
  try {
    return (
      window.sessionStorage.getItem(MAP_SELECTED_PROPERTY_STORAGE_KEY) ?? null
    );
  } catch (error) {
    console.error("Failed to read selected property id:", error);
    return null;
  }
}

type Props = {
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  properties: Property[];
  isLoadingProperties: boolean;
  propertiesError: string | null;
  onMobileListModeChange?: (isListMode: boolean) => void;
  onVisibleSearchPropertiesChange?: (properties: Property[]) => void;
  onVisibleBasePropertiesChange?: (properties: Property[]) => void;
  rawProperties: Property[];
};

export default function Map({
  hoveredPropertyId,
  setHoveredPropertyId,
  selectedPropertyId,
  setSelectedPropertyId,
  favoriteIds,
  toggleFavorite,
  showFavoritesOnly,
  properties,
  isLoadingProperties,
  propertiesError,
  onMobileListModeChange,
  onVisibleSearchPropertiesChange,
  onVisibleBasePropertiesChange,
  rawProperties,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markerRefs = useRef<globalThis.Map<string, mapboxgl.Marker>>(
    new globalThis.Map(),
  );
  const searchPropertiesRef = useRef<Property[]>([]);
  const rawPropertiesRef = useRef<Property[]>([]);
  const favoriteIdsRef = useRef<string[]>([]);

  const [visibleProperties, setVisibleProperties] = useState<Property[]>([]);
  const [mobileViewMode, setMobileViewMode] = useState<"map" | "list">("map");
  const [mobileSnapshotProperties, setMobileSnapshotProperties] = useState<
    Property[]
  >([]);
  const [desktopPopupProperty, setDesktopPopupProperty] =
    useState<Property | null>(null);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const formatCompactPrice = (num: number) => {
    if (num >= 1000000) {
      const value = num / 1000000;
      return value % 1 === 0 ? `$${value}M` : `$${value.toFixed(1)}M`;
    }

    if (num >= 1000) {
      const value = num / 1000;
      return value % 1 === 0 ? `$${value}k` : `$${value.toFixed(1)}k`;
    }

    return `$${num}`;
  };

  const formatCompactMetricPrice = (num: number) => {
    if (num >= 1000) {
      const value = num / 1000;
      return value % 1 === 0 ? `$${value}k` : `$${value.toFixed(1)}k`;
    }

    return `$${num}`;
  };

  const buildMarkerLabel = (p: Property) => {
    const topLine = formatCompactPrice(p.price);

    if (p.propertyType === "apartment") {
      const pricePerSqm = Math.round(p.price / p.area);
      return `${topLine}\n${p.rooms}к • $${pricePerSqm}/м²`;
    }

    if (p.propertyType === "house") {
      return `${topLine}\n${p.rooms}к • ${p.floors} пов.`;
    }

    if (p.propertyType === "land") {
      const perSotka = Math.round(p.price / p.area);
      return `${topLine}\n${p.area} сот. • ${formatCompactMetricPrice(perSotka)}/сот.`;
    }

    return topLine;
  };

  // const createMarkerElement = (property: Property) => {
  //   const el = document.createElement("button");
  //   // const isFavorite = favoriteIds.includes(String(property.id));
  //   el.type = "button";
  //   el.setAttribute("data-property-id", String(property.id));

  //   const topLine = formatCompactPrice(property.price);

  //   let bottomLine = "";

  //   if (property.propertyType === "apartment") {
  //     const pricePerSqm = Math.round(property.price / property.area);
  //     bottomLine = `${property.rooms}к • $${pricePerSqm}/м²`;
  //   }

  //   if (property.propertyType === "house") {
  //     bottomLine = `${property.rooms}к • ${property.floors} пов.`;
  //   }

  //   if (property.propertyType === "land") {
  //     const perSotka = Math.round(property.price / property.area);
  //     bottomLine = `${property.area} сот. • ${formatCompactMetricPrice(perSotka)}/сот.`;
  //   }

  //   const heartIcon = `
  //   <svg
  //     viewBox="0 0 24 24"
  //     width="12"
  //     height="12"
  //     fill="#ef4444"
  //     stroke="#ef4444"
  //     stroke-width="1.8"
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     aria-hidden="true"
  //   >
  //     <path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.5 1.5-1.5 4 0 5.5L12 19l8.8-8.9c1.5-1.5 1.5-4 0-5.5z" />
  //   </svg>
  //   `;

  //   el.innerHTML = buildMarkerInnerHtml(property);

  //   el.className = "marker-pill marker-pill--enter";
  //   return el;
  // };

  const createMarkerElement = (property: Property) => {
    const el = document.createElement("button");
    el.type = "button";
    el.setAttribute("data-property-id", String(property.id));

    el.innerHTML = buildMarkerInnerHtml(property);
    el.className = "marker-pill marker-pill--enter";

    return el;
  };

  const buildMarkerInnerHtml = (property: Property) => {
    const topLine = formatCompactPrice(property.price);

    let bottomLine = "";

    if (property.propertyType === "apartment") {
      const pricePerSqm = Math.round(property.price / property.area);
      bottomLine = `${property.rooms}к • $${pricePerSqm}/м²`;
    }

    if (property.propertyType === "house") {
      bottomLine = `${property.rooms}к • ${property.floors} пов.`;
    }

    if (property.propertyType === "land") {
      const perSotka = Math.round(property.price / property.area);
      bottomLine = `${property.area} сот. • ${formatCompactMetricPrice(perSotka)}/сот.`;
    }

    // const isFavorite = favoriteIds.includes(String(property.id));

    const isFavorite = favoriteIdsRef.current.includes(String(property.id));
    const heartIcon = `
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="#ef4444"
      stroke="#ef4444"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6c-1.5-1.5-4-1.5-5.5 0L12 7.9 8.7 4.6c-1.5-1.5-4-1.5-5.5 0-1.5 1.5-1.5 4 0 5.5L12 19l8.8-8.9c1.5-1.5 1.5-4 0-5.5z" />
    </svg>
    `;

    return `
    <span class="marker-pill__top">
      <span>${topLine}</span>
      ${isFavorite ? `<span class="marker-pill__heart">${heartIcon}</span>` : ""}
    </span>
    <span class="marker-pill__bottom">${bottomLine}</span>
  `;
  };

  const renderHtmlMarkers = (map: mapboxgl.Map, list: Property[]) => {
    if (!map.getLayer("unclustered-helper")) return;

    const features = map.queryRenderedFeatures({
      layers: ["unclustered-helper"],
    });

    const visibleIds = new Set<string>();

    features.forEach((feature) => {
      const id = String(feature.properties?.id ?? "");
      if (!id) return;

      visibleIds.add(id);

      if (markerRefs.current.has(id)) return;

      const property = list.find((p) => String(p.id) === id);
      if (!property) return;

      const el = createMarkerElement(property);

      el.addEventListener("mouseenter", () => {
        el.classList.add("is-hovered");
        setHoveredPropertyId(String(property.id));
      });

      el.addEventListener("mouseleave", () => {
        el.classList.remove("is-hovered");
        setHoveredPropertyId(null);
      });

      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.innerWidth <= 768) {
          setMobileViewMode("map");
        }

        setSelectedPropertyId(String(property.id));

        if (window.innerWidth <= 768) {
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        } else {
          setDesktopPopupProperty(property);
        }
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(property.coordinates)
        .addTo(map);

      requestAnimationFrame(() => {
        el.classList.remove("marker-pill--enter");
      });

      markerRefs.current.set(id, marker);
    });

    markerRefs.current.forEach((marker, id) => {
      if (!visibleIds.has(id)) {
        marker.remove();
        markerRefs.current.delete(id);
      }
    });
  };

  const searchProperties: Property[] = properties;

  searchPropertiesRef.current = searchProperties;
  rawPropertiesRef.current = rawProperties;
  favoriteIdsRef.current = favoriteIds;

  const buildGeoJSONFromList = (list: Property[]): FeatureCollection<Point> => {
    return {
      type: "FeatureCollection",
      features: list.map((p) => ({
        type: "Feature",
        properties: {
          id: String(p.id),
          label: buildMarkerLabel(p),
        },
        geometry: {
          type: "Point",
          coordinates: p.coordinates,
        },
      })),
    };
  };

  const getPropertiesInView = (
    map: mapboxgl.Map,
    list: Property[],
  ): Property[] => {
    const bounds = map.getBounds();
    if (!bounds) return list;

    return list.filter((property) => {
      const [lng, lat] = property.coordinates;
      return bounds.contains([lng, lat]);
    });
  };

  const syncViewportDerivedState = (map: mapboxgl.Map) => {
    const nextVisibleSearch = getPropertiesInView(
      map,
      searchPropertiesRef.current,
    );
    const nextVisibleBase = getPropertiesInView(map, rawPropertiesRef.current);

    setVisibleProperties(nextVisibleSearch);
    onVisibleSearchPropertiesChange?.(nextVisibleSearch);
    onVisibleBasePropertiesChange?.(nextVisibleBase);

    if (window.innerWidth <= 768 && mobileViewMode === "map") {
      setMobileSnapshotProperties(nextVisibleSearch);
    }
  };

  const syncExistingMarkerContent = (list: Property[]) => {
    markerRefs.current.forEach((marker, id) => {
      const property = list.find((p) => String(p.id) === id);
      if (!property) return;

      const el = marker.getElement();
      el.innerHTML = buildMarkerInnerHtml(property);
    });
  };

  useEffect(() => {
    saveSelectedPropertyIdToSessionStorage(selectedPropertyId);
  }, [selectedPropertyId]);

  useEffect(() => {
    if (selectedPropertyId) return;

    const savedSelectedId = readSelectedPropertyIdFromSessionStorage();
    if (!savedSelectedId) return;

    const existsInRaw = rawProperties.some(
      (p) => String(p.id) === savedSelectedId,
    );
    const existsInSearch = searchProperties.some(
      (p) => String(p.id) === savedSelectedId,
    );

    if (!existsInRaw && !existsInSearch) return;

    setSelectedPropertyId(savedSelectedId);
  }, [
    selectedPropertyId,
    rawProperties,
    searchProperties,
    setSelectedPropertyId,
  ]);

  useEffect(() => {
    if (isMobile === null) return;
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [24.71, 48.92],
    //   zoom: 12,
    // });

    const savedMapView = readMapViewFromSessionStorage();

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: savedMapView?.center ?? [24.71, 48.92],
      zoom: savedMapView?.zoom ?? 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.resize();

      map.addSource("points", {
        type: "geojson",
        data: buildGeoJSONFromList(searchPropertiesRef.current),
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "points",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#ffffff",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 24, 30, 28],
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#d9d9d9",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 14,
        },
        paint: {
          "text-color": "#111111",
        },
      });

      map.addLayer({
        id: "unclustered-helper",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 1,
          "circle-opacity": 0,
          "circle-stroke-opacity": 0,
        },
      });

      // map.once("idle", () => {
      //   renderHtmlMarkers(map, searchPropertiesRef.current);
      //   syncViewportDerivedState(map);
      // });

      map.once("idle", () => {
        saveMapViewToSessionStorage(map);
        renderHtmlMarkers(map, searchPropertiesRef.current);
        syncViewportDerivedState(map);
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        if (clusterId === undefined || clusterId === null) return;

        const source = map.getSource("points") as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          if (zoom === undefined || zoom === null) return;

          map.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [
              number,
              number,
            ],
            zoom,
          });
        });
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("click", (e) => {
        const clickedCluster = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        if (clickedCluster.length > 0) return;

        setSelectedPropertyId(null);
        setDesktopPopupProperty(null);

        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      // const handleViewportChange = () => {
      //   renderHtmlMarkers(map, searchPropertiesRef.current);
      //   syncViewportDerivedState(map);
      // };

      const handleViewportChange = () => {
        saveMapViewToSessionStorage(map);
        renderHtmlMarkers(map, searchPropertiesRef.current);
        syncViewportDerivedState(map);
      };

      map.on("moveend", handleViewportChange);
      map.on("zoomend", handleViewportChange);

      map.on("data", () => {
        if (!map.getLayer("unclustered-helper")) return;
        renderHtmlMarkers(map, searchPropertiesRef.current);
      });

      map.on("dragstart", () => {
        if (window.innerWidth <= 768) {
          setMobileViewMode("map");
        }
      });

      map.on("zoomstart", () => {
        if (window.innerWidth <= 768) {
          setMobileViewMode("map");
        }
      });

      map.on("touchstart", () => {
        if (window.innerWidth <= 768) {
          setMobileViewMode("map");
        }
      });
    });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current.clear();

      map.remove();
      mapRef.current = null;
    };
  }, [isMobile]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const source = map.getSource("points") as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (!source) return;

    source.setData(buildGeoJSONFromList(searchPropertiesRef.current));

    setDesktopPopupProperty((prev) => {
      if (!prev) return null;

      return (
        rawProperties.find((p) => String(p.id) === String(prev.id)) ??
        searchPropertiesRef.current.find(
          (p) => String(p.id) === String(prev.id),
        ) ??
        null
      );
    });

    map.once("idle", () => {
      renderHtmlMarkers(map, searchPropertiesRef.current);
      syncViewportDerivedState(map);
    });
  }, [properties, rawProperties, showFavoritesOnly]);

  useEffect(() => {
    if (!mapRef.current) return;
    syncExistingMarkerContent(searchPropertiesRef.current);
  }, [favoriteIds]);

  useEffect(() => {
    markerRefs.current.forEach((marker, id) => {
      const el = marker.getElement();

      el.classList.remove("is-hovered");
      el.classList.remove("is-selected");

      if (selectedPropertyId === id) {
        el.classList.add("is-selected");
      } else if (hoveredPropertyId === id) {
        el.classList.add("is-hovered");
      }
    });
  }, [hoveredPropertyId, selectedPropertyId]);

  useEffect(() => {
    if (!mapRef.current) return;

    const timer = window.setTimeout(() => {
      mapRef.current?.resize();
    }, 230);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMobile, mobileViewMode]);

  useEffect(() => {
    onMobileListModeChange?.(isMobile === true && mobileViewMode === "list");
  }, [isMobile, mobileViewMode, onMobileListModeChange]);

  const handleSelect = (p: Property) => {
    if (!mapRef.current) return;

    setSelectedPropertyId(String(p.id));

    mapRef.current.flyTo({
      center: p.coordinates,
      zoom: Math.max(mapRef.current.getZoom(), 15),
      speed: 1.1,
      curve: 1.2,
      essential: true,
    });
  };

  const sidebarProperties = showFavoritesOnly
    ? searchProperties
    : isMobile
      ? mobileViewMode === "list"
        ? mobileSnapshotProperties
        : visibleProperties
      : visibleProperties.length > 0 || searchProperties.length === 0
        ? visibleProperties
        : searchProperties;

  if (isMobile === null) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "#fff",
        }}
      />
    );
  }

  return isMobile ? (
    <div
      style={{
        height: "100%",
        position: "relative",
        background: "#fff",
        overflow: "hidden",
      }}
      className="main-search-layout mobile"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f8f8f8",
        }}
        className="main-search-map"
        onClick={() => {
          if (mobileViewMode === "list") {
            setMobileViewMode("map");
          }
        }}
      >
        <div
          ref={mapContainer}
          style={{
            position: "absolute",
            inset: 0,
          }}
        />

        {isLoadingProperties && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              padding: "10px 14px",
              borderRadius: "999px",
              background: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              zIndex: 5,
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Завантаження...
          </div>
        )}

        {propertiesError && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              fontWeight: 600,
              zIndex: 6,
            }}
          >
            {propertiesError}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: mobileViewMode === "map" ? "auto" : "0",
          height: mobileViewMode === "map" ? "92px" : "100%",
          background: "#fff",
          borderTopLeftRadius: "18px",
          borderTopRightRadius: "18px",
          boxShadow: "0 -8px 28px rgba(0,0,0,0.08)",
          overflow: "hidden",
          transition: "height 260ms ease, top 260ms ease",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
        }}
        className="main-search-sidebar"
      >
        <div
          style={{
            width: "36px",
            height: "4px",
            borderRadius: "999px",
            background: "#d4d4d4",
            margin: "8px auto 4px",
            flexShrink: 0,
          }}
        />

        <Sidebar
          properties={sidebarProperties}
          onSelect={handleSelect}
          onHover={setHoveredPropertyId}
          hoveredPropertyId={hoveredPropertyId}
          selectedPropertyId={selectedPropertyId}
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          showFavoritesOnly={showFavoritesOnly}
          onUserInteract={() => {
            if (mobileViewMode === "map") {
              setMobileSnapshotProperties(visibleProperties);
              setMobileViewMode("list");
            }
          }}
          compactHeaderOnly={mobileViewMode === "map"}
        />

        {mobileViewMode === "list" && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "14px",
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <button
              type="button"
              onClick={() => setMobileViewMode("map")}
              style={{
                pointerEvents: "auto",
                height: "42px",
                padding: "0 16px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(17,17,17,0.82)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                backdropFilter: "blur(8px)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px", lineHeight: 1 }}>🗺</span>
              <span>Показати карту</span>
            </button>
          </div>
        )}

        {isLoadingProperties && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              zIndex: 5,
            }}
          >
            Завантаження оголошень...
          </div>
        )}

        {propertiesError && (
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              fontWeight: 600,
              zIndex: 6,
            }}
          >
            {propertiesError}
          </div>
        )}
      </div>

      {selectedPropertyId && (
        <MobilePropertyOverlay
          property={
            rawProperties.find((p) => String(p.id) === selectedPropertyId) ??
            searchProperties.find((p) => String(p.id) === selectedPropertyId) ??
            null
          }
          onClose={() => setSelectedPropertyId(null)}
          isFavorite={favoriteIds.includes(String(selectedPropertyId))}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  ) : (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "380px minmax(0, 1fr)",
        gridTemplateRows: "1fr",
        position: "relative",
      }}
      className="main-search-layout"
    >
      <div
        style={{
          minWidth: 0,
          minHeight: 0,
          background: "#fff",
          borderRight: "1px solid #eee",
          position: "relative",
        }}
        className="main-search-sidebar"
      >
        <Sidebar
          properties={sidebarProperties}
          onSelect={handleSelect}
          onHover={setHoveredPropertyId}
          hoveredPropertyId={hoveredPropertyId}
          selectedPropertyId={selectedPropertyId}
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          showFavoritesOnly={showFavoritesOnly}
          onUserInteract={() => {}}
        />

        {isLoadingProperties && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              zIndex: 5,
            }}
          >
            Завантаження оголошень...
          </div>
        )}

        {propertiesError && (
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 16,
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              fontWeight: 600,
              zIndex: 6,
            }}
          >
            {propertiesError}
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          minWidth: 0,
          minHeight: 0,
          background: "#f8f8f8",
        }}
        className="main-search-map"
      >
        <div
          ref={mapContainer}
          style={{
            position: "absolute",
            inset: 0,
          }}
        />

        {desktopPopupProperty && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "300px",
              maxWidth: "calc(100% - 32px)",
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                borderRadius: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setDesktopPopupProperty(null);
                  setSelectedPropertyId(null);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "30px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "999px",
                  border: "1px solid rgba(17,17,17,0.08)",
                  background: "rgba(255,255,255,0.92)",
                  fontSize: "15px",
                  cursor: "pointer",
                  zIndex: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.10)",
                }}
                aria-label="Закрити попап"
              >
                ✕
              </button>

              <PopupCard
                id={String(desktopPopupProperty.id)}
                price={desktopPopupProperty.price}
                rooms={desktopPopupProperty.rooms}
                area={desktopPopupProperty.area}
                images={desktopPopupProperty.images}
                dealType={desktopPopupProperty.dealType}
                propertyType={desktopPopupProperty.propertyType}
                isFavorite={favoriteIds.includes(
                  String(desktopPopupProperty.id),
                )}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </div>
        )}

        {isLoadingProperties && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: "10px 14px",
              borderRadius: "999px",
              background: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              zIndex: 5,
              fontWeight: 600,
            }}
          >
            Завантаження...
          </div>
        )}

        {propertiesError && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              padding: "12px 14px",
              borderRadius: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              fontWeight: 600,
              zIndex: 6,
            }}
          >
            {propertiesError}
          </div>
        )}
      </div>
    </div>
  );
}
