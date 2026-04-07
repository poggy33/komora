"use client";

import dynamic from "next/dynamic";

type Props = {
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
};

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper({ dealType, propertyType }: Props) {
  return <Map dealType={dealType} propertyType={propertyType} />;
}
