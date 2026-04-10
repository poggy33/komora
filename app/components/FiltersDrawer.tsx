"use client";

"use client";

import { useEffect, useState } from "react";
import type { DealType } from "@/types/property";
import { getPropertiesCountFromSupabase } from "lib/properties";

export type FiltersState = {
  priceMin: string;
  priceMax: string;
  rooms: string;
  areaMin: string;
};

type SupportedPropertyType = "apartment" | "house" | "land";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  value: FiltersState;
  onApply: (next: FiltersState) => void;
  onReset: () => void;
  propertyType: SupportedPropertyType;
  dealType: DealType;
};

export default function FiltersDrawer({
  isOpen,
  onClose,
  value,
  onApply,
  onReset,
  propertyType,
  dealType,
  // previewCount,
}: Props) {
  const [draft, setDraft] = useState<FiltersState>(value);
  const [previewCount, setPreviewCount] = useState(0);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
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

  useEffect(() => {
    if (propertyType === "land") {
      setDraft((prev) => ({
        ...prev,
        rooms: "",
      }));
    }
  }, [propertyType]);

  useEffect(() => {
    if (!isOpen) return;

    const previewFilters =
      propertyType === "land" ? { ...draft, rooms: "" } : draft;

    let isCancelled = false;

    async function loadPreviewCount() {
      try {
        setIsPreviewLoading(true);

        const count = await getPropertiesCountFromSupabase({
          dealType,
          propertyType,
          filters: previewFilters,
        });

        if (!isCancelled) {
          setPreviewCount(count);
        }
      } catch (error) {
        console.error("Failed to load preview count:", error);

        if (!isCancelled) {
          setPreviewCount(0);
        }
      } finally {
        if (!isCancelled) {
          setIsPreviewLoading(false);
        }
      }
    }

    loadPreviewCount();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, draft, propertyType, dealType]);

  const previewFilters =
    propertyType === "land" ? { ...draft, rooms: "" } : draft;

  if (!isOpen) return null;

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
        className="filters-drawer"
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
          <div>
            <div style={labelStyle}>Ціна від</div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Напр. 30000"
              value={draft.priceMin}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, priceMin: e.target.value }))
              }
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>Ціна до</div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Напр. 100000"
              value={draft.priceMax}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, priceMax: e.target.value }))
              }
              style={inputStyle}
            />
          </div>

          {propertyType !== "land" && (
            <div>
              <div style={labelStyle}>Кімнати</div>
              <select
                value={draft.rooms}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, rooms: e.target.value }))
                }
                style={inputStyle}
              >
                <option value="">Будь-яка кількість</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          )}

          <div>
            <div style={labelStyle}>
              {propertyType === "land" ? "Площа від, сот." : "Площа від, м²"}
            </div>
            <input
              type="number"
              inputMode="numeric"
              placeholder={propertyType === "land" ? "Напр. 6" : "Напр. 40"}
              value={draft.areaMin}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, areaMin: e.target.value }))
              }
              style={inputStyle}
            />
          </div>
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
          <button type="button" onClick={onReset} style={secondaryButtonStyle}>
            Скинути
          </button>

          <button
            type="button"
            onClick={() => {
              onApply(previewFilters);
              onClose();
            }}
            style={primaryButtonStyle}
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? "Рахуємо..." : `Показати ${previewCount}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#333",
  marginBottom: "8px",
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
};

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
