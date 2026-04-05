"use client";

import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function PropertyGallery({ images, title }: Props) {
  const safeImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["https://via.placeholder.com/1200x700?text=No+image"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "18px",
          overflow: "hidden",
          background: "#f5f5f5",
        }}
      >
        <img
          src={safeImages[currentIndex]}
          alt={title}
          style={{
            width: "100%",
            height: "520px",
            objectFit: "cover",
            display: "block",
          }}
        />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Попереднє фото"
              style={{
                position: "absolute",
                top: "50%",
                left: "16px",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "999px",
                border: "none",
                background: "rgba(255,255,255,0.92)",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Наступне фото"
              style={{
                position: "absolute",
                top: "50%",
                right: "16px",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "999px",
                border: "none",
                background: "rgba(255,255,255,0.92)",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              ›
            </button>

            <div
              style={{
                position: "absolute",
                left: "16px",
                bottom: "16px",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontSize: "14px",
              }}
            >
              {currentIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "12px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Фото ${index + 1}`}
              style={{
                border: index === currentIndex ? "2px solid #111" : "2px solid transparent",
                borderRadius: "12px",
                padding: 0,
                background: "transparent",
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                style={{
                  width: "110px",
                  height: "78px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}