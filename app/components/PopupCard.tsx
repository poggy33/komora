"use client";

import { useState } from "react";

type Props = {
  id: string;
  price: number;
  rooms?: number;
  area: number;
  images: string[];
  dealType: "sale" | "rent";
  propertyType: "apartment" | "house" | "land";
};

export default function PopupCard({
  id,
  price,
  rooms,
  area,
  images,
  dealType,
  propertyType,
}: Props) {
  const safeImages =
    images?.length > 0
      ? images
      : ["https://via.placeholder.com/400x260"];

  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const typeLabel =
    propertyType === "apartment"
      ? "Квартира"
      : propertyType === "house"
      ? "Будинок"
      : "Земля";

  const dealLabel = dealType === "sale" ? "Продаж" : "Оренда";

  return (
    <a
      href={`/property/${id}`}
      style={{
        display: "block",
        width: "270px",
        textDecoration: "none",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            position: "relative",
            height: "160px",
          }}
        >
          <img
            src={safeImages[index]}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* BADGE */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#111",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            {dealLabel}
          </div>

          {/* NAV */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prev();
                }}
                style={navLeft}
              >
                ‹
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
                style={navRight}
              >
                ›
              </button>

              <div style={counterStyle}>
                {index + 1} / {safeImages.length}
              </div>
            </>
          )}
        </div>

        {/* CONTENT */}
        <div style={{ padding: "12px" }}>
          {/* PRICE */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            ${price.toLocaleString()}
          </div>

          {/* TYPE */}
          <div
            style={{
              fontSize: "13px",
              color: "#666",
              marginBottom: "4px",
            }}
          >
            {typeLabel}
          </div>

          {/* DETAILS */}
          <div
            style={{
              fontSize: "13px",
              color: "#444",
            }}
          >
            {rooms ? `${rooms} кімн. • ` : ""}
            {area} м²
          </div>

          {/* ADDRESS (fake for now) */}
          <div
            style={{
              fontSize: "12px",
              color: "#888",
              marginTop: "6px",
            }}
          >
            Івано-Франківськ
          </div>
        </div>
      </div>
    </a>
  );
}

const navBase: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "32px",
  height: "32px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(255,255,255,0.9)",
  cursor: "pointer",
  fontSize: "20px",
};

const navLeft = {
  ...navBase,
  left: "8px",
};

const navRight = {
  ...navBase,
  right: "8px",
};

const counterStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "8px",
  right: "8px",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  borderRadius: "999px",
  padding: "4px 8px",
  fontSize: "11px",
};