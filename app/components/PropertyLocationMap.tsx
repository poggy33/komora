"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  coordinates: [number, number];
  title: string;
  address?: string;
};

export default function PropertyLocationMap({
  coordinates,
  title,
  address,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: coordinates,
      zoom: 14,
    });

    mapRef.current = map;

    const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
      `
        <div style="font-family: Arial, sans-serif;">
          <div style="font-weight: 700; margin-bottom: 4px;">${escapeHtml(title)}</div>
          <div style="font-size: 13px; color: #555;">${escapeHtml(address ?? "Локація об’єкта")}</div>
        </div>
      `,
    );

    new mapboxgl.Marker({
      color: "#111111",
    })
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(map);

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates, title, address]);

  return (
    <div
      style={{
        height: "320px",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid #e7e7e7",
        background: "#f3f3f3",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}