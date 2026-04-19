"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import type { Property } from "@/types/property";
import HeartIcon from "./ui/HeartIcon";

type Props = {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export default function MobilePropertyOverlay({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null)
      return;

    const diff = touchStartXRef.current - touchEndXRef.current;

    if (Math.abs(diff) < 40) return;

    if (diff > 0) {
      goNext();
    } else {
      goPrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [property?.id]);

  if (!property) return null;

  const images = property.images?.length ? property.images : [];
  const hasImages = images.length > 0;

  const goPrev = () => {
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const showPricePerSqm =
    property.dealType === "sale" &&
    (property.propertyType === "apartment" ||
      property.propertyType === "commercial") &&
    property.area > 0;

  const pricePerSqm = showPricePerSqm
    ? Math.round(property.price / property.area)
    : null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
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
          <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.25,
              }}
            >
              {property.title}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
                lineHeight: 1.3,
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

        {hasImages ? (
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#f3f3f3",
            }}
          >
            <img
              key={`${property.id}-${currentIndex}`}
              src={images[currentIndex]}
              alt={`${property.title} ${currentIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition:
                  "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  style={{
                    ...navButtonStyle,
                    left: "10px",
                  }}
                  aria-label="Попереднє фото"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  style={{
                    ...navButtonStyle,
                    right: "10px",
                  }}
                  aria-label="Наступне фото"
                >
                  ›
                </button>

                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    background: "rgba(17,17,17,0.72)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "14px",
              background: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Немає фото
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              minWidth: 0,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#111",
                lineHeight: 1.1,
              }}
            >
              ${property.price.toLocaleString()}
            </div>

            {showPricePerSqm ? (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#666",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                (${pricePerSqm?.toLocaleString()}/м²)
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(String(property.id));
            }}
            aria-label="Додати в обране"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              border: "none",
              background: "rgba(255,255,255,0.94)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              flexShrink: 0,
            }}
          >
            <HeartIcon isActive={isFavorite} size={18} />
          </button>
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
                : property.propertyType === "land"
                  ? "Земля"
                  : "Комерція"}
          </span>

          {property.rooms && (
            <span style={chipStyle}>{property.rooms} кімн.</span>
          )}
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

const navButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.75)",
  background: "rgba(255,255,255,0.88)",
  color: "#111",
  fontSize: "20px",
  lineHeight: 1,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
