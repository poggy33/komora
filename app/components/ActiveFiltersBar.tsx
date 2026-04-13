"use client";

import { useEffect, useState } from "react";
import type { FiltersState } from "./FiltersDrawer";

type Props = {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  isHiddenOnMobile?: boolean;
};

export default function ActiveFiltersBar({ filters, onChange, isHiddenOnMobile = false, }: Props) {
  const items = buildItems(filters);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    check();
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  if (items.length === 0) return null;
  if (isMobile && isHiddenOnMobile) return null;

  return (
    <div
      style={
        isMobile
          ? {
              position: "absolute",
              top: "0",
              left: "10px",
              right: "10px",
              zIndex: 2,
              pointerEvents: "none",
            }
          : {
              padding: "6px 12px",
              borderBottom: "1px solid #eee",
              background: "#fff",
            }
      }
    >
      <div
        style={
          isMobile
            ? {
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                padding: "6px 8px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(3px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                pointerEvents: "auto",
                WebkitOverflowScrolling: "touch",
              }
            : {
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }
        }
      >
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.next)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              minHeight: "30px",
              borderRadius: "999px",
              border: "1px solid #ddd",
              background: "rgba(248,248,248,0.58)",
              color: "#111",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span>{item.label}</span>
            <span
              style={{
                fontSize: "12px",
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