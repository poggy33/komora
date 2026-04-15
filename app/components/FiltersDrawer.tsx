"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealType, Property } from "@/types/property";
import { filtersConfig } from "./filters.config";
import type {
  FiltersState,
  SupportedPropertyType,
  MarketType,
  HeatingType,
  ParkingType,
  RenovationType,
  LandPurposeType,
} from "./filters.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  value: FiltersState;
  onApply: (next: FiltersState) => void;
  onReset: () => void;
  propertyType: SupportedPropertyType;
  dealType: DealType;
  visibleProperties?: Property[];
};

const ROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

const MARKET_TYPE_OPTIONS: { value: MarketType; label: string }[] = [
  { value: "new_building", label: "Новобудова" },
  { value: "secondary", label: "Вторинка" },
];

const HEATING_OPTIONS: { value: HeatingType; label: string }[] = [
  { value: "individual", label: "Індивідуальне" },
  { value: "central", label: "Центральне" },
  { value: "electric", label: "Електричне" },
  { value: "solid_fuel", label: "Твердопаливне" },
];

const PARKING_OPTIONS: { value: ParkingType; label: string }[] = [
  { value: "parking", label: "Паркінг" },
  { value: "underground", label: "Підземний" },
];

const RENOVATION_OPTIONS: { value: RenovationType; label: string }[] = [
  { value: "no_repair", label: "Без ремонту" },
  { value: "livable", label: "Житловий стан" },
  { value: "good", label: "Хороший" },
  { value: "euro", label: "Євроремонт" },
];

const LAND_PURPOSE_OPTIONS: { value: LandPurposeType; label: string }[] = [
  { value: "residential", label: "Під забудову" },
  { value: "agricultural", label: "С/г" },
  { value: "commercial", label: "Комерційне" },
];

export default function FiltersDrawer({
  isOpen,
  onClose,
  value,
  onApply,
  onReset,
  propertyType,
  dealType,
  visibleProperties = [],
}: Props) {
  const [draft, setDraft] = useState<FiltersState>(value);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
      setShowAdvanced(false);
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const config = useMemo(() => {
    return filtersConfig[propertyType][dealType];
  }, [propertyType, dealType]);

  const visibleFields = showAdvanced
    ? config
    : config.filter((field) => !field.hiddenInTop);

  const previewCount = useMemo(() => {
    return getPreviewCount({
      properties: visibleProperties,
      propertyType,
      dealType,
      filters: draft,
    });
  }, [visibleProperties, propertyType, dealType, draft]);

  if (!isOpen) return null;

  const setRangeField = (key: keyof FiltersState, nextValue: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const toggleStringArrayValue = <
    T extends MarketType | HeatingType | ParkingType | RenovationType | LandPurposeType
  >(
    key: keyof FiltersState,
    item: T,
  ) => {
    setDraft((prev) => {
      const current = prev[key] as T[];
      const exists = current.includes(item);

      return {
        ...prev,
        [key]: exists
          ? current.filter((value) => value !== item)
          : [...current, item],
      };
    });
  };

  const toggleRoomValue = (room: string) => {
    setDraft((prev) => {
      const exists = prev.rooms.includes(room);

      return {
        ...prev,
        rooms: exists
          ? prev.rooms.filter((value) => value !== room)
          : [...prev.rooms, room],
      };
    });
  };

  const setBooleanField = (key: keyof FiltersState, nextValue: boolean) => {
    setDraft((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const renderField = (field: { key: string; label: string; type: string }) => {
    if (field.type === "range") {
      if (field.key === "price") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.priceMin}
              onChange={(e) => setRangeField("priceMin", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.priceMax}
              onChange={(e) => setRangeField("priceMax", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }

      if (field.key === "pricePerSqm") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.pricePerSqmMin}
              onChange={(e) => setRangeField("pricePerSqmMin", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.pricePerSqmMax}
              onChange={(e) => setRangeField("pricePerSqmMax", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }

      if (field.key === "area") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.areaMin}
              onChange={(e) => setRangeField("areaMin", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.areaMax}
              onChange={(e) => setRangeField("areaMax", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }

      if (field.key === "lotArea") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.lotAreaMin}
              onChange={(e) => setRangeField("lotAreaMin", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.lotAreaMax}
              onChange={(e) => setRangeField("lotAreaMax", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }

      if (field.key === "floors") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.floorsMin}
              onChange={(e) => setRangeField("floorsMin", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.floorsMax}
              onChange={(e) => setRangeField("floorsMax", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }

      if (field.key === "yearBuilt") {
        return (
          <div style={rangeGridStyle}>
            <input
              type="number"
              placeholder="Від"
              value={draft.yearBuiltFrom}
              onChange={(e) => setRangeField("yearBuiltFrom", e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="До"
              value={draft.yearBuiltTo}
              onChange={(e) => setRangeField("yearBuiltTo", e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      }
    }

    if (field.type === "multi_select") {
      if (field.key === "rooms") {
        return (
          <div style={chipsWrapStyle}>
            {ROOM_OPTIONS.map((room) => {
              const active = draft.rooms.includes(room);

              return (
                <button
                  key={room}
                  type="button"
                  onClick={() => toggleRoomValue(room)}
                  style={chipButtonStyle(active)}
                >
                  {room}
                </button>
              );
            })}
          </div>
        );
      }

      if (field.key === "marketType") {
        return (
          <div style={chipsWrapStyle}>
            {MARKET_TYPE_OPTIONS.map((item) => {
              const active = draft.marketType.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleStringArrayValue("marketType", item.value)}
                  style={chipButtonStyle(active)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      if (field.key === "heating") {
        return (
          <div style={chipsWrapStyle}>
            {HEATING_OPTIONS.map((item) => {
              const active = draft.heating.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleStringArrayValue("heating", item.value)}
                  style={chipButtonStyle(active)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      if (field.key === "parking") {
        return (
          <div style={chipsWrapStyle}>
            {PARKING_OPTIONS.map((item) => {
              const active = draft.parking.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleStringArrayValue("parking", item.value)}
                  style={chipButtonStyle(active)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      if (field.key === "renovation") {
        return (
          <div style={chipsWrapStyle}>
            {RENOVATION_OPTIONS.map((item) => {
              const active = draft.renovation.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    toggleStringArrayValue("renovation", item.value)
                  }
                  style={chipButtonStyle(active)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }

      if (field.key === "landPurpose") {
        return (
          <div style={chipsWrapStyle}>
            {LAND_PURPOSE_OPTIONS.map((item) => {
              const active = draft.landPurpose.includes(item.value);

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    toggleStringArrayValue("landPurpose", item.value)
                  }
                  style={chipButtonStyle(active)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        );
      }
    }

    if (field.type === "toggle") {
      if (field.key === "notFirstFloor") {
        return (
          <label style={toggleRowStyle}>
            <input
              type="checkbox"
              checked={draft.notFirstFloor}
              onChange={(e) =>
                setBooleanField("notFirstFloor", e.target.checked)
              }
            />
            <span>Не перший поверх</span>
          </label>
        );
      }

      if (field.key === "notLastFloor") {
        return (
          <label style={toggleRowStyle}>
            <input
              type="checkbox"
              checked={draft.notLastFloor}
              onChange={(e) =>
                setBooleanField("notLastFloor", e.target.checked)
              }
            />
            <span>Не останній поверх</span>
          </label>
        );
      }

      if (field.key === "documentsReady") {
        return (
          <label style={toggleRowStyle}>
            <input
              type="checkbox"
              checked={draft.documentsReady}
              onChange={(e) =>
                setBooleanField("documentsReady", e.target.checked)
              }
            />
            <span>Документи готові</span>
          </label>
        );
      }

      if (field.key === "furnished") {
        return (
          <label style={toggleRowStyle}>
            <input
              type="checkbox"
              checked={draft.furnished}
              onChange={(e) => setBooleanField("furnished", e.target.checked)}
            />
            <span>З меблями</span>
          </label>
        );
      }

      if (field.key === "petsAllowed") {
        return (
          <label style={toggleRowStyle}>
            <input
              type="checkbox"
              checked={draft.petsAllowed}
              onChange={(e) => setBooleanField("petsAllowed", e.target.checked)}
            />
            <span>Можна з тваринами</span>
          </label>
        );
      }
    }

    return null;
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.28)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          height: "100%",
          background: "#fff",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111",
            }}
          >
            Фільтри
          </div>

          <button
            type="button"
            onClick={onClose}
            style={iconButtonStyle}
            aria-label="Закрити фільтри"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            display: "grid",
            gap: "18px",
          }}
        >
          {visibleFields.map((field) => (
            <div key={field.key} style={fieldBlockStyle}>
              <div style={labelStyle}>{field.label}</div>
              {renderField(field)}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            style={showMoreButtonStyle}
          >
            {showAdvanced ? "Сховати розширені" : "Показати розширені"}
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            padding: "16px 20px",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onReset}
            style={secondaryButtonStyle}
          >
            Скинути
          </button>

          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            style={{
              ...primaryButtonStyle,
              opacity: previewCount > 0 ? 1 : 0.75,
            }}
          >
            {previewCount > 0
              ? `Показати ${previewCount}`
              : "Нічого не знайдено"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getPreviewCount({
  properties,
  propertyType,
  dealType,
  filters,
}: {
  properties: Property[];
  propertyType: SupportedPropertyType;
  dealType: DealType;
  filters: FiltersState;
}) {
  return properties.filter((property) =>
    matchesFilters(property, propertyType, dealType, filters),
  ).length;
}

function matchesFilters(
  property: Property,
  propertyType: SupportedPropertyType,
  dealType: DealType,
  filters: FiltersState,
) {
  if (property.propertyType !== propertyType) return false;
  if (property.dealType !== dealType) return false;

  const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : null;
  const areaMin = filters.areaMin ? Number(filters.areaMin) : null;
  const areaMax = filters.areaMax ? Number(filters.areaMax) : null;
  const lotAreaMin = filters.lotAreaMin ? Number(filters.lotAreaMin) : null;
  const lotAreaMax = filters.lotAreaMax ? Number(filters.lotAreaMax) : null;
  const floorsMin = filters.floorsMin ? Number(filters.floorsMin) : null;
  const floorsMax = filters.floorsMax ? Number(filters.floorsMax) : null;
  const yearBuiltFrom = filters.yearBuiltFrom
    ? Number(filters.yearBuiltFrom)
    : null;
  const yearBuiltTo = filters.yearBuiltTo ? Number(filters.yearBuiltTo) : null;
  const pricePerSqmMin = filters.pricePerSqmMin
    ? Number(filters.pricePerSqmMin)
    : null;
  const pricePerSqmMax = filters.pricePerSqmMax
    ? Number(filters.pricePerSqmMax)
    : null;

  if (priceMin !== null && property.price < priceMin) return false;
  if (priceMax !== null && property.price > priceMax) return false;

  if (areaMin !== null && property.area < areaMin) return false;
  if (areaMax !== null && property.area > areaMax) return false;

  if (propertyType !== "land" && propertyType !== "commercial") {
    if (filters.rooms.length > 0) {
      const normalizedRooms = filters.rooms.map((value) =>
        value === "5+" ? 5 : Number(value),
      );

      const propertyRooms = property.rooms;

      if (
        propertyRooms === undefined ||
        !normalizedRooms.some((value) =>
          value === 5 ? propertyRooms >= 5 : propertyRooms === value,
        )
      ) {
        return false;
      }
    }

    if (
      filters.notFirstFloor &&
      property.floor !== undefined &&
      property.floor <= 1
    ) {
      return false;
    }

    if (
      filters.notLastFloor &&
      property.floor !== undefined &&
      property.totalFloors !== undefined &&
      property.floor >= property.totalFloors
    ) {
      return false;
    }
  }

  if (pricePerSqmMin !== null || pricePerSqmMax !== null) {
    if (!property.area || property.area <= 0) return false;

    const pricePerSqm = property.price / property.area;

    if (pricePerSqmMin !== null && pricePerSqm < pricePerSqmMin) return false;
    if (pricePerSqmMax !== null && pricePerSqm > pricePerSqmMax) return false;
  }

  if (lotAreaMin !== null) {
    if (property.lotArea === undefined || property.lotArea < lotAreaMin) {
      return false;
    }
  }

  if (lotAreaMax !== null) {
    if (property.lotArea === undefined || property.lotArea > lotAreaMax) {
      return false;
    }
  }

  const propertyFloors =
    property.propertyType === "house"
      ? property.floors
      : property.totalFloors;

  if (floorsMin !== null) {
    if (propertyFloors === undefined || propertyFloors < floorsMin) {
      return false;
    }
  }

  if (floorsMax !== null) {
    if (propertyFloors === undefined || propertyFloors > floorsMax) {
      return false;
    }
  }

  if (yearBuiltFrom !== null) {
    if (property.yearBuilt === undefined || property.yearBuilt < yearBuiltFrom) {
      return false;
    }
  }

  if (yearBuiltTo !== null) {
    if (property.yearBuilt === undefined || property.yearBuilt > yearBuiltTo) {
      return false;
    }
  }

  if (
    filters.marketType.length > 0 &&
    (!property.marketType || !filters.marketType.includes(property.marketType))
  ) {
    return false;
  }

  if (
    filters.heating.length > 0 &&
    (!property.heating || !filters.heating.includes(property.heating))
  ) {
    return false;
  }

  if (
    filters.parking.length > 0 &&
    (!property.parking || !filters.parking.includes(property.parking))
  ) {
    return false;
  }

  if (
    filters.renovation.length > 0 &&
    (!property.renovation || !filters.renovation.includes(property.renovation))
  ) {
    return false;
  }

  if (
    filters.landPurpose.length > 0 &&
    (!property.landPurpose || !filters.landPurpose.includes(property.landPurpose))
  ) {
    return false;
  }

  if (filters.documentsReady && !property.documentsReady) return false;
  if (filters.furnished && !property.isFurnished) return false;
  if (filters.petsAllowed && !property.petsAllowed) return false;

  return true;
}

const fieldBlockStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#333",
};

const rangeGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  padding: "0 14px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

const chipsWrapStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const toggleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
  color: "#222",
};

const chipButtonStyle = (active: boolean): React.CSSProperties => ({
  height: "38px",
  padding: "0 12px",
  borderRadius: "999px",
  border: active ? "1px solid #111" : "1px solid #ddd",
  background: active ? "#111" : "#fff",
  color: active ? "#fff" : "#111",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
});

const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  height: "46px",
  border: "none",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  height: "46px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const iconButtonStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const showMoreButtonStyle: React.CSSProperties = {
  height: "42px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#fafafa",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};
