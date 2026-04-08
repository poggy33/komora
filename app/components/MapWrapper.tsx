"use client";

import dynamic from "next/dynamic";

type Props = {
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
};

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({
  dealType,
  propertyType,
  hoveredPropertyId,
  setHoveredPropertyId,
}: Props) {
  return (
    <Map
      dealType={dealType}
      propertyType={propertyType}
      hoveredPropertyId={hoveredPropertyId}
      setHoveredPropertyId={setHoveredPropertyId}
    />
  );
}
