"use client";

import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertyHeader({ property }: Props) {
  const address = property.location?.fullAddress ?? "Адресу не вказано";

  const meta = buildMeta(property);

  return (
    <section style={{ marginBottom: "18px" }}>
      <div
        style={{
          display: "grid",
          gap: "8px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#111",
            margin: 0,
          }}
        >
          {property.title}
        </h1>

        <div
          style={{
            fontSize: "13px",
            color: "#666",
            lineHeight: 1.35,
            opacity: 0.9,
          }}
        >
          {address}
        </div>

        {meta && (
          <div
            style={{
              fontSize: "12.5px",
              color: "#333",
              lineHeight: 1.35,
            }}
          >
            {meta}
          </div>
        )}

        <div
          style={{
            marginTop: "6px",
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            ${property.price.toLocaleString()}
            {property.dealType === "rent" ? " / міс." : ""}
          </div>

          {property.area > 0 && (
            <div
              style={{
                fontSize: "13px",
                color: "#666",
                lineHeight: 1.2,
              }}
            >
              ${Math.round(property.price / property.area).toLocaleString()}
              {property.propertyType === "land" ? " / сот." : " / м²"}
            </div>
          )}
        </div>
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

    if (
      property.livingArea !== undefined &&
      property.kitchenArea !== undefined
    ) {
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
    parts.push(capitalize(renovationLabel(property.renovation)));
  }

  if (property.heating) {
    parts.push(`${capitalize(heatingLabel(property.heating))} опалення`);
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

function renovationLabel(value: string) {
  switch (value) {
    case "no_repair":
      return "без ремонту";
    case "livable":
      return "житловий стан";
    case "good":
      return "хороший стан";
    case "euro":
      return "євроремонт";
    default:
      return value;
  }
}

function heatingLabel(value: string) {
  switch (value) {
    case "individual":
      return "індивідуальне";
    case "central":
      return "центральне";
    case "electric":
      return "електричне";
    case "solid_fuel":
      return "твердопаливне";
    default:
      return value;
  }
}
