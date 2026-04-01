"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Point } from "geojson";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [24.71, 48.92],
      zoom: 12,
    });

    map.on("load", () => {
      const geojson: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: 1,
            properties: {
              color: "green",
              priceLabel: "$50k",
              sqmLabel: "$1k/m²",
            },
            geometry: {
              type: "Point",
              coordinates: [24.71, 48.92],
            },
          },
          {
            type: "Feature",
            id: 2,
            properties: {
              color: "orange",
              priceLabel: "$60k",
              sqmLabel: "$1.1k/m²",
            },
            geometry: {
              type: "Point",
              coordinates: [24.72, 48.925],
            },
          },
          {
            type: "Feature",
            id: 3,
            properties: {
              color: "red",
              priceLabel: "$70k",
              sqmLabel: "$1.3k/m²",
            },
            geometry: {
              type: "Point",
              coordinates: [24.705, 48.915],
            },
          },
        ],
      };

      map.addSource("points", {
        type: "geojson",
        data: geojson,
      });

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

      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            12, // 🔥 при hover
            6, // звичайний
          ],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#000", // 🔥 hover колір
            ["get", "color"],
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
          "text-field": ["get", "priceLabel"],
          "text-size": 14,
          "text-anchor": "center",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#000",
        },
        minzoom: 13,
        maxzoom: 15, // 🔥 до цього рівня
      });

      map.addLayer({
        id: "price-full-layer",
        type: "symbol",
        source: "points",
        layout: {
          "text-field": [
            "format",
            ["get", "priceLabel"],
            { "font-scale": 1.1 },
            "\n",
            {},
            ["get", "sqmLabel"],
            { "font-scale": 0.8 },
          ],
          "text-size": 12,
          "text-anchor": "center",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#000",
        },
        minzoom: 15, // 🔥 тільки коли сильно зумимо
      });
    });

    let hoveredId: number | null = null;

    map.on("mousemove", "points-layer", (e) => {
      if (!e.features?.length) return;

      const feature = e.features[0];

      if (hoveredId !== null) {
        map.setFeatureState(
          { source: "points", id: hoveredId },
          { hover: false },
        );
      }

      hoveredId = feature.id as number;

      map.setFeatureState({ source: "points", id: hoveredId }, { hover: true });
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

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        position: "fixed",
        inset: 0,
      }}
    />
  );
}
