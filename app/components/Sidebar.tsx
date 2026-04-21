"use client";

import type { Property } from "../types/property";
import PropertyListCard from "./PropertyListCard";
import { useEffect, useRef, useState } from "react";

const SIDEBAR_SCROLL_STORAGE_KEY_DESKTOP = "sidebar-scroll-top-desktop";
const SIDEBAR_SCROLL_STORAGE_KEY_MOBILE = "sidebar-scroll-top-mobile";

type Props = {
  properties: Property[];
  onSelect: (p: Property) => void;
  onHover: (id: string | null) => void;
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  onUserInteract?: () => void;
  compactHeaderOnly?: boolean;
};

function getSidebarScrollStorageKey(isMobileList: boolean) {
  return isMobileList
    ? SIDEBAR_SCROLL_STORAGE_KEY_MOBILE
    : SIDEBAR_SCROLL_STORAGE_KEY_DESKTOP;
}

function saveSidebarScrollTop(value: number, isMobileList: boolean) {
  try {
    window.sessionStorage.setItem(
      getSidebarScrollStorageKey(isMobileList),
      String(value),
    );
  } catch (error) {
    console.error("Failed to save sidebar scroll:", error);
  }
}

function readSidebarScrollTop(isMobileList: boolean): number | null {
  try {
    const raw = window.sessionStorage.getItem(
      getSidebarScrollStorageKey(isMobileList),
    );
    if (!raw) return null;

    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    console.error("Failed to read sidebar scroll:", error);
    return null;
  }
}

export default function Sidebar({
  properties,
  onSelect,
  onHover,
  hoveredPropertyId,
  selectedPropertyId,
  favoriteIds,
  toggleFavorite,
  showFavoritesOnly,
  onUserInteract,
  compactHeaderOnly = false,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const hasHydratedScrollRef = useRef(false);
  const isMobileListMode = compactHeaderOnly === false;

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (compactHeaderOnly) return;

    const handleScroll = () => {
      saveSidebarScrollTop(el.scrollTop, isMobileListMode);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [compactHeaderOnly, isMobileListMode]);

  useEffect(() => {
    if (compactHeaderOnly) return;

    const el = scrollContainerRef.current;
    if (!el) return;
    if (properties.length === 0) return;

    const savedScrollTop = readSidebarScrollTop(isMobileListMode);
    if (savedScrollTop === null) {
      hasHydratedScrollRef.current = true;
      return;
    }

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      scrollContainerRef.current.scrollTop = savedScrollTop;
      hasHydratedScrollRef.current = true;
    });
  }, [properties.length, compactHeaderOnly, isMobileListMode]);

  useEffect(() => {
    hasHydratedScrollRef.current = false;
  }, [compactHeaderOnly]);
  
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
          padding: compactHeaderOnly ? "10px 16px 12px" : "14px 16px",
          borderBottom: "1px solid #eee",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: compactHeaderOnly ? "72px" : "auto",
          boxSizing: "border-box",
          cursor: compactHeaderOnly ? "pointer" : "default",
        }}
        onClick={() => {
          if (compactHeaderOnly) onUserInteract?.();
        }}
      >
        <div
          style={{
            fontSize: compactHeaderOnly ? "13px" : "14px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "2px",
            lineHeight: 1.25,
          }}
        >
          {showFavoritesOnly
            ? `${properties.length} в обраному`
            : `${properties.length} оголошень`}
        </div>

        <div
          style={{
            fontSize: compactHeaderOnly ? "11px" : "12px",
            color: "#666",
            lineHeight: 1.25,
          }}
        >
          {showFavoritesOnly
            ? "Усі збережені об’єкти"
            : `${getTypeLabel(properties)} • ${getDealLabel(properties)}`}
        </div>
      </div>

      {compactHeaderOnly ? null : (
        <div
          className="sidebar-scroll sidebar-cards"
          ref={scrollContainerRef}
          style={{
            padding: "14px",
            overflowY: "auto",
            flex: 1,
          }}
          onScroll={() => onUserInteract?.()}
          onTouchStart={() => onUserInteract?.()}
        >
          {properties.length === 0 ? (
            <EmptyState isFavorites={showFavoritesOnly} />
          ) : (
            properties.map((property) => {
              const isHovered = hoveredPropertyId === String(property.id);
              const isSelected = selectedPropertyId === String(property.id);

              return (
                <div
                  key={property.id}
                  style={{ marginBottom: "14px" }}
                  onMouseDown={() => onUserInteract?.()}
                  onTouchStart={() => onUserInteract?.()}
                >
                  <PropertyListCard
                    key={property.id}
                    property={property}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    isFavorite={favoriteIds.includes(String(property.id))}
                    onToggleFavorite={toggleFavorite}
                    onHover={onHover}
                    onSelect={onSelect}
                  />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function getTypeLabel(properties: Property[]) {
  if (!properties.length) return "";

  const type = properties[0].propertyType;

  if (type === "apartment") return "Квартири";
  if (type === "house") return "Будинки";
  if (type === "land") return "Земля";
  if (type === "commercial") return "Комерційна нерухомість";

  return "Нерухомість";
}

function getDealLabel(properties: Property[]) {
  if (!properties.length) return "";

  const deal = properties[0].dealType;

  return deal === "sale" ? "Продаж" : "Оренда";
}

function EmptyState({ isFavorites }: { isFavorites: boolean }) {
  return (
    <div
      style={{
        padding: "44px 20px",
        textAlign: "center",
        color: "#555",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          marginBottom: "8px",
          color: "#111",
        }}
      >
        {isFavorites ? "У вас ще немає обраних" : "Нічого не знайдено"}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#777",
          lineHeight: 1.5,
          maxWidth: "260px",
          margin: "0 auto",
        }}
      >
        {isFavorites
          ? "Натисніть ♥ на картці або на мапі, щоб зберегти оголошення."
          : "Спробуйте змінити тип нерухомості, режим угоди або параметри фільтрів."}
      </div>
    </div>
  );
}
