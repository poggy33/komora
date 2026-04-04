"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Point } from "geojson";
import { properties } from "../data/properties";
import type { Property } from "../types/property";
import Sidebar from "./Sidebar";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<
    "apartment" | "house" | "land"
  >("apartment");
  const formatToK = (num: number) => {
    if (num >= 1000) {
      const value = num / 1000;

      // якщо ціле → без .0
      if (value % 1 === 0) {
        return `$${value}k`;
      }

      return `$${value.toFixed(1)}k`;
    }

    return `$${num}`;
  };

  const buildGeoJSON = (): FeatureCollection<Point> => {
    const filtered = properties.filter(
      (p) => p.dealType === dealType && p.propertyType === propertyType,
    );

    return {
      type: "FeatureCollection",
      features: filtered.map((p) => {
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
          type: "Feature",
          properties: {
            label,
            id: p.id, // 🔥 ДОДАЙ
          },
          geometry: {
            type: "Point",
            coordinates: p.coordinates,
          },
        };
      }),
    };
  };

  // 🔥 створення карти (ОДИН РАЗ)
  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return; // 🔥 КРИТИЧНО

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [24.71, 48.92],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      // const geojson = buildGeoJSON(); // 🔥 дефолт
      map.resize();
      map.addSource("points", {
        type: "geojson",
        data: buildGeoJSON(), // 🔥 ВАЖЛИВО
        // generateId: true,
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "points",

        // 👇 показує тільки кластери
        filter: ["has", "point_count"],

        paint: {
          "circle-color": "#2563eb",

          // 👇 розмір залежить від кількості
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, // <10
            10,
            25, // 10-30
            30,
            30, // 30+
          ],

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

      // 🔵 фон
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
        filter: ["==", ["get", "id"], -1], // нічого не показує

        paint: {
          "circle-radius": 24,
          "circle-color": "#ffffff",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#000",
        },
        minzoom: 13,
      });

      // 🔵 точки
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

      // 🔥 hover
      map.on("mousemove", "badge-bg", (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];
        const id = feature.properties?.id;
        map.getCanvas().style.cursor = "pointer";
        // if (!id) return;
        if (id === undefined || id === null) return;

        // 🔥 показуємо hover тільки для цієї точки
        map.setFilter("hover-layer", ["==", ["get", "id"], id]);
      });

      map.on("mouseleave", "badge-bg", () => {
        // 🔥 ховаємо hover
        map.getCanvas().style.cursor = "";
        map.setFilter("hover-layer", ["==", ["get", "id"], -1]);
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;

        const source = map.getSource("points") as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          if (zoom === undefined || zoom === null) return;

          map.easeTo({
            center: (features[0].geometry as any).coordinates,
            zoom: zoom,
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
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const source = map.getSource("points") as mapboxgl.GeoJSONSource;

    if (!source) return;

    source.setData(buildGeoJSON());
  }, [dealType, propertyType]);

  const filteredProperties = properties.filter(
    (p) => p.dealType === dealType && p.propertyType === propertyType,
  );

  const handleSelect = (p: Property) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: p.coordinates,
      zoom: 15,
      speed: 1.2,
    });
  };

  return (
    <div className="layout">
      {/* 🔥 SIDEBAR */}
      <div className="sidebar">
        <Sidebar
          properties={filteredProperties}
          dealType={dealType}
          propertyType={propertyType}
          setDealType={setDealType}
          setPropertyType={setPropertyType}
          onSelect={handleSelect}
        />
      </div>

      {/* 🔥 MAP */}
      <div className="map-wrapper">
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
