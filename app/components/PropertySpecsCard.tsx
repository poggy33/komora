"use client";

import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertySpecsCard({ property }: Props) {
  const propertyTypeLabel = getPropertyTypeLabel(property.propertyType);
  const dealTypeLabel = property.dealType === "sale" ? "Продаж" : "Оренда";

  const roomsLabel =
    property.rooms !== undefined
      ? `${property.rooms} ${getRoomWord(property.rooms)}`
      : null;

  const areaTriple =
    property.propertyType !== "land" &&
    property.livingArea !== undefined &&
    property.kitchenArea !== undefined
      ? `${property.area} / ${property.livingArea} / ${property.kitchenArea} м²`
      : property.propertyType === "land"
        ? `${property.area} сот.`
        : `${property.area} м²`;

  const floorLabel =
    property.propertyType === "apartment" &&
    property.floor !== undefined &&
    property.totalFloors !== undefined
      ? `${property.floor} поверх з ${property.totalFloors}`
      : property.propertyType === "house" && property.floors !== undefined
        ? `${property.floors} ${property.floors === 1 ? "поверх" : "поверхи"}`
        : null;

  const facts = [
    {
      icon: "🏠",
      label: "Тип",
      value: propertyTypeLabel,
    },
    {
      icon: "💼",
      label: "Операція",
      value: dealTypeLabel,
    },
    {
      icon: "📐",
      label: "Площа",
      value: areaTriple,
    },
    ...(roomsLabel
      ? [
          {
            icon: "🛏",
            label: "Кімнати",
            value: roomsLabel,
          },
        ]
      : []),
    ...(floorLabel
      ? [
          {
            icon: "🏢",
            label: "Поверх",
            value: floorLabel,
          },
        ]
      : []),
    ...(property.renovation
      ? [
          {
            icon: "🛠",
            label: "Стан",
            value: property.renovation,
          },
        ]
      : []),
    ...(property.heating
      ? [
          {
            icon: "🔥",
            label: "Опалення",
            value: property.heating,
          },
        ]
      : []),
    ...(property.yearBuilt
      ? [
          {
            icon: "📅",
            label: "Рік будівництва",
            value: String(property.yearBuilt),
          },
        ]
      : []),
  ];

  return (
    <section style={{ marginBottom: "32px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Основна інформація
      </h2>

      <div
        style={{
          border: "1px solid #e9e9e9",
          borderRadius: "18px",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          }}
        >
          {facts.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              style={{
                padding: "18px 20px",
                borderRight: index % 2 === 0 ? "1px solid #f1f1f1" : "none",
                borderBottom:
                  index < facts.length - (facts.length % 2 === 0 ? 2 : 1)
                    ? "1px solid #f1f1f1"
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>
                  {item.icon}
                </span>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#777",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111",
                  lineHeight: 1.35,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getPropertyTypeLabel(type: Property["propertyType"]) {
  switch (type) {
    case "apartment":
      return "Квартира";
    case "house":
      return "Будинок";
    case "land":
      return "Земельна ділянка";
    default:
      return "Нерухомість";
  }
}

function getRoomWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "кімната";
  if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return "кімнати";
  }
  return "кімнат";
}