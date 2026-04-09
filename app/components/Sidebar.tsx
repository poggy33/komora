"use client";

import type { Property } from "../types/property";
import PropertyListCard from "./PropertyListCard";

type Props = {
  properties: Property[];
  onSelect: (p: Property) => void;
  onHover: (id: string | null) => void;
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
};

export default function Sidebar({
  properties,
  onSelect,
  onHover,
  hoveredPropertyId,
  selectedPropertyId,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="sidebar-header"
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #eee",
          fontSize: "14px",
          color: "#666",
          fontWeight: 600,
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        Знайдено: {properties.length}
      </div>

      <div
        className="sidebar-scroll sidebar-cards"
        style={{
          padding: "14px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {properties.map((property) => {
          const isHovered = hoveredPropertyId === String(property.id);
          const isSelected = selectedPropertyId === String(property.id);

          return (
            <div key={property.id} style={{ marginBottom: "14px" }}>
              <PropertyListCard
                property={property}
                isHovered={isHovered}
                isSelected={isSelected}
                onHover={onHover}
                onSelect={onSelect}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}