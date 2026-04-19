"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "app/hooks/useFavorites";
import HeartIcon from "./ui/HeartIcon";

type Props = {
  propertyId: string;
};

export default function PropertyPageActions({ propertyId }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    check();
    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  const favorite = isFavorite(propertyId);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Оголошення",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      alert("Посилання скопійовано");
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  if (!isMobile) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        margin: "10px 0 14px",
      }}
    >
      <button type="button" onClick={handleShare} style={secondaryButtonStyle}>
        Поділитися
      </button>

      {/* <button
        type="button"
        onClick={() => toggleFavorite(propertyId)}
        aria-label={favorite ? "Прибрати з обраного" : "Додати в обране"}
        style={{
          ...iconButtonStyle,
          color: favorite ? "#e11d48" : "#111",
        }}
      >
        {favorite ? "♥" : "♡"}
      </button> */}
      <button
        type="button"
        aria-label={favorite ? "Прибрати з обраного" : "Додати в обране"}
        style={{
          ...iconButtonStyle,
          // color: favorite ? "#e11d48" : "#111",
        }}
        onClick={() => toggleFavorite(propertyId)}
      >
        <HeartIcon isActive={favorite} />
      </button>
    </div>
  );
}

const secondaryButtonStyle: React.CSSProperties = {
  height: "42px",
  padding: "0 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const iconButtonStyle: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  border: "1px solid #ddd",
  background: "#fff",
  fontSize: "20px",
  lineHeight: 1,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
