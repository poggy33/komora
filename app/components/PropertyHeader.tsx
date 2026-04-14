"use client";

import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertyHeader({ property }: Props) {
  const address = property.location?.fullAddress ?? "Адресу не вказано";

  const meta = buildMeta(property);

  return (
    <section style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#111",
              margin: 0,
              marginBottom: "10px",
            }}
          >
            {property.title}
          </h1>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "10px",
              lineHeight: 1.5,
              opacity: 0.85,
            }}
          >
            {address}
          </div>

          {meta && (
            <div
              style={{
                fontSize: "13px",
                color: "#333",
                lineHeight: 1.5,
              }}
            >
              {meta}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          alignItems: "baseline",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
          }}
        >
          ${property.price.toLocaleString()}
          {property.dealType === "rent" ? " / міс." : ""}
        </div>

        {property.area > 0 && (
          <div
            style={{
              fontSize: "15px",
              color: "#666",
            }}
          >
            $
            {Math.round(property.price / property.area).toLocaleString()}
            {property.propertyType === "land" ? " / сот." : " / м²"}
          </div>
        )}
      </div>
    </section>
  );
}

function buildMeta(property: Property) {
  const parts: string[] = [];

  if (property.propertyType === "land") {
    parts.push(`${property.area} сот.`);
  } else {
    if (property.rooms !== undefined) {
      parts.push(`${property.rooms} ${getRoomWord(property.rooms)}`);
    }

    if (property.livingArea !== undefined && property.kitchenArea !== undefined) {
      parts.push(
        `${property.area} / ${property.livingArea} / ${property.kitchenArea} м²`,
      );
    } else {
      parts.push(`${property.area} м²`);
    }

    if (
      property.propertyType === "apartment" &&
      property.floor !== undefined &&
      property.totalFloors !== undefined
    ) {
      parts.push(`${property.floor} поверх з ${property.totalFloors}`);
    }

    if (property.propertyType === "house" && property.floors !== undefined) {
      parts.push(`${property.floors} ${getFloorWord(property.floors)}`);
    }
  }

  if (property.renovation) {
    parts.push(capitalize(property.renovation));
  }

  if (property.heating) {
    parts.push(`${capitalize(property.heating)} опалення`);
  }

  if (property.yearBuilt) {
    parts.push(`${property.yearBuilt} рік будівництва`);
  }

  return parts.join(" • ");
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