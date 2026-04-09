"use client";

import type { FiltersState } from "./FiltersDrawer";

type Props = {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
};

export default function ActiveFiltersBar({ filters, onChange }: Props) {
  const items = buildItems(filters);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        padding: "10px 16px",
        borderBottom: "1px solid #eee",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.next)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "999px",
              border: "1px solid #ddd",
              background: "#f8f8f8",
              color: "#111",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <span>{item.label}</span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: 1,
                color: "#666",
              }}
            >
              ✕
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function buildItems(filters: FiltersState) {
  const items: Array<{
    key: string;
    label: string;
    next: FiltersState;
  }> = [];

  if (filters.priceMin) {
    items.push({
      key: "priceMin",
      label: `від $${Number(filters.priceMin).toLocaleString()}`,
      next: { ...filters, priceMin: "" },
    });
  }

  if (filters.priceMax) {
    items.push({
      key: "priceMax",
      label: `до $${Number(filters.priceMax).toLocaleString()}`,
      next: { ...filters, priceMax: "" },
    });
  }

  if (filters.rooms) {
    items.push({
      key: "rooms",
      label: `${filters.rooms}+ кімнати`,
      next: { ...filters, rooms: "" },
    });
  }

  if (filters.areaMin) {
    items.push({
      key: "areaMin",
      label: `від ${Number(filters.areaMin).toLocaleString()} м²`,
      next: { ...filters, areaMin: "" },
    });
  }

  return items;
}