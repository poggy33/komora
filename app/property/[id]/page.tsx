import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";
import SellerCard from "@/components/SellerCard";
import PropertySpecsCard from "@/components/PropertySpecsCard";

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
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#111",
      }}
    >
      <div style={{ marginBottom: "12px", color: "#666", fontSize: "14px" }}>
        Головна / Нерухомість / {property.title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 700,
              margin: 0,
              marginBottom: "10px",
            }}
          >
            {property.title}
          </h1>

          <div style={{ color: "#555", fontSize: "15px" }}>
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
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button style={secondaryButtonStyle}>Поділитися</button>
          <button style={secondaryButtonStyle}>Зберегти</button>
        </div>
      </div>

      <PropertyGallery images={property.images} title={property.title} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) 380px",
          gap: "40px",
          alignItems: "start",
        }}
      >
        <section>
          <div
            style={{
              paddingBottom: "24px",
              marginBottom: "24px",
              borderBottom: "1px solid #eee",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              ${property.price.toLocaleString()}
              {property.dealType === "rent" ? " / міс." : ""}
            </div>

            <div
              style={{
                color: "#555",
                fontSize: "16px",
              }}
            >
              {property.dealType === "sale" ? "Продаж" : "Оренда"} •{" "}
              {property.propertyType === "apartment"
                ? "Квартира"
                : property.propertyType === "house"
                  ? "Будинок"
                  : "Земельна ділянка"}
            </div>
          </div>

          <PropertySpecsCard property={property} />

          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Опис
            </h2>

            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "#333",
                margin: 0,
              }}
            >
              Просторий і перспективний об’єкт у хорошій локації. Тут можна
              розмістити повний опис нерухомості: стан ремонту, планування,
              інфраструктуру поблизу, транспортну доступність, особливості
              району, переваги для проживання або інвестиції, умови продажу чи
              оренди, а також інші ключові характеристики.
            </p>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Зручності
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={chipStyle}>Wi-Fi</div>
              <div style={chipStyle}>Паркування</div>
              <div style={chipStyle}>Поруч транспорт</div>
              <div style={chipStyle}>Розвинена інфраструктура</div>
              <div style={chipStyle}>Гарна локація</div>
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Локація
            </h2>

            <div
              style={{
                height: "280px",
                borderRadius: "18px",
                background: "#f3f3f3",
                border: "1px solid #eee",
                display: "grid",
                placeItems: "center",
                color: "#777",
                fontSize: "15px",
              }}
            >
              Тут буде блок карти або адреси об’єкта
            </div>
          </div>
        </section>

        <SellerCard property={property} />
      </div>
    </main>
  );
}

const infoCardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: "14px",
  padding: "16px",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#777",
  marginBottom: "6px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
};

const chipStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fafafa",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "11px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};
