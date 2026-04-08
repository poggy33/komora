"use client";

import type { Property } from "../types/property";

type Props = {
  properties: Property[];
  onSelect: (p: Property) => void;
  onHover: (id: string | null) => void;
  hoveredPropertyId: string | null;
};

export default function Sidebar({
  properties,
  onSelect,
  onHover,
  hoveredPropertyId,
}: Props) {
  return (
    <div
      style={{
        width: "360px",
        maxWidth: "100%",
        height: "100%",
        minHeight: 0,
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

      <div className="sidebar-scroll" style={{ padding: "12px" }}>
        {properties.map((p) => {
          const isHovered = hoveredPropertyId === String(p.id);

          return (
            <a
              key={p.id}
              href={`/property/${p.id}`}
              onMouseEnter={() => onHover(String(p.id))}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(p)}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                padding: "14px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: isHovered ? "2px solid #111" : "1px solid #eee",
                background: isHovered ? "#f8f8f8" : "#fff",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                {p.title}
              </div>

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
          );
        })}
      </div>
    </div>
  );
}