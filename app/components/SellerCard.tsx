"use client";

import { useMemo, useState } from "react";
import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function SellerCard({ property }: Props) {
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const ownerName = property.owner?.name ?? "Ім’я не вказано";
  const ownerCompany = property.owner?.companyName;
  const ownerPhone = property.owner?.phone ?? "+38 0XX XXX XX XX";
  const isVerified = property.owner?.isVerified ?? false;
  const fullAddress = property.location?.fullAddress ?? "Адресу не вказано";

  const pricePerUnit = useMemo(() => {
    if (!property.area) return null;
    return Math.round(property.price / property.area);
  }, [property.price, property.area]);

  const pricePerUnitLabel = property.propertyType === "land" ? " / сот." : " / м²";

  const initials = ownerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const displayedPhone = isPhoneVisible ? ownerPhone : maskPhone(ownerPhone);
  const telHref = `tel:${ownerPhone.replace(/[^\d+]/g, "")}`;

  const handlePhoneClick = () => {
    if (!isPhoneVisible) {
      setIsPhoneVisible(true);
      return;
    }

    window.location.href = telHref;
  };

  return (
    <aside
      style={{
        border: "1px solid #eee",
        borderRadius: "20px",
        padding: "22px",
        position: "sticky",
        top: "24px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#111",
        }}
      >
        ${property.price.toLocaleString()}
        {property.dealType === "rent" ? " / міс." : ""}
      </div>

      {pricePerUnit !== null && (
        <div
          style={{
            fontSize: "15px",
            color: "#666",
            marginBottom: "10px",
          }}
        >
          ${pricePerUnit.toLocaleString()}
          {pricePerUnitLabel}
        </div>
      )}

      <div
        style={{
          fontSize: "15px",
          color: "#333",
          marginBottom: "20px",
          lineHeight: 1.5,
        }}
      >
        {fullAddress}
      </div>

      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: "18px",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              background: "#111",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: "18px",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {property.owner?.avatar ? (
              <img
                src={property.owner.avatar}
                alt={ownerName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              initials || "?"
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#111",
                marginBottom: "2px",
              }}
            >
              {ownerName}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              {ownerCompany ?? ownerTypeLabel(property.ownerType)}
            </div>
          </div>
        </div>

        {isVerified && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "999px",
              background: "#f6f6f6",
              color: "#222",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#16a34a",
                display: "inline-block",
              }}
            />
            Верифікована особа
          </div>
        )}

        <button
          type="button"
          onClick={handlePhoneClick}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            background: "#fff",
            color: "#111",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {displayedPhone}
        </button>

        {/* <button
          type="button"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          Написати
        </button> */}

        <button
          type="button"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "transparent",
            color: "#666",
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Поскаржитися на оголошення
        </button>

        {/* <div
          style={{
            marginTop: "14px",
            paddingTop: "14px",
            borderTop: "1px solid #f0f0f0",
            fontSize: "12px",
            color: "#888",
            lineHeight: 1.5,
          }}
        >
          Розміщено через платформу
        </div> */}
      </div>
    </aside>
  );
}

function ownerTypeLabel(type: Property["ownerType"]) {
  switch (type) {
    case "owner":
      return "Власник";
    case "realtor":
      return "Рієлтор";
    case "developer":
      return "Забудовник";
    default:
      return "Контактна особа";
  }
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length >= 12 && digits.startsWith("380")) {
    return `+38 ${digits.slice(2, 5)} ... Показати`;
  }

  if (digits.length >= 10) {
    return `${phone.slice(0, 7)} ... Показати`;
  }

  return phone;
}