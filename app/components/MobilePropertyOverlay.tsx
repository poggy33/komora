"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import type { Property } from "@/types/property";
import HeartIcon from "./ui/HeartIcon";
import ImageNavButton from "./ui/ImageNavButton";
import { preloadNeighborImages } from "../../lib/preloadImage";

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
  const [previousIndex, setPreviousIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isTransitioningImage, setIsTransitioningImage] = useState(false);
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

  useEffect(() => {
    if (!property?.images?.length) return;
    preloadNeighborImages(property.images, currentIndex);
  }, [property?.images, currentIndex]);

  if (!property) return null;

  const images = property.images?.length ? property.images : [];
  const hasImages = images.length > 0;

  const goToImage = (nextIndex: number, direction: "next" | "prev") => {
    if (!hasImages || nextIndex === currentIndex) return;

    setPreviousIndex(currentIndex);
    setSlideDirection(direction);
    setCurrentIndex(nextIndex);
    setIsTransitioningImage(true);

    preloadNeighborImages(images, nextIndex);

    window.setTimeout(() => {
      setIsTransitioningImage(false);
    }, 420);
  };

  const goPrev = () => {
    if (!hasImages) return;

    const nextIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToImage(nextIndex, "prev");
  };

  const goNext = () => {
    if (!hasImages) return;

    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToImage(nextIndex, "next");
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
            {images.length > 1 && (
              <>
                <ImageNavButton
                  direction="prev"
                  size="sm"
                  ariaLabel="Попереднє фото"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goPrev();
                  }}
                />

                <ImageNavButton
                  direction="next"
                  size="sm"
                  ariaLabel="Наступне фото"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goNext();
                  }}
                />
              </>
            )}

            {isTransitioningImage && (
              <img
                src={images[previousIndex]}
                alt={`${property.title} ${previousIndex + 1}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform:
                    slideDirection === "next"
                      ? "translateX(-12%)"
                      : "translateX(12%)",
                  opacity: 0,
                  transition:
                    "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
                }}
              />
            )}

            <img
              src={images[currentIndex]}
              alt={`${property.title} ${currentIndex + 1}`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 1,
                animation: isTransitioningImage
                  ? slideDirection === "next"
                    ? "photoSlideInFromRight 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "photoSlideInFromLeft 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : undefined,
              }}
            />

            {images.length > 1 && (
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
      <style jsx>{`
        @keyframes photoSlideInFromRight {
          from {
            transform: translateX(12%);
            opacity: 0.96;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes photoSlideInFromLeft {
          from {
            transform: translateX(-12%);
            opacity: 0.96;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
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


