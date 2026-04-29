"use client";

import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertySpecsCard({ property }: Props) {
  const items = buildSpecs(property);

  return (
  <section style={{ marginBottom: "14px" }}>
    <h2
      style={{
        fontSize: "20px",
        fontWeight: 700,
        marginBottom: "10px",
        color: "#111",
        lineHeight: 1.1,
      }}
    >
      Основна інформація
    </h2>

    <div
      style={{
        border: "1px solid #e7e7e7",
        borderRadius: "14px",
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
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;
          const isLastRow =
            index >= items.length - (items.length % 2 === 0 ? 2 : 1);

          return (
            <div
              key={`${item.label}-${index}`}
              style={{
                padding: "10px 12px",
                borderRight: isLeft ? "1px solid #f1f1f1" : "none",
                borderBottom: isLastRow ? "none" : "1px solid #f1f1f1",
                minHeight: "56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#7a7a7a",
                  marginBottom: "3px",
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#111",
                  lineHeight: 1.15,
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
}

function buildSpecs(property: Property) {
  const propertyTypeLabel = getPropertyTypeLabel(property.propertyType);
  const dealTypeLabel = property.dealType === "sale" ? "Продаж" : "Оренда";

  const items: Array<{ label: string; value: string }> = [
    {
      label: "Тип",
      value: propertyTypeLabel,
    },
    {
      label: "Операція",
      value: dealTypeLabel,
    },
  ];

  if (property.propertyType === "land") {
    items.push({
      label: "Площа",
      value: `${property.area} сот.`,
    });
  } else {
    items.push({
      label: "Площа",
      value:
        property.livingArea !== undefined && property.kitchenArea !== undefined
          ? `${property.area} / ${property.livingArea} / ${property.kitchenArea} м²`
          : `${property.area} м²`,
    });
  }

  if (property.rooms !== undefined) {
    items.push({
      label: "Кімнати",
      value: `${property.rooms} ${getRoomWord(property.rooms)}`,
    });
  }

  if (
    property.propertyType === "apartment" &&
    property.floor !== undefined &&
    property.totalFloors !== undefined
  ) {
    items.push({
      label: "Поверх",
      value: `${property.floor} з ${property.totalFloors}`,
    });
  }

  if (property.propertyType === "house" && property.floors !== undefined) {
    items.push({
      label: "Поверховість",
      value: `${property.floors} ${getFloorWord(property.floors)}`,
    });
  }

  if (property.renovation) {
    items.push({
      label: "Стан",
      value: capitalize(property.renovation),
    });
  }

  if (property.heating) {
    items.push({
      label: "Опалення",
      value: capitalize(property.heating),
    });
  }

  if (property.yearBuilt) {
    items.push({
      label: "Рік будівництва",
      value: String(property.yearBuilt),
    });
  }

  if (property.propertyType === "house" && property.houseType) {
    items.push({
      label: "Тип будинку",
      value: getHouseTypeLabel(property.houseType),
    });
  }

  return items;
}

function getPropertyTypeLabel(type: Property["propertyType"]) {
  switch (type) {
    case "apartment":
      return "Квартира";
    case "house":
      return "Будинок";
    case "land":
      return "Земельна ділянка";
    case "commercial":
      return "Комерційна нерухомість";
    default:
      return "Нерухомість";
  }
}

function getHouseTypeLabel(type: NonNullable<Property["houseType"]>) {
  switch (type) {
    case "detached":
      return "Окремий";
    case "semi-detached":
      return "Напівособняк";
    default:
      return type;
  }
}

function getRoomWord(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return "кімната";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "кімнати";
  }
  return "кімнат";
}

function getFloorWord(count: number) {
  if (count === 1) return "поверх";
  if ([2, 3, 4].includes(count)) return "поверхи";
  return "поверхів";
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
