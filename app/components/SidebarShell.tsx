"use client";

import { ReactNode } from "react";
import LoadingPill from "./ui/LoadingPill";

type Props = {
  count: number;
  title: string;
  subtitle: string;
  compactHeaderOnly?: boolean;
  isBootLoading?: boolean;
  isRefreshing?: boolean;
  onHeaderClick?: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  onTouchStart?: () => void;
  children?: ReactNode;
};

export default function SidebarShell({
  count,
  title,
  subtitle,
  compactHeaderOnly = false,
  isBootLoading = false,
  isRefreshing = false,
  onHeaderClick,
  scrollContainerRef,
  onScroll,
  onTouchStart,
  children,
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
          padding: compactHeaderOnly ? "6px 16px 8px" : "22px 16px 4px",
          minHeight: compactHeaderOnly ? "46px" : "68px",
          borderBottom: "1px solid #eee",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxSizing: "border-box",
          cursor: compactHeaderOnly ? "pointer" : "default",
        }}
        onClick={() => {
          if (compactHeaderOnly) onHeaderClick?.();
        }}
      >
        {isBootLoading || isRefreshing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: compactHeaderOnly ? "34px" : "40px",
            }}
          >
            <LoadingPill size="sm" label="" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "1px",
              justifyItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: compactHeaderOnly ? "13.5px" : "13px",
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.2,
              }}
            >
              {count} {title}
            </div>

            <div
              style={{
                fontSize: compactHeaderOnly ? "11.5px" : "11.5px",
                color: "#666",
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </div>
          </div>
        )}
      </div>

      {compactHeaderOnly ? null : (
        <>
          {isBootLoading || isRefreshing ? (
            <div
              style={{
                padding: "12px 14px 0",
                display: "flex",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LoadingPill
                size="sm"
                label={
                  isBootLoading
                    ? "Завантажуємо список..."
                    : "Список оновлюється..."
                }
              />
            </div>
          ) : null}

          <div
            className="sidebar-scroll sidebar-cards"
            ref={scrollContainerRef}
            style={{
              padding: "14px",
              overflowY: "auto",
              flex: 1,
              minHeight: 0,
            }}
            onScroll={onScroll}
            onTouchStart={onTouchStart}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
