"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Point } from "geojson";
import { properties } from "../data/properties";
import type { Property } from "../types/property";
import Sidebar from "./Sidebar";
import { createRoot, type Root } from "react-dom/client";
import PopupCard from "./PopupCard";

type Props = {
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
};

export default function Map({ dealType, propertyType }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markerRefs = useRef<globalThis.Map<string, mapboxgl.Marker>>(
    new globalThis.Map(),
  );
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null,
  );

  const formatToK = (num: number) => {
    if (num >= 1000) {
      const value = num / 1000;

      if (value % 1 === 0) {
        return `$${value}k`;
      }

      return `$${value.toFixed(1)}k`;
    }

    return `$${num}`;
  };

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

  const createMarkerElement = (property: Property) => {
    const el = document.createElement("button");
    el.type = "button";
    el.setAttribute("data-property-id", String(property.id));

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

    el.innerHTML = `
    <span class="marker-pill__top">${topLine}</span>
    <span class="marker-pill__bottom">${bottomLine}</span>
  `;

    el.className = "marker-pill";
    return el;
  };

  const openPropertyPopup = (
    map: mapboxgl.Map,
    property: Property,
    coordinates: [number, number],
  ) => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    const container = document.createElement("div");
    const root = createRoot(container);

    root.render(
      <PopupCard
        id={String(property.id)}
        price={property.price}
        rooms={property.rooms}
        area={property.area}
        images={property.images}
      />,
    );

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 12,
    })
      .setLngLat(coordinates)
      .setDOMContent(container)
      .addTo(map);

    let isUnmounted = false;

    popup.on("close", () => {
      setTimeout(() => {
        if (isUnmounted) return;
        isUnmounted = true;
        root.unmount();
      }, 0);
    });

    popupRef.current = popup;
  };

  const renderHtmlMarkers = (map: mapboxgl.Map) => {
    const features = map.queryRenderedFeatures({
      layers: ["unclustered-helper"],
    });

    const visibleIds = new Set<string>();

    features.forEach((feature) => {
      const id = String(feature.properties?.id ?? "");
      if (!id) return;

      visibleIds.add(id);

      if (markerRefs.current.has(id)) return;

      const property = filteredProperties.find((p) => String(p.id) === id);
      if (!property) return;

      const el = createMarkerElement(property);

      el.addEventListener("mouseenter", () => {
        el.classList.add("is-hovered");
      });

      el.addEventListener("mouseleave", () => {
        if (hoveredPropertyId !== String(property.id)) {
          el.classList.remove("is-hovered");
        }
      });

      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        openPropertyPopup(map, property, property.coordinates);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(property.coordinates)
        .addTo(map);

      markerRefs.current.set(id, marker);
    });

    markerRefs.current.forEach((marker, id) => {
      if (!visibleIds.has(id)) {
        marker.remove();
        markerRefs.current.delete(id);
      }
    });
  };

  const filteredProperties = properties.filter(
    (p) => p.dealType === dealType && p.propertyType === propertyType,
  );

  const buildGeoJSON = (): FeatureCollection<Point> => {
    return {
      type: "FeatureCollection",
      features: filteredProperties.map((p) => {
        const label = buildMarkerLabel(p);

        return {
          type: "Feature" as const,
          properties: {
            id: String(p.id),
            label,
          },
          geometry: {
            type: "Point" as const,
            coordinates: p.coordinates,
          },
        };
      }),
    };
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [24.71, 48.92],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.resize();

      map.addSource("points", {
        type: "geojson",
        data: buildGeoJSON(),
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
          "circle-color": "#2563eb",
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 25, 30, 30],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
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
          "text-color": "#fff",
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

      renderHtmlMarkers(map);

      map.on("moveend", () => {
        renderHtmlMarkers(map);
      });

      map.on("zoomend", () => {
        renderHtmlMarkers(map);
      });

      map.on("data", () => {
        if (!map.getLayer("unclustered-helper")) return;
        renderHtmlMarkers(map);
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
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const source = map.getSource("points") as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (!source) return;

    source.setData(buildGeoJSON());

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    requestAnimationFrame(() => {
      renderHtmlMarkers(map);
    });
  }, [dealType, propertyType]);

  useEffect(() => {
    markerRefs.current.forEach((marker, id) => {
      const el = marker.getElement();

      if (hoveredPropertyId !== null && id === hoveredPropertyId) {
        el.classList.add("is-hovered");
      } else {
        el.classList.remove("is-hovered");
      }
    });
  }, [hoveredPropertyId]);

  const handleSelect = (p: Property) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: p.coordinates,
      zoom: 15,
      speed: 1.2,
    });
  };

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "380px minmax(0, 1fr)",
        gridTemplateRows: "1fr",
      }}
      className="main-search-layout"
    >
      <div
        style={{
          minWidth: 0,
          minHeight: 0,
          background: "#fff",
          borderRight: "1px solid #eee",
        }}
        className="main-search-sidebar"
      >
        <Sidebar
          properties={filteredProperties}
          onSelect={handleSelect}
          onHover={setHoveredPropertyId}
        />
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
      </div>
    </div>
  );
}
