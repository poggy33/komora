"use client";

import { useEffect, useState } from "react";
import HeartIcon from "./ui/HeartIcon";
import ImageNavButton from "./ui/ImageNavButton";
import { preloadNeighborImages } from "../../lib/preloadImage";
import type { DealType, PropertyType } from "@/types/property";

type Props = {
  id: string;
  price: number;
  rooms?: number;
  area: number;
  images: string[];
  dealType: DealType;
  propertyType: PropertyType;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export default function PopupCard({
  id,
  price,
  rooms,
  area,
  images,
  dealType,
  propertyType,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const safeImages =
    images?.length > 0 ? images : ["https://via.placeholder.com/400x260"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isTransitioningImage, setIsTransitioningImage] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  useEffect(() => {
    preloadNeighborImages(safeImages, currentImageIndex);
  }, [safeImages, currentImageIndex]);

  const showPricePerSqm =
    dealType === "sale" &&
    (propertyType === "apartment" || propertyType === "commercial") &&
    area > 0;

  const pricePerSqm = showPricePerSqm ? Math.round(price / area) : null;

  const goToImage = (nextImageIndex: number, direction: "next" | "prev") => {
    if (nextImageIndex === currentImageIndex) return;

    setPreviousImageIndex(currentImageIndex);
    setSlideDirection(direction);
    setCurrentImageIndex(nextImageIndex);
    setIsTransitioningImage(true);

    preloadNeighborImages(safeImages, nextImageIndex);

    window.setTimeout(() => {
      setIsTransitioningImage(false);
    }, 420);
  };

  const next = () => {
    const nextImageIndex = (currentImageIndex + 1) % safeImages.length;
    goToImage(nextImageIndex, "next");
  };

  const prev = () => {
    const nextImageIndex =
      (currentImageIndex - 1 + safeImages.length) % safeImages.length;
    goToImage(nextImageIndex, "prev");
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
          {isTransitioningImage && (
            <img
              src={safeImages[previousImageIndex]}
              alt=""
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
            src={safeImages[currentImageIndex]}
            alt=""
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
              <ImageNavButton
                direction="prev"
                size="sm"
                ariaLabel="Попереднє фото"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prev();
                }}
              />

              <ImageNavButton
                direction="next"
                size="sm"
                ariaLabel="Наступне фото"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
              />

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
                {currentImageIndex + 1} / {safeImages.length}
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
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#111",
                  lineHeight: 1.1,
                }}
              >
                ${price.toLocaleString()}
              </div>

              {showPricePerSqm ? (
                <div
                  style={{
                    fontSize: "13px",
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
                onToggleFavorite(id);
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
    </a>
  );
}

