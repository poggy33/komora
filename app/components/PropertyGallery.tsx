"use client";

import { useEffect, useState, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = (index?: number) => {
    if (typeof index === "number") {
      setCurrentIndex(index);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
  }, [images]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }

      if (e.key === "ArrowRight") {
        goNext();
      }

      if (e.key === "ArrowLeft") {
        goPrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, safeImages.length]);

  return (
    <div style={{ marginBottom: "32px" }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#f5f5f5",
          cursor: "pointer",
        }}
        onClick={() => openModal(currentIndex)}
      >
        <img
          key={currentIndex}
          src={safeImages[currentIndex]}
          alt={title}
          style={{
            width: "100%",
            height: "520px",
            objectFit: "cover",
            display: "block",
            transition:
              "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Попереднє фото"
              style={navButtonLeftStyle}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Наступне фото"
              style={navButtonRightStyle}
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

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openModal(currentIndex);
          }}
          style={{
            position: "absolute",
            right: "16px",
            bottom: "16px",
            border: "none",
            borderRadius: "12px",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.95)",
            color: "#111",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Показати всі фото
        </button>
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
                border:
                  index === currentIndex
                    ? "2px solid #111"
                    : "2px solid transparent",
                borderRadius: "12px",
                padding: 0,
                background: "transparent",
                cursor: "pointer",
                flex: "0 0 auto",
                opacity: index === currentIndex ? 1 : 0.8,
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

      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: "100%",
              maxWidth: "1200px",
              maxHeight: "100%",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Закрити галерею"
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "44px",
                height: "44px",
                borderRadius: "999px",
                border: "none",
                background: "#fff",
                color: "#111",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 3,
              }}
            >
              ✕
            </button>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Попереднє фото"
                  style={{
                    ...modalNavButtonStyle,
                    left: "16px",
                  }}
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Наступне фото"
                  style={{
                    ...modalNavButtonStyle,
                    right: "16px",
                  }}
                >
                  ›
                </button>
              </>
            )}

            <img
              key={`modal-${currentIndex}`}
              src={safeImages[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              style={{
                width: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "18px",
                display: "block",
                background: "#111",
                transition:
                  "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "14px",
                color: "#fff",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                }}
              >
                {currentIndex + 1} / {safeImages.length}
              </div>
            </div>

            {safeImages.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "16px",
                  overflowX: "auto",
                  paddingBottom: "6px",
                }}
              >
                {safeImages.map((image, index) => (
                  <button
                    key={`modal-${image}-${index}`}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Фото ${index + 1}`}
                    style={{
                      border:
                        index === currentIndex
                          ? "2px solid #fff"
                          : "2px solid transparent",
                      borderRadius: "12px",
                      padding: 0,
                      background: "transparent",
                      cursor: "pointer",
                      flex: "0 0 auto",
                      opacity: index === currentIndex ? 1 : 0.75,
                    }}
                  >
                    <img
                      src={image}
                      alt={`${title} thumb ${index + 1}`}
                      style={{
                        width: "96px",
                        height: "68px",
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
        </div>
      )}
    </div>
  );
}

const navButtonBase: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(255,255,255,0.92)",
  cursor: "pointer",
  fontSize: "24px",
  lineHeight: 1,
  fontWeight: 700,
};

const navButtonLeftStyle: React.CSSProperties = {
  ...navButtonBase,
  left: "16px",
};

const navButtonRightStyle: React.CSSProperties = {
  ...navButtonBase,
  right: "16px",
};

const modalNavButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "48px",
  height: "48px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(255,255,255,0.95)",
  cursor: "pointer",
  fontSize: "28px",
  lineHeight: 1,
  fontWeight: 700,
  zIndex: 2,
};
