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
          padding: compactHeaderOnly ? "10px 16px 12px" : "14px 16px",
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
          minHeight: compactHeaderOnly ? "72px" : "auto",
          boxSizing: "border-box",
          cursor: compactHeaderOnly ? "pointer" : "default",
        }}
        onClick={() => {
          if (compactHeaderOnly) onHeaderClick?.();
        }}
      >
        <div
          style={{
            fontSize: compactHeaderOnly ? "13px" : "14px",
            fontWeight: 700,
            color: "#111",
            marginBottom: "2px",
            lineHeight: 1.25,
          }}
        >
          {count} {title}
        </div>

        <div
          style={{
            fontSize: compactHeaderOnly ? "11px" : "12px",
            color: "#666",
            lineHeight: 1.25,
          }}
        >
          {subtitle}
        </div>
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