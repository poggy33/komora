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
          .marker-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 74px;
  padding: 8px 12px;
  border: 1px solid #dcdcdc;
  border-radius: 999px;
  background: #ffffff;
  color: #111111;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
  font-family: Arial, sans-serif;
}

.marker-pill:hover,
.marker-pill.is-hovered {
  transform: scale(1.04);
  border-color: #111111;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
}

.marker-pill__top {
  display: block;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.1;
}

.marker-pill__bottom {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.1;
  color: #555555;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .marker-pill {
    min-width: 68px;
    padding: 7px 10px;
  }

  .marker-pill__top {
    font-size: 13px;
  }

  .marker-pill__bottom {
    font-size: 10px;
  }
}
      `}</style>
    </>
  );
}

