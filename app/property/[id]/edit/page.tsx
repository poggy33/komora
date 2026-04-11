import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "lib/supabase/server";
import {
  getEditablePropertyByIdFromSupabase,
  type EditablePropertyMediaItem,
} from "lib/properties";
import EditPropertyForm from "./EditPropertyForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
            maxWidth: "960px",
            margin: "0 auto",
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
            Увійдіть, щоб редагувати оголошення
          </h1>

          <div
            style={{
              fontSize: "15px",
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Редагування оголошень доступне лише авторизованим користувачам.
          </div>

          <Link
            href="/auth"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "48px",
              padding: "0 18px",
              borderRadius: "14px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Увійти
          </Link>
        </div>
      </main>
    );
  }

  const property = await getEditablePropertyByIdFromSupabase(id, user.id);

  if (!property) {
    notFound();
  }

  const { data: mediaRows, error: mediaError } = await supabase
    .from("property_media")
    .select("id, property_id, public_url, storage_path, position")
    .eq("property_id", id)
    .order("position", { ascending: true });

  if (mediaError) {
    throw new Error(`Failed to load property media: ${mediaError.message}`);
  }

  const { data: propertyMeta, error: propertyMetaError } = await supabase
    .from("properties")
    .select("cover_image_url")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (propertyMetaError) {
    throw new Error(`Failed to load property meta: ${propertyMetaError.message}`);
  }

  const media: EditablePropertyMediaItem[] = (mediaRows ?? []).map((row) => ({
    id: String(row.id),
    propertyId: String(row.property_id),
    publicUrl: row.public_url ?? "",
    storagePath: row.storage_path ?? null,
    position: row.position ?? 0,
  }));

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
          maxWidth: "960px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #ececec",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <EditPropertyForm
          property={property}
          media={media}
          coverImageUrl={propertyMeta.cover_image_url ?? null}
        />
      </div>
    </main>
  );
}