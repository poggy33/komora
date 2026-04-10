import { notFound } from "next/navigation";
// import { getPropertyByIdFromSupabase } from "@/lib/properties";
import { getPropertyByIdFromSupabase } from "lib/properties";
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

  const property = await getPropertyByIdFromSupabase(id);

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
          gridTemplateColumns: "1fr",
          gap: "32px",
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

        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <SellerCard property={property} />
        </div>
      </div>
    </main>
  );
}
