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
    <>
      <main
        style={{
          height: "100dvh",
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

        <div
          style={{
            flex: 1,
            minHeight: 0,
          }}
        >
          <MapWrapper dealType={dealType} propertyType={propertyType} />
        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 900px) {
          .main-search-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: 48vh minmax(0, 1fr) !important;
          }

          .main-search-sidebar {
            order: 2;
            border-right: none !important;
            border-top: 1px solid #eee;
          }

          .main-search-map {
            order: 1;
          }
        }
      `}</style>
    </>
  );
}

