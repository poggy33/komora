"use client";

import { useEffect, useRef, useState } from "react";
import type { DealType } from "@/types/property";
import { useAuthUser } from "@/hooks/useAuthUser";
import UserMenu from "@/components/UserMenu";
import type { SupportedPropertyType } from "./filters.types";

type Props = {
  propertyType: SupportedPropertyType;
  dealType: DealType;
  setPropertyType: (value: SupportedPropertyType) => void;
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

  const [filtersBadgePop, setFiltersBadgePop] = useState(false);
  const [favoritesBadgePop, setFavoritesBadgePop] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const { user, isAuthenticated } = useAuthUser();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    minWidth: "18px",
    height: "18px",
    padding: "0 5px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: "18px",
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
        style={{
          maxWidth: "100%",
          padding: "8px 12px 6px",
          display: "grid",
          gap: "10px",
          position: "relative",
        }}
      >
        {/* row 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111",
              whiteSpace: "nowrap",
              lineHeight: 1.1,
            }}
          >
            <img
              src="/komora_logo_ultratight_more_rounded.svg"
              alt="KOMORA"
              style={{
                height: "32px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <div style={{ position: "relative" }} ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                onOpenUserMenu?.();
                setIsUserMenuOpen((prev) => !prev);
              }}
              style={{
                ...userButtonStyle,
                background: isAuthenticated ? "#111" : "#fff",
                color: isAuthenticated ? "#E31B23" : "#111",
                border: isAuthenticated ? "1px solid #111" : "1px solid #ddd",
              }}
              aria-label="Відкрити меню користувача"
            >
              {isAuthenticated ? (
                user?.phone?.slice(-2) || "•"
              ) : (
                <svg width="34" height="34" viewBox="0 0 40 40">
                  {/* фон */}
                  <circle cx="20" cy="20" r="20" fill="#0B0B0B" />

                  {/* обводка */}
                  <circle
                    cx="20"
                    cy="20"
                    r="19"
                    stroke="#E31B23"
                    strokeWidth="1.5"
                  />

                  {/* голова */}
                  <circle cx="20" cy="15" r="5.5" fill="#E31B23" />

                  {/* тіло */}
                  <path d="M9 30c0-5.5 5.5-8 11-8s11 2.5 11 8" fill="#E31B23" />
                </svg>
              )}
            </button>

            {isUserMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "46px",
                  right: 0,
                  zIndex: 50,
                }}
              >
                <UserMenu onClose={() => setIsUserMenuOpen(false)} />
              </div>
            )}
          </div>
        </div>
   {/* row 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "6px",
            rowGap: "6px",
            marginTop: "-4px",
            flexWrap: "wrap",
          }}
        >
          <select
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value as SupportedPropertyType)
            }
            disabled={controlsDisabled}
            style={{
              ...selectStyle,
              minWidth: isMobile ? "104px" : "140px",
              width: isMobile ? "104px" : "auto",
              opacity: controlsDisabled ? 0.5 : 1,
              cursor: controlsDisabled ? "not-allowed" : "pointer",
            }}
          >
            <option value="apartment">Квартири</option>
            <option value="house">Будинки</option>
            <option value="land">Земля</option>
            <option value="commercial">Комерція</option>
          </select>

          {!isMobile ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#f3f3f3",
                borderRadius: "999px",
                padding: "3px",
                gap: "3px",
                flexShrink: 0,
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
          ) : (
            <select
              value={dealType}
              onChange={(e) => setDealType(e.target.value as DealType)}
              disabled={controlsDisabled}
              style={{
                ...selectStyle,
                minWidth: "92px",
                width: "92px",
                opacity: controlsDisabled ? 0.5 : 1,
                cursor: controlsDisabled ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}
            >
              <option value="sale">Продаж</option>
              <option value="rent">Оренда</option>
            </select>
          )}

          <div
            style={{
              position: "relative",
              display: "inline-flex",
              overflow: "visible",
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
              <span style={{ fontSize: "15px", lineHeight: 1 }}>☰</span>
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
            style={{
              position: "relative",
              display: "inline-flex",
              overflow: "visible",
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
              <span style={{ fontSize: "15px" }}>
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

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#f3f3f3",
              borderRadius: "999px",
              padding: "3px",
              gap: "3px",
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}

const selectStyle: React.CSSProperties = {
  height: "34px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "12px",
  fontWeight: 600,
  color: "#111",
  outline: "none",
  flexShrink: 0,
};

const toggleButtonStyle: React.CSSProperties = {
  height: "34px",
  border: "none",
  borderRadius: "999px",
  padding: "0 10px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const pillButtonStyle: React.CSSProperties = {
  height: "34px",
  padding: "0 10px",
  borderRadius: "999px",
  background: "#fff",
  color: "#111",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const userButtonStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "15px",
  cursor: "pointer",
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};
