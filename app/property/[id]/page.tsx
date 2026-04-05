import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PageProps) {
  const { id } = await params;

  const property = properties.find((p) => String(p.id) === id);

  if (!property) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "12px" }}>
        {property.title}
      </h1>

      <div style={{ fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>
        ${property.price.toLocaleString()}
        {property.dealType === "rent" ? " / міс." : ""}
      </div>

      <div style={{ color: "#555", marginBottom: "24px" }}>
        {property.propertyType === "land" ? (
          <>{property.area} сот.</>
        ) : (
          <>
            {property.rooms ?? "—"} кімн. • {property.area} м²
            {property.propertyType === "house" && property.floors
              ? ` • ${property.floors} пов.`
              : ""}
          </>
        )}
      </div>

      <PropertyGallery images={property.images} title={property.title} />

      <div style={{ fontSize: "16px", lineHeight: 1.6, color: "#333" }}>
        Просторий об’єкт у хорошій локації. Тут буде детальний опис оголошення,
        характеристики, умови продажу або оренди, переваги району та інші деталі.
      </div>
    </main>
  );
}