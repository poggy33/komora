// import { notFound } from "next/navigation";
// import { properties } from "@/data/properties";
// import PropertyGallery from "@/components/PropertyGallery";

// type PageProps = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export default async function PropertyPage({ params }: PageProps) {
//   const { id } = await params;

//   const property = properties.find((p) => String(p.id) === id);

//   if (!property) {
//     notFound();
//   }

//   return (
//     <main
//       style={{
//         maxWidth: "1200px",
//         margin: "0 auto",
//         padding: "24px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "12px" }}>
//         {property.title}
//       </h1>

//       <div style={{ fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>
//         ${property.price.toLocaleString()}
//         {property.dealType === "rent" ? " / міс." : ""}
//       </div>

//       <div style={{ color: "#555", marginBottom: "24px" }}>
//         {property.propertyType === "land" ? (
//           <>{property.area} сот.</>
//         ) : (
//           <>
//             {property.rooms ?? "—"} кімн. • {property.area} м²
//             {property.propertyType === "house" && property.floors
//               ? ` • ${property.floors} пов.`
//               : ""}
//           </>
//         )}
//       </div>

//       <PropertyGallery images={property.images} title={property.title} />

//       <div style={{ fontSize: "16px", lineHeight: 1.6, color: "#333" }}>
//         Просторий об’єкт у хорошій локації. Тут буде детальний опис оголошення,
//         характеристики, умови продажу або оренди, переваги району та інші деталі.
//       </div>
//     </main>
//   );
// }

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

          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              Основні характеристики
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <div style={infoCardStyle}>
                <div style={labelStyle}>Тип</div>
                <div style={valueStyle}>
                  {property.propertyType === "apartment"
                    ? "Квартира"
                    : property.propertyType === "house"
                      ? "Будинок"
                      : "Земля"}
                </div>
              </div>

              <div style={infoCardStyle}>
                <div style={labelStyle}>Операція</div>
                <div style={valueStyle}>
                  {property.dealType === "sale" ? "Продаж" : "Оренда"}
                </div>
              </div>

              <div style={infoCardStyle}>
                <div style={labelStyle}>Площа</div>
                <div style={valueStyle}>
                  {property.propertyType === "land"
                    ? `${property.area} сот.`
                    : `${property.area} м²`}
                </div>
              </div>

              {property.propertyType !== "land" && (
                <div style={infoCardStyle}>
                  <div style={labelStyle}>Кімнати</div>
                  <div style={valueStyle}>{property.rooms}</div>
                </div>
              )}

              {property.propertyType === "house" && (
                <div style={infoCardStyle}>
                  <div style={labelStyle}>Поверхів</div>
                  <div style={valueStyle}>{property.floors}</div>
                </div>
              )}
            </div>
          </div>

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

  {property.propertyType !== "land" && (
    <div
      style={{
        fontSize: "15px",
        color: "#666",
        marginBottom: "10px",
      }}
    >
      ${Math.round(property.price / property.area).toLocaleString()} / м²
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
    вул. Височана, 18 к7
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
        marginBottom: "14px",
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
        }}
      >
        РІ
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
          Ротерман Іван
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#666",
          }}
        >
          Майдан
        </div>
      </div>
    </div>

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

    <button
      type="button"
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
      +38 097 ... Показати
    </button>

    <button
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
    </button>

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

    <div
      style={{
        marginTop: "14px",
        paddingTop: "14px",
        borderTop: "1px solid #f0f0f0",
        fontSize: "12px",
        color: "#888",
        lineHeight: 1.5,
      }}
    >
      Розміщено через партнерський кабінет
    </div>
  </div>
</aside>
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