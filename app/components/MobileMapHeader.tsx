"use client";

import { useState } from "react";

type Props = {
  count: number;
  title: string;
  subtitle: string;
  isLoading: boolean;
  onClick: () => void;
};

export default function MobileMapHeader({
  count,
  title,
  subtitle,
  isLoading,
  onClick,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        width: "100%",
        minHeight: "60px",
        padding: "8px 16px 10px",
        border: "none",
        borderTop: "1px solid #eee",
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        textAlign: "left",
        boxSizing: "border-box",
        appearance: "none",
        WebkitAppearance: "none",
        opacity: isPressed ? 0.72 : 1,
        transition: "opacity 0.16s ease",
      }}
      aria-label={isLoading ? "Відкрити список" : `${count} ${title}. Відкрити список`}
    >
      {isLoading ? (
        <>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111",
              marginBottom: "2px",
              lineHeight: 1.2,
            }}
          >
            Завантажуємо список...
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#666",
              lineHeight: 1.2,
            }}
          >
            Оновлюємо видимі оголошення
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#111",
              marginBottom: "2px",
              lineHeight: 1.2,
            }}
          >
            {count} {title}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#666",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </div>
        </>
      )}
    </button>
  );
}
