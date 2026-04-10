"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  lat: number | null;
  lng: number | null;
  onPick: (coords: { lat: number; lng: number }) => void;
};

export default function LocationPickerMap({ lat, lng, onPick }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const initialCenter: [number, number] =
      lng !== null && lat !== null ? [lng, lat] : [24.7111, 48.9226];

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCenter,
      zoom: 12,
    });

    mapRef.current = map;

    if (lng !== null && lat !== null) {
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    }

    map.on("click", (e) => {
      const nextLng = e.lngLat.lng;
      const nextLat = e.lngLat.lat;

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat([nextLng, nextLat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([nextLng, nextLat]);
      }

      onPick({
        lat: nextLat,
        lng: nextLng,
      });
    });

    return () => {
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (lat === null || lng === null) return;

    const coords: [number, number] = [lng, lat];

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker().setLngLat(coords).addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat(coords);
    }

    mapRef.current.easeTo({
      center: coords,
      duration: 500,
    });
  }, [lat, lng]);

  return (
    <div
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #ddd",
        minHeight: "320px",
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "320px",
        }}
      />
    </div>
  );
}