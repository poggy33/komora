"use client";

import SidebarShell from "./SidebarShell";
import SidebarList from "./SidebarList";
import type { Property } from "../types/property";
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
  // isLoading?: boolean;
  isBootLoading?: boolean;
  isRefreshing?: boolean;
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
  // isLoading,
  isBootLoading = false,
  isRefreshing = false,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const hasHydratedScrollRef = useRef(false);
  const isMobileListMode = compactHeaderOnly === false;

  const [stableProperties, setStableProperties] =
    useState<Property[]>(properties);

  useEffect(() => {
    if (!isRefreshing) {
      setStableProperties(properties);
    }
  }, [properties, isRefreshing]);

  const displayedProperties = isRefreshing ? stableProperties : properties;

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
    <SidebarShell
      count={displayedProperties.length}
      title={showFavoritesOnly ? "в обраному" : "оголошень"}
      subtitle={
        showFavoritesOnly
          ? "Усі збережені об’єкти"
          : `${getTypeLabel(displayedProperties)} • ${getDealLabel(displayedProperties)}`
      }
      compactHeaderOnly={compactHeaderOnly}
      isBootLoading={isBootLoading}
      isRefreshing={isRefreshing}
      onHeaderClick={onUserInteract}
      scrollContainerRef={scrollContainerRef}
      onScroll={() => onUserInteract?.()}
      onTouchStart={() => onUserInteract?.()}
    >
      {isBootLoading ? (
        <SidebarSkeleton />
      ) : displayedProperties.length === 0 ? (
        <EmptyState isFavorites={showFavoritesOnly} />
      ) : (
        <SidebarList
          properties={displayedProperties}
          hoveredPropertyId={hoveredPropertyId}
          selectedPropertyId={selectedPropertyId}
          favoriteIds={favoriteIds}
          toggleFavorite={toggleFavorite}
          onHover={onHover}
          onSelect={onSelect}
          onUserInteract={onUserInteract}
        />
      )}
    </SidebarShell>
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

function SidebarSkeleton() {
  return (
    <div
      style={{
        padding: "14px",
        display: "grid",
        gap: "14px",
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ececec",
            borderRadius: "18px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "180px",
              background:
                "linear-gradient(90deg, #f3f3f3 0%, #f8f8f8 50%, #f3f3f3 100%)",
            }}
          />
          <div
            style={{
              padding: "14px",
              display: "grid",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "38%",
                height: "12px",
                borderRadius: "999px",
                background: "#f0f0f0",
              }}
            />
            <div
              style={{
                width: "72%",
                height: "16px",
                borderRadius: "999px",
                background: "#ececec",
              }}
            />
            <div
              style={{
                width: "56%",
                height: "13px",
                borderRadius: "999px",
                background: "#f1f1f1",
              }}
            />
            <div
              style={{
                width: "84%",
                height: "12px",
                borderRadius: "999px",
                background: "#f5f5f5",
              }}
            />
            <div
              style={{
                width: "34%",
                height: "18px",
                borderRadius: "999px",
                background: "#ececec",
                marginTop: "4px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
