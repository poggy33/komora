"use client";

import type { Property } from "../types/property";

type Props = {
  properties: Property[];
  onSelect: (p: Property) => void;
  onHover: (id: string | null) => void;
};

export default function Sidebar({ properties, onSelect, onHover }: Props) {
  return (
    <div
      style={{
        width: "360px",
        maxWidth: "100%",
        height: "100vh",
        overflowY: "auto",
        background: "#fff",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #eee",
          fontSize: "14px",
          color: "#666",
          fontWeight: 600,
        }}
      >
        Знайдено: {properties.length}
      </div>

      <div style={{ padding: "12px" }}>
        {properties.map((p) => (
          <a
            key={p.id}
            href={`/property/${p.id}`}
            onMouseEnter={() => onHover(String(p.id))}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(p)}
            style={{
              display: "block",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "1px solid #eee",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>{p.title}</div>

            <div style={{ marginBottom: "6px" }}>
              💰 ${p.price.toLocaleString()}
            </div>

            {p.propertyType === "apartment" && (
              <div>
                📐 {p.area} м² • 🛏 {p.rooms}
              </div>
            )}

            {p.propertyType === "house" && (
              <div>
                🏠 {p.area} м² • 🛏 {p.rooms} • 🏢 {p.floors} пов.
              </div>
            )}

            {p.propertyType === "land" && <div>🌍 {p.area} сот.</div>}
          </a>
        ))}
      </div>
    </div>
  );
}
