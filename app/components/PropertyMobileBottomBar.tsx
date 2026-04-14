"use client";

import { useEffect, useState } from "react";

type Props = {
  price: number;
  dealType: "sale" | "rent";
  phone?: string;
};

export default function PropertyMobileBottomBar({
  price,
  dealType,
  phone,
}: Props) {
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

  if (!isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "12px",
        right: "12px",
        bottom: "12px",
        zIndex: 60,
        borderRadius: "18px",
        background: "rgba(255,255,255,0.3)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(17,17,17,0.06)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
        padding: "10px 10px 10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#111",
            lineHeight: 1.15,
            whiteSpace: "nowrap",
          }}
        >
          ${price.toLocaleString()}
          {dealType === "rent" ? " / міс." : ""}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginTop: "3px",
            lineHeight: 1.2,
          }}
        >
          Швидкий зв’язок із продавцем
        </div>
      </div>

      <a
        href={phone ? `tel:${phone}` : "#"}
        onClick={(e) => {
          if (!phone) {
            e.preventDefault();
            alert("Номер телефону недоступний");
          }
        }}
        style={{
          height: "46px",
          padding: "0 16px",
          borderRadius: "14px",
          background: "#111",
          color: "#fff",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 700,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Зателефонувати
      </a>
    </div>
  );
}