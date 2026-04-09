"use client";
import { useEffect, useState } from "react";

type PropertyType = "apartment" | "house" | "land";
type DealType = "sale" | "rent";

type Props = {
  propertyType: PropertyType;
  dealType: DealType;
  setPropertyType: (value: PropertyType) => void;
  setDealType: (value: DealType) => void;
  onOpenFilters?: () => void;
  onOpenUserMenu?: () => void;
  hasActiveFilters?: boolean;
  activeFiltersCount?: number;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
};

export default function MainTopBar({
  propertyType,
  dealType,
  setPropertyType,
  setDealType,
  onOpenFilters,
  onOpenUserMenu,
  hasActiveFilters = false,
  activeFiltersCount = 0,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
}: Props) {
  const controlsDisabled = showFavoritesOnly;
  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    minWidth: "20px",
    height: "20px",
    padding: "0 6px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    boxSizing: "border-box",
    pointerEvents: "none",
    zIndex: 3,
    transform: "scale(1)",
    transition: "transform 0.15s ease",
  };
  const [filtersBadgePop, setFiltersBadgePop] = useState(false);
  const [favoritesBadgePop, setFavoritesBadgePop] = useState(false);

  useEffect(() => {
    if (activeFiltersCount <= 0) return;

    setFiltersBadgePop(true);

    const timer = setTimeout(() => {
      setFiltersBadgePop(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeFiltersCount]);

  useEffect(() => {
    if (favoritesCount <= 0) return;

    setFavoritesBadgePop(true);

    const timer = setTimeout(() => {
      setFavoritesBadgePop(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [favoritesCount]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#fff",
        borderBottom: "1px solid #eaeaea",
      }}
    >
      <div
        className="main-topbar-inner"
        style={{
          maxWidth: "100%",
          padding: "12px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          position: "relative",
        }}
      >
        <div
          className="main-topbar-logo"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111",
            whiteSpace: "nowrap",
          }}
        >
          HomeMap
        </div>

        <div
          className="main-topbar-controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <select
            className="main-topbar-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
            disabled={controlsDisabled}
            style={{
              ...selectStyle,
              opacity: controlsDisabled ? 0.5 : 1,
              cursor: controlsDisabled ? "not-allowed" : "pointer",
            }}
          >
            <option value="apartment">Квартири</option>
            <option value="house">Будинки</option>
            <option value="land">Земля</option>
          </select>

          <div
            className="main-topbar-toggle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f3f3f3",
              borderRadius: "999px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (controlsDisabled) return;
                setDealType("sale");
              }}
              disabled={controlsDisabled}
              style={{
                ...toggleButtonStyle,
                background: dealType === "sale" ? "#111" : "transparent",
                color: dealType === "sale" ? "#fff" : "#111",
                opacity: controlsDisabled ? 0.5 : 1,
                cursor: controlsDisabled ? "not-allowed" : "pointer",
              }}
            >
              Продаж
            </button>

            <button
              type="button"
              onClick={() => {
                if (controlsDisabled) return;
                setDealType("rent");
              }}
              disabled={controlsDisabled}
              style={{
                ...toggleButtonStyle,
                background: dealType === "rent" ? "#111" : "transparent",
                color: dealType === "rent" ? "#fff" : "#111",
                opacity: controlsDisabled ? 0.5 : 1,
                cursor: controlsDisabled ? "not-allowed" : "pointer",
              }}
            >
              Оренда
            </button>
          </div>

          <div
            className="main-topbar-filters"
            style={{
              position: "relative",
              display: "inline-flex",
              flex: "0 0 auto",
              overflow: "visible",
              paddingTop: "2px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (controlsDisabled) return;
                onOpenFilters?.();
              }}
              disabled={controlsDisabled}
              style={{
                ...pillButtonStyle,
                border: hasActiveFilters ? "1px solid #111" : "1px solid #ddd",
                background: "#fff",
                color: "#111",
                opacity: controlsDisabled ? 0.5 : 1,
                cursor: controlsDisabled ? "not-allowed" : "pointer",
                position: "relative",
              }}
              aria-label="Відкрити розширені фільтри"
            >
              <span style={{ fontSize: "16px", lineHeight: 1 }}>☰</span>
              <span>Фільтри</span>
            </button>

            {activeFiltersCount > 0 && (
              <span
                style={{
                  ...badgeStyle,
                  transform: filtersBadgePop ? "scale(1.12)" : "scale(1)",
                }}
              >
                {activeFiltersCount > 9 ? "9+" : activeFiltersCount}
              </span>
            )}
          </div>

          <div
            className="main-topbar-favorites"
            style={{
              position: "relative",
              display: "inline-flex",
              flex: "0 0 auto",
              overflow: "visible",
              paddingTop: "2px",
            }}
          >
            <button
              type="button"
              onClick={onToggleFavorites}
              style={{
                ...pillButtonStyle,
                position: "relative",
                border: showFavoritesOnly ? "1px solid #111" : "1px solid #ddd",
                background: showFavoritesOnly ? "#111" : "#fff",
                color: showFavoritesOnly ? "#fff" : "#111",
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {showFavoritesOnly ? "♥" : "♡"}
              </span>
              <span>Обране</span>
            </button>

            {favoritesCount > 0 && (
              <span
                style={{
                  ...badgeStyle,
                  transform: favoritesBadgePop ? "scale(1.12)" : "scale(1)",
                }}
              >
                {favoritesCount > 9 ? "9+" : favoritesCount}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="main-topbar-user"
          onClick={onOpenUserMenu}
          style={userButtonStyle}
          aria-label="Відкрити меню користувача"
        >
          👤
        </button>
      </div>
    </header>
  );
}

const selectStyle: React.CSSProperties = {
  minWidth: "170px",
  height: "44px",
  padding: "0 14px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "14px",
  color: "#111",
  outline: "none",
  cursor: "pointer",
};

const toggleButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const pillButtonStyle: React.CSSProperties = {
  height: "44px",
  padding: "0 16px",
  borderRadius: "999px",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

const userButtonStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "18px",
  cursor: "pointer",
  flexShrink: 0,
};
