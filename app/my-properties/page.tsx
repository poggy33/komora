import Link from "next/link";
import { createClient } from "lib/supabase/server";
import { getMyPropertiesFromSupabase } from "lib/properties";

export default async function MyPropertiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const properties = user
    ? await getMyPropertiesFromSupabase(user.id)
    : [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "32px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #ececec",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            display: "grid",
            gap: "18px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: 800,
              color: "#111",
            }}
          >
            Мої оголошення
          </h1>

          {!user ? (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Щоб бачити свої оголошення, увійди в акаунт.
              </div>

              <Link href="/auth" style={primaryLinkStyle}>
                Увійти
              </Link>
            </div>
          ) : properties.length === 0 ? (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                У тебе ще немає оголошень.
              </div>

              <Link href="/create" style={primaryLinkStyle}>
                Створити перше оголошення
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {properties.map((property) => (
                <div
                  key={property.id}
                  style={{
                    border: "1px solid #ececec",
                    borderRadius: "18px",
                    background: "#fff",
                    padding: "16px",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "grid", gap: "6px" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#111",
                        }}
                      >
                        {property.title}
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {property.location?.city}
                        {property.location?.district
                          ? `, ${property.location.district}`
                          : ""}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#111",
                      }}
                    >
                      ${property.price.toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={chipStyle}>
                      {property.dealType === "sale" ? "Продаж" : "Оренда"}
                    </span>

                    <span style={chipStyle}>
                      {property.propertyType === "apartment"
                        ? "Квартира"
                        : property.propertyType === "house"
                          ? "Будинок"
                          : "Земля"}
                    </span>

                    {property.rooms && (
                      <span style={chipStyle}>{property.rooms} кімн.</span>
                    )}

                    <span style={chipStyle}>{property.area} м²</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      href={`/property/${property.id}`}
                      style={primaryLinkStyle}
                    >
                      Відкрити
                    </Link>

                    <button type="button" style={secondaryButtonStyle} disabled>
                      Редагувати
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const primaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "46px",
  padding: "0 16px",
  borderRadius: "14px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 700,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: "46px",
  padding: "0 16px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#999",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "not-allowed",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "32px",
  padding: "0 12px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fafafa",
  color: "#111",
  fontSize: "13px",
  fontWeight: 600,
};