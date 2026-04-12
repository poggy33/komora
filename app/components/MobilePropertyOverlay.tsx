"use client";

import Link from "next/link";
import type { Property } from "@/types/property";

type Props = {
  property: Property | null;
  onClose: () => void;
};

export default function MobilePropertyOverlay({ property, onClose }: Props) {
  if (!property) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 80,
        background: "#fff",
        borderTopLeftRadius: "18px",
        borderTopRightRadius: "18px",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
        padding: "12px 12px 16px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "4px",
          borderRadius: "999px",
          background: "#d4d4d4",
          margin: "0 auto 10px",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "grid", gap: "4px" }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111",
              }}
            >
              {property.title}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              {property.location?.fullAddress || property.location?.city}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              border: "1px solid #ddd",
              background: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#111",
          }}
        >
          ${property.price.toLocaleString()}
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span style={chipStyle}>
            {property.dealType === "sale" ? "Продаж" : "Оренда"}
          </span>

          <span style={chipStyle}>
            {property.propertyType === "apartment"
              ? "Квартира"
              : property.propertyType === "house"
                ? "Будинок"
                : "Земля"}
          </span>

          {property.rooms && <span style={chipStyle}>{property.rooms} кімн.</span>}
          <span style={chipStyle}>{property.area} м²</span>
        </div>

        <Link
          href={`/property/${property.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "44px",
            borderRadius: "14px",
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Відкрити оголошення
        </Link>
      </div>
    </div>
  );
}

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "30px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fafafa",
  color: "#111",
  fontSize: "12px",
  fontWeight: 600,
};