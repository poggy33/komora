import Link from "next/link";
import { createClient } from "lib/supabase/server";
import type { Property } from "@/types/property";
import ClosePageButton from "../components/ClosePageButton";

function buildFullAddress(row: {
  address_line: string | null;
  district: string | null;
  city: string;
  region: string | null;
}) {
  return [row.address_line, row.district, row.city, row.region]
    .filter(Boolean)
    .join(", ");
}

function mapDbPropertyToUi(row: any): Property {
  const images =
    row.property_media
      ?.slice()
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((img: any) => img.public_url)
      ?.filter(Boolean) ?? [];

  return {
    id: String(row.id),
    title: row.title,
    propertyType: row.property_type,
    dealType: row.listing_type,
    price: row.price,
    area: row.area_total_m2 ?? 0,
    rooms: row.rooms_count ?? undefined,
    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,
    floors:
      row.property_type === "house"
        ? (row.total_floors ?? row.floor ?? undefined)
        : undefined,
    ownerType: "owner",
    coordinates: [row.lng, row.lat],
    images,
    coverImage: row.cover_image_url ?? images[0] ?? null,
    location: {
      city: row.city,
      district: row.district ?? undefined,
      street: row.address_line ?? undefined,
      fullAddress: buildFullAddress(row),
    },
    description: row.description ?? undefined,
    publishedAt: row.created_at ?? undefined,
    status: row.status ?? "active",
    owner: {
      id: row.owner_id ? String(row.owner_id) : "",
      type: "owner",
      name: row.seller_name ?? "Власник",
      isVerified: false,
      phone: row.seller_phone ?? "",
    },
  };
}

export default async function SavedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let properties: Property[] = [];

  if (user) {
    const { data, error } = await supabase
      .from("saved_properties")
      .select(
        `
        property_id,
        properties (
          id,
          owner_id,
          title,
          description,
          property_type,
          listing_type,
          status,
          price,
          currency,
          area_total_m2,
          rooms_count,
          floor,
          total_floors,
          address_line,
          city,
          region,
          district,
          lat,
          lng,
          seller_name,
          seller_phone,
          cover_image_url,
          created_at,
          property_media (
            public_url,
            position
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load saved properties: ${error.message}`);
    }

    properties = (data ?? [])
      .map((row: any) => row.properties)
      .filter(Boolean)
      .map(mapDbPropertyToUi);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f7",
        padding: "32px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <ClosePageButton />
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
              fontSize: "26px",
              fontWeight: 800,
              color: "#111",
            }}
          >
            Збережені
          </h1>

          {!user ? (
            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  fontSize: "15px",
                  color: "#666",
                  lineHeight: 1.6,
                }}
              >
                Щоб бачити збережені оголошення, увійди в акаунт.
              </div>

              <Link href="/auth" style={primaryLinkStyle}>
                Увійти
              </Link>
            </div>
          ) : properties.length === 0 ? (
            <div
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              У тебе ще немає збережених оголошень.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {properties.map((property) => {
                const showPricePerSqm =
                  property.dealType === "sale" &&
                  (property.propertyType === "apartment" ||
                    property.propertyType === "commercial") &&
                  property.area > 0;

                const pricePerSqm = showPricePerSqm
                  ? Math.round(property.price / property.area)
                  : null;

                return (
                  <div
                    key={property.id}
                    style={{
                      border: "1px solid #ececec",
                      borderRadius: "18px",
                      background: "#fff",
                      padding: "12px",
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          borderRadius: "16px",
                          overflow: "hidden",
                          background: "#f1f1f1",
                          border: "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        {property.coverImage ? (
                          <img
                            src={property.coverImage}
                            alt={property.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "grid",
                              placeItems: "center",
                              color: "#999",
                              fontSize: "11px",
                              fontWeight: 700,
                              textAlign: "center",
                              padding: "6px",
                              boxSizing: "border-box",
                            }}
                          >
                            Немає фото
                          </div>
                        )}
                      </div>

                      <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "8px",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "#111",
                              lineHeight: 1.15,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {property.title}
                          </div>

                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "#111",
                              whiteSpace: "nowrap",
                              lineHeight: 1.15,
                            }}
                          >
                            ${property.price.toLocaleString()}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            lineHeight: 1.25,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {property.location?.city}
                          {property.location?.district
                            ? `, ${property.location.district}`
                            : ""}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span style={compactChipStyle}>
                            {property.dealType === "sale" ? "Продаж" : "Оренда"}
                          </span>

                          <span style={compactChipStyle}>
                            {property.propertyType === "apartment"
                              ? "Квартира"
                              : property.propertyType === "house"
                                ? "Будинок"
                                : property.propertyType === "land"
                                  ? "Земля"
                                  : "Комерція"}
                          </span>

                          {property.rooms ? (
                            <span style={compactChipStyle}>
                              {property.rooms} кімн.
                            </span>
                          ) : null}

                          <span style={compactChipStyle}>
                            {property.area} м²
                          </span>
                          {pricePerSqm !== null ? (
                            <span style={compactChipStyle}>
                              ${pricePerSqm.toLocaleString()}/м²
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/property/${property.id}`}
                      style={compactPrimaryLinkStyle}
                    >
                      Відкрити
                    </Link>
                  </div>
                );
              })}
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

// const chipStyle: React.CSSProperties = {
//   display: "inline-flex",
//   alignItems: "center",
//   height: "32px",
//   padding: "0 12px",
//   borderRadius: "999px",
//   border: "1px solid #e5e5e5",
//   background: "#fafafa",
//   color: "#111",
//   fontSize: "13px",
//   fontWeight: 600,
// };

const compactChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "26px",
  padding: "0 6px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  color: "#111",
  fontSize: "10px",
  fontWeight: 600,
};

const compactPrimaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "38px",
  padding: "0 12px",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: 800,
};
