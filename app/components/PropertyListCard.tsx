"use client";

import { useState, useEffect } from "react";
import type { Property } from "../types/property";
import HeartIcon from "./ui/HeartIcon";
import { preloadNeighborImages } from "../../lib/preloadImage";

type Props = {
  property: Property;
  isHovered: boolean;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onHover: (id: string | null) => void;
  onSelect: (property: Property) => void;
};

export default function PropertyListCard({
  property,
  isHovered,
  isSelected,
  isFavorite,
  onToggleFavorite,
  onHover,
  onSelect,
}: Props) {
  const safeImages =
    property.images?.length > 0
      ? property.images
      : ["https://via.placeholder.com/600x400?text=No+image"];

  // const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isTransitioningImage, setIsTransitioningImage] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const [didSwipe, setDidSwipe] = useState(false);

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
    setDidSwipe(false);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) < 40) {
      setTouchStartX(null);
      setTouchEndX(null);
      return;
    }

    setDidSwipe(true);

    if (distance > 0) next();
    if (distance < -40) prev();

    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    preloadNeighborImages(safeImages, currentImageIndex);
  }, [safeImages, currentImageIndex]);

  const typeLabel =
    property.propertyType === "apartment"
      ? "Квартира"
      : property.propertyType === "house"
        ? "Будинок"
        : property.propertyType === "land"
          ? "Земля"
          : "Комерція";

  const dealLabel = property.dealType === "sale" ? "Продаж" : "Оренда";

  const subtitle =
    property.propertyType === "land"
      ? `${property.area} сот.`
      : property.propertyType === "house"
        ? `${property.rooms ?? "—"} кімн. • ${property.area} м² • ${
            property.floors ?? "—"
          } пов.`
        : `${property.rooms ?? "—"} кімн. • ${property.area} м²`;

  const description =
    property.description?.trim() ||
    "Зручна локація, хороше планування та приваблива ціна.";

  // useEffect(() => {
  //   setIsImageLoading(true);
  // }, [currentImageIndex]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id]);

  return (
    <a
      href={`/property/${property.id}`}
      onMouseEnter={() => onHover(String(property.id))}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        if (didSwipe) {
          e.preventDefault();
          e.stopPropagation();
          setDidSwipe(false);
          return;
        }

        onSelect(property);
      }}
      className="property-list-card"
      style={{
        display: "block",
        textDecoration: "none",
        color: "#111",
        background: "#fff",
        borderRadius: "18px",
        overflow: "hidden",
        border: isSelected
          ? "2px solid #111"
          : isHovered
            ? "1px solid #999"
            : "1px solid #ececec",
        boxShadow: isSelected
          ? "0 10px 26px rgba(0,0,0,0.12)"
          : isHovered
            ? "0 8px 20px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.04)",
        transition:
          "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
      }}
    >
      <div
        className="property-list-card__image-wrap"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          height: "220px",
          background: "#f3f3f3",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            background: "#f3f3f3",
          }}
        >
          {isTransitioningImage && (
            <img
              src={safeImages[previousImageIndex]}
              alt={property.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform:
                  slideDirection === "next"
                    ? "translateX(-18%)"
                    : "translateX(18%)",
                opacity: 0,
                transition:
                  "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
              }}
            />
          )}

          <img
            src={safeImages[currentImageIndex]}
            alt={property.title}
            // onLoad={() => setIsImageLoading(false)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isTransitioningImage
                ? "translateX(0)"
                : "translateX(0)",
              opacity: 1,
              animation: isTransitioningImage
                ? slideDirection === "next"
                  ? "photoSlideInFromRight 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "photoSlideInFromLeft 420ms cubic-bezier(0.22, 1, 0.36, 1)"
                : undefined,
              transition: "opacity 260ms ease",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(17,17,17,0.92)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            borderRadius: "999px",
            padding: "6px 10px",
            lineHeight: 1,
          }}
        >
          {dealLabel}
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
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "34px",
            height: "34px",
            borderRadius: "999px",
            border: "none",
            background: "rgba(255,255,255,0.94)",
            color: isFavorite ? "#e11d48" : "#111",
            fontSize: "18px",
            lineHeight: 1,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          }}
        >
          <HeartIcon isActive={isFavorite} size={18} />
        </button>

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
              className="property-list-card__nav property-list-card__nav--left"
              style={{
                ...cardNavButtonStyle,
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
              className="property-list-card__nav property-list-card__nav--right"
              style={{
                ...cardNavButtonStyle,
                right: "10px",
              }}
            >
              &#8250;
            </button>

            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
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
        className="property-list-card__content"
        style={{
          padding: "14px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#777",
            marginBottom: "6px",
            lineHeight: 1.3,
          }}
        >
          {typeLabel}
        </div>

        <div
          className="property-list-card__title"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.35,
            marginBottom: "6px",
          }}
        >
          {property.title}
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#555",
            lineHeight: 1.4,
            marginBottom: "8px",
          }}
        >
          {subtitle}
        </div>

        <div
          className="property-list-card__description"
          style={{
            fontSize: "12px",
            color: "#777",
            lineHeight: 1.45,
            marginBottom: "10px",
          }}
        >
          {description}
        </div>

        <div
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
          }}
        >
          ${property.price.toLocaleString()}
          {property.dealType === "rent" ? " / міс." : ""}
        </div>
      </div>
      <style jsx>{`
        @keyframes photoSlideInFromRight {
          from {
            transform: translateX(18%);
            opacity: 0.92;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes photoSlideInFromLeft {
          from {
            transform: translateX(-18%);
            opacity: 0.92;
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

const cardNavButtonStyle: React.CSSProperties = {
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
