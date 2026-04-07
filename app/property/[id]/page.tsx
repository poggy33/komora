import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";
import SellerCard from "@/components/SellerCard";
import PropertySpecsCard from "@/components/PropertySpecsCard";
import PropertyHeader from "@/components/PropertyHeader";
import PropertyDescription from "@/components/PropertyDescription";
import PropertyAmenities from "@/components/PropertyAmenities";
import PropertyLocationMapWrapper from "@/components/PropertyLocationMapWrapper";

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

      <PropertyHeader property={property} />

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
  <PropertySpecsCard property={property} />

  <PropertyDescription description={property.description} />

  <PropertyAmenities property={property} />

  <div style={{ marginBottom: "32px" }}>
    <h2
      style={{
        fontSize: "24px",
        fontWeight: 700,
        marginBottom: "16px",
        color: "#111",
      }}
    >
      Локація
    </h2>

    <PropertyLocationMapWrapper
      coordinates={property.coordinates}
      title={property.title}
      address={property.location?.fullAddress}
    />
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
