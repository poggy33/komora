import { notFound } from "next/navigation";
import { getPropertyByIdFromSupabase } from "lib/properties";
import PropertyGallery from "@/components/PropertyGallery";
import SellerCard from "@/components/SellerCard";
import PropertySpecsCard from "@/components/PropertySpecsCard";
import PropertyHeader from "@/components/PropertyHeader";
import PropertyDescription from "@/components/PropertyDescription";
import PropertyAmenities from "@/components/PropertyAmenities";
import PropertyLocationMapWrapper from "@/components/PropertyLocationMapWrapper";
import PropertyPageActions from "@/components/PropertyPageActions";
import PropertyMobileBottomBar from "@/components/PropertyMobileBottomBar";
import ClosePageButton from "../../components/ClosePageButton";

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
        padding: "16px 16px 96px",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        lineHeight: 1.45,
      }}
    >
      <ClosePageButton />
      <div
        style={{
          marginBottom: "10px",
          color: "#666",
          fontSize: "13px",
          opacity: 0.7,
        }}
      >
        Головна / Нерухомість / {property.title}
      </div>

      <PropertyHeader property={property} />

      <PropertyPageActions propertyId={String(property.id)} />

      <PropertyGallery images={property.images} title={property.title} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
        }}
      >
        <section>
          <PropertySpecsCard property={property} />

          <PropertyDescription description={property.description} />

          <PropertyAmenities property={property} />

          <div style={{ marginBottom: "24px" }}>
            <h2
              style={{
                fontSize: "20px",
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
            maxWidth: "100%",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <SellerCard property={property} />
        </div>
      </div>
      <PropertyMobileBottomBar
        price={property.price}
        dealType={property.dealType}
        phone={property.owner?.phone}
      />
    </main>
  );
}
