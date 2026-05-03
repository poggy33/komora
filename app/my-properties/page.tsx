import Link from "next/link";
import { createClient } from "lib/supabase/server";
import ArchivePropertyButton from "./ArchivePropertyButton";
import RestorePropertyButton from "./RestorePropertyButton";
import DeletePropertyButton from "./DeletePropertyButton";
import type { Property } from "@/types/property";
import PublishPropertyButton from "./PublishPropertyButton";
import MoveToDraftButton from "./MoveToDraftButton";
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
      <section style={{ display: "grid", gap: "14px" }}>
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
              fontSize: "18px",
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

        <div style={{ display: "grid", gap: "14px" }}>
          {items.map((property) => (
            <div
              key={property.id}
              className="my-property-card"
              style={{
                background: getCardBackground(property.status),
              }}
            >
              <div className="my-property-card-main">
                <div
                  className="my-property-image"
                  style={{ position: "relative" }}
                >
                  {property.coverImage ? (
                    <>
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

                      {/* STATUS */}
                      <div
                        style={{
                          position: "absolute",
                          top: "6px",
                          left: "6px",
                          padding: "2px 7px",
                          borderRadius: "999px",
                          fontSize: "10px",
                          fontWeight: 700,
                          backdropFilter: "blur(6px)",
                          WebkitBackdropFilter: "blur(6px)",
                          background:
                            property.status === "archived"
                              ? "rgba(243,244,246,0.9)"
                              : property.status === "draft"
                                ? "rgba(255,247,237,0.9)"
                                : property.status === "pending_review"
                                  ? "rgba(239,246,255,0.9)"
                                  : "rgba(236,253,243,0.9)",
                          color: "#111",
                          border: "1px solid rgba(0,0,0,0.06)",
                          lineHeight: 1,
                        }}
                      >
                        {getStatusLabel(property.status)}
                      </div>
                    </>
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

                <div style={{ minWidth: 0, display: "grid", gap: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                        display: "grid",
                        gap: "5px",
                      }}
                    >
                      <div className="my-property-title">{property.title}</div>
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
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
                      gap: "4px",
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

                    {property.rooms && (
                      <span style={compactChipStyle}>
                        {property.rooms} кімн.
                      </span>
                    )}

                    <span style={compactChipStyle}>{property.area} м²</span>
                  </div>
                </div>
              </div>

              <div className="my-property-actions">
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
      className="my-properties-page"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
        }}
      >
        <div className="my-properties-shell">
          <div className="my-properties-header">
            <h1 className="my-properties-title">Мої оголошення</h1>
            <ClosePageButton />
          </div>

          {!user ? (
            <div style={{ display: "grid", gap: "14px" }}>
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
            <div style={{ display: "grid", gap: "14px" }}>
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
  if (status === "pending_review") return "Перевірка";
  if (status === "archived") return "Архів";
  if (status === "draft") return "Чернетка";
  return "Активне";
}

function getCardBackground(status?: string) {
  if (status === "archived") return "#fafafa";
  if (status === "draft") return "#fffdf7";
  if (status === "pending_review") return "#fff";
  return "#fff";
}

const compactChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  height: "24px",
  padding: "0 8px",
  borderRadius: "999px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  color: "#111",
  fontSize: "11px",
  fontWeight: 700,
  width: "fit-content",
};


const compactPrimaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "34px",
  padding: "0 10px",
  borderRadius: "11px",
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 800,
};


const compactSecondaryLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "34px",
  padding: "0 10px",
  borderRadius: "11px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 800,
};
