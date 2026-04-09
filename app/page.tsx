"use client";

import { useState } from "react";
import MainTopBar from "./components/MainTopBar";
import MapWrapper from "./components/MapWrapper";
import FiltersDrawer, { type FiltersState } from "./components/FiltersDrawer";
import ActiveFiltersBar from "./components/ActiveFiltersBar";

export default function HomePage() {
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState<
    "apartment" | "house" | "land"
  >("apartment");

  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null,
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: "",
    priceMax: "",
    rooms: "",
    areaMin: "",
  });

  const hasActiveFilters =
    !!filters.priceMin ||
    !!filters.priceMax ||
    !!filters.rooms ||
    !!filters.areaMin;

  const activeFiltersCount = [
    filters.priceMin,
    filters.priceMax,
    filters.rooms,
    filters.areaMin,
  ].filter(Boolean).length;

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
          onOpenFilters={() => setIsFiltersOpen(true)}
          onOpenUserMenu={() => {
            console.log("open user menu");
          }}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
        />

        <ActiveFiltersBar
          filters={filters}
          onChange={(next) => setFilters(next)}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
          }}
        >
          <MapWrapper
            dealType={dealType}
            propertyType={propertyType}
            hoveredPropertyId={hoveredPropertyId}
            setHoveredPropertyId={setHoveredPropertyId}
            selectedPropertyId={selectedPropertyId}
            setSelectedPropertyId={setSelectedPropertyId}
            filters={filters}
          />
        </div>
      </main>

      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        value={filters}
        onApply={(next) => setFilters(next)}
        onReset={() =>
          setFilters({
            priceMin: "",
            priceMax: "",
            rooms: "",
            areaMin: "",
          })
        }
      />
      <style jsx global>{`
        @media (max-width: 900px) {
          .main-search-layout {
            grid-template-columns: 1fr !important;
            grid-template-rows: 40dvh minmax(0, 1fr) !important;
          }

          .main-search-sidebar {
            order: 2;
            border-right: none !important;
            border-top: 1px solid #eee;
            min-height: 0;
          }

          .main-search-map {
            order: 1;
            min-height: 0;
          }

          .main-topbar-inner {
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 10px !important;
          }

          .main-topbar-logo {
            width: 100%;
            font-size: 18px !important;
            padding-right: 56px;
          }

          .main-topbar-controls {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start !important;
            align-items: center;
            gap: 8px !important;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .main-topbar-controls > * {
            flex-shrink: 0;
          }

          .main-topbar-user {
            position: absolute;
            top: 12px;
            right: 16px;
          }

          /* 640–900 px: один рядок */
          .main-topbar-select {
            order: 1;
            flex: 0 1 auto;
            min-width: 140px !important;
            max-width: 200px;
          }

          .main-topbar-toggle {
            order: 2;
            width: auto;
            display: inline-flex !important;
            align-items: center;
            justify-content: flex-start;
            flex: 0 0 auto !important;
            max-width: 100%;
          }

          .main-topbar-toggle button {
            flex: 0 0 auto !important;
            width: auto !important;
            min-width: 0 !important;
            white-space: nowrap;
          }

          .main-topbar-filters {
            order: 3;
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
          }

          .sidebar-scroll {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            padding-bottom: 20px;
          }

          .filters-drawer {
            max-width: 100% !important;
            width: 100% !important;
            margin-top: auto;
            height: auto !important;
            max-height: 78dvh;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
          }
        }

        @media (max-width: 640px) {
          .main-search-layout {
            grid-template-rows: 36dvh minmax(0, 1fr) !important;
          }

          /* <640 px: компактно, без розтягування */
          .main-topbar-controls {
            display: grid !important;
            grid-template-columns: auto auto;
            grid-template-areas:
              "select filters"
              "toggle toggle";
            justify-content: flex-start !important;
            align-items: center;
            gap: 8px !important;
            overflow: visible;
            width: 100%;
          }

          .main-topbar-select {
            grid-area: select;
            width: auto !important;
            min-width: 136px !important;
            max-width: 180px;
            flex: unset !important;
          }

          .main-topbar-filters {
            grid-area: filters;
            width: auto !important;
            flex: unset !important;
            justify-self: start;
            align-self: center;
          }

          .main-topbar-toggle {
            grid-area: toggle;
            display: inline-flex !important;
            width: auto !important;
            justify-content: flex-start;
            align-items: center;
            flex: unset !important;
            justify-self: start;
          }

          .main-topbar-toggle button {
            flex: 0 0 auto !important;
            width: auto !important;
            min-width: 0 !important;
            white-space: nowrap;
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
            border-color 0.15s ease,
            background 0.15s ease,
            color 0.15s ease;
          font-family: Arial, sans-serif;
        }

        .marker-pill:hover,
        .marker-pill.is-hovered {
          transform: scale(1.04);
          border-color: #111111;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
        }

        .marker-pill.is-selected {
          transform: scale(1.08);
          border-color: #111111;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          background: #111111;
          color: #ffffff;
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

        .marker-pill.is-selected .marker-pill__bottom {
          color: rgba(255, 255, 255, 0.8);
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
