"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Point } from "geojson";
import { properties } from "../data/properties";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [typeFilter, setTypeFilter] = useState<"sale" | "rent">("sale");

  const buildGeoJSON = (type: "sale" | "rent"): FeatureCollection<Point> => {
    const filtered = properties.filter((p) => p.type === type);

    return {
      type: "FeatureCollection",
      features: filtered.map((p) => {
        const pricePerSqm = p.area > 0 ? Math.round(p.price / p.area) : 0;

        // 🔥 різні label для sale / rent
        let label = "";
        if (type === "sale") {
          label =
            `$${p.price.toLocaleString()}\n` +
            `${p.rooms} кімн.\n` +
            `$${pricePerSqm.toLocaleString()}/m²`;
        } else {
          label = `$${p.price.toLocaleString()}/міс\n` + `${p.rooms} кімн.`;
        }
        return {
          type: "Feature",
          id: p.id,
          properties: {
            label,
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

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [24.71, 48.92],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", () => {
      const geojson = buildGeoJSON("sale"); // 🔥 дефолт

      map.addSource("points", {
        type: "geojson",
        data: geojson,
        generateId: true, // 🔥 ДОДАЙ ЦЕ
      });

      // 🔵 фон
      map.addLayer({
        id: "badge-bg",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 18,
          "circle-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ddd",
        },
        minzoom: 13,
      });

      // 🔵 точки
      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            12,
            6,
          ],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#000",
            "#2563eb", // 🔥 фіксований колір
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
        maxzoom: 13,
      });

      map.addLayer({
        id: "price-layer",
        type: "symbol",
        source: "points",
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
      let hoveredId: string | number | null = null;

      map.on("mousemove", "points-layer", (e) => {
        if (!e.features?.length) return;

        const feature = e.features[0];

        if (!feature.id) return; // 🔥 FIX

        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "points", id: hoveredId },
            { hover: false },
          );
        }

        hoveredId = feature.id;

        map.setFeatureState(
          { source: "points", id: hoveredId },
          { hover: true },
        );
      });

      map.on("mouseleave", "points-layer", () => {
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "points", id: hoveredId },
            { hover: false },
          );
        }
        hoveredId = null;
      });
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (!map.isStyleLoaded()) return; // 🔥 захист

    const source = map.getSource("points") as mapboxgl.GeoJSONSource;

    if (!source) return;

    const geojson = buildGeoJSON(typeFilter);

    source.setData(geojson);
  }, [typeFilter]);

  return (
    <>
      {/* 🔥 UI окремо */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          background: "#fff",
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <button onClick={() => setTypeFilter("sale")}>Продаж</button>
        <button onClick={() => setTypeFilter("rent")}>Оренда</button>
      </div>

      {/* 🔥 карта */}
      <div
        ref={mapContainer}
        style={{
          position: "fixed",
          inset: 0,
        }}
      />
    </>
  );
}
