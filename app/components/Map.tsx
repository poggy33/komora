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

  const filteredProperties = properties.filter(
    (p) => p.dealType === dealType && p.propertyType === propertyType,
  );

  const buildGeoJSON = (): FeatureCollection<Point> => {
    return {
      type: "FeatureCollection",
      features: filteredProperties.map((p) => {
        let label = "";

        if (p.propertyType === "apartment") {
          if (p.dealType === "sale") {
            const pricePerSqm = Math.round(p.price / p.area);

            label =
              `$${p.price.toLocaleString()}\n` +
              `${p.rooms} кімн.\n` +
              `$${pricePerSqm}/m²`;
          } else {
            label = `$${p.price}/міс\n${p.rooms} кімн.`;
          }
        }

        if (p.propertyType === "house") {
          label =
            `$${p.price.toLocaleString()}\n` +
            `${p.rooms} кімн.\n` +
            `${p.floors} пов.`;
        }

        if (p.propertyType === "land") {
          const perSotka = Math.round(p.price / p.area);
          label =
            `$${p.price.toLocaleString()}\n` +
            `${p.area} сот.\n` +
            `${formatToK(perSotka)}/сот.`;
        }

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
        id: "badge-bg",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 18,
          "circle-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ddd",
        },
        minzoom: 13,
      });

      map.addLayer({
        id: "hover-layer",
        type: "circle",
        source: "points",
        filter: ["==", ["get", "id"], "__none__"],
        paint: {
          "circle-radius": 24,
          "circle-color": "#ffffff",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#000",
        },
        minzoom: 13,
      });

      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 6,
          "circle-color": "#2563eb",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
        maxzoom: 13,
      });

      map.addLayer({
        id: "price-layer",
        type: "symbol",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-anchor": "center",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#000",
        },
        minzoom: 13,
      });

      map.on("mousemove", "badge-bg", (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];
        const id = String(feature.properties?.id ?? "");

        if (!id) return;

        map.getCanvas().style.cursor = "pointer";
        map.setFilter("hover-layer", ["==", ["get", "id"], id]);
      });

      map.on("mouseenter", "badge-bg", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "badge-bg", () => {
        map.getCanvas().style.cursor = "";

        if (hoveredPropertyId) {
          map.setFilter("hover-layer", [
            "==",
            ["get", "id"],
            hoveredPropertyId,
          ]);
        } else {
          map.setFilter("hover-layer", ["==", ["get", "id"], "__none__"]);
        }
      });

      map.on("click", "badge-bg", (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];
        const id = String(feature.properties?.id ?? "");

        if (!id) return;

        const property = properties.find((p) => String(p.id) === id);
        if (!property) return;

        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
          number,
          number,
        ];

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
    });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

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

    map.setFilter("hover-layer", ["==", ["get", "id"], "__none__"]);
  }, [dealType, propertyType]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (!map.isStyleLoaded()) return;
    if (!map.getLayer("hover-layer")) return;

    if (hoveredPropertyId === null) {
      map.setFilter("hover-layer", ["==", ["get", "id"], "__none__"]);
    } else {
      map.setFilter("hover-layer", ["==", ["get", "id"], hoveredPropertyId]);
    }
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
