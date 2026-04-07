"use client";

import { useState } from "react";
import MainTopBar from "./components/MainTopBar";
import MapWrapper from "./components/MapWrapper";

export default function HomePage() {
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<
    "apartment" | "house" | "land"
  >("apartment");

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <MainTopBar
        dealType={dealType}
        propertyType={propertyType}
        setDealType={setDealType}
        setPropertyType={setPropertyType}
        onOpenFilters={() => {
          console.log("open filters");
        }}
        onOpenUserMenu={() => {
          console.log("open user menu");
        }}
      />

      <div style={{ flex: 1, minHeight: 0 }}>
        <MapWrapper dealType={dealType} propertyType={propertyType} />
      </div>
    </main>
  );
}

