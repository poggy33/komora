"use client";

import type { Property } from "../types/property";
import SidebarShell from "./SidebarShell";
import SidebarList from "./SidebarList";
import LoadingPill from "@/components/ui/LoadingPill";

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
  isBootLoading?: boolean;
  isRefreshing?: boolean;
};

export default function SidebarV2({
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
  isBootLoading = false,
  isRefreshing = false,
}: Props) {
  return (
    <SidebarShell
      count={properties.length}
      title={showFavoritesOnly ? "в обраному" : "оголошень"}
      subtitle={
        showFavoritesOnly
          ? "Усі збережені об’єкти"
          : `${getTypeLabel(properties)} • ${getDealLabel(properties)}`
      }
      compactHeaderOnly={compactHeaderOnly}
      isBootLoading={isBootLoading}
      isRefreshing={isRefreshing}
      onHeaderClick={onUserInteract}
    >
      {isBootLoading ? (
        <SidebarSkeleton />
      ) : isRefreshing ? (
        <div
          style={{
            padding: "18px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LoadingPill size="sm" label="" />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState isFavorites={showFavoritesOnly} />
      ) : (
        <div
          className="sidebar-scroll sidebar-cards"
          style={{
            padding: "14px",
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
          onScroll={() => onUserInteract?.()}
          onTouchStart={() => onUserInteract?.()}
        >
          <SidebarList
            properties={properties}
            hoveredPropertyId={hoveredPropertyId}
            selectedPropertyId={selectedPropertyId}
            favoriteIds={favoriteIds}
            toggleFavorite={toggleFavorite}
            onHover={onHover}
            onSelect={onSelect}
            onUserInteract={onUserInteract}
          />
        </div>
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
