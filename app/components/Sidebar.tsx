"use client";

import type { Property } from "../types/property";
import PropertyListCard from "./PropertyListCard";

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
          padding: "14px 16px",
          borderBottom: "1px solid #eee",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "4px",
          }}
        >
          {showFavoritesOnly
            ? `${properties.length} в обраному`
            : `${properties.length} оголошень`}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#666",
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
  return "Земля";
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
