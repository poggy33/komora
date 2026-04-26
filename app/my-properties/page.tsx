import Link from "next/link";
import { createClient } from "lib/supabase/server";
import ArchivePropertyButton from "./ArchivePropertyButton";
import RestorePropertyButton from "./RestorePropertyButton";
import DeletePropertyButton from "./DeletePropertyButton";
import type { Property } from "@/types/property";
import PublishPropertyButton from "./PublishPropertyButton";
import MoveToDraftButton from "./MoveToDraftButton";

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

export default async function MyPropertiesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let properties: Property[] = [];

  if (user) {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
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
      `,
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load my properties: ${error.message}`);
    }

    properties = (data ?? []).map(mapDbPropertyToUi);
  }

  const activeProperties = properties.filter(
    (property) => property.status === "active",
  );

  const reviewProperties = properties.filter(
    (property) => property.status === "pending_review",
  );

  const draftProperties = properties.filter(
    (property) => property.status === "draft",
  );

  const archivedProperties = properties.filter(
    (property) => property.status === "archived",
  );

  const renderSection = (title: string, items: Property[]) => {
    if (items.length === 0) return null;

    return (
      <section
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#111",
            }}
          >
            {title}
          </h2>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "32px",
              height: "32px",
              padding: "0 10px",
              borderRadius: "999px",
              background: "#f3f4f6",
              color: "#111",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {items.length}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {items.map((property) => (
            <div
              key={property.id}
              style={{
                border: "1px solid #ececec",
                borderRadius: "18px",
                background: getCardBackground(property.status),
                padding: "12px",
                display: "grid",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "76px minmax(0, 1fr)",
                  gap: "12px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "76px",
                    height: "76px",
                    borderRadius: "14px",
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
                    <span style={statusChipStyle(property.status)}>
                      {getStatusLabel(property.status)}
                    </span>

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

                    {property.rooms && (
                      <span style={compactChipStyle}>
                        {property.rooms} кімн.
                      </span>
                    )}

                    <span style={compactChipStyle}>{property.area} м²</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {property.status === "active" ? (
                  <Link
                    href={`/property/${property.id}`}
                    style={compactPrimaryLinkStyle}
                  >
                    Відкрити
                  </Link>
                ) : (
                  <span
                    style={{
                      ...compactPrimaryLinkStyle,
                      opacity: 0.55,
                      pointerEvents: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    {property.status === "pending_review"
                      ? "На перевірці"
                      : property.status === "draft"
                        ? "Чернетка"
                        : "Неактивне"}
                  </span>
                )}

                <Link
                  href={`/property/${property.id}/edit`}
                  style={{
                    ...compactSecondaryLinkStyle,
                    pointerEvents:
                      property.status === "archived" ? "none" : "auto",
                    opacity: property.status === "archived" ? 0.55 : 1,
                  }}
                >
                  Редагувати
                </Link>

{property.status === "archived" && (
  <DeletePropertyButton propertyId={property.id} />
)}

                {property.status === "draft" ? (
                  <PublishPropertyButton propertyId={property.id} />
                ) : property.status === "archived" ? (
                  <RestorePropertyButton propertyId={property.id} />
                ) : (
                  <>
                    <MoveToDraftButton propertyId={property.id} />
                    <ArchivePropertyButton propertyId={property.id} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

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
                gap: "28px",
              }}
            >
              {renderSection("Активні", activeProperties)}
              {renderSection("На перевірці", reviewProperties)}
              {renderSection("Чернетки", draftProperties)}
              {renderSection("Архів", archivedProperties)}
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

function getStatusLabel(status?: string) {
  if (status === "archived") return "Архів";
  if (status === "draft") return "Чернетка";
  return "Активне";
}

function getCardBackground(status?: string) {
  if (status === "archived") return "#fafafa";
  if (status === "draft") return "#fffdf7";
  return "#fff";
}

const compactChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "26px",
  padding: "0 9px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  color: "#111",
  fontSize: "12px",
  fontWeight: 700,
};

const statusChipStyle = (status?: string): React.CSSProperties => ({
  ...compactChipStyle,
  background:
    status === "archived"
      ? "#f3f4f6"
      : status === "draft"
        ? "#fff7ed"
        : "#ecfdf3",
  border:
    status === "archived"
      ? "1px solid #d1d5db"
      : status === "draft"
        ? "1px solid #fed7aa"
        : "1px solid #bbf7d0",
  color:
    status === "archived"
      ? "#374151"
      : status === "draft"
        ? "#9a3412"
        : "#166534",
});

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

const compactSecondaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "38px",
  padding: "0 12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: 800,
};
