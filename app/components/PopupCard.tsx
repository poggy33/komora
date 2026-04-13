"use client";

import { useState } from "react";
import type { DealType, PropertyType } from "@/types/property";

type Props = {
  id: string;
  price: number;
  rooms?: number;
  area: number;
  images: string[];
  dealType: DealType;
  propertyType: PropertyType;
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
    images?.length > 0 ? images : ["https://via.placeholder.com/400x260"];

  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const next = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;

    if (distance > 40) next();
    if (distance < -40) prev();
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
        width: "280px",
        textDecoration: "none",
        color: "#111",
        fontFamily: "Arial, sans-serif",
        borderRadius: "20px",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
          border: "1px solid rgba(17,17,17,0.06)",
        }}
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "relative",
            height: "176px",
            background: "#f3f3f3",
          }}
        >
          <img
            key={index}
            src={safeImages[index]}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition:
                "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "rgba(17,17,17,0.92)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {dealLabel}
          </div>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Попереднє фото"
                style={{
                  ...navButtonStyle,
                  left: "10px",
                }}
              >
                &#8249;
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
                aria-label="Наступне фото"
                style={{
                  ...navButtonStyle,
                  right: "10px",
                }}
              >
                &#8250;
              </button>

              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  background: "rgba(17,17,17,0.7)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "5px 9px",
                  fontSize: "11px",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {index + 1} / {safeImages.length}
              </div>
            </>
          )}
        </div>

        <div
          style={{
            padding: "14px 14px 16px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: "4px",
              color: "#111",
            }}
          >
            ${price.toLocaleString()}
            {dealType === "rent" ? " / міс." : ""}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#666",
              marginBottom: "4px",
              lineHeight: 1.35,
            }}
          >
            {typeLabel}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#444",
              lineHeight: 1.4,
            }}
          >
            {rooms ? `${rooms} кімн. • ` : ""}
            {area} м²
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#888",
              marginTop: "7px",
              lineHeight: 1.4,
            }}
          >
            Натисніть, щоб відкрити оголошення
          </div>
        </div>
      </div>
    </a>
  );
}

const navButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "32px",
  height: "32px",
  borderRadius: "999px",
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.94)",
  color: "#111",
  cursor: "pointer",
  fontSize: "22px",
  lineHeight: 1,
  display: "grid",
  placeItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  appearance: "none",
  WebkitAppearance: "none",
};
