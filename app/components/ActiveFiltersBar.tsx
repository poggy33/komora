"use client";

import { useEffect, useState } from "react";
import type { FiltersState } from "./filters.types";

type Props = {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  isHiddenOnMobile?: boolean;
};

type FilterChip = {
  key: string;
  label: string;
  next: FiltersState;
};

export default function ActiveFiltersBar({
  filters,
  onChange,
  isHiddenOnMobile = false,
}: Props) {
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

function buildItems(filters: FiltersState): FilterChip[] {
  const items: FilterChip[] = [];

  if (filters.priceMin) {
    items.push({
      key: "priceMin",
      label: `ціна від $${Number(filters.priceMin).toLocaleString()}`,
      next: { ...filters, priceMin: "" },
    });
  }

  if (filters.priceMax) {
    items.push({
      key: "priceMax",
      label: `ціна до $${Number(filters.priceMax).toLocaleString()}`,
      next: { ...filters, priceMax: "" },
    });
  }

  if (filters.pricePerSqmMin) {
    items.push({
      key: "pricePerSqmMin",
      label: `від $${Number(filters.pricePerSqmMin).toLocaleString()}/м²`,
      next: { ...filters, pricePerSqmMin: "" },
    });
  }

  if (filters.pricePerSqmMax) {
    items.push({
      key: "pricePerSqmMax",
      label: `до $${Number(filters.pricePerSqmMax).toLocaleString()}/м²`,
      next: { ...filters, pricePerSqmMax: "" },
    });
  }

  if (filters.areaMin) {
    items.push({
      key: "areaMin",
      label: `площа від ${Number(filters.areaMin).toLocaleString()} м²`,
      next: { ...filters, areaMin: "" },
    });
  }

  if (filters.areaMax) {
    items.push({
      key: "areaMax",
      label: `площа до ${Number(filters.areaMax).toLocaleString()} м²`,
      next: { ...filters, areaMax: "" },
    });
  }

  if (filters.lotAreaMin) {
    items.push({
      key: "lotAreaMin",
      label: `ділянка від ${Number(filters.lotAreaMin).toLocaleString()}`,
      next: { ...filters, lotAreaMin: "" },
    });
  }

  if (filters.lotAreaMax) {
    items.push({
      key: "lotAreaMax",
      label: `ділянка до ${Number(filters.lotAreaMax).toLocaleString()}`,
      next: { ...filters, lotAreaMax: "" },
    });
  }

  if (filters.floorsMin) {
    items.push({
      key: "floorsMin",
      label: `поверхів від ${filters.floorsMin}`,
      next: { ...filters, floorsMin: "" },
    });
  }

  if (filters.floorsMax) {
    items.push({
      key: "floorsMax",
      label: `поверхів до ${filters.floorsMax}`,
      next: { ...filters, floorsMax: "" },
    });
  }

  if (filters.yearBuiltFrom) {
    items.push({
      key: "yearBuiltFrom",
      label: `рік від ${filters.yearBuiltFrom}`,
      next: { ...filters, yearBuiltFrom: "" },
    });
  }

  if (filters.yearBuiltTo) {
    items.push({
      key: "yearBuiltTo",
      label: `рік до ${filters.yearBuiltTo}`,
      next: { ...filters, yearBuiltTo: "" },
    });
  }

  filters.rooms.forEach((room) => {
    items.push({
      key: `room-${room}`,
      label: `${room} кімн.`,
      next: {
        ...filters,
        rooms: filters.rooms.filter((value) => value !== room),
      },
    });
  });

  filters.marketType.forEach((value) => {
    items.push({
      key: `marketType-${value}`,
      label: value === "new_building" ? "новобудова" : "вторинка",
      next: {
        ...filters,
        marketType: filters.marketType.filter((item) => item !== value),
      },
    });
  });

  filters.heating.forEach((value) => {
    items.push({
      key: `heating-${value}`,
      label: heatingLabel(value),
      next: {
        ...filters,
        heating: filters.heating.filter((item) => item !== value),
      },
    });
  });

  filters.parking.forEach((value) => {
    items.push({
      key: `parking-${value}`,
      label: parkingLabel(value),
      next: {
        ...filters,
        parking: filters.parking.filter((item) => item !== value),
      },
    });
  });

  filters.renovation.forEach((value) => {
    items.push({
      key: `renovation-${value}`,
      label: renovationLabel(value),
      next: {
        ...filters,
        renovation: filters.renovation.filter((item) => item !== value),
      },
    });
  });

  filters.landPurpose.forEach((value) => {
    items.push({
      key: `landPurpose-${value}`,
      label: landPurposeLabel(value),
      next: {
        ...filters,
        landPurpose: filters.landPurpose.filter((item) => item !== value),
      },
    });
  });

  if (filters.notFirstFloor) {
    items.push({
      key: "notFirstFloor",
      label: "не перший поверх",
      next: { ...filters, notFirstFloor: false },
    });
  }

  if (filters.notLastFloor) {
    items.push({
      key: "notLastFloor",
      label: "не останній поверх",
      next: { ...filters, notLastFloor: false },
    });
  }

  if (filters.documentsReady) {
    items.push({
      key: "documentsReady",
      label: "документи готові",
      next: { ...filters, documentsReady: false },
    });
  }

  if (filters.furnished) {
    items.push({
      key: "furnished",
      label: "з меблями",
      next: { ...filters, furnished: false },
    });
  }

  if (filters.petsAllowed) {
    items.push({
      key: "petsAllowed",
      label: "можна з тваринами",
      next: { ...filters, petsAllowed: false },
    });
  }

  if (filters.publishedWithin !== "all") {
    items.push({
      key: "publishedWithin",
      label: `${getPublishedWithinLabel(filters.publishedWithin)}`,
      next: {
        ...filters,
        publishedWithin: "all",
      },
    });
  }

  return items;
}

function heatingLabel(value: FiltersState["heating"][number]) {
  switch (value) {
    case "individual":
      return "індивідуальне опалення";
    case "central":
      return "центральне опалення";
    case "electric":
      return "електричне опалення";
    case "solid_fuel":
      return "твердопаливне опалення";
    default:
      return value;
  }
}

function parkingLabel(value: FiltersState["parking"][number]) {
  switch (value) {
    case "parking":
      return "паркінг";
    case "underground":
      return "підземний паркінг";
    default:
      return value;
  }
}

function renovationLabel(value: FiltersState["renovation"][number]) {
  switch (value) {
    case "no_repair":
      return "без ремонту";
    case "livable":
      return "житловий стан";
    case "good":
      return "хороший стан";
    case "euro":
      return "євроремонт";
    default:
      return value;
  }
}

function landPurposeLabel(value: FiltersState["landPurpose"][number]) {
  switch (value) {
    case "residential":
      return "під забудову";
    case "agricultural":
      return "с/г призначення";
    case "commercial":
      return "комерційне призначення";
    default:
      return value;
  }
}

function getPublishedWithinLabel(value: FiltersState["publishedWithin"]) {
  if (value === "1d") return "За 1 день";
  if (value === "3d") return "За 3 дні";
  if (value === "7d") return "За 7 днів";
  if (value === "30d") return "За 30 днів";
  return "";
}
