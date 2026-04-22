"use client";

import type { Property } from "../types/property";
import PropertyListCard from "./PropertyListCard";

type Props = {
  properties: Property[];
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  onHover: (id: string | null) => void;
  onSelect: (p: Property) => void;
  onUserInteract?: () => void;
};

export default function SidebarList({
  properties,
  hoveredPropertyId,
  selectedPropertyId,
  favoriteIds,
  toggleFavorite,
  onHover,
  onSelect,
  onUserInteract,
}: Props) {
  return (
    <>
      {properties.map((property) => {
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
      })}
    </>
  );
}