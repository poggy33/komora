"use client";

import type { Property } from "../types/property";

type Props = {
  property: Property;
};

export default function PropertyAmenities({ property }: Props) {
  const amenities = buildAmenities(property);

  if (amenities.length === 0) return null;

  return (
    <section style={{ marginBottom: "18px" }}>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "12px",
          color: "#111",
          lineHeight: 1.15,
        }}
      >
        Зручності та особливості
      </h2>

      <div
        style={{
          border: "1px solid #e7e7e7",
          borderRadius: "16px",
          padding: "12px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {amenities.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid #e3e3e3",
                background: "#fafafa",
                fontSize: "13px",
                color: "#333",
                lineHeight: 1.2,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildAmenities(property: Property) {
  const items: string[] = [];

  if (property.renovation) {
    items.push(capitalize(property.renovation));
  }

  if (property.heating) {
    items.push(`${capitalize(property.heating)} опалення`);
  }

  if (property.yearBuilt) {
    items.push(`${property.yearBuilt} рік будівництва`);
  }

  if (property.propertyType === "apartment") {
    items.push("Багатоквартирний будинок");

    if (property.floor !== undefined && property.totalFloors !== undefined) {
      items.push(`${property.floor} поверх з ${property.totalFloors}`);
    }
  }

  if (property.propertyType === "house") {
    items.push("Приватний будинок");

    if (property.houseType === "detached") {
      items.push("Окремий будинок");
    }

    if (property.houseType === "semi-detached") {
      items.push("Напівособняк");
    }

    if (property.floors !== undefined) {
      items.push(`${property.floors} ${getFloorWord(property.floors)}`);
    }
  }

  if (property.propertyType === "land") {
    items.push("Ділянка під забудову");
  }

  return items;
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
